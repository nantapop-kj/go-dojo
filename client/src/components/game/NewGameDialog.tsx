import { useState, type ChangeEvent, type FormEvent, type JSX } from 'react';
import { BotLevels, type BoardSize, type BotLevel } from '@/lib/go';
import { Button } from '@/components/common/Button';
import { Dialog } from '@/components/common/Dialog';
import { BotLevelDescriptionKeys, BotLevelKeys } from '@/constants/botLevels';
import { DefaultKomi, HandicapKomi, HandicapOptions } from '@/constants/defaults';
import { usePreferences } from '@/hooks/usePreferences';
import { useTranslation } from '@/hooks/useTranslation';
import type { StringKey } from '@/i18n';
import type { GameSettings } from '@/types';
import '@/components/game/NewGameDialog.css';

type ColorChoice = GameSettings['color'];

interface NewGameDialogProps {
  open: boolean;
  onClose: () => void;
  onStart: (settings: GameSettings) => void;
}

interface SizeItem {
  size: BoardSize;
  descriptionKey: StringKey;
}

interface ColorItem {
  color: ColorChoice;
  labelKey: StringKey;
  descriptionKey: StringKey | null;
}

const SizeItems: readonly SizeItem[] = [
  { size: 9, descriptionKey: 'size9Description' },
  { size: 13, descriptionKey: 'size13Description' },
  { size: 19, descriptionKey: 'size19Description' },
];

const ColorItems: readonly ColorItem[] = [
  { color: 'black', labelKey: 'black', descriptionKey: 'moveFirst' },
  { color: 'white', labelKey: 'white', descriptionKey: 'getsKomi' },
  { color: 'random', labelKey: 'random', descriptionKey: null },
];

export const NewGameDialog = ({ open, onClose, onStart }: NewGameDialogProps): JSX.Element => {
  const { preferences } = usePreferences();
  const { translate } = useTranslation();
  const [settings, setSettings] = useState<GameSettings>(preferences.lastGameSettings);

  const updateSettings = (changes: Partial<GameSettings>): void => {
    setSettings((current: GameSettings): GameSettings => ({ ...current, ...changes }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onStart(settings);
  };

  const handleHandicapChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const handicap = Number(event.target.value);

    if (handicap >= 2) {
      updateSettings({ handicap, komi: HandicapKomi, color: 'black' });
    } else {
      updateSettings({ handicap, komi: DefaultKomi });
    }
  };

  const handleKomiChange = (event: ChangeEvent<HTMLInputElement>): void => {
    updateSettings({ komi: Math.max(0, Number(event.target.value) || 0) });
  };

  return (
    <Dialog open={open} onClose={onClose} labelledBy="new-game-title">
      <form onSubmit={handleSubmit}>
        <h2 id="new-game-title">{translate('newGameTitle')}</h2>
        <fieldset className="field">
          <legend>{translate('boardSize')}</legend>
          <div className="choices">
            {SizeItems.map((item: SizeItem): JSX.Element => (
              <label key={item.size} className="choice">
                <input
                  type="radio"
                  name="size"
                  checked={settings.size === item.size}
                  onChange={(): void => updateSettings({ size: item.size })}
                />
                <span className="choice-mono">
                  {item.size}×{item.size}
                  <small>{translate(item.descriptionKey)}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="field">
          <legend>{translate('botLevel')}</legend>
          <div className="choices">
            {BotLevels.map((level: BotLevel): JSX.Element => (
              <label key={level} className="choice">
                <input
                  type="radio"
                  name="level"
                  checked={settings.level === level}
                  onChange={(): void => updateSettings({ level })}
                />
                <span>
                  {translate(BotLevelKeys[level])}
                  <small>{translate(BotLevelDescriptionKeys[level])}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="field">
          <legend>{translate('yourColor')}</legend>
          <div className="choices">
            {ColorItems.map((item: ColorItem): JSX.Element => (
              <label key={item.color} className="choice">
                <input
                  type="radio"
                  name="color"
                  checked={settings.color === item.color}
                  disabled={settings.handicap >= 2 && item.color !== 'black'}
                  onChange={(): void => updateSettings({ color: item.color })}
                />
                <span>
                  {translate(item.labelKey)}
                  {item.descriptionKey && <small>{translate(item.descriptionKey)}</small>}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="field">
          <label>
            <span>{translate('handicap')}</span>
            <select className="input" value={settings.handicap} onChange={handleHandicapChange}>
              {HandicapOptions.map((count: number): JSX.Element => (
                <option key={count} value={count}>
                  {count ? translate('stoneCount', { count }) : translate('noHandicap')}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="field">
          <label>
            <span>{translate('komiLabel')}</span>
            <input
              className="input choice-mono"
              type="number"
              step={0.5}
              min={0}
              max={15}
              value={settings.komi}
              onChange={handleKomiChange}
            />
          </label>
        </div>
        <div className="modal-actions">
          <Button onClick={onClose}>{translate('cancel')}</Button>
          <Button type="submit" variant="primary">{translate('start')}</Button>
        </div>
      </form>
    </Dialog>
  );
};
