import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type JSX,
  type ReactNode,
} from 'react';
import { usePreferences } from '@/hooks/usePreferences';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/hooks/useTranslation';
import type { StringKey } from '@/i18n';
import { GameController } from '@/services/game/GameController';
import type { GameMessage, GameSettings, TranslationVariables } from '@/types';

export interface GameContextValue {
  game: GameController;
  startGame: (settings: GameSettings) => void;
}

interface GameProviderProps {
  children: ReactNode;
}

export const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider = ({ children }: GameProviderProps): JSX.Element => {
  const { preferences, updatePreferences } = usePreferences();
  const { translate } = useTranslation();
  const showToast = useToast();
  const [game] = useState((): GameController => new GameController());
  const [initialSettings] = useState((): GameSettings => preferences.lastGameSettings);

  useEffect((): (() => void) => {
    game.onMessage = (message: GameMessage): void => {
      const variables: TranslationVariables = { ...message.variables };
      const translated = Object.entries(message.translatedVariables ?? {});

      for (const [name, key] of translated as [string, StringKey][]) {
        variables[name] = translate(key);
      }

      showToast(translate(message.key, variables));
    };

    return (): void => {
      game.onMessage = undefined;
    };
  }, [game, showToast, translate]);

  useEffect((): void => {
    game.start(initialSettings);
  }, [game, initialSettings]);

  const startGame = useCallback(
    (settings: GameSettings): void => {
      updatePreferences({ lastGameSettings: settings });
      game.start(settings);
    },
    [game, updatePreferences],
  );

  const value = useMemo(
    (): GameContextValue => ({ game, startGame }),
    [game, startGame],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
