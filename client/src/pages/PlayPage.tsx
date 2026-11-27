import type { JSX } from 'react';
import { Black, White } from '@/lib/go';
import { Board } from '@/components/board/Board';
import { BoardLegend } from '@/components/game/BoardLegend';
import { DisplayToggles } from '@/components/game/DisplayToggles';
import { GameActions } from '@/components/game/GameActions';
import { Inspector } from '@/components/game/Inspector';
import { PlayerCard } from '@/components/game/PlayerCard';
import { useBoardInteraction } from '@/hooks/useBoardInteraction';
import { useGame } from '@/hooks/useGame';
import { usePreferences } from '@/hooks/usePreferences';
import { useTranslation } from '@/hooks/useTranslation';
import '@/pages/PlayPage.css';

export const PlayPage = (): JSX.Element => {
  const { game, version } = useGame();
  const { preferences } = usePreferences();
  const { translate } = useTranslation();
  const { hover, setHover, handlePoint } = useBoardInteraction(game);
  const { board, settings } = game;

  return (
    <main className="play">
      <section className="play-board" aria-label={translate('board')}>
        <Board
          board={board}
          version={version}
          showLegal={preferences.showLegal}
          showCoordinates={preferences.showCoordinates}
          showTerritory={preferences.showTerritory}
          hover={hover}
          label={`${translate('board')} ${board.size}×${board.size}`}
          onHover={setHover}
          onPoint={handlePoint}
        />
        <BoardLegend />
      </section>
      <aside className="play-panel">
        <div className="play-players">
          <PlayerCard board={board} color={Black} komi={settings.komi} />
          <PlayerCard board={board} color={White} komi={settings.komi} />
        </div>
        <Inspector board={board} hover={hover} />
        <GameActions game={game} />
        <DisplayToggles />
      </aside>
    </main>
  );
};
