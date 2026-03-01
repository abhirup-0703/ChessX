package com.chessx.logic.domain.move;

import com.chessx.logic.domain.model.Board;
import com.chessx.logic.domain.model.Piece;
import com.chessx.logic.domain.model.Square;

public class CastlingMove extends StandardMove {
    private final Square rookFrom;
    private final Square rookTo;
    private final Piece rook;

    public CastlingMove(Square kingFrom, Square kingTo, Piece king, Square rookFrom, Square rookTo, Piece rook) {
        super(kingFrom, kingTo, king);
        this.rookFrom = rookFrom;
        this.rookTo = rookTo;
        this.rook = rook;
    }

    @Override
    public void execute(Board board) {
        super.execute(board); // Moves king, updates state flags
        // Move the rook
        board.removePiece(rookFrom);
        board.setPiece(rookTo, rook);
    }

    @Override
    public void undo(Board board) {
        super.undo(board); // Moves king back, restores state
        // Move the rook back
        board.removePiece(rookTo);
        board.setPiece(rookFrom, rook);
    }
}