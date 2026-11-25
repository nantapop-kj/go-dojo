import type { Color } from '@/lib/go/types';

export const Empty = 0;
export const Black = 1;
export const White = 2;
export const Pass = -1;

export const ColumnLetters = 'ABCDEFGHJKLMNOPQRST';
export const BoardSizes = [9, 13, 19] as const;

export const other = (color: Color): Color => (color === Black ? White : Black);

export const colorLetter = (color: Color): 'B' | 'W' => (color === Black ? 'B' : 'W');
