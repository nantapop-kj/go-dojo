import type { Language } from '@/enums';
import type { BoardSize, BotLevel } from '@/lib/go/types';

export interface GameSettings {
  size: BoardSize;
  level: BotLevel;
  color: 'black' | 'white' | 'random';
  handicap: number;
  komi: number;
}

export interface Preferences {
  language: Language;
  showLegal: boolean;
  showTerritory: boolean;
  showCoordinates: boolean;
  lastGameSettings: GameSettings;
}
