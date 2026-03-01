package com.chessx.logic.domain.move;

import com.chessx.logic.domain.model.Board;
import com.chessx.logic.domain.model.Piece;
import com.chessx.logic.domain.model.Square;

public class PromotionMove extends StandardMove {
    private final Piece promotionPiece;

    public PromotionMove(Square from, Square to, Piece movedPiece, Piece promotionPiece) {
        super(from, to, movedPiece);
        this.promotionPiece = promotionPiece;
    }

    @Override
    public void execute(Board board) {
        super.execute(board); // Does the normal move and captures
        // Overwrite the moved pawn with the new piece
        board.setPiece(to, promotionPiece);
    }

    @Override
    public void undo(Board board) {
        super.undo(board); // Standard undo handles everything perfectly
    }

    @Override
    public String toString() {
        // e.g. e7e8q
        String p = switch (promotionPiece.getType()) {
            case QUEEN -> "q";
            case ROOK -> "r";
            case BISHOP -> "b";
            case KNIGHT -> "n";
            default -> "q";
        };
        return super.toString() + p;
    }
}