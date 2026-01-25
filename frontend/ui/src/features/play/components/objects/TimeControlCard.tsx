import Link from 'next/link';
import { Game } from '@/features/play/data/playPageData';

interface TimeControlCardProps {
  game: Game;
}

const TimeControlCard = ({ game }: TimeControlCardProps) => (
  <Link href="/play" className="group block">
    <div className={`relative h-32 bg-gradient-to-br ${game.gradient} backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 transition-all duration-500 transform group-hover:scale-110 group-hover:shadow-2xl overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${game.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="text-3xl font-bold text-white mb-1 transform group-hover:translate-x-1 transition-transform duration-300">
          {game.time}
        </div>
        {game.type && (
          <div className="text-white/90 text-lg transform group-hover:translate-x-1 transition-transform duration-300 delay-75">
            {game.type}
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out"></div>
      <div className="absolute top-2 right-2 text-white/20 text-2xl group-hover:text-white/40 transition-colors duration-300">
        {game.time === 'Custom' ? '⚙️' : '♚'}
      </div>
    </div>
  </Link>
);

export default TimeControlCard;