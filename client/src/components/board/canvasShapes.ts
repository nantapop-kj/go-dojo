import type { BoardPalette } from '@/constants/board';

type Context = CanvasRenderingContext2D;

export const circle = (
  context: Context,
  x: number,
  y: number,
  radius: number,
  fill: boolean,
): void => {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);

  if (fill) {
    context.fill();
  } else {
    context.stroke();
  }
};

export const roundRect = (
  context: Context,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  stroke: boolean = false,
): void => {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();

  if (stroke) context.stroke();
};

export const cross = (
  context: Context,
  x: number,
  y: number,
  size: number,
  color: string,
  lineWidth: number,
): void => {
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(x - size, y - size);
  context.lineTo(x + size, y + size);
  context.moveTo(x + size, y - size);
  context.lineTo(x - size, y + size);
  context.stroke();
  context.lineCap = 'butt';
};

export const stone = (
  context: Context,
  x: number,
  y: number,
  radius: number,
  black: boolean,
  alpha: number,
  palette: BoardPalette,
): void => {
  context.save();
  context.globalAlpha = alpha;

  if (alpha === 1) {
    context.shadowColor = palette.stoneShadow;
    context.shadowBlur = radius * 0.5;
    context.shadowOffsetY = radius * 0.18;
  }

  const gradient = context.createRadialGradient(
    x - radius * 0.35,
    y - radius * 0.4,
    radius * 0.08,
    x,
    y,
    radius,
  );

  if (black) {
    gradient.addColorStop(0, '#4a4f58');
    gradient.addColorStop(0.7, '#050608');
    gradient.addColorStop(1, '#050608');
  } else {
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.85, '#cfd6e0');
    gradient.addColorStop(1, '#b9c2cf');
  }

  context.fillStyle = gradient;
  circle(context, x, y, radius, true);
  context.restore();
};
