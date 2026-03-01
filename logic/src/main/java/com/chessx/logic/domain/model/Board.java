package com.chessx.logic.domain.model;

public class Board {
    private final Piece[][] grid;
    
    // New state variables for special rules
    private Square enPassantTarget;
    private boolean whiteCastleKingside = true;
    private boolean whiteCastleQueenside = true;
    private boolean blackCastleKingside = true;
    private boolean blackCastleQueenside = true;

    public Board() {
        this.grid = new Piece[8][8];
    }

    public Board(Board other) {
        this.grid = new Piece[8][8];
        for (int file = 0; file < 8; file++) {
            for (int rank = 0; rank < 8; rank++) {
                Piece piece = other.getPiece(new Square(file, rank));
                if (piece != null) this.setPiece(new Square(file, rank), piece.copy());
            }
        }
        this.enPassantTarget = other.enPassantTarget;
        this.whiteCastleKingside = other.whiteCastleKingside;
        this.whiteCastleQueenside = other.whiteCastleQueenside;
        this.blackCastleKingside = other.blackCastleKingside;
        this.blackCastleQueenside = other.blackCastleQueenside;
    }

    public Piece getPiece(Square square) { return grid[square.getFile()][square.getRank()]; }
    public void setPiece(Square square, Piece piece) { grid[square.getFile()][square.getRank()] = piece; }
    public Piece removePiece(Square square) {
        Piece piece = grid[square.getFile()][square.getRank()];
        grid[square.getFile()][square.getRank()] = null;
        return piece;
    }
    public boolean isEmpty(Square square) { return getPiece(square) == null; }
    public boolean hasEnemyPiece(Square square, Color myColor) {
        Piece p = getPiece(square);
        return p != null && p.getColor() != myColor;
    }

    // Getters and Setters for state
    public Square getEnPassantTarget() { return enPassantTarget; }
    public void setEnPassantTarget(Square enPassantTarget) { this.enPassantTarget = enPassantTarget; }
    
    public boolean canWhiteCastleKingside() { return whiteCastleKingside; }
    public void setWhiteCastleKingside(boolean val) { this.whiteCastleKingside = val; }
    
    public boolean canWhiteCastleQueenside() { return whiteCastleQueenside; }
    public void setWhiteCastleQueenside(boolean val) { this.whiteCastleQueenside = val; }
    
    public boolean canBlackCastleKingside() { return blackCastleKingside; }
    public void setBlackCastleKingside(boolean val) { this.blackCastleKingside = val; }
    
    public boolean canBlackCastleQueenside() { return blackCastleQueenside; }
    public void setBlackCastleQueenside(boolean val) { this.blackCastleQueenside = val; }
}