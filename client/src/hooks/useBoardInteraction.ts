import { useState } from 'react';
import type { GameController } from '@/services/game/GameController';

interface BoardInteraction {
  hover: number;
  setHover: (point: number) => void;
  handlePoint: (point: number) => void;
}

export const useBoardInteraction = (game: GameController): BoardInteraction => {
  const [hover, setHover] = useState(-1);

  const handlePoint = (point: number): void => {
    setHover(point);
    game.play(point);
  };

  return { hover, setHover, handlePoint };
};
