import {
  Black,
  Empty,
  Pass,
  White,
  ColumnLetters,
  other
} from '@/lib/go/game/constants';
import type {
  AreaScore,
  BoardSnapshot,
  Cell,
  Color,
  GroupInfo,
  IllegalReason,
  Move
} from '@/lib/go/types';

interface Geometry {
  neighbors: number[][];
  diagonals: number[][];
  mark: Uint32Array;
  stamp: number;
}

const diagonalOffsets = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];

const geometryCache = new Map<number, Geometry>();

const getGeometry = (size: number): Geometry => {
  const cached = geometryCache.get(size);
  if (cached) return cached;

  const pointCount = size * size;
  const neighbors: number[][] = new Array(pointCount);
  const diagonals: number[][] = new Array(pointCount);

  for (let point = 0; point < pointCount; point++) {
    const x = point % size;
    const y = (point / size) | 0;
    const adjacent: number[] = [];
    const diagonal: number[] = [];

    if (x > 0) adjacent.push(point - 1);
    if (x < size - 1) adjacent.push(point + 1);
    if (y > 0) adjacent.push(point - size);
    if (y < size - 1) adjacent.push(point + size);

    for (const [dx, dy] of diagonalOffsets) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && ny >= 0 && nx < size && ny < size) {
        diagonal.push(ny * size + nx);
      }
    }

    neighbors[point] = adjacent;
    diagonals[point] = diagonal;
  }

  const geometry: Geometry = {
    neighbors,
    diagonals,
    mark: new Uint32Array(pointCount),
    stamp: 0,
  };

  geometryCache.set(size, geometry);

  return geometry;
};

export class Board {
  readonly size: number;
  readonly pointCount: number;

  cells: Uint8Array;
  geometry: Geometry;

  ko = -1;
  toPlay: Color = Black;
  captures: [number, number, number] = [0, 0, 0];
  moveCount = 0;
  passes = 0;
  lastMove: Move | null = null;

  constructor(size: number = 19) {
    this.size = size;
    this.pointCount = size * size;
    this.cells = new Uint8Array(this.pointCount);
    this.geometry = getGeometry(size);
  }

  clone = (): Board => {
    const copy = new Board(this.size);

    copy.cells.set(this.cells);
    copy.ko = this.ko;
    copy.toPlay = this.toPlay;
    copy.captures = [...this.captures] as [number, number, number];
    copy.moveCount = this.moveCount;
    copy.passes = this.passes;
    copy.lastMove = this.lastMove;

    return copy;
  };

  snapshot = (): BoardSnapshot => {
    return {
      size: this.size,
      cells: Array.from(this.cells),
      ko: this.ko,
      toPlay: this.toPlay,
      captures: [...this.captures] as [number, number, number],
      moveCount: this.moveCount,
      passes: this.passes,
      lastMove: this.lastMove,
    };
  };

  static fromSnapshot = (snapshot: BoardSnapshot): Board => {
    const board = new Board(snapshot.size);

    board.cells.set(snapshot.cells);
    board.ko = snapshot.ko;
    board.toPlay = snapshot.toPlay;
    board.captures = [...snapshot.captures] as [number, number, number];
    board.moveCount = snapshot.moveCount;
    board.passes = snapshot.passes;
    board.lastMove = snapshot.lastMove;

    return board;
  };

  toCoordinates = (point: number): [number, number] => {
    return [point % this.size, (point / this.size) | 0];
  };

  toIndex = (x: number, y: number): number => {
    return y * this.size + x;
  };

  label = (point: Move): string => {
    if (point === Pass) return 'Pass';

    const [x, y] = this.toCoordinates(point);

    return ColumnLetters[x] + (this.size - y);
  };

  neighbors = (point: number): readonly number[] => {
    return this.geometry.neighbors[point];
  };

  groupInfo = (point: number, includeLiberties: boolean = false): GroupInfo => {
    const geometry = this.geometry;
    const cells = this.cells;
    const neighbors = geometry.neighbors;

    if (++geometry.stamp >= 0xfffffff0) {
      geometry.mark.fill(0);
      geometry.stamp = 1;
    }

    const stamp = geometry.stamp;
    const mark = geometry.mark;
    const color = cells[point] as Cell;
    const stones = [point];
    const libertyPoints: number[] | null = includeLiberties ? [] : null;
    let liberties = 0;

    mark[point] = stamp;

    for (let stoneIndex = 0; stoneIndex < stones.length; stoneIndex++) {
      const adjacent = neighbors[stones[stoneIndex]];

      for (let adjacentIndex = 0; adjacentIndex < adjacent.length; adjacentIndex++) {
        const neighbor = adjacent[adjacentIndex];

        if (mark[neighbor] === stamp) continue;

        const neighborColor = cells[neighbor];

        if (neighborColor === Empty) {
          mark[neighbor] = stamp;
          liberties++;
          libertyPoints?.push(neighbor);
        } else if (neighborColor === color) {
          mark[neighbor] = stamp;
          stones.push(neighbor);
        }
      }
    }

    return { stones, liberties, libertyPoints, color };
  };

