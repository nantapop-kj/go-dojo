import { useState, type JSX } from 'react';
import { Button } from '@/components/common/Button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { FlagIcon, PassIcon, UndoIcon } from '@/components/common/icons';
import { GamePhase } from '@/enums';
import { useTranslation } from '@/hooks/useTranslation';
import type { GameController } from '@/services/game/GameController';
import '@/components/game/GameActions.css';

interface GameActionsProps {
  game: GameController;
}

export const GameActions = ({ game }: GameActionsProps): JSX.Element => {
  const { translate } = useTranslation();
  const [resignOpen, setResignOpen] = useState(false);

  return (
    <div className="game-actions">
      <Button disabled={!game.humanTurn} onClick={game.pass}>
        <PassIcon />
        {translate('pass')}
      </Button>
      <Button disabled={!game.canUndo} onClick={game.undo}>
        <UndoIcon />
        {translate('undo')}
      </Button>
      <Button
        variant="danger"
        className="game-actions-resign"
        disabled={game.phase !== GamePhase.Play}
        onClick={(): void => setResignOpen(true)}
      >
        <FlagIcon />
        {translate('resign')}
      </Button>
      <ConfirmDialog
        open={resignOpen}
        title={translate('resignTitle')}
        body={translate('resignBody')}
        confirmLabel={translate('resign')}
        cancelLabel={translate('cancel')}
        danger
        onConfirm={game.resign}
        onClose={(): void => setResignOpen(false)}
      />
    </div>
  );
};
