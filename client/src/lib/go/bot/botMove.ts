import { Black, Empty, Pass } from '@/lib/go/game/constants';
import type { Board } from '@/lib/go/game/board';
import { heuristic } from '@/lib/go/bot/heuristic';
import { countOwnership, estimate, now, playout, randomInt } from '@/lib/go/bot/playout';
import type { BotConfig, BotDecision, Candidate, Color } from '@/lib/go/types';

interface Arm {
  point: number;
  prior: number;
  wins: number;
  visits: number;
}

const byScore = (first: Candidate, second: Candidate): number => second.score - first.score;

const getEstimateCount = (config: BotConfig, isLarge: boolean): number => {
  if (config.level === 'easy') return 0;
  if (config.level === 'medium') return isLarge ? 24 : 40;

  return isLarge ? 40 : 80;
};

const pickEasy = (candidates: Candidate[]): BotDecision => {
  const reasonable = candidates.filter((candidate: Candidate): boolean => candidate.score > -3);

  if (reasonable.length && Math.random() < 0.3) {
    return { move: reasonable[randomInt(reasonable.length)].point };
  }

  for (const candidate of candidates) {
    candidate.score += Math.random() * 5;
  }

  candidates.sort(byScore);

  return { move: candidates[0].point };
};

const pickMedium = (board: Board, candidates: Candidate[]): BotDecision => {
  for (const candidate of candidates) candidate.score += Math.random() * 0.9;

  candidates.sort(byScore);

  if (candidates[0].score < -4 && board.moveCount > board.pointCount * 0.6) {
    return { move: Pass };
  }

  return { move: candidates[0].point };
};

const pickHard = (
  board: Board,
  color: Color,
  candidates: Candidate[],
  config: BotConfig,
): BotDecision => {
  const { pointCount } = board;
  const isLarge = pointCount > 200;
  const sign = color === Black ? 1 : -1;

  candidates.sort(byScore);

  const isHopeless = candidates[0].score < -4 && board.moveCount > pointCount * 0.6;

  if (isHopeless && !config.forHint) return { move: Pass };

  const armCount = Math.min(candidates.length, isLarge ? 10 : 12);
  const arms: Arm[] = candidates.slice(0, armCount).map((candidate: Candidate): Arm => ({
    point: candidate.point,
    prior: candidate.score,
    wins: 0,
    visits: 0,
  }));
  const budget = config.budget ?? (isLarge ? 2200 : pointCount > 100 ? 1600 : 1200);
  const ownership = new Int8Array(pointCount);
  const deadline = now() + budget;
  let total = 0;

  while (now() < deadline) {
    let best = arms[0];
    let bestValue = -Infinity;

    for (const arm of arms) {
      const value = arm.visits === 0
        ? 1e9 + arm.prior
        : arm.wins / arm.visits
        + Math.sqrt((2 * Math.log(total + 1)) / arm.visits)
        + arm.prior * 0.02;

      if (value > bestValue) {
        bestValue = value;
        best = arm;
      }
    }

    const trial = board.clone();
    trial.play(best.point, color);
    playout(trial);

    const score = (countOwnership(trial, ownership) - config.komi) * sign;

    best.visits++;

    if (score > 0) best.wins++;

    total++;
  }

  arms.sort((first: Arm, second: Arm): number => {
    return second.visits - first.visits || second.prior - first.prior;
  });

  const chosen = arms[0];

  return {
    move: chosen.point,
    winrate: chosen.wins / Math.max(1, chosen.visits),
    playouts: total,
  };
};

export const botMove = (board: Board, color: Color, config: BotConfig): BotDecision => {
  const { level, komi, opponentPassed = false, forHint = false } = config;
  const { pointCount } = board;
  const isLarge = pointCount > 200;
  const sign = color === Black ? 1 : -1;
  const estimateCount = getEstimateCount(config, isLarge);
  const analysis = estimateCount ? estimate(board, estimateCount, komi) : null;

  if (opponentPassed && !forHint) {
    const settled = analysis ?? estimate(board, isLarge ? 24 : 40, komi);
    const lead = settled.meanScore * sign;
    let unsettled = 0;

    for (let point = 0; point < pointCount; point++) {
      if (board.cells[point] === Empty && Math.abs(settled.ownership[point]) < 0.6) {
        unsettled++;
      }
    }

    const isWinningAndSettled = lead > 0 && unsettled <= pointCount * 0.08;

    if (isWinningAndSettled || unsettled <= (isLarge ? 2 : 0)) {
      return { move: Pass };
    }
  }

  if (analysis && !forHint && level !== 'easy' && board.moveCount > pointCount * 0.45) {
    const myWin = color === Black ? analysis.blackWin : 1 - analysis.blackWin;

    if (myWin < 0.02 && Math.abs(analysis.meanScore) > 15) {
      return { move: 'resign' };
    }
  }

  const candidates = heuristic(board, color, analysis?.ownership ?? null);

  if (!candidates.length || board.moveCount > pointCount * 2.5) {
    return { move: Pass };
  }

  if (level === 'easy') {
    return pickEasy(candidates);
  }

  if (level === 'medium') {
    return pickMedium(board, candidates);
  }

  return pickHard(board, color, candidates, config);
};
