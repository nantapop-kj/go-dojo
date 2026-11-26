import type { JSX } from 'react';
import { Eyebrow } from '@/components/common/Eyebrow';
import { Page } from '@/components/layout/Page';
import { PageTitle } from '@/components/layout/PageTitle';
import { useTranslation } from '@/hooks/useTranslation';
import type { StringKey } from '@/i18n';
import '@/pages/RulesPage.css';

const ruleKeys: readonly StringKey[] = [
  'ruleTurns',
  'ruleLiberties',
  'ruleCapture',
  'ruleSuicide',
  'ruleKo',
  'ruleGameEnd',
];

const tipKeys: readonly StringKey[] = [
  'tipStartSmall',
  'tipOpening',
  'tipTerritory',
  'tipHandicap',
  'tipReview',
];

export const RulesPage = (): JSX.Element => {
  const { translate } = useTranslation();

  return (
    <Page>
      <div className="prose">
        <Eyebrow>GO · BADUK · WEIQI</Eyebrow>
        <PageTitle>{translate('navigationRules')}</PageTitle>

        <h2>{translate('rulesTitle')}</h2>
        <ol>
          {ruleKeys.map((key: StringKey): JSX.Element => (
            <li key={key}>{translate(key)}</li>
          ))}
        </ol>

        <h2>{translate('scoringRulesTitle')}</h2>
        <p>{translate('scoringRule')}</p>

        <h2>{translate('tipsTitle')}</h2>
        <ul>
          {tipKeys.map((key: StringKey): JSX.Element => (
            <li key={key}>{translate(key)}</li>
          ))}
        </ul>
      </div>
    </Page>
  );
};
