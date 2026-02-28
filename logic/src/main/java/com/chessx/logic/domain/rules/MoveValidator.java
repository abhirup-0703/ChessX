package com.chessx.logic.domain.rules;

import com.chessx.logic.domain.model.Board;
import com.chessx.logic.domain.model.Color;
import com.chessx.logic.domain.model.Piece;
import com.chessx.logic.domain.model.PieceType;
import com.chessx.logic.domain.model.Square;
import com.chessx.logic.domain.move.Move;

import java.util.List;

public class MoveValidator {

    /**
     * Checks if the King of the given color is currently in check on the board.
     */
    public boolean isKingInCheck(Board board, Color kingColor) {
        Square kingSquare = findKingSquare(board, kingColor);
        if (kingSquare == null) {
            return false; // Should only happen in tests with custom partial boards
        }
        return isSquareAttacked(board, kingSquare, kingColor.opposite());
    }

    /**
     * Checks if a specific square is attacked by ANY piece of the given attacking color.
     */
    public boolean isSquareAttacked(Board board, Square targetSquare, Color attackingColor) {
        for (int file = 0; file < 8; file++) {
            for (int rank = 0; rank < 8; rank++) {
                Square currentSquare = new Square(file, rank);
                Piece piece = board.getPiece(currentSquare);

                if (piece != null && piece.getColor() == attackingColor) {
                    // Generate pseudo-legal moves for this enemy piece
                    List<Move> enemyMoves = piece.generatePseudoLegalMoves(board, currentSquare);
                    
                    // See if any of those moves land on our target square
                    for (Move move : enemyMoves) {
                        if (move.getTo().equals(targetSquare)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    private Square findKingSquare(Board board, Color kingColor) {
        for (int file = 0; file < 8; file++) {
            for (int rank = 0; rank < 8; rank++) {
                Square square = new Square(file, rank);
                Piece piece = board.getPiece(square);
                if (piece != null && piece.getType() == PieceType.KING && piece.getColor() == kingColor) {
                    return square;
                }
            }
        }
        return null; // King not found
    }
}