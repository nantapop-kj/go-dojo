import type { JSX } from 'react';
import { Button } from '@/components/common/Button';
import { PassIcon, UndoIcon } from '@/components/common/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { GameController } from '@/services/game/GameController';
import '@/components/game/GameActions.css';

interface GameActionsProps {
  game: GameController;
}

export const GameActions = ({ game }: GameActionsProps): JSX.Element => {
  const { translate } = useTranslation();

  return (
    <div className="game-actions">
      <Button onClick={game.pass}>
        <PassIcon />
        {translate('pass')}
      </Button>
      <Button disabled={!game.canUndo} onClick={game.undo}>
        <UndoIcon />
        {translate('undo')}
      </Button>
    </div>
  );
};
