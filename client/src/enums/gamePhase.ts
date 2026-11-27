export const GamePhase = {
  Play: 'play',
  Over: 'over',
} as const;

export type GamePhase = (typeof GamePhase)[keyof typeof GamePhase];
