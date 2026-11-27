import { Black, ColumnLetters, Empty, White, type Board, type MoveStatus } from '@/lib/go';
import { BoardColors, StarPoints } from '@/constants/board';
import { circle, cross, roundRect, stone } from '@/components/board/canvasShapes';

export interface DrawOptions {
  showCoordinates: boolean;
  showTerritory: boolean;
  ownership: Float32Array | null;
  statuses: readonly MoveStatus[] | null;
  hover: number;
}

export interface BoardGeometry {
  cell: number;
  padding: number;
}

export const drawBoard = (
  context: CanvasRenderingContext2D,
  width: number,
  board: Board,
  options: DrawOptions,
): BoardGeometry => {
  const palette = BoardColors;
  const size = board.size;
  const paddingFactor = options.showCoordinates ? 1.15 : 0.65;
  const cell = width / (size - 1 + paddingFactor * 2);
  const padding = cell * paddingFactor;
  const toPixel = (index: number): number => padding + index * cell;

  const background = context.createLinearGradient(0, 0, width * 0.4, width);
  background.addColorStop(0, palette.boardTop);
  background.addColorStop(1, palette.boardBottom);
  context.fillStyle = background;
  context.fillRect(0, 0, width, width);
  context.strokeStyle = palette.edge;
  context.lineWidth = 2;
  context.strokeRect(1, 1, width - 2, width - 2);

  context.strokeStyle = palette.grid;
  context.lineWidth = 1;
  context.beginPath();

  for (let index = 0; index < size; index++) {
    const line = Math.round(toPixel(index)) + 0.5;

    context.moveTo(toPixel(0), line);
    context.lineTo(toPixel(size - 1), line);
    context.moveTo(line, toPixel(0));
    context.lineTo(line, toPixel(size - 1));
  }

  context.stroke();

  const stars = StarPoints[size] ?? [];
  const middle = (size - 1) / 2;
  context.fillStyle = palette.star;

  for (const starX of stars) {
    for (const starY of stars) {
      if (size === 9 && (starX === middle) !== (starY === middle)) continue;

      circle(
        context,
        toPixel(starX),
        toPixel(starY),
        Math.max(2.2, cell * 0.09),
        true
      );
    }
  }

  if (options.showCoordinates) {
    context.fillStyle = palette.coordinate;
    context.font = `500 ${Math.max(9, Math.min(13, cell * 0.36))}px 'JetBrains Mono', monospace`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    for (let index = 0; index < size; index++) {
      const position = toPixel(index);
      const row = String(size - index);

      context.fillText(ColumnLetters[index], position, padding * 0.4);
      context.fillText(ColumnLetters[index], position, width - padding * 0.4);
      context.fillText(row, padding * 0.4, position);
      context.fillText(row, width - padding * 0.4, position);
    }
  }

  for (let point = 0; point < board.pointCount; point++) {
    const cellColor = board.cells[point];

    if (cellColor === Empty) continue;

    const [x, y] = board.toCoordinates(point);

    stone(
      context,
      toPixel(x),
      toPixel(y),
      cell * 0.47,
      cellColor === Black,
      1,
      palette
    );
  }

  if (options.showTerritory && options.ownership) {
    for (let point = 0; point < board.pointCount; point++) {
      const owned = options.ownership[point];
      const cellColor = board.cells[point];
      const ownerColor = owned > 0 ? Black : White;

      if (Math.abs(owned) < 0.25 || cellColor === ownerColor) continue;

      const [x, y] = board.toCoordinates(point);
      const isBlack = ownerColor === Black;
      const markSize = cell * 0.4 * Math.abs(owned);

      context.fillStyle = isBlack ? palette.blackMark : palette.whiteMark;
      context.strokeStyle = isBlack ? palette.blackMarkStroke : palette.whiteMarkStroke;
      context.lineWidth = 1;
      roundRect(
        context,
        toPixel(x) - markSize / 2,
        toPixel(y) - markSize / 2,
        markSize,
        markSize,
        markSize * 0.2,
        true,
      );
    }
  }

  const lastMove = board.lastMove;

  if (lastMove !== null && lastMove >= 0 && board.cells[lastMove] !== Empty) {
    const [x, y] = board.toCoordinates(lastMove);

    context.strokeStyle = palette.accent;
    context.lineWidth = Math.max(2, cell / 14);
    circle(
      context,
      toPixel(x),
      toPixel(y),
      cell * 0.17,
      false
    );
  }

  if (options.statuses) {
    for (let point = 0; point < board.pointCount; point++) {
      const status = options.statuses[point];

      if (status === 'occupied') continue;

      const [x, y] = board.toCoordinates(point);
      const centerX = toPixel(x);
      const centerY = toPixel(y);

      if (status === 'legal') {
        context.fillStyle = palette.legal;
        circle(
          context,
          centerX,
          centerY,
          Math.max(1.8, cell * 0.075),
          true
        );
      } else if (status === 'selfAtari') {
        context.fillStyle = palette.warning;
        circle(
          context,
          centerX,
          centerY,
          Math.max(2.4, cell * 0.11),
          true
        );
      } else {
        cross(
          context,
          centerX,
          centerY,
          cell * 0.17,
          palette.illegal,
          Math.max(2, cell / 13)
        );
      }
    }
  }

  if (options.hover >= 0) {
    const [x, y] = board.toCoordinates(options.hover);
    const reason = board.legalReason(options.hover);

    if (!reason) {
      const isBlack = board.toPlay === Black;

      stone(
        context,
        toPixel(x),
        toPixel(y),
        cell * 0.47,
        isBlack,
        palette.ghostAlpha,
        palette
      );
    } else if (reason !== 'occupied') {
      context.strokeStyle = palette.illegal;
      context.lineWidth = Math.max(2, cell / 12);
      circle(
        context,
        toPixel(x),
        toPixel(y),
        cell * 0.4,
        false
      );
    }
  }

  return { cell, padding };
};
