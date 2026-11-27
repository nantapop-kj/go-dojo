import {
  Black,
  Pass,
  White,
  other,
  setupBoard,
  type Board,
  type BotDecision,
  type Color,
  type Move,
} from '@/lib/go';
import { BotLevelKeys } from '@/constants/botLevels';
import { BotMoveDelay, DefaultGameSettings } from '@/constants/defaults';
import { GamePhase } from '@/enums';
import { BotWorkerClient } from '@/services/game/BotWorkerClient';
import type { ActiveSettings, GameMessage, GameResult, GameSettings } from '@/types';

interface UndoEntry {
  board: Board;
  moveCount: number;
}

type Listener = () => void;

const wait = (milliseconds: number): Promise<void> => {
  return new Promise((resolve: () => void): void => {
    setTimeout(resolve, milliseconds);
  });
};

const resolvePlayer = (settings: GameSettings): Color => {
  if (settings.handicap >= 2 || settings.color === 'black') return Black;
  if (settings.color === 'white') return White;

  return Math.random() < 0.5 ? Black : White;
};

export class GameController {
  settings: ActiveSettings = {
    size: DefaultGameSettings.size,
    level: DefaultGameSettings.level,
    handicap: DefaultGameSettings.handicap,
    komi: DefaultGameSettings.komi,
  };
  player: Color = Black;
  board: Board = setupBoard(this.settings.size);
  moves: Move[] = [];
  phase: GamePhase = GamePhase.Play;
  result: GameResult | null = null;
  thinking = false;
  ownership: Float32Array | null = null;
  blackWin: number | null = null;
  version = 0;

  onMessage?: (message: GameMessage) => void;

  private undoStack: UndoEntry[] = [];
  private listeners = new Set<Listener>();
  private gameId = 0;
  private analysisSequence = 0;
  private botWorker = new BotWorkerClient();
  private analysisWorker = new BotWorkerClient();

  get bot(): Color {
    return other(this.player);
  }

  get humanTurn(): boolean {
    return this.phase === GamePhase.Play && !this.thinking && this.board.toPlay === this.player;
  }

  get canUndo(): boolean {
    return this.phase === GamePhase.Play && !this.thinking && this.undoStack.length > 0;
  }

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);

    return (): void => {
      this.listeners.delete(listener);
    };
  };

  getVersion = (): number => {
    return this.version;
  };

  start = (settings: GameSettings): void => {
    this.gameId++;
    this.settings = {
      size: settings.size,
      level: settings.level,
      handicap: settings.handicap,
      komi: settings.komi,
    };
    this.player = resolvePlayer(settings);
    this.board = setupBoard(settings.size, settings.handicap);
    this.moves = [];
    this.undoStack = [];
    this.phase = GamePhase.Play;
    this.result = null;
    this.thinking = false;
    this.ownership = null;
    this.blackWin = null;

    this.onMessage?.({
      key: 'toastNewGame',
      translatedVariables: {
        color: this.player === Black ? 'black' : 'white',
        level: BotLevelKeys[settings.level],
      },
    });

    this.afterChange();
  };

  play = (point: Move): boolean => {
    if (!this.humanTurn || !this.board.isLegal(point)) return false;

    this.undoStack.push({ board: this.board.clone(), moveCount: this.moves.length });
    this.applyMove(point);

    return true;
  };

  pass = (): void => {
    this.play(Pass);
  };

  undo = (): void => {
    if (!this.canUndo) return;

    const entry = this.undoStack.pop();

    if (!entry) return;

    this.board = entry.board;
    this.moves.length = entry.moveCount;
    this.afterChange();
  };

  resign = (): void => {
    if (this.phase !== GamePhase.Play) return;

    this.onMessage?.({ key: 'youResigned' });
    this.finish({ winner: this.bot, reason: 'resign', margin: null });
  };

  private applyMove = (point: Move): void => {
    const mover = this.board.toPlay;
    const captured = this.board.play(point, mover);

    this.moves.push(point);

    if (mover === this.player && captured.length) {
      this.onMessage?.({ key: 'toastCaptured', variables: { count: captured.length } });
    }

    if (this.board.passes >= 2) {
      this.onMessage?.({ key: 'toastBothPass' });
      this.finishByScore();
      return;
    }

    this.afterChange();
  };

  private afterChange = (): void => {
    this.emit();
    void this.refreshAnalysis();

    const isBotTurn = this.phase === GamePhase.Play && this.board.toPlay === this.bot;

    if (isBotTurn && !this.thinking) void this.botTurn();
  };

  private botTurn = async (): Promise<void> => {
    const gameId = this.gameId;

    this.thinking = true;
    this.emit();

    await wait(BotMoveDelay);

    let decision: BotDecision;

    try {
      decision = await this.botWorker.move(this.board, this.bot, {
        level: this.settings.level,
        komi: this.settings.komi,
        opponentPassed: this.board.lastMove === Pass,
      });
    } catch (error) {
      console.error(error);
      decision = { move: Pass };
    }

    if (gameId !== this.gameId || this.phase !== GamePhase.Play) return;

    this.thinking = false;

    if (decision.move === 'resign') {
      this.onMessage?.({ key: 'botResigned' });
      this.finish({ winner: this.player, reason: 'resign', margin: null });
      return;
    }

    if (decision.move === Pass && this.board.lastMove !== Pass) {
      this.onMessage?.({ key: 'toastBotPass' });
    }

    this.applyMove(decision.move);
  };

  private refreshAnalysis = async (): Promise<void> => {
    if (this.phase !== GamePhase.Play) return;

    const sequence = ++this.analysisSequence;
    const count = this.board.pointCount > 200 ? 48 : 90;

    try {
      const analysis = await this.analysisWorker.estimate(this.board, count, this.settings.komi);

      if (sequence !== this.analysisSequence || this.phase !== GamePhase.Play) return;

      this.ownership = analysis.ownership;
      this.blackWin = analysis.blackWin;
      this.emit();
    } catch (error) {
      console.error(error);
    }
  };

  private finishByScore = (): void => {
    const score = this.board.areaScore(null, this.settings.komi);
    const winner = score.black > score.white ? Black : White;
    const margin = Math.abs(score.black - score.white);

    this.onMessage?.({
      key: 'scoreLine',
      variables: { black: score.black, white: score.white, margin },
      translatedVariables: { color: winner === Black ? 'black' : 'white' },
    });

    this.finish({ winner, reason: 'score', margin });
  };

  private finish = (result: GameResult): void => {
    this.phase = GamePhase.Over;
    this.result = result;
    this.thinking = false;
    this.emit();
  };

  private emit = (): void => {
    this.version++;

    for (const listener of this.listeners) listener();
  };
}
