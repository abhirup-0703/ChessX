interface PlayerClockProps {
  name: string;
  time: string;
  isActive: boolean;
}

const PlayerClock = ({ name, time, isActive }: PlayerClockProps) => (
  <div className={`p-3 rounded-lg transition-colors duration-300 ${isActive ? 'bg-emerald-600/60' : 'bg-slate-700/40'}`}>
    <div className="flex justify-between items-center">
      <span className="text-white font-semibold text-lg">{name}</span>
      <div className="bg-slate-900/50 text-white text-2xl font-mono py-1 px-3 rounded-md">
        {time}
      </div>
    </div>
  </div>
);

export default PlayerClock;

