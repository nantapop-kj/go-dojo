import type { JSX } from 'react';
import { Card } from '@/components/common/Card';
import { Switch } from '@/components/common/Switch';
import { usePreferences } from '@/hooks/usePreferences';
import { useTranslation } from '@/hooks/useTranslation';
import type { StringKey } from '@/i18n';
import type { Preferences } from '@/types';
import '@/components/game/DisplayToggles.css';

interface ToggleItem {
  key: 'showLegal' | 'showTerritory' | 'showCoordinates';
  labelKey: StringKey;
}

const ToggleItems: readonly ToggleItem[] = [
  { key: 'showLegal', labelKey: 'showLegal' },
  { key: 'showTerritory', labelKey: 'showTerritory' },
  { key: 'showCoordinates', labelKey: 'showCoordinates' },
];

export const DisplayToggles = (): JSX.Element => {
  const { preferences, updatePreferences } = usePreferences();
  const { translate } = useTranslation();

  return (
    <Card className="display-toggles">
      {ToggleItems.map((item: ToggleItem): JSX.Element => (
        <Switch
          key={item.key}
          label={translate(item.labelKey)}
          checked={preferences[item.key]}
          onChange={(checked: boolean): void => {
            updatePreferences({ [item.key]: checked } as Partial<Preferences>);
          }}
        />
      ))}
    </Card>
  );
};
