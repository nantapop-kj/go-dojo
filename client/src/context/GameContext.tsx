import { createContext, useEffect, useState, type JSX, type ReactNode } from 'react';
import { usePreferences } from '@/hooks/usePreferences';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/hooks/useTranslation';
import { GameController } from '@/services/game/GameController';

export interface GameContextValue {
  game: GameController;
}

interface GameProviderProps {
  children: ReactNode;
}

export const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider = ({ children }: GameProviderProps): JSX.Element => {
  const { preferences } = usePreferences();
  const { translate } = useTranslation();
  const showToast = useToast();

  const [value] = useState((): GameContextValue => {
    const game = new GameController();

    game.start(preferences.lastGameSettings);

    return { game };
  });

  useEffect((): (() => void) => {
    const { game } = value;

    game.onCapture = (count: number): void => {
      showToast(translate('toastCaptured', { count }));
    };

    return (): void => {
      game.onCapture = undefined;
    };
  }, [value, showToast, translate]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
