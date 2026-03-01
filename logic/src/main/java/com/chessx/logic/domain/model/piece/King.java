package com.chessx.logic.domain.model.piece;

import com.chessx.logic.domain.model.Board;
import com.chessx.logic.domain.model.Color;
import com.chessx.logic.domain.model.Piece;
import com.chessx.logic.domain.model.PieceType;
import com.chessx.logic.domain.model.Square;
import com.chessx.logic.domain.move.CastlingMove;
import com.chessx.logic.domain.move.Move;
import com.chessx.logic.domain.move.StandardMove;

import java.util.ArrayList;
import java.util.List;

public class King extends Piece {

    private static final int[][] MOVES = {
        {1, 0}, {-1, 0}, {0, 1}, {0, -1},
        {1, 1}, {1, -1}, {-1, 1}, {-1, -1}
    };

    public King(Color color) { super(color, PieceType.KING); }

    @Override
    public List<Move> generatePseudoLegalMoves(Board board, Square currentSquare) {
        List<Move> moves = new ArrayList<>();
        int file = currentSquare.getFile();
        int rank = currentSquare.getRank();

        // 1. Standard King Steps
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

        // 2. Castling
        if (this.color == Color.WHITE && file == 4 && rank == 0) {
            // Kingside (O-O)
            if (board.canWhiteCastleKingside() && board.isEmpty(new Square(5, 0)) && board.isEmpty(new Square(6, 0))) {
                moves.add(new CastlingMove(currentSquare, new Square(6, 0), this, new Square(7, 0), new Square(5, 0), board.getPiece(new Square(7, 0))));
            }
            // Queenside (O-O-O)
            if (board.canWhiteCastleQueenside() && board.isEmpty(new Square(3, 0)) && board.isEmpty(new Square(2, 0)) && board.isEmpty(new Square(1, 0))) {
                moves.add(new CastlingMove(currentSquare, new Square(2, 0), this, new Square(0, 0), new Square(3, 0), board.getPiece(new Square(0, 0))));
            }
        } else if (this.color == Color.BLACK && file == 4 && rank == 7) {
            // Kingside (O-O)
            if (board.canBlackCastleKingside() && board.isEmpty(new Square(5, 7)) && board.isEmpty(new Square(6, 7))) {
                moves.add(new CastlingMove(currentSquare, new Square(6, 7), this, new Square(7, 7), new Square(5, 7), board.getPiece(new Square(7, 7))));
            }
            // Queenside (O-O-O)
            if (board.canBlackCastleQueenside() && board.isEmpty(new Square(3, 7)) && board.isEmpty(new Square(2, 7)) && board.isEmpty(new Square(1, 7))) {
                moves.add(new CastlingMove(currentSquare, new Square(2, 7), this, new Square(0, 7), new Square(3, 7), board.getPiece(new Square(0, 7))));
            }
        }

        return moves;
    }

    @Override
    public Piece copy() { return new King(this.color); }
}