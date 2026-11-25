import { other } from '@/lib/go/game/constants';
import type { Board } from '@/lib/go/game/board';
import type { Color, MoveInspection } from '@/lib/go/types';

export const inspectMove = (
  board: Board,
  point: number,
  color: Color,
): MoveInspection => {
  const illegalReason = board.legalReason(point, color);

  if (illegalReason) {
    return { status: illegalReason, liberties: 0, captured: 0, ataris: 0 };
  }

  const trial = board.clone();
  const captured = trial.play(point, color);
  const group = trial.groupInfo(point);

  const seen = new Set<number>();
  let ataris = 0;

  for (const neighbor of trial.neighbors(point)) {
    if (trial.cells[neighbor] !== other(color)) continue;

    const neighborGroup = trial.groupInfo(neighbor);
    const groupKey = Math.min(...neighborGroup.stones);

    if (!seen.has(groupKey) && neighborGroup.liberties === 1) ataris++;

    seen.add(groupKey);
  }

  return {
    status: group.liberties === 1 && captured.length === 0 ? 'selfAtari' : 'legal',
    liberties: group.liberties,
    captured: captured.length,
    ataris,
  };
};
