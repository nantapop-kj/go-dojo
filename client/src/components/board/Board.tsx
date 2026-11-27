import { useEffect, useMemo, useRef, type JSX, type MouseEvent, type PointerEvent } from 'react';
import { inspectMove, type Board as GoBoard, type MoveStatus } from '@/lib/go';
import { drawBoard, type BoardGeometry } from '@/components/board/drawBoard';
import '@/components/board/Board.css';

interface BoardProps {
  board: GoBoard;
  version: number;
  showLegal: boolean;
  showCoordinates: boolean;
  showTerritory: boolean;
  hover: number;
  label: string;
  onHover: (point: number) => void;
  onPoint: (point: number) => void;
}

const getStatuses = (board: GoBoard): MoveStatus[] => {
  const statuses: MoveStatus[] = new Array(board.pointCount);

  for (let point = 0; point < board.pointCount; point++) {
    statuses[point] = inspectMove(board, point, board.toPlay).status;
  }

  return statuses;
};

export const Board = ({
  board,
  version,
  showLegal,
  showCoordinates,
  showTerritory,
  hover,
  label,
  onHover,
  onPoint,
}: BoardProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const geometryRef = useRef<BoardGeometry>({ cell: 0, padding: 0 });

  const statuses = useMemo(
    (): MoveStatus[] | null => (showLegal ? getStatuses(board) : null),
    [board, version, showLegal],
  );

  useEffect((): (() => void) | undefined => {
    const canvas = canvasRef.current;

    if (!canvas) return undefined;

    const draw = (): void => {
      const cssWidth = canvas.clientWidth;

      if (!cssWidth) return;

      const pixelRatio = window.devicePixelRatio || 1;
      const pixelWidth = Math.round(cssWidth * pixelRatio);

      if (canvas.width !== pixelWidth) {
        canvas.width = pixelWidth;
        canvas.height = pixelWidth;
      }

      const context = canvas.getContext('2d');

      if (!context) return;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      geometryRef.current = drawBoard(context, cssWidth, board, {
        showCoordinates,
        showTerritory,
        statuses,
        hover,
      });
    };

    draw();

    const observer = new ResizeObserver(draw);
    observer.observe(canvas);

    return (): void => observer.disconnect();
  }, [board, version, showCoordinates, showTerritory, statuses, hover]);

  const pointAt = (clientX: number, clientY: number): number => {
    const canvas = canvasRef.current;

    if (!canvas) return -1;

    const rect = canvas.getBoundingClientRect();
    const { cell, padding } = geometryRef.current;
    const x = Math.round((clientX - rect.left - padding) / cell);
    const y = Math.round((clientY - rect.top - padding) / cell);
    const isInside = x >= 0 && y >= 0 && x < board.size && y < board.size;

    return isInside ? board.toIndex(x, y) : -1;
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>): void => {
    if (event.pointerType !== 'mouse') return;

    const point = pointAt(event.clientX, event.clientY);

    if (point !== hover) onHover(point);
  };

  const handlePointerLeave = (): void => {
    onHover(-1);
  };

  const handleClick = (event: MouseEvent<HTMLCanvasElement>): void => {
    const point = pointAt(event.clientX, event.clientY);

    if (point >= 0) onPoint(point);
  };

  return (
    <div className="board-frame">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      />
    </div>
  );
};
