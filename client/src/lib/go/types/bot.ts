import type { Move } from '@/lib/go/types/game';

export type BotLevel = 'easy' | 'medium' | 'hard';

export interface BotConfig {
  level: BotLevel;
  komi: number;
  opponentPassed?: boolean;
  budget?: number;
  forHint?: boolean;
}

export interface BotDecision {
  move: Move | 'resign';
  winrate?: number;
  playouts?: number;
}

export interface Estimate {
  ownership: Float32Array;
  blackWin: number;
  meanScore: number;
}

export interface Candidate {
  point: number;
  score: number;
}
