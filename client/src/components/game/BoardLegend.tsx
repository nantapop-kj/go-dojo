import type { JSX } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import '@/components/game/BoardLegend.css';

export const BoardLegend = (): JSX.Element => {
  const { translate } = useTranslation();

  return (
    <div className="legend">
      <span>
        <i className="legend-dot legal" />
        {translate('legendLegal')}
      </span>
      <span>
        <i className="legend-dot warning" />
        {translate('legendWarning')}
      </span>
      <span>
        <b className="legend-cross">×</b>
        {translate('legendIllegal')}
      </span>
    </div>
  );
};
