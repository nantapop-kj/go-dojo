import type { BotLevel } from '@/lib/go/types/bot';
import type { Move } from '@/lib/go/types/game';

export type ResultReason = 'score' | 'resign';
export type ColorLetter = 'B' | 'W';

export interface GameSubmission {
  size: number;
  level: BotLevel;
  player: ColorLetter;
  handicap: number;
  komi: number;
  moves: Move[];
  winner: ColorLetter;
  reason: ResultReason;
  margin: number | null;
  black: number | null;
  white: number | null;
  duration: number;
  undos: number;
  hints: number;
}

export interface GameRecord extends GameSubmission {
  id: string;
  date: string;
  result: 'win' | 'loss';
  captures: { B: number; W: number };
}

export interface WinLoss {
  wins: number;
  losses: number;
}

export interface StatsSummary {
  total: number;
  wins: number;
  losses: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  resignWins: number;
  resignLosses: number;
  averageMoves: number;
  averageWinMargin: number | null;
  totalCaptured: number;
  totalTime: number;
  byLevel: Record<string, WinLoss>;
  bySize: Record<string, WinLoss>;
  byColor: { B: WinLoss; W: WinLoss };
  recent: ('win' | 'loss')[];
}

export interface SgfInfo {
  size: number;
  komi: number;
  handicap?: number;
  blackName: string;
  whiteName: string;
  result?: string;
  date?: string;
}
