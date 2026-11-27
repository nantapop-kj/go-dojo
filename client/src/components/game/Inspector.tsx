import type { JSX } from 'react';
import { inspectMove, type Board, type MoveStatus } from '@/lib/go';
import { Card } from '@/components/common/Card';
import { Eyebrow } from '@/components/common/Eyebrow';
import { useTranslation } from '@/hooks/useTranslation';
import type { StringKey } from '@/i18n';
import '@/components/game/Inspector.css';

interface InspectorProps {
  board: Board;
  hover: number;
}

const StatusKeys: Record<MoveStatus, StringKey> = {
  legal: 'statusLegal',
  selfAtari: 'statusSelfAtari',
  ko: 'statusKo',
  suicide: 'statusSuicide',
  occupied: 'statusOccupied',
};

const StatusTones: Record<MoveStatus, string> = {
  legal: 'ok',
  selfAtari: 'warn',
  ko: 'bad',
  suicide: 'bad',
  occupied: 'muted',
};

const ReasonKeys: Partial<Record<MoveStatus, StringKey>> = {
  ko: 'reasonKo',
  suicide: 'reasonSuicide',
  selfAtari: 'reasonSelfAtari',
};

export const Inspector = ({ board, hover }: InspectorProps): JSX.Element => {
  const { translate } = useTranslation();

  if (hover < 0) {
    return (
      <Card className="inspector">
        <Eyebrow>{translate('inspect')}</Eyebrow>
        <p className="inspector-reason">{translate('hoverToInspect')}</p>
      </Card>
    );
  }

  const inspection = inspectMove(board, hover, board.toPlay);
  const { status } = inspection;
  const reasonKey = ReasonKeys[status];
  const isPlayable = status === 'legal' || status === 'selfAtari';

  return (
    <Card className="inspector">
      <Eyebrow>{translate('inspect')}</Eyebrow>
      <div className="inspector-head">
        <span className="inspector-point">{board.label(hover)}</span>
        <span className={`inspector-status ${StatusTones[status]}`}>
          {translate(StatusKeys[status])}
        </span>
      </div>
      {isPlayable && (
        <div className="inspector-facts">
          <div>
            <div className="inspector-value">{inspection.liberties}</div>
            <div className="inspector-caption">{translate('liberties')}</div>
          </div>
          <div>
            <div className="inspector-value">{inspection.captured}</div>
            <div className="inspector-caption">{translate('captures')}</div>
          </div>
          <div>
            <div className="inspector-value">{inspection.ataris}</div>
            <div className="inspector-caption">{translate('ataris')}</div>
          </div>
        </div>
      )}
      {reasonKey && <p className="inspector-reason">{translate(reasonKey)}</p>}
    </Card>
  );
};
