package com.chessx.logic.domain.rules;

import com.chessx.logic.domain.model.Board;
import com.chessx.logic.domain.model.Color;
import com.chessx.logic.domain.model.Game;
import com.chessx.logic.domain.model.Piece;
import com.chessx.logic.domain.model.Square;
import com.chessx.logic.domain.move.Move;

import java.util.ArrayList;
import java.util.List;

public class MoveGenerator {

    private final MoveValidator validator;

    public MoveGenerator() {
        this.validator = new MoveValidator();
    }

    /**
     * Generates all strictly legal moves for the player whose turn it currently is.
     */
    public List<Move> generateLegalMoves(Game game) {
        List<Move> legalMoves = new ArrayList<>();
        Board board = game.getBoard();
        Color currentTurn = game.getCurrentTurn();

        for (int file = 0; file < 8; file++) {
            for (int rank = 0; rank < 8; rank++) {
                Square currentSquare = new Square(file, rank);
                Piece piece = board.getPiece(currentSquare);

                // If it's our piece, generate its moves
                if (piece != null && piece.getColor() == currentTurn) {
                    List<Move> pseudoLegalMoves = piece.generatePseudoLegalMoves(board, currentSquare);

                    // Filter out moves that leave our king in check
                    for (Move move : pseudoLegalMoves) {
                        if (isMoveLegal(game, move, currentTurn)) {
                            legalMoves.add(move);
                        }
                    }
                }
            }
        }
        return legalMoves;
    }

    private boolean isMoveLegal(Game game, Move move, Color currentTurn) {
        Board board = game.getBoard();
        
        // 1. Execute the move temporarily
        move.execute(board);
        
        // 2. Check if our king is in check after the move
        boolean inCheck = validator.isKingInCheck(board, currentTurn);
        
        // 3. Undo the move to restore the board state
        move.undo(board);
        
        // If we are NOT in check, the move is legal
        return !inCheck;
    }
}