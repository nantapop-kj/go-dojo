import { useContext, useSyncExternalStore } from 'react';
import { GameContext } from '@/context/GameContext';
import type { GameController } from '@/services/game/GameController';

interface GameState {
  game: GameController;
  version: number;
}

export const useGame = (): GameState => {
  const value = useContext(GameContext);

  if (!value) {
    throw new Error('useGame must be used inside <GameProvider>');
  }

  const version = useSyncExternalStore(value.game.subscribe, value.game.getVersion);

  return { game: value.game, version };
};
