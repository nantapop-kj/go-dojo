import { Black, Pass, White } from '@/lib/go/game/constants';
import { Board } from '@/lib/go/game/board';
import type { Move } from '@/lib/go/types';

export interface ReplayResult {
  board: Board;
  illegalAt: number;
}

export const handicapPoints = (size: number, count: number): number[] => {
  if (count < 2) return [];

  const near = size >= 13 ? 3 : 2;
  const middle = (size - 1) / 2;
  const far = size - 1 - near;

  const toIndex = (x: number, y: number): number => y * size + x;

  const corners = [
    toIndex(far, near),
    toIndex(near, far),
    toIndex(far, far),
    toIndex(near, near),
  ];
  const sides = [
    toIndex(near, middle),
    toIndex(far, middle),
    toIndex(middle, near),
    toIndex(middle, far),
  ];

  const points = corners.slice(0, Math.min(count, 4));

  if (count >= 6) points.push(sides[0], sides[1]);
  if (count >= 8) points.push(sides[2], sides[3]);
  if (count >= 5 && count % 2 === 1) points.push(toIndex(middle, middle));

  return points;
};

export const setupBoard = (size: number, handicap: number = 0): Board => {
  const board = new Board(size);
  const handicapStones = handicapPoints(size, handicap);

  for (const point of handicapStones) {
    board.cells[point] = Black;
  }

  if (handicapStones.length) board.toPlay = White;

  return board;
};

export const replay = (
  size: number,
  handicap: number,
  moves: readonly Move[],
): ReplayResult => {
  const board = setupBoard(size, handicap);

  for (let moveIndex = 0; moveIndex < moves.length; moveIndex++) {
    const move = moves[moveIndex];
    const isOutside = move !== Pass && (move < 0 || move >= board.pointCount);

    if (!Number.isInteger(move) || isOutside || !board.isLegal(move)) {
      return {
        board,
        illegalAt: moveIndex
      };
    }

    board.play(move);
  }

  return { board, illegalAt: -1 };
};
