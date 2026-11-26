import type { JSX } from 'react';
import { Page } from '@/components/layout/Page';
import { PageTitle } from '@/components/layout/PageTitle';
import { useTranslation } from '@/hooks/useTranslation';

export const PlayPage = (): JSX.Element => {
  const { translate } = useTranslation();

  return (
    <Page>
      <PageTitle>{translate('navigationPlay')}</PageTitle>
    </Page>
  );
};
