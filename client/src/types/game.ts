import type { StringKey } from '@/i18n';
import type { BoardSize, BotLevel, Color, ResultReason } from '@/lib/go/types';
import type { TranslationVariables } from '@/types/translation';

export interface ActiveSettings {
  size: BoardSize;
  level: BotLevel;
  handicap: number;
  komi: number;
}

export interface GameResult {
  winner: Color;
  reason: ResultReason;
  margin: number | null;
}

export interface GameMessage {
  key: StringKey;
  variables?: TranslationVariables;
  translatedVariables?: Record<string, StringKey>;
}
