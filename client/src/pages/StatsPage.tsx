import type { JSX } from 'react';
import { Page } from '@/components/layout/Page';
import { PageTitle } from '@/components/layout/PageTitle';
import { useTranslation } from '@/hooks/useTranslation';

export const StatsPage = (): JSX.Element => {
  const { translate } = useTranslation();

  return (
    <Page>
      <PageTitle>{translate('navigationStats')}</PageTitle>
    </Page>
  );
};
