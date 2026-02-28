'use client'; // Required for interactivity in Next.js App Router

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { initialBoard, fenToBoard } from '../../data/gameData'; // Update imports as needed
import { analyzePosition } from '../../services/chessApi';

// Helper to convert indices (col=4, row=6) to algebraic (e2)
const toAlgebraic = (colIndex: number, rowIndex: number) => {
  const file = String.fromCharCode(97 + colIndex); // 0 -> a, 1 -> b...
  const rank = 8 - rowIndex; // 0 -> 8, 1 -> 7...
  return `${file}${rank}`;
};

const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const Chessboard = () => {
  // State management
  const [fen, setFen] = useState(STARTING_FEN);
  const [boardState, setBoardState] = useState<string[][]>(initialBoard);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  // Fetch initial moves when the component mounts
  useEffect(() => {
    analyzePosition(STARTING_FEN).then((data) => {
      setLegalMoves(data.legalMoves);
      setBoardState(fenToBoard(data.fen));
    });
  }, []);

  const handleSquareClick = async (colIndex: number, rowIndex: number) => {
    const clickedSquare = toAlgebraic(colIndex, rowIndex);

    // If we already selected a piece, try to make a move!
    if (selectedSquare) {
      const attemptedMove = `${selectedSquare}${clickedSquare}`;
      
      // Check if the move is in our list of legal moves from the backend
      if (legalMoves.includes(attemptedMove)) {
        try {
          // Send the move to the Spring Boot engine
          const data = await analyzePosition(fen, attemptedMove);
          
          // Update the UI with the engine's response
          setFen(data.fen);
          setBoardState(fenToBoard(data.fen));
          setLegalMoves(data.legalMoves);
          setSelectedSquare(null); // Reset selection
          
          if (data.gameState !== 'ONGOING') {
             alert(`Game Over! Result: ${data.gameState}`);
          }
        } catch (error) {
          console.error("Move failed:", error);
          setSelectedSquare(null);
        }
      } else {
        // Invalid move or clicking another piece -> change selection
        setSelectedSquare(clickedSquare);
      }
    } else {
      // Nothing selected yet, select this square
      setSelectedSquare(clickedSquare);
    }
  };

  return (
    <div className="w-[80vh] h-[80vh] max-w-[90vw] max-h-[90vw] bg-slate-600 shadow-2xl flex flex-col aspect-square">
      {boardState.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-1">
          {row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 !== 0;
            const squareColor = isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]';
            const algebraic = toAlgebraic(colIndex, rowIndex);
            
            // Highlight logic
            const isSelected = selectedSquare === algebraic;
            const isLegalDest = selectedSquare !== null && legalMoves.some(m => m.startsWith(selectedSquare) && m.endsWith(algebraic));

            return (
              <div 
                key={colIndex} 
                onClick={() => handleSquareClick(colIndex, rowIndex)}
                className={`flex-1 flex items-center justify-center relative cursor-pointer
                  ${squareColor} 
                  ${isSelected ? 'ring-4 ring-yellow-400 ring-inset' : ''}
                `}
              >
                {/* Show a dot if this is a legal move destination */}
                {isLegalDest && (
                   <div className="absolute w-1/4 h-1/4 bg-black/20 rounded-full z-10" />
                )}

                {piece !== '--' && piece && (
                  <Image
                    src={`/pieces/wood/${piece}.png`}
                    alt={`Chess piece: ${piece}`}
                    layout="fill"
                    objectFit="contain"
                    priority
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