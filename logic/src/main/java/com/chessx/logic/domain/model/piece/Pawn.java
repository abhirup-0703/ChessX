package com.chessx.logic.domain.model.piece;

import com.chessx.logic.domain.model.Board;
import com.chessx.logic.domain.model.Color;
import com.chessx.logic.domain.model.Piece;
import com.chessx.logic.domain.model.PieceType;
import com.chessx.logic.domain.model.Square;
import com.chessx.logic.domain.move.EnPassantMove;
import com.chessx.logic.domain.move.Move;
import com.chessx.logic.domain.move.PromotionMove;
import com.chessx.logic.domain.move.StandardMove;

import java.util.ArrayList;
import java.util.List;

public class Pawn extends Piece {

    public Pawn(Color color) {
        super(color, PieceType.PAWN);
    }

    @Override
    public List<Move> generatePseudoLegalMoves(Board board, Square currentSquare) {
        List<Move> moves = new ArrayList<>();
        int file = currentSquare.getFile();
        int rank = currentSquare.getRank();
        
        int direction = (this.color == Color.WHITE) ? 1 : -1;
        int startRank = (this.color == Color.WHITE) ? 1 : 6;
        int promotionRank = (this.color == Color.WHITE) ? 7 : 0;

        int forwardOneRank = rank + direction;
        
        // 1. Forward Moves
        if (Square.isValid(file, forwardOneRank) && board.isEmpty(new Square(file, forwardOneRank))) {
            Square forwardOneSquare = new Square(file, forwardOneRank);
            
            if (forwardOneRank == promotionRank) {
                // Auto-promote to Queen for now
                moves.add(new PromotionMove(currentSquare, forwardOneSquare, this, new Queen(this.color)));
            } else {
                moves.add(new StandardMove(currentSquare, forwardOneSquare, this));
                
                // Double move
                if (rank == startRank) {
                    int forwardTwoRank = rank + (direction * 2);
                    Square forwardTwoSquare = new Square(file, forwardTwoRank);
                    if (board.isEmpty(forwardTwoSquare)) {
                        moves.add(new StandardMove(currentSquare, forwardTwoSquare, this));
                    }
                }
            }
        }

        // 2. Captures
        int[] captureFiles = {file - 1, file + 1};
        for (int targetFile : captureFiles) {
            if (Square.isValid(targetFile, forwardOneRank)) {
                Square targetSquare = new Square(targetFile, forwardOneRank);
                
                // Standard capture
                if (board.hasEnemyPiece(targetSquare, this.color)) {
                    if (forwardOneRank == promotionRank) {
                        moves.add(new PromotionMove(currentSquare, targetSquare, this, new Queen(this.color)));
                    } else {
                        moves.add(new StandardMove(currentSquare, targetSquare, this));
                    }
                }
                
                // En Passant capture
                Square epTarget = board.getEnPassantTarget();
                if (epTarget != null && epTarget.equals(targetSquare)) {
                    moves.add(new EnPassantMove(currentSquare, targetSquare, this));
                }
            }
        }

        return moves;
    }

    @Override
    public Piece copy() { return new Pawn(this.color); }
}