package com.chessx.logic.domain.rules;

import com.chessx.logic.domain.model.Board;
import com.chessx.logic.domain.model.Color;
import com.chessx.logic.domain.model.Game;
import com.chessx.logic.domain.model.Piece;
import com.chessx.logic.domain.model.Square;
import com.chessx.logic.domain.move.CastlingMove;
import com.chessx.logic.domain.move.Move;

import java.util.ArrayList;
import java.util.List;

public class MoveGenerator {
    private final MoveValidator validator;

    public MoveGenerator() { this.validator = new MoveValidator(); }

    public List<Move> generateLegalMoves(Game game) {
        List<Move> legalMoves = new ArrayList<>();
        Board board = game.getBoard();
        Color currentTurn = game.getCurrentTurn();

        for (int file = 0; file < 8; file++) {
            for (int rank = 0; rank < 8; rank++) {
                Square currentSquare = new Square(file, rank);
                Piece piece = board.getPiece(currentSquare);

                if (piece != null && piece.getColor() == currentTurn) {
                    List<Move> pseudoLegalMoves = piece.generatePseudoLegalMoves(board, currentSquare);
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
        
        // Extra Castling Rule: Cannot castle out of check, or through check
        if (move instanceof CastlingMove) {
            if (validator.isKingInCheck(board, currentTurn)) return false;
            
            // The square the king passes through
            int passThroughFile = (move.getFrom().getFile() + move.getTo().getFile()) / 2;
            Square passThroughSquare = new Square(passThroughFile, move.getFrom().getRank());
            if (validator.isSquareAttacked(board, passThroughSquare, currentTurn.opposite())) return false;
        }

        move.execute(board);
        boolean inCheck = validator.isKingInCheck(board, currentTurn);
        move.undo(board);
        
        return !inCheck;
    }
}