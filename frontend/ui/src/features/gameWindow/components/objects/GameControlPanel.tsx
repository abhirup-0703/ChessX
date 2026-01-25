import PlayerClock from './PlayerClock';

const GameControlPanel = () => {
  // Placeholder moves
  const moves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7'];

  return (
    <div className="w-full h-full bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg flex flex-col p-4 text-white">
      <PlayerClock name="Opponent" time="5:00" isActive={false} />
      
      <div className="flex-grow bg-slate-900/70 my-4 rounded-lg overflow-y-auto p-2">
        {/* Moves Table */}
        <table className="w-full text-center">
          <tbody>
            {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => (
              <tr key={i} className="border-b border-slate-700/50">
                <td className="p-1.5 text-gray-400">{i + 1}.</td>
                <td className="p-1.5 font-semibold">{moves[i * 2]}</td>
                <td className="p-1.5 font-semibold">{moves[i * 2 + 1] || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PlayerClock name="You" time="5:00" isActive={true} />
    </div>
  );
};

export default GameControlPanel;
