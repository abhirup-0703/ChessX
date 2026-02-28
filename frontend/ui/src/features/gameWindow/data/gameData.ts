// Defines the type for a piece notation.
export type Piece = 
  'wp' | 'wR' | 'wN' | 'wB' | 'wQ' | 'wK' |
  'bp' | 'bR' | 'bN' | 'bB' | 'bQ' | 'bK' |
  '--';

// Defines the 8x8 board as a 2D array of Piece types.
export const initialBoard: Piece[][] = [
  ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
  ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
  ['--', '--', '--', '--', '--', '--', '--', '--'],
  ['--', '--', '--', '--', '--', '--', '--', '--'],
  ['--', '--', '--', '--', '--', '--', '--', '--'],
  ['--', '--', '--', '--', '--', '--', '--', '--'],
  ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
  ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
];

export const fenToBoard = (fen: string): string[][] => {
  const board: string[][] = [];
  const rows = fen.split(' ')[0].split('/'); // Get just the board part

  for (const row of rows) {
    const boardRow: string[] = [];
    for (const char of row) {
      if (!isNaN(parseInt(char))) {
        // It's a number (empty squares)
        const emptyCount = parseInt(char);
        // FIX: The loop condition is now i < emptyCount
        for (let i = 0; i < emptyCount; i++) {
            boardRow.push('--'); 
        }
      } else {
        // It's a piece
        const color = char === char.toUpperCase() ? 'w' : 'b';
        const type = char.toLowerCase() === 'n' ? 'N' : 
                     char.toLowerCase() === 'k' ? 'K' : 
                     char.toLowerCase() === 'q' ? 'Q' : 
                     char.toLowerCase() === 'b' ? 'B' : 
                     char.toLowerCase() === 'r' ? 'R' : 'p';
        boardRow.push(`${color}${type}`);
      }
    }
    board.push(boardRow);
  }
  return board;
};