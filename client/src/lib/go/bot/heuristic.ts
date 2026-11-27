import { Black, Empty, other } from '@/lib/go/game/constants';
import type { Board } from '@/lib/go/game/board';
import type { Candidate, Color } from '@/lib/go/types';

const OpeningLineScores = [-4, -2, 1.5, 1.5, 0.3];

export const heuristic = (
  board: Board,
  color: Color,
  ownership: Float32Array | null = null,
): Candidate[] => {
  const { pointCount, size, cells } = board;
  const neighbors = board.geometry.neighbors;
  const opponent = other(color);
  const isOpening = board.moveCount < pointCount * 0.12;
  const lastMove = board.lastMove !== null && board.lastMove >= 0 ? board.lastMove : -1;
  const [lastX, lastY] = lastMove >= 0 ? board.toCoordinates(lastMove) : [0, 0];
  const sign = color === Black ? 1 : -1;
  const candidates: Candidate[] = [];

  for (let point = 0; point < pointCount; point++) {
    if (cells[point] !== Empty || board.isEye(point, color) || !board.isLegal(point, color)) {
      continue;
    }

    let score = 0;
    let captureCount = 0;
    let saveCount = 0;
    const seen = new Set<number>();

    for (const neighbor of neighbors[point]) {
      const neighborColor = cells[neighbor];

      if (neighborColor === Empty) continue;

      const group = board.groupInfo(neighbor);
      const groupKey = Math.min(...group.stones);

      if (seen.has(groupKey)) continue;

      seen.add(groupKey);

      if (neighborColor === opponent && group.liberties === 1) {
        captureCount += group.stones.length;
      }
      
      if (neighborColor === color && group.liberties === 1) {
        saveCount += group.stones.length;
      }
    }

    const trial = board.clone();
    trial.play(point, color);

    const myGroup = trial.groupInfo(point);

    if (captureCount) score += 6 + captureCount * 4;

    if (saveCount) {
      if (myGroup.liberties >= 3) {
        score += 5 + saveCount * 3;
      } else if (myGroup.liberties === 2) {
        score += 1 + saveCount;
      }
    }

    if (myGroup.liberties === 1 && !captureCount) {
      score -= 6 + myGroup.stones.length * 3;
    } else if (myGroup.liberties === 2 && !captureCount && myGroup.stones.length > 2) {
      score -= 1;
    }

    for (const neighbor of trial.neighbors(point)) {
      const putsInAtari = trial.cells[neighbor] === opponent
        && trial.groupInfo(neighbor).liberties === 1
        && myGroup.liberties >= 2;

      if (putsInAtari) {
        score += 2;
        break;
      }
    }

    const [x, y] = board.toCoordinates(point);
    const line = Math.min(x, y, size - 1 - x, size - 1 - y) + 1;

    if (size >= 13) {
      if (isOpening) {
        score += OpeningLineScores[Math.min(line, 5) - 1];
      } else if (line === 1) {
        score -= 1.5;
      } else if (line === 2) {
        score -= 0.3;
      }
    } else if (line === 1) {
      score -= isOpening ? 2.5 : 1;
    }

    if (lastMove >= 0) {
      const distance = Math.abs(x - lastX) + Math.abs(y - lastY);

      if (distance <= 2) {
        score += 1.2;
      } else if (distance <= 4) {
        score += 0.4;
      }
    }

    let myNearby = 0;
    let opponentNearby = 0;

    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        if (Math.abs(dx) + Math.abs(dy) > 2 || (!dx && !dy)) continue;

        const nearX = x + dx;
        const nearY = y + dy;

        if (nearX < 0 || nearY < 0 || nearX >= size || nearY >= size) continue;

        const nearColor = cells[nearY * size + nearX];

        if (nearColor === color) {
          myNearby++;
        } else if (nearColor === opponent) {
          opponentNearby++;
        }
      }
    }

    if (isOpening && !myNearby && !opponentNearby) score += 1;
    if (myNearby >= 4 && !opponentNearby) score -= 1;

    if (ownership) {
      const owned = ownership[point] * sign;

      if (owned > 0.8) {
        score -= 2.5;
      } else if (owned < -0.8) {
        score -= 2;
      } else {
        score += (1 - Math.abs(owned)) * 1.5;
      }
    }

    candidates.push({ point, score });
  }

  return candidates;
};
