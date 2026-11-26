import { useEffect, type JSX } from 'react';
import { NavigationType, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { NotFoundPage, PlayPage, RulesPage, StatsPage } from '@/pages';
import { Paths } from './paths';

export const AppRoutes = (): JSX.Element => {
  const { key } = useLocation();
  const navigationType: NavigationType = useNavigationType();

  useEffect((): void => {
    if (navigationType !== NavigationType.Pop) window.scrollTo(0, 0);
  }, [key, navigationType]);

  return (
    <Routes>
      <Route path={Paths.home} element={<PlayPage />} />
      <Route path={Paths.stats} element={<StatsPage />} />
      <Route path={Paths.rules} element={<RulesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
