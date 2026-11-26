import { type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { AppRoutes, Paths } from '@/routes';
import '@/App.css';

export const App = (): JSX.Element => {
  const navigate = useNavigate();

  const handleNewGame = (): void => {
    void navigate(Paths.home);
  };

  return (
    <>
      <Header onNewGame={handleNewGame} />
      <AppRoutes />
    </>
  );
};
