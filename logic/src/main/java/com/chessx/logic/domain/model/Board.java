package com.chessx.logic.domain.model;

public class Board {
    private final Piece[][] grid;

    public Board() {
        this.grid = new Piece[8][8]; // [file][rank]
    }

    // Copy constructor for move validation (cloning the board state)
    public Board(Board other) {
        this.grid = new Piece[8][8];
        for (int file = 0; file < 8; file++) {
            for (int rank = 0; rank < 8; rank++) {
                Piece piece = other.getPiece(new Square(file, rank));
                if (piece != null) {
                    this.setPiece(new Square(file, rank), piece.copy());
                }
            }
        }
    }

    public Piece getPiece(Square square) {
        return grid[square.getFile()][square.getRank()];
    }

    public void setPiece(Square square, Piece piece) {
        grid[square.getFile()][square.getRank()] = piece;
    }

    public Piece removePiece(Square square) {
        Piece piece = grid[square.getFile()][square.getRank()];
        grid[square.getFile()][square.getRank()] = null;
        return piece;
    }

    public boolean isEmpty(Square square) {
        return getPiece(square) == null;
    }
    
    // Quick helper to check if a square has an enemy piece
    public boolean hasEnemyPiece(Square square, Color myColor) {
        Piece p = getPiece(square);
        return p != null && p.getColor() != myColor;
    }
}