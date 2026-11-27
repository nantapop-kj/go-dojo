import type { BoardSize } from '@/lib/go/types';

export interface ActiveSettings {
  size: BoardSize;
  handicap: number;
  komi: number;
}
