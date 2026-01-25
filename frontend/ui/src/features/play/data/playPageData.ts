export interface Game {
  time: string;
  type: string;
  gradient: string;
  hoverGradient: string;
}

export const gameTypes: { games: Game[] }[] = [
  {
    games: [
      { time: '1+0', type: 'Bullet', gradient: 'from-red-500/80 to-orange-500/80', hoverGradient: 'from-red-400/90 to-orange-400/90' },
      { time: '2+1', type: 'Bullet', gradient: 'from-red-500/80 to-orange-500/80', hoverGradient: 'from-red-400/90 to-orange-400/90' },
      { time: '3+0', type: 'Blitz', gradient: 'from-yellow-500/80 to-amber-500/80', hoverGradient: 'from-yellow-400/90 to-amber-400/90' }
    ]
  },
  {
    games: [
      { time: '3+2', type: 'Blitz', gradient: 'from-yellow-500/80 to-amber-500/80', hoverGradient: 'from-yellow-400/90 to-amber-400/90' },
      { time: '5+0', type: 'Blitz', gradient: 'from-yellow-500/80 to-amber-500/80', hoverGradient: 'from-yellow-400/90 to-amber-400/90' },
      { time: '5+3', type: 'Blitz', gradient: 'from-yellow-500/80 to-amber-500/80', hoverGradient: 'from-yellow-400/90 to-amber-400/90' }
    ]
  },
  {
    games: [
      { time: '10+0', type: 'Rapid', gradient: 'from-green-500/80 to-emerald-500/80', hoverGradient: 'from-green-400/90 to-emerald-400/90' },
      { time: '10+5', type: 'Rapid', gradient: 'from-green-500/80 to-emerald-500/80', hoverGradient: 'from-green-400/90 to-emerald-400/90' },
      { time: '15+10', type: 'Rapid', gradient: 'from-green-500/80 to-emerald-500/80', hoverGradient: 'from-green-400/90 to-emerald-400/90' }
    ]
  }
];

export const additionalGames: Game[] = [
  { time: '30+0', type: 'Classical', gradient: 'from-blue-500/80 to-indigo-500/80', hoverGradient: 'from-blue-400/90 to-indigo-400/90' },
  { time: '30+20', type: 'Classical', gradient: 'from-blue-500/80 to-indigo-500/80', hoverGradient: 'from-blue-400/90 to-indigo-400/90' },
  { time: 'Custom', type: '', gradient: 'from-purple-500/80 to-violet-500/80', hoverGradient: 'from-purple-400/90 to-violet-400/90' }
];