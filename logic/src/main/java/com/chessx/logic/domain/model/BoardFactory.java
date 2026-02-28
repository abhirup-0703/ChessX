package com.chessx.logic.domain.model;

import com.chessx.logic.domain.model.piece.*;

public class BoardFactory {

    public static Board createStandardBoard() {
        Board board = new Board();

        // Setup White Pieces (Ranks 0 and 1)
        setupMajorPieces(board, Color.WHITE, 0);
        setupPawns(board, Color.WHITE, 1);

        // Setup Black Pieces (Ranks 7 and 6)
        setupMajorPieces(board, Color.BLACK, 7);
        setupPawns(board, Color.BLACK, 6);

        return board;
    }

    private static void setupPawns(Board board, Color color, int rank) {
        for (int file = 0; file < 8; file++) {
            board.setPiece(new Square(file, rank), new Pawn(color));
        }
    }

    private static void setupMajorPieces(Board board, Color color, int rank) {
        board.setPiece(new Square(0, rank), new Rook(color));
        board.setPiece(new Square(1, rank), new Knight(color));
        board.setPiece(new Square(2, rank), new Bishop(color));
        board.setPiece(new Square(3, rank), new Queen(color));
        board.setPiece(new Square(4, rank), new King(color));
        board.setPiece(new Square(5, rank), new Bishop(color));
        board.setPiece(new Square(6, rank), new Knight(color));
        board.setPiece(new Square(7, rank), new Rook(color));
    }
}