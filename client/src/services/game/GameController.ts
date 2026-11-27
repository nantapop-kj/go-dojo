import { Pass, setupBoard, type Board, type Move } from '@/lib/go';
import { DefaultGameSettings } from '@/constants/defaults';
import type { ActiveSettings, GameSettings } from '@/types';

interface UndoEntry {
  board: Board;
  moveCount: number;
}

type Listener = () => void;

export class GameController {
  settings: ActiveSettings = {
    size: DefaultGameSettings.size,
    handicap: DefaultGameSettings.handicap,
    komi: DefaultGameSettings.komi,
  };
  board: Board = setupBoard(this.settings.size);
  moves: Move[] = [];
  version = 0;

  onCapture?: (count: number) => void;

  private undoStack: UndoEntry[] = [];
  private listeners = new Set<Listener>();

  get canUndo(): boolean {
    return this.undoStack.length > 0;
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
    this.settings = { size: settings.size, handicap: settings.handicap, komi: settings.komi };
    this.board = setupBoard(settings.size, settings.handicap);
    this.moves = [];
    this.undoStack = [];
    this.emit();
  };

  play = (point: Move): boolean => {
    if (!this.board.isLegal(point)) return false;

    this.undoStack.push({ board: this.board.clone(), moveCount: this.moves.length });

    const captured = this.board.play(point);
    this.moves.push(point);

    if (captured.length) this.onCapture?.(captured.length);

    this.emit();

    return true;
  };

  pass = (): void => {
    this.play(Pass);
  };

  undo = (): void => {
    const entry = this.undoStack.pop();

    if (!entry) return;

    this.board = entry.board;
    this.moves.length = entry.moveCount;
    this.emit();
  };

  private emit = (): void => {
    this.version++;

    for (const listener of this.listeners) listener();
  };
}
