import type { BoardSnapshot, BotConfig, Color } from '@/lib/go/types';

export type WorkerRequest =
  | { id: number; kind: 'move'; snapshot: BoardSnapshot; color: Color; config: BotConfig }
  | { id: number; kind: 'estimate'; snapshot: BoardSnapshot; count: number; komi: number };

export interface WorkerResponse {
  id: number;
  result?: unknown;
  error?: string;
}
