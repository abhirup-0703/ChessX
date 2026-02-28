package com.chessx.logic.domain.model;

import com.chessx.logic.domain.move.Move;
import java.util.List;

public abstract class Piece {
    protected final Color color;
    protected final PieceType type;

    public Piece(Color color, PieceType type) {
        this.color = color;
        this.type = type;
    }

    public Color getColor() { return color; }
    public PieceType getType() { return type; }

    // Generates moves assuming the board is empty of complex rules (like pins)
    public abstract List<Move> generatePseudoLegalMoves(Board board, Square currentSquare);

    // Deep copy for board cloning (crucial for evaluating future moves)
    public abstract Piece copy();
}