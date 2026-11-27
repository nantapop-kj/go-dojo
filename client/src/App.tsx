import { useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { NewGameDialog } from '@/components/game/NewGameDialog';
import { Header } from '@/components/layout/Header';
import { useGame } from '@/hooks/useGame';
import { AppRoutes, Paths } from '@/routes';
import type { GameSettings } from '@/types';
import '@/App.css';

export const App = (): JSX.Element => {
  const navigate = useNavigate();
  const { startGame } = useGame();
  const [newGameKey, setNewGameKey] = useState(0);

  const handleNewGame = (): void => {
    setNewGameKey((current: number): number => current + 1);
  };

  const handleCloseNewGame = (): void => {
    setNewGameKey(0);
  };

  const handleStart = (settings: GameSettings): void => {
    setNewGameKey(0);
    startGame(settings);
    void navigate(Paths.home);
  };

  return (
    <>
      <Header onNewGame={handleNewGame} />
      <AppRoutes />
      <NewGameDialog
        key={newGameKey}
        open={newGameKey > 0}
        onClose={handleCloseNewGame}
        onStart={handleStart}
      />
    </>
  );
};
