import { Pass } from '@/lib/go/game/constants';
import { handicapPoints } from '@/lib/go/game/setup';
import type { GameRecord, GameSubmission, Move, SgfInfo } from '@/lib/go/types';

export const resultString = (
  game: Pick<GameSubmission, 'winner' | 'reason' | 'margin'>,
): string => {
  return game.reason === 'resign'
    ? `${game.winner}+R`
    : `${game.winner}+${game.margin ?? 0}`;
};

const escapeText = (text: string): string => {
  return text.replace(/[\]\\]/g, (character: string): string => '\\' + character);
};

export const toSgf = (info: SgfInfo, moves: readonly Move[]): string => {
  const {
    size,
    komi,
    handicap = 0,
    blackName,
    whiteName,
    result = '',
    date,
  } = info;

  const toCoordinates = (point: Move): string => {
    if (point === Pass) return '';

    const x = point % size;
    const y = (point / size) | 0;

    return String.fromCharCode(97 + x) + String.fromCharCode(97 + y);
  };

  const handicapStones = handicapPoints(size, handicap);
  const gameDate = date ?? new Date().toISOString().slice(0, 10);

  let sgf =
    `(;GM[1]FF[4]CA[UTF-8]AP[GoDojo]RU[Chinese]SZ[${size}]KM[${komi}]` +
    `PB[${escapeText(blackName)}]PW[${escapeText(whiteName)}]DT[${gameDate}]`;

  if (result) sgf += `RE[${result}]`;

  if (handicapStones.length) {
    const stones = handicapStones
      .map((point: number): string => `[${toCoordinates(point)}]`)
      .join('');

    sgf += `HA[${handicapStones.length}]AB${stones}`;
  }

  let blackToPlay = handicapStones.length === 0;

  for (const move of moves) {
    sgf += `;${blackToPlay ? 'B' : 'W'}[${toCoordinates(move)}]`;
    blackToPlay = !blackToPlay;
  }

  return sgf + ')';
};

export const recordToSgf = (
  game: GameRecord,
  names: { you: string; bot: string } = { you: 'Player', bot: 'GoDojo Bot' },
): string => {
  const botName = `${names.bot} (${game.level})`;

  return toSgf(
    {
      size: game.size,
      komi: game.komi,
      handicap: game.handicap,
      blackName: game.player === 'B' ? names.you : botName,
      whiteName: game.player === 'W' ? names.you : botName,
      result: resultString(game),
      date: game.date.slice(0, 10),
    },
    game.moves,
  );
};
