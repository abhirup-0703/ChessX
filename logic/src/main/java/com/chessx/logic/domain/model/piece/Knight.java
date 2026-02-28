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

public class Knight extends Piece {

    // The 8 possible L-shaped jumps for a knight
    private static final int[][] MOVE_OFFSETS = {
        {2, 1}, {1, 2}, {-1, 2}, {-2, 1},
        {-2, -1}, {-1, -2}, {1, -2}, {2, -1}
    };

    public Knight(Color color) {
        super(color, PieceType.KNIGHT);
    }

    @Override
    public List<Move> generatePseudoLegalMoves(Board board, Square currentSquare) {
        List<Move> moves = new ArrayList<>();
        int file = currentSquare.getFile();
        int rank = currentSquare.getRank();

        for (int[] offset : MOVE_OFFSETS) {
            int targetFile = file + offset[0];
            int targetRank = rank + offset[1];

            if (Square.isValid(targetFile, targetRank)) {
                Square targetSquare = new Square(targetFile, targetRank);
                Piece targetPiece = board.getPiece(targetSquare);

                // Can move if square is empty or has an enemy piece (capture)
                if (targetPiece == null || targetPiece.getColor() != this.color) {
                    moves.add(new StandardMove(currentSquare, targetSquare, this));
                }
            }
        }
        return moves;
    }

    @Override
    public Piece copy() {
        return new Knight(this.color);
    }
}