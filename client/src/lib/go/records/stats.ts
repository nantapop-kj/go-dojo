import type { GameRecord, StatsSummary } from '@/lib/go/types';

export const summarize = (games: readonly GameRecord[]): StatsSummary => {
  const summary: StatsSummary = {
    total: games.length,
    wins: 0,
    losses: 0,
    winRate: 0,
    currentStreak: 0,
    bestStreak: 0,
    resignWins: 0,
    resignLosses: 0,
    averageMoves: 0,
    averageWinMargin: null,
    totalCaptured: 0,
    totalTime: 0,
    byLevel: {},
    bySize: {},
    byColor: {
      B: { wins: 0, losses: 0 },
      W: { wins: 0, losses: 0 },
    },
    recent: games
      .slice(-20)
      .map((game: GameRecord): GameRecord['result'] => game.result),
  };

  let streak = 0;
  let marginSum = 0;
  let marginCount = 0;
  let moveSum = 0;

  for (const game of games) {
    const win = game.result === 'win';

    if (win) {
      summary.wins++;
    } else {
      summary.losses++;
    }

    if (game.reason === 'resign') {
      if (win) {
        summary.resignWins++;
      } else {
        summary.resignLosses++;
      }
    }

    streak = win ? Math.max(1, streak + 1) : Math.min(-1, streak - 1);

    if (win) {
      summary.bestStreak = Math.max(summary.bestStreak, streak);
    }

    if (win && game.margin != null) {
      marginSum += game.margin;
      marginCount++;
    }

    moveSum += game.moves.length;
    summary.totalCaptured += game.captures[game.player] ?? 0;
    summary.totalTime += game.duration || 0;

    const buckets = [
      [summary.byLevel, game.level],
      [summary.bySize, `${game.size}x${game.size}`],
    ] as const;

    for (const [bucket, key] of buckets) {
      const winLoss = (bucket[key] ??= { wins: 0, losses: 0 });

      if (win) {
        winLoss.wins++;
      } else {
        winLoss.losses++;
      }
    }

    const colorWinLoss = summary.byColor[game.player];

    if (win) {
      colorWinLoss.wins++;
    } else {
      colorWinLoss.losses++;
    }
  }

  summary.currentStreak = streak;
  summary.winRate = summary.total ? summary.wins / summary.total : 0;
  summary.averageMoves = summary.total ? Math.round(moveSum / summary.total) : 0;
  summary.averageWinMargin = marginCount ? marginSum / marginCount : null;

  return summary;
};
