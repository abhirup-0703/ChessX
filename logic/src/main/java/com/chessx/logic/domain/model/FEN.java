package com.chessx.logic.domain.model;

import com.chessx.logic.domain.model.piece.*;

public class FEN {

    public static final String STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    public static Game fromString(String fen) {
        String[] parts = fen.split(" ");
        Board board = parseBoard(parts[0]);
        Color currentTurn = parts[1].equals("w") ? Color.WHITE : Color.BLACK;

        // Parse Castling Rights
        String castling = parts.length > 2 ? parts[2] : "-";
        board.setWhiteCastleKingside(castling.contains("K"));
        board.setWhiteCastleQueenside(castling.contains("Q"));
        board.setBlackCastleKingside(castling.contains("k"));
        board.setBlackCastleQueenside(castling.contains("q"));

        // Parse En Passant Target
        String enPassant = parts.length > 3 ? parts[3] : "-";
        if (!enPassant.equals("-")) {
            board.setEnPassantTarget(Square.fromAlgebraic(enPassant));
        }

        return new Game(board, currentTurn);
    }

    public static String toFEN(Game game) {
        StringBuilder fenBuilder = new StringBuilder();
        Board board = game.getBoard();

        // 1. Board
        for (int rank = 7; rank >= 0; rank--) {
            int emptyCount = 0;
            for (int file = 0; file < 8; file++) {
                Piece piece = board.getPiece(new Square(file, rank));
                if (piece == null) {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) { fenBuilder.append(emptyCount); emptyCount = 0; }
                    fenBuilder.append(getPieceChar(piece));
                }
            }
            if (emptyCount > 0) fenBuilder.append(emptyCount);
            if (rank > 0) fenBuilder.append("/");
        }

        // 2. Turn
        fenBuilder.append(" ").append(game.getCurrentTurn() == Color.WHITE ? "w" : "b");

        // 3. Castling Rights
        StringBuilder castling = new StringBuilder();
        if (board.canWhiteCastleKingside()) castling.append("K");
        if (board.canWhiteCastleQueenside()) castling.append("Q");
        if (board.canBlackCastleKingside()) castling.append("k");
        if (board.canBlackCastleQueenside()) castling.append("q");
        fenBuilder.append(" ").append(castling.length() > 0 ? castling.toString() : "-");

        // 4. En Passant Target
        Square ep = board.getEnPassantTarget();
        fenBuilder.append(" ").append(ep != null ? ep.toAlgebraic() : "-");

        // 5 & 6. Halfmove / Fullmove defaults
        fenBuilder.append(" 0 1");

        return fenBuilder.toString();
    }

    // Keep parseBoard, createPieceFromChar, and getPieceChar exactly as they were before
    private static Board parseBoard(String piecePlacement) {
        Board board = new Board();
        String[] ranks = piecePlacement.split("/");
        for (int i = 0; i < 8; i++) {
            int rank = 7 - i;
            String rankData = ranks[i];
            int file = 0;
            for (char c : rankData.toCharArray()) {
                if (Character.isDigit(c)) file += Character.getNumericValue(c);
                else { board.setPiece(new Square(file, rank), createPieceFromChar(c)); file++; }
            }
        }
        return board;
    }

    private static Piece createPieceFromChar(char c) {
        Color color = Character.isUpperCase(c) ? Color.WHITE : Color.BLACK;
        return switch (Character.toLowerCase(c)) {
            case 'p' -> new Pawn(color); case 'n' -> new Knight(color);
            case 'b' -> new Bishop(color); case 'r' -> new Rook(color);
            case 'q' -> new Queen(color); case 'k' -> new King(color);
            default -> throw new IllegalArgumentException("Unknown piece: " + c);
        };
    }

    private static char getPieceChar(Piece piece) {
        char c = switch (piece.getType()) {
            case PAWN -> 'p'; case KNIGHT -> 'n'; case BISHOP -> 'b';
            case ROOK -> 'r'; case QUEEN -> 'q'; case KING -> 'k';
        };
        return piece.getColor() == Color.WHITE ? Character.toUpperCase(c) : c;
    }
}