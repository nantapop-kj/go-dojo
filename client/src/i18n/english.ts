import type { StringKey } from '@/i18n/thai';

export const EnglishStrings: Record<StringKey, string> = {
  tagline: 'Train Go against a bot',

  navigationPlay: 'Play',
  navigationStats: 'Stats',
  navigationRules: 'Rules',

  newGame: 'New game',
  language: 'Language',

  black: 'Black',
  white: 'White',
  you: 'You',
  bot: 'Bot',

  levelEasy: 'Easy',
  levelMedium: 'Medium',
  levelHard: 'Hard',

  levelEasyDescription: 'Beginner, mostly random',
  levelMediumDescription: 'Captures, escapes, claims territory',
  levelHardDescription: 'Simulates games ahead (slower)',

  captured: 'Stones captured',
  komi: 'Komi',

  yourMove: 'Your move',
  botThinking: 'Bot is thinking…',
  findingHint: 'Finding a hint…',
  scoringTitle: 'Scoring',

  youWon: 'You won!',
  youLost: 'You lost',
  gameOverHint: 'Press “New game” to play again',

  winProbability: 'Win probability (est.)',

  inspect: 'INSPECT',
  hoverToInspect: 'Hover or tap the board to check a point',

  statusLegal: 'Legal',
  statusSelfAtari: 'Legal, but self-atari',
  statusKo: 'Illegal: ko',
  statusSuicide: 'Illegal: suicide',
  statusOccupied: 'Occupied',

  reasonKo: 'You cannot retake the ko immediately — play elsewhere first',
  reasonSuicide: 'Your stones would have no liberties left',
  reasonSelfAtari: 'Your group would have one liberty — the bot can capture it',

  liberties: 'Liberties',
  captures: 'Captures',
  ataris: 'Atari',

  pass: 'Pass',
  undo: 'Undo',
  hint: 'Hint',
  resign: 'Resign',

  showLegal: 'Show legal moves',
  showTerritory: 'Territory estimate',
  showCoordinates: 'Coordinates',

  legendLegal: 'Legal',
  legendWarning: 'Self-atari risk',
  legendIllegal: 'Illegal (ko/suicide)',
  legendHint: 'Hint',

  chineseRules: 'Chinese rules',
  handicapCount: 'Handicap {count}',
  downloadSgf: 'Download SGF',

  undosHints: '{undos} undos · {hints} hints',

  scoringHelp: 'The bot marked likely dead stones (×). Click a group to toggle dead/alive.',

  stonesOnBoard: 'Stones on board',
  territory: 'Territory',
  deadRemoved: 'Dead stones',
  total: 'Total',

  leads: '{color} leads by {points}',
  confirmScore: 'Confirm',
  resume: 'Resume',

  toastNewGame: 'You play {color} · {level} bot',
  toastCaptured: 'Captured {count}!',
  toastBotPass: 'Bot passed — pass too to end the game',

  toastBothPass: 'Both passed → scoring',
  toastHint: 'Hint: {move}',
  toastHintPass: 'The bot suggests passing',
  toastSaved: 'Result saved',

  toastSavedLocally: 'Server unreachable — saved on this device',
  toastCopied: 'Copied',

  newGameTitle: 'New game',
  boardSize: 'Board size',
  botLevel: 'Bot level',
  yourColor: 'You play',

  size9Description: 'Basics',
  size13Description: 'Medium',
  size19Description: 'Standard',
  moveFirst: 'Moves first',
  getsKomi: 'Gets komi',
  random: 'Random',

  handicap: 'Handicap (you take black with stones placed in advance)',
  noHandicap: 'None (even game)',
  stoneCount: '{count} stones',

  komiLabel: 'Komi (compensation for white)',
  cancel: 'Cancel',
  start: 'Start',

  resignTitle: 'Resign this game?',
  resignBody: 'It will count as a loss in your stats',

  botResigned: 'The bot resigned',
  youResigned: 'You resigned',
  scoreLine: 'Black {black} : White {white} · {color} wins by {margin}',

  resultSummary: '{moves} moves · captured {captured} · lost {lost}',
  viewBoard: 'View board',
  playAgain: 'Play again',

  record: 'PLAYER RECORD',
  yourProgress: 'Your progress',
  exportJson: 'Export JSON',
  reset: 'Reset',

  resetTitle: 'Reset all stats?',
  resetBody: 'Your whole game history will be deleted. This cannot be undone.',

  winRate: 'win rate',
  wins: 'wins',
  losses: 'losses',
  gamesPlayed: '{count} games played',

  currentStreak: 'Current streak',
  bestStreak: 'Best streak',
  averageMargin: 'Avg. winning margin',
  averageMoves: 'Avg. moves / game',

  stonesCaptured: 'Stones captured',
  timePlayed: 'Time on the board',
  recentGames: 'Last 20 games',
  byLevel: 'By bot level',
  bySize: 'By board size',

  byColor: 'By color',
  history: 'History',
  date: 'Date',
  board: 'Board',
  color: 'Color',
  result: 'Result',
  score: 'Score',

  win: 'Win',
  loss: 'Loss',
  noStats: 'No stats yet — finish a game and they will show up here',
  online: 'Synced with server',
  offline: 'Offline · saved on this device',

  hoursMinutes: '{hours}h {minutes}m',
  minutesOnly: '{minutes}m',

  rulesTitle: 'The basics',
  scoringRulesTitle: 'Scoring (area / Chinese rules)',
  tipsTitle: 'Training tips',

  notFoundTitle: 'Page not found',
  backToPlay: 'Back to play',

  ruleTurns:
    'Players alternate, black first, placing stones on the intersections. Stones never move.',
  ruleLiberties:
    'A liberty is an empty point directly next to a stone. Connected stones share their liberties.',
  ruleCapture:
    'A group with no liberties left is captured. A group with one liberty left is in “atari”.',
  ruleSuicide:
    'Suicide is illegal: you cannot leave your own stones without liberties, unless the move captures.',
  ruleKo:
    'Ko: you cannot immediately recapture if it would repeat the previous position — play elsewhere first.',
  ruleGameEnd:
    'The game ends after two passes in a row; dead stones are removed, then the board is scored.',

  scoringRule:
    'Score = your stones on the board + empty points you surround. White gets komi (usually 7.5) for moving second. Higher score wins.',

  tipStartSmall: 'Start with the easy bot on 9×9, then move up to 13×13 and 19×19.',
  tipOpening: 'In the opening take corners first, then sides, then the center.',
  tipTerritory: 'Turn on “Territory estimate” to see who controls which area.',
  tipHandicap: 'Losing a lot? Try a 2–9 stone handicap.',
  tipReview: 'Download the SGF and review it in Sabaki or KaTrain.',
};
