import type { GameSettings } from '@/types';

export const DefaultGameSettings: GameSettings = {
  size: 19,
  level: 'medium',
  color: 'black',
  handicap: 0,
  komi: 7.5,
};
export const DefaultKomi = 7.5;
export const HandicapKomi = 0.5;
export const HandicapOptions = [0, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export const BotMoveDelay = 200;
export const ToastDuration = 2400;
