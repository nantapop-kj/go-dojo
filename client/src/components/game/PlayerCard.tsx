import type { JSX } from 'react';
import { Black, White, type Color } from '@/lib/go';
import { StoneIcon } from '@/components/common/StoneIcon';
import { BotLevelKeys } from '@/constants/botLevels';
import { GamePhase } from '@/enums';
import { useTranslation } from '@/hooks/useTranslation';
import type { GameController } from '@/services/game/GameController';
import '@/components/game/PlayerCard.css';

interface PlayerCardProps {
  game: GameController;
  color: Color;
}

export const PlayerCard = ({ game, color }: PlayerCardProps): JSX.Element => {
  const { translate } = useTranslation();
  const isPlayer = color === game.player;
  const isTurn = game.phase === GamePhase.Play && game.board.toPlay === color;

  return (
    <div className={`player-card${isTurn ? ' turn' : ''}`}>
      <div className="player-card-head">
        <StoneIcon black={color === Black} />
        <span>{translate(isPlayer ? 'you' : 'bot')}</span>
        {!isPlayer && (
          <span className="player-card-level">{translate(BotLevelKeys[game.settings.level])}</span>
        )}
      </div>
      <div className="player-card-count">{game.board.captures[color]}</div>
      <div className="player-card-caption">
        {translate('captured')}
        {color === White && ` · ${translate('komi')} ${game.settings.komi}`}
      </div>
    </div>
  );
};
