import { useContext, useSyncExternalStore } from 'react';
import { GameContext, type GameContextValue } from '@/context/GameContext';

interface GameState extends GameContextValue {
  version: number;
}

export const useGame = (): GameState => {
  const value = useContext(GameContext);

  if (!value) {
    throw new Error('useGame must be used inside <GameProvider>');
  }

  const version = useSyncExternalStore(value.game.subscribe, value.game.getVersion);

  return { ...value, version };
};
