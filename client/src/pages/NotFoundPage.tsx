import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow } from '@/components/common/Eyebrow';
import { StoneIcon } from '@/components/common/StoneIcon';
import { Page } from '@/components/layout/Page';
import { PageTitle } from '@/components/layout/PageTitle';
import { useTranslation } from '@/hooks/useTranslation';
import { Paths } from '@/routes/paths';
import '@/components/common/Button.css';
import '@/pages/NotFoundPage.css';

const BoardSize = 5;

const stones: ReadonlyMap<string, boolean> = new Map([
  ['1-2', true],
  ['2-1', true],
  ['2-3', false],
  ['3-2', false],
  ['1-1', false],
  ['3-3', true],
]);

const MiniBoard = (): JSX.Element => {
  const cells: JSX.Element[] = [];

  for (let row = 0; row < BoardSize; row += 1) {
    for (let column = 0; column < BoardSize; column += 1) {
      const key = `${row}-${column}`;
      const stone = stones.get(key);
      const isTarget = row === 2 && column === 2;

      cells.push(
        <span key={key} className="mini-board-point">
          {stone !== undefined && <StoneIcon black={stone} />}
          {isTarget && <span className="mini-board-target" />}
        </span>,
      );
    }
  }

  return (
    <div className="mini-board" aria-hidden="true">
      {cells}
    </div>
  );
};

export const NotFoundPage = (): JSX.Element => {
  const { translate } = useTranslation();

  return (
    <Page>
      <section className="not-found">
        <MiniBoard />
        <Eyebrow>Error 404</Eyebrow>
        <PageTitle>{translate('notFoundTitle')}</PageTitle>
        <p className="not-found-description">{translate('notFoundDescription')}</p>
        <div className="not-found-actions">
          <Link to={Paths.home} className="btn primary">
            {translate('backToPlay')}
          </Link>
          <Link to={Paths.rules} className="btn">
            {translate('notFoundRules')}
          </Link>
        </div>
      </section>
    </Page>
  );
};
