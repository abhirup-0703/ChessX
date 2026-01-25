import Image from 'next/image';
import { Piece, initialBoard } from '../../data/gameData'; // Adjust import path as needed

interface ChessboardProps {
  boardState: Piece[][];
}

const Chessboard = ({ boardState }: ChessboardProps) => {
    boardState = boardState || initialBoard;
  return (
    // The main container for the board.
    // Using aspect-ratio-square to ensure it's always a square.
    // Sizing is controlled by the parent container in GameWindowLayout.
    <div className="w-[80vh] h-[80vh] max-w-[90vw] max-h-[90vw] bg-slate-600 shadow-2xl flex flex-col aspect-square">
      {boardState.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-1">
          {row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 !== 0;
            // Changed square colors to be more distinct and closer to the Lichess theme
            const squareColor = isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]';

            return (
              <div key={colIndex} className={`flex-1 flex items-center justify-center ${squareColor} relative`}>
                {/* Render the piece image only if the square is not empty */}
                {piece !== '--' && (
                  <Image
                    // Construct the image path dynamically.
                    // Assumes your files are named e.g., 'wp.png', 'bK.png' in '/public/pieces/wood/'
                    src={`/pieces/wood/${piece}.png`}
                    alt={`Chess piece: ${piece}`}
                    // layout="fill" is great for responsive squares.
                    // object-contain ensures the piece fits without being stretched.
                    layout="fill"
                    objectFit="contain"
                    priority // Prioritize loading of pieces for better LCP
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Chessboard;

