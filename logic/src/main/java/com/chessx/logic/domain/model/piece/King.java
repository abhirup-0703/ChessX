package com.chessx.logic.domain.model.piece;

import com.chessx.logic.domain.model.Board;
import com.chessx.logic.domain.model.Color;
import com.chessx.logic.domain.model.Piece;
import com.chessx.logic.domain.model.PieceType;
import com.chessx.logic.domain.model.Square;
import com.chessx.logic.domain.move.Move;
import com.chessx.logic.domain.move.StandardMove;

import java.util.ArrayList;
import java.util.List;

public class King extends Piece {

    private static final int[][] MOVES = {
        {1, 0}, {-1, 0}, {0, 1}, {0, -1},
        {1, 1}, {1, -1}, {-1, 1}, {-1, -1}
    };

    public King(Color color) {
        super(color, PieceType.KING);
    }

    @Override
    public List<Move> generatePseudoLegalMoves(Board board, Square currentSquare) {
        List<Move> moves = new ArrayList<>();
        int file = currentSquare.getFile();
        int rank = currentSquare.getRank();

        for (int[] offset : MOVES) {
            int targetFile = file + offset[0];
            int targetRank = rank + offset[1];

            if (Square.isValid(targetFile, targetRank)) {
                Square targetSquare = new Square(targetFile, targetRank);
                Piece targetPiece = board.getPiece(targetSquare);

                if (targetPiece == null || targetPiece.getColor() != this.color) {
                    moves.add(new StandardMove(currentSquare, targetSquare, this));
                }
            }
        }
        return moves;
    }

    @Override
    public Piece copy() {
        return new King(this.color);
    }
}