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
