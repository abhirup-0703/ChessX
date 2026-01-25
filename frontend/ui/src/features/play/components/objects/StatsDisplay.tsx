interface StatsDisplayProps {
  onlinePlayers: number | string;
  gamesInPlay: number | string;
}

const StatsDisplay = ({ onlinePlayers, gamesInPlay }: StatsDisplayProps) => (
  <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-purple-500/20 animate-in fade-in slide-in-from-bottom duration-1000 delay-1400">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
      <div className="group">
        <div className="text-4xl font-bold text-white mb-2 transform group-hover:scale-110 transition-transform duration-300">
          {typeof onlinePlayers === 'number' ? onlinePlayers.toLocaleString() : onlinePlayers}
        </div>
        <div className="text-gray-400 text-lg">players online</div>
      </div>
      <div className="group">
        <div className="text-4xl font-bold text-white mb-2 transform group-hover:scale-110 transition-transform duration-300">
          {typeof gamesInPlay === 'number' ? gamesInPlay.toLocaleString() : gamesInPlay}
        </div>
        <div className="text-gray-400 text-lg">games in play</div>
      </div>
    </div>
  </div>
);

export default StatsDisplay;