  legalReason = (point: Move, color: Color = this.toPlay): IllegalReason | null => {
    if (point === Pass) return null;
    if (point < 0 || point >= this.pointCount || this.cells[point] !== Empty) return 'occupied';
    if (point === this.ko && color === this.toPlay) return 'ko';

    const adjacent = this.geometry.neighbors[point];
    const cells = this.cells;
    const opponent = other(color);

    for (let adjacentIndex = 0; adjacentIndex < adjacent.length; adjacentIndex++) {
      if (cells[adjacent[adjacentIndex]] === Empty) return null;
    }

    for (let adjacentIndex = 0; adjacentIndex < adjacent.length; adjacentIndex++) {
      const neighbor = adjacent[adjacentIndex];
      const neighborColor = cells[neighbor];

      if (neighborColor === color && this.groupInfo(neighbor).liberties > 1) return null;
      if (neighborColor === opponent && this.groupInfo(neighbor).liberties === 1) return null;
    }

    return 'suicide';
  };

  isLegal = (point: Move, color: Color = this.toPlay): boolean => {
    return this.legalReason(point, color) === null;
  };

  isEye = (point: number, color: Color): boolean => {
    const { neighbors, diagonals } = this.geometry;
    const cells = this.cells;
    const adjacent = neighbors[point];

    for (let adjacentIndex = 0; adjacentIndex < adjacent.length; adjacentIndex++) {
      if (cells[adjacent[adjacentIndex]] !== color) return false;
    }

    const diagonalPoints = diagonals[point];
    let opponentCount = 0;

    for (let diagonalIndex = 0; diagonalIndex < diagonalPoints.length; diagonalIndex++) {
      if (cells[diagonalPoints[diagonalIndex]] === other(color)) opponentCount++;
    }

    return diagonalPoints.length < 4 ? opponentCount === 0 : opponentCount < 2;
  };

  play = (point: Move, color: Color = this.toPlay): number[] => {
    this.moveCount++;
    this.toPlay = other(color);
    this.lastMove = point;

    if (point === Pass) {
      this.ko = -1;
      this.passes++;
      return [];
    }

    this.passes = 0;

    const cells = this.cells;
    const opponent = other(color);
    const adjacent = this.geometry.neighbors[point];
    let captured: number[] = [];

    cells[point] = color;

    for (let adjacentIndex = 0; adjacentIndex < adjacent.length; adjacentIndex++) {
      if (cells[adjacent[adjacentIndex]] !== opponent) continue;

      const group = this.groupInfo(adjacent[adjacentIndex]);

      if (group.liberties === 0) {
        for (const stone of group.stones) {
          cells[stone] = Empty;
        }

        captured = captured.concat(group.stones);
      }
    }

    this.captures[color] += captured.length;
    this.ko = -1;

    if (captured.length === 1) {
      const group = this.groupInfo(point);

      if (group.stones.length === 1 && group.liberties === 1) {
        this.ko = captured[0];
      }
    }

    return captured;
  };

  areaScore = (
    dead: Iterable<number> | null = null,
    komi: number = 7.5,
  ): AreaScore => {
    const pointCount = this.pointCount;
    const cells = this.cells.slice();
    const neighbors = this.geometry.neighbors;
    let deadBlack = 0;
    let deadWhite = 0;

    if (dead) {
      for (const deadPoint of dead) {
        if (cells[deadPoint] === Black) {
          deadBlack++;
        } else if (cells[deadPoint] === White) {
          deadWhite++;
        }

        cells[deadPoint] = Empty;
      }
    }

    const owner = new Uint8Array(pointCount);
    const seen = new Uint8Array(pointCount);
    let blackStones = 0;
    let whiteStones = 0;
    let blackTerritory = 0;
    let whiteTerritory = 0;

    for (let point = 0; point < pointCount; point++) {
      if (cells[point] === Black) {
        blackStones++;
        owner[point] = Black;
      } else if (cells[point] === White) {
        whiteStones++;
        owner[point] = White;
      }
    }

    for (let point = 0; point < pointCount; point++) {
      if (cells[point] !== Empty || seen[point]) continue;

      const region = [point];
      let border = 0;

      seen[point] = 1;

      for (let regionIndex = 0; regionIndex < region.length; regionIndex++) {
        for (const neighbor of neighbors[region[regionIndex]]) {
          const neighborColor = cells[neighbor];

          if (neighborColor === Empty) {
            if (!seen[neighbor]) {
              seen[neighbor] = 1;
              region.push(neighbor);
            }
          } else {
            border |= neighborColor;
          }
        }
      }

      if (border === Black || border === White) {
        for (const regionPoint of region) {
          owner[regionPoint] = border;
        }

        if (border === Black) {
          blackTerritory += region.length;
        } else {
          whiteTerritory += region.length;
        }
      }
    }

    return {
      black: blackStones + blackTerritory,
      white: whiteStones + whiteTerritory + komi,
      blackStones,
      whiteStones,
      blackTerritory,
      whiteTerritory,
      deadBlack,
      deadWhite,
      komi,
      owner,
    };
  };
}
