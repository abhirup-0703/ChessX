export interface Card {
  title: string;
  icon: string;
  href: string;
  gradient: string;
  shadow: string;
}

export interface Feature {
  icon: string;
  title: string;
  desc: string;
}

export const cards: Card[] = [
  {
    title: 'Quick Play',
    icon: '⚡',
    href: '/play',
    gradient: 'from-emerald-600 to-teal-700',
    shadow: 'hover:shadow-[0_0_40px_-10px_rgba(22,163,74,0.5)]'
  },
  {
    title: 'Puzzles',
    icon: '🧩',
    href: '/puzzles',
    gradient: 'from-violet-600 to-purple-700',
    shadow: 'hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)]'
  },
  {
    title: 'Analysis',
    icon: '🔍',
    href: '/analysis',
    gradient: 'from-orange-600 to-red-700',
    shadow: 'hover:shadow-[0_0_40px_-10px_rgba(234,88,12,0.5)]'
  }
];

export const features: Feature[] = [
  { icon: '🚀', title: 'Fast & Smooth', desc: 'Lightning-fast gameplay' },
  { icon: '🎯', title: 'Skill-Based', desc: 'Fair matchmaking' },
  { icon: '📊', title: 'Deep Analysis', desc: 'Learn from every game' },
  { icon: '🌍', title: 'Compete Globally', desc: 'Join tournaments' }
];