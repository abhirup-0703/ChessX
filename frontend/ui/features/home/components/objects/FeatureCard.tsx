import Link from 'next/link';
import { Card } from '@/features/home/data/homePageData';

interface FeatureCardProps {
  card: Card;
  animationDelay: string;
}

const FeatureCard = ({ card, animationDelay }: FeatureCardProps) => (
  <Link
    href={card.href}
    className="group block animate-in fade-in slide-in-from-bottom duration-1000"
    style={{ animationDelay }}
  >
    <div className={`relative h-80 bg-gradient-to-br ${card.gradient} rounded-2xl p-6 shadow-lg transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2 overflow-hidden ${card.shadow}`}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-50 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
        {card.icon}
      </div>
      <div className="relative z-10 h-full flex items-center justify-center">
        <h3 className="text-4xl font-bold text-center">
          {card.title}
        </h3>
      </div>
    </div>
  </Link>
);

export default FeatureCard;