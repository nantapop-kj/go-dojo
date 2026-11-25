import type { Black, BoardSizes, Empty, White } from '@/lib/go/game/constants';

export type Color = typeof Black | typeof White;
export type Cell = typeof Empty | Color;
export type Move = number;
export type BoardSize = (typeof BoardSizes)[number];
export type IllegalReason = 'occupied' | 'ko' | 'suicide';

export interface GroupInfo {
  stones: number[];
  liberties: number;
  libertyPoints: number[] | null;
  color: Cell;
}

export interface AreaScore {
  black: number;
  white: number;
  blackStones: number;
  whiteStones: number;
  blackTerritory: number;
  whiteTerritory: number;
  deadBlack: number;
  deadWhite: number;
  komi: number;
  owner: Uint8Array;
}

export interface BoardSnapshot {
  size: number;
  cells: number[];
  ko: number;
  toPlay: Color;
  captures: [number, number, number];
  moveCount: number;
  passes: number;
  lastMove: Move | null;
}

export type MoveStatus = 'occupied' | 'legal' | 'selfAtari' | 'ko' | 'suicide';

export interface MoveInspection {
  status: MoveStatus;
  liberties: number;
  captured: number;
  ataris: number;
}
