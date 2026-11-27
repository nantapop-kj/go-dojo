import type { StringKey } from '@/i18n';
import type { BotLevel } from '@/lib/go';

export const BotLevelKeys: Readonly<Record<BotLevel, StringKey>> = {
  easy: 'levelEasy',
  medium: 'levelMedium',
  hard: 'levelHard',
};

export const BotLevelDescriptionKeys: Readonly<Record<BotLevel, StringKey>> = {
  easy: 'levelEasyDescription',
  medium: 'levelMediumDescription',
  hard: 'levelHardDescription',
};
