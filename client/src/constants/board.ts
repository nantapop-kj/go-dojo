export interface BoardPalette {
  boardTop: string;
  boardBottom: string;
  edge: string;
  grid: string;
  coordinate: string;
  star: string;
  legal: string;
  warning: string;
  illegal: string;
  accent: string;
  ghostAlpha: number;
  stoneShadow: string;
  blackMark: string;
  whiteMark: string;
  blackMarkStroke: string;
  whiteMarkStroke: string;
}

export const BoardColors: BoardPalette = {
  boardTop: '#ecd2a0',
  boardBottom: '#d9b273',
  edge: '#c49a5c',
  grid: 'rgba(70, 45, 15, 0.55)',
  coordinate: '#6e4f24',
  star: '#4a3112',
  legal: 'rgba(74, 49, 18, 0.55)',
  warning: '#d97706',
  illegal: '#b3202f',
  accent: '#0a5bb5',
  ghostAlpha: 0.5,
  stoneShadow: 'rgba(60, 35, 5, 0.4)',
  blackMark: 'rgba(28, 18, 6, 0.85)',
  whiteMark: 'rgba(255, 250, 238, 0.92)',
  blackMarkStroke: 'rgba(255, 240, 210, 0.35)',
  whiteMarkStroke: 'rgba(70, 45, 15, 0.45)',
};

export const StarPoints: Readonly<Record<number, readonly number[]>> = {
  9: [2, 4, 6],
  13: [3, 6, 9],
  19: [3, 9, 15],
};
