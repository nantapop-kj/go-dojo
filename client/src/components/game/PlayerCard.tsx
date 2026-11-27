import type { JSX } from 'react';
import { Black, White, type Board, type Color } from '@/lib/go';
import { StoneIcon } from '@/components/common/StoneIcon';
import { useTranslation } from '@/hooks/useTranslation';
import '@/components/game/PlayerCard.css';

interface PlayerCardProps {
  board: Board;
  color: Color;
  komi: number;
}

export const PlayerCard = ({ board, color, komi }: PlayerCardProps): JSX.Element => {
  const { translate } = useTranslation();
  const isBlack = color === Black;
  const isTurn = board.toPlay === color;
  const name = translate(isBlack ? 'black' : 'white');

  return (
    <div className={`player-card${isTurn ? ' turn' : ''}`}>
      <div className="player-card-head">
        <StoneIcon black={isBlack} />
        <span>{name}</span>
      </div>
      <div className="player-card-count">{board.captures[color]}</div>
      <div className="player-card-caption">
        {translate('captured')}
        {color === White && ` · ${translate('komi')} ${komi}`}
      </div>
    </div>
  );
};
