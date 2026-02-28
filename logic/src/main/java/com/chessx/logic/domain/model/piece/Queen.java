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

public class Queen extends Piece {

    // All 8 directions (horizontal, vertical, diagonal)
    private static final int[][] DIRECTIONS = {
        {1, 0}, {-1, 0}, {0, 1}, {0, -1},
        {1, 1}, {1, -1}, {-1, 1}, {-1, -1}
    };

    public Queen(Color color) {
        super(color, PieceType.QUEEN);
    }

    @Override
    public List<Move> generatePseudoLegalMoves(Board board, Square currentSquare) {
        List<Move> moves = new ArrayList<>();

        for (int[] dir : DIRECTIONS) {
            int file = currentSquare.getFile() + dir[0];
            int rank = currentSquare.getRank() + dir[1];

            while (Square.isValid(file, rank)) {
                Square targetSquare = new Square(file, rank);
                Piece targetPiece = board.getPiece(targetSquare);

                if (targetPiece == null) {
                    moves.add(new StandardMove(currentSquare, targetSquare, this));
                } else {
                    if (targetPiece.getColor() != this.color) {
                        moves.add(new StandardMove(currentSquare, targetSquare, this));
                    }
                    break;
                }
                file += dir[0];
                rank += dir[1];
            }
        }
        return moves;
    }

    @Override
    public Piece copy() {
        return new Queen(this.color);
    }
}