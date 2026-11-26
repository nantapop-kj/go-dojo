import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { Page } from '@/components/layout/Page';
import { PageTitle } from '@/components/layout/PageTitle';
import { useTranslation } from '@/hooks/useTranslation';
import { Paths } from '@/routes/paths';
import '@/pages/NotFoundPage.css';

export const NotFoundPage = (): JSX.Element => {
  const { translate } = useTranslation();

  return (
    <Page>
      <PageTitle>{translate('notFoundTitle')}</PageTitle>
      <Link to={Paths.home} className="not-found-link">
        {translate('backToPlay')}
      </Link>
    </Page>
  );
};
