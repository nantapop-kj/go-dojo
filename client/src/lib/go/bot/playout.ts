import { Black, Empty, Pass, White, other } from '@/lib/go/game/constants';
import type { Board } from '@/lib/go/game/board';
import type { Estimate, Move } from '@/lib/go/types';

export const now = (): number => performance.now();

export const randomInt = (limit: number): number => (Math.random() * limit) | 0;

export const playout = (board: Board): Board => {
  const pointCount = board.pointCount;
  const cells = board.cells;
  const maxMoves = pointCount * 2;
  let moveCount = 0;

  while (board.passes < 2 && moveCount < maxMoves) {
    const color = board.toPlay;
    const lastMove = board.lastMove;
    let move: Move = Pass;

    if (lastMove !== null && lastMove >= 0 && cells[lastMove] === other(color)) {
      const group = board.groupInfo(lastMove, true);
      const liberty = group.libertyPoints?.[0];

      if (group.liberties === 1 && liberty !== undefined && board.isLegal(liberty, color)) {
        move = liberty;
      }
    }

    if (move === Pass) {
      const start = randomInt(pointCount);

      for (let offset = 0; offset < pointCount; offset++) {
        let point = start + offset;

        if (point >= pointCount) point -= pointCount;
        if (cells[point] !== Empty || board.isEye(point, color) || !board.isLegal(point, color)) {
          continue;
        }

        move = point;
        break;
      }
    }

    board.play(move, color);
    moveCount++;
  }

  return board;
};

export const countOwnership = (board: Board, ownership: Int8Array): number => {
  const cells = board.cells;
  const neighbors = board.geometry.neighbors;
  let balance = 0;

  for (let point = 0; point < board.pointCount; point++) {
    let owner: number = cells[point];

    if (owner === Empty) {
      const adjacent = neighbors[point];
      const firstColor = cells[adjacent[0]];

      owner = firstColor;

      for (let adjacentIndex = 1; adjacentIndex < adjacent.length; adjacentIndex++) {
        if (cells[adjacent[adjacentIndex]] !== firstColor) {
          owner = Empty;
          break;
        }
      }
    }

    ownership[point] = owner === Black ? 1 : owner === White ? -1 : 0;
    balance += ownership[point];
  }

  return balance;
};

export const estimate = (board: Board, count: number = 60, komi: number = 7.5): Estimate => {
  const ownership = new Float32Array(board.pointCount);
  const trial = new Int8Array(board.pointCount);
  let blackWins = 0;
  let scoreSum = 0;

  for (let round = 0; round < count; round++) {
    const finished = playout(board.clone());
    const score = countOwnership(finished, trial) - komi;

    for (let point = 0; point < board.pointCount; point++) {
      ownership[point] += trial[point];
    }

    if (score > 0) blackWins++;

    scoreSum += score;
  }

  for (let point = 0; point < board.pointCount; point++) {
    ownership[point] /= count;
  }

  return { ownership, blackWin: blackWins / count, meanScore: scoreSum / count };
};

export const guessDead = (board: Board, ownership: Float32Array): Set<number> => {
  const dead = new Set<number>();
  const seen = new Uint8Array(board.pointCount);

  for (let point = 0; point < board.pointCount; point++) {
    if (board.cells[point] === Empty || seen[point]) continue;

    const group = board.groupInfo(point);
    let average = 0;

    for (const stone of group.stones) {
      seen[stone] = 1;
      average += ownership[stone];
    }

    average = (average / group.stones.length) * (group.color === Black ? 1 : -1);

    if (average < -0.3) {
      for (const stone of group.stones) dead.add(stone);
    }
  }

  return dead;
};
