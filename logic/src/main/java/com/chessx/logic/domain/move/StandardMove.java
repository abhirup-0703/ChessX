package com.chessx.logic.domain.move;

import com.chessx.logic.domain.model.Board;
import com.chessx.logic.domain.model.Piece;
import com.chessx.logic.domain.model.Square;

public class StandardMove implements Move {
    private final Square from;
    private final Square to;
    private final Piece movedPiece;
    private Piece capturedPiece; // Stored for undo operations

    public StandardMove(Square from, Square to, Piece movedPiece) {
        this.from = from;
        this.to = to;
        this.movedPiece = movedPiece;
    }

    @Override
    public Square getFrom() { return from; }

    @Override
    public Square getTo() { return to; }

    @Override
    public Piece getMovedPiece() { return movedPiece; }

    @Override
    public void execute(Board board) {
        // Remove the piece from its original square
        board.removePiece(from);
        
        // If there's a piece at the destination, capture it
        this.capturedPiece = board.getPiece(to);
        
        // Place the moved piece on the new square
        board.setPiece(to, movedPiece);
    }

    @Override
    public void undo(Board board) {
        // Move the piece back to its original square
        board.setPiece(from, movedPiece);
        
        // Restore the captured piece (if any) or clear the destination square
        if (capturedPiece != null) {
            board.setPiece(to, capturedPiece);
        } else {
            board.removePiece(to);
        }
    }

    @Override
    public String toString() {
        return from.toAlgebraic() + to.toAlgebraic(); // e.g., e2e4
    }
}