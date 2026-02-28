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

public class Rook extends Piece {

    // Horizontal and vertical directions
    private static final int[][] DIRECTIONS = {
        {1, 0}, {-1, 0}, {0, 1}, {0, -1}
    };

    public Rook(Color color) {
        super(color, PieceType.ROOK);
    }

    @Override
    public List<Move> generatePseudoLegalMoves(Board board, Square currentSquare) {
        List<Move> moves = new ArrayList<>();

        for (int[] dir : DIRECTIONS) {
            int file = currentSquare.getFile() + dir[0];
            int rank = currentSquare.getRank() + dir[1];

            // Slide until we hit the edge of the board
            while (Square.isValid(file, rank)) {
                Square targetSquare = new Square(file, rank);
                Piece targetPiece = board.getPiece(targetSquare);

                if (targetPiece == null) {
                    // Empty square, can move and keep sliding
                    moves.add(new StandardMove(currentSquare, targetSquare, this));
                } else {
                    // Hit a piece. If it's an enemy, we can capture it. 
                    if (targetPiece.getColor() != this.color) {
                        moves.add(new StandardMove(currentSquare, targetSquare, this));
                    }
                    // Regardless of color, we cannot slide past a piece.
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
        return new Rook(this.color);
    }
}