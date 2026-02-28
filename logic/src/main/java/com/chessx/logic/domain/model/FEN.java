package com.chessx.logic.domain.model;

import com.chessx.logic.domain.model.piece.*;

public class FEN {

    public static final String STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    /**
     * Parses a FEN string and returns a fully initialized Game object.
     */
    public static Game fromString(String fen) {
        String[] parts = fen.split(" ");
        if (parts.length < 2) {
            throw new IllegalArgumentException("Invalid FEN string: " + fen);
        }

        String piecePlacement = parts[0];
        String activeColorStr = parts[1];

        Board board = parseBoard(piecePlacement);
        Color currentTurn = activeColorStr.equals("w") ? Color.WHITE : Color.BLACK;

        // Note: Castling (parts[2]), En Passant (parts[3]), Halfmove (parts[4]), 
        // and Fullmove (parts[5]) are ignored in this basic version, but you 
        // can parse and pass them to the Game object later as you add advanced rules.

        return new Game(board, currentTurn);
    }

    /**
     * Converts the current state of a Game into a FEN string.
     */
    public static String toFEN(Game game) {
        StringBuilder fenBuilder = new StringBuilder();
        Board board = game.getBoard();

        // 1. Piece Placement (Start from rank 7 down to 0)
        for (int rank = 7; rank >= 0; rank--) {
            int emptyCount = 0;
            for (int file = 0; file < 8; file++) {
                Piece piece = board.getPiece(new Square(file, rank));
                if (piece == null) {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        fenBuilder.append(emptyCount);
                        emptyCount = 0;
                    }
                    fenBuilder.append(getPieceChar(piece));
                }
            }
            if (emptyCount > 0) {
                fenBuilder.append(emptyCount);
            }
            if (rank > 0) {
                fenBuilder.append("/");
            }
        }

        // 2. Active Color
        fenBuilder.append(" ");
        fenBuilder.append(game.getCurrentTurn() == Color.WHITE ? "w" : "b");

        // 3-6. Castling, En Passant, Halfmove, Fullmove (Defaults for now)
        fenBuilder.append(" - - 0 1");

        return fenBuilder.toString();
    }

    private static Board parseBoard(String piecePlacement) {
        Board board = new Board();
        String[] ranks = piecePlacement.split("/");
        
        // FEN ranks go from 8 to 1 (array index 7 to 0)
        for (int i = 0; i < 8; i++) {
            int rank = 7 - i;
            String rankData = ranks[i];
            int file = 0;
            
            for (char c : rankData.toCharArray()) {
                if (Character.isDigit(c)) {
                    file += Character.getNumericValue(c);
                } else {
                    board.setPiece(new Square(file, rank), createPieceFromChar(c));
                    file++;
                }
            }
        }
        return board;
    }

    private static Piece createPieceFromChar(char c) {
        Color color = Character.isUpperCase(c) ? Color.WHITE : Color.BLACK;
        return switch (Character.toLowerCase(c)) {
            case 'p' -> new Pawn(color);
            case 'n' -> new Knight(color);
            case 'b' -> new Bishop(color);
            case 'r' -> new Rook(color);
            case 'q' -> new Queen(color);
            case 'k' -> new King(color);
            default -> throw new IllegalArgumentException("Unknown piece character: " + c);
        };
    }

    private static char getPieceChar(Piece piece) {
        char c = switch (piece.getType()) {
            case PAWN -> 'p';
            case KNIGHT -> 'n';
            case BISHOP -> 'b';
            case ROOK -> 'r';
            case QUEEN -> 'q';
            case KING -> 'k';
        };
        return piece.getColor() == Color.WHITE ? Character.toUpperCase(c) : c;
    }
}