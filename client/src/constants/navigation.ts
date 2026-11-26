import type { StringKey } from '@/i18n';
import { Paths } from '@/routes/paths';

export interface NavigationItem {
  path: string;
  labelKey: StringKey;
}

export const NavigationItems: readonly NavigationItem[] = [
  { path: Paths.home, labelKey: 'navigationPlay' },
  { path: Paths.stats, labelKey: 'navigationStats' },
  { path: Paths.rules, labelKey: 'navigationRules' },
];
