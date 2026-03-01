package com.chessx.logic.domain.move;

import com.chessx.logic.domain.model.Board;
import com.chessx.logic.domain.model.Piece;
import com.chessx.logic.domain.model.Square;
import com.chessx.logic.domain.model.Color;

public class EnPassantMove extends StandardMove {
    private final Square captureSquare;

    public EnPassantMove(Square from, Square to, Piece movedPiece) {
        super(from, to, movedPiece);
        // The captured pawn is on the same rank as the moving pawn, but on the destination file
        int captureRank = movedPiece.getColor() == Color.WHITE ? 4 : 3; 
        this.captureSquare = new Square(to.getFile(), captureRank);
    }

    @Override
    public void execute(Board board) {
        saveState(board);
        
        board.removePiece(from);
        this.capturedPiece = board.removePiece(captureSquare); // Capture happens behind the destination!
        board.setPiece(to, movedPiece);
        
        board.setEnPassantTarget(null);
    }

    @Override
    public void undo(Board board) {
        board.setPiece(from, movedPiece);
        board.removePiece(to);
        board.setPiece(captureSquare, capturedPiece);
        restoreState(board);
    }
}