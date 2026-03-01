package com.chessx.logic.domain.move;

import com.chessx.logic.domain.model.Board;
import com.chessx.logic.domain.model.Piece;
import com.chessx.logic.domain.model.PieceType;
import com.chessx.logic.domain.model.Square;
import com.chessx.logic.domain.model.Color;

public class StandardMove implements Move {
    protected final Square from;
    protected final Square to;
    protected final Piece movedPiece;
    protected Piece capturedPiece;

    // State preservation for undo
    protected Square prevEnPassantTarget;
    protected boolean prevWK, prevWQ, prevBK, prevBQ;

    public StandardMove(Square from, Square to, Piece movedPiece) {
        this.from = from;
        this.to = to;
        this.movedPiece = movedPiece;
    }

    @Override public Square getFrom() { return from; }
    @Override public Square getTo() { return to; }
    @Override public Piece getMovedPiece() { return movedPiece; }

    @Override
    public void execute(Board board) {
        saveState(board);
        
        board.removePiece(from);
        this.capturedPiece = board.getPiece(to);
        board.setPiece(to, movedPiece);

        // 1. Handle En Passant Target Creation (Pawn moves 2 squares)
        if (movedPiece.getType() == PieceType.PAWN && Math.abs(from.getRank() - to.getRank()) == 2) {
            int dir = movedPiece.getColor() == Color.WHITE ? 1 : -1;
            board.setEnPassantTarget(new Square(from.getFile(), from.getRank() + dir));
        } else {
            board.setEnPassantTarget(null); // EP only lasts one turn
        }

        // 2. Handle Castling Rights Revocation
        updateCastlingRights(board, from);
        updateCastlingRights(board, to); // If a rook is captured, revoke its side's castling
    }

    @Override
    public void undo(Board board) {
        board.setPiece(from, movedPiece);
        if (capturedPiece != null) {
            board.setPiece(to, capturedPiece);
        } else {
            board.removePiece(to);
        }
        restoreState(board);
    }

    protected void saveState(Board board) {
        this.prevEnPassantTarget = board.getEnPassantTarget();
        this.prevWK = board.canWhiteCastleKingside();
        this.prevWQ = board.canWhiteCastleQueenside();
        this.prevBK = board.canBlackCastleKingside();
        this.prevBQ = board.canBlackCastleQueenside();
    }

    protected void restoreState(Board board) {
        board.setEnPassantTarget(prevEnPassantTarget);
        board.setWhiteCastleKingside(prevWK);
        board.setWhiteCastleQueenside(prevWQ);
        board.setBlackCastleKingside(prevBK);
        board.setBlackCastleQueenside(prevBQ);
    }

    private void updateCastlingRights(Board board, Square square) {
        String alg = square.toAlgebraic();
        if (alg.equals("e1")) { board.setWhiteCastleKingside(false); board.setWhiteCastleQueenside(false); }
        if (alg.equals("e8")) { board.setBlackCastleKingside(false); board.setBlackCastleQueenside(false); }
        if (alg.equals("a1")) board.setWhiteCastleQueenside(false);
        if (alg.equals("h1")) board.setWhiteCastleKingside(false);
        if (alg.equals("a8")) board.setBlackCastleQueenside(false);
        if (alg.equals("h8")) board.setBlackCastleKingside(false);
    }

    @Override
    public String toString() { return from.toAlgebraic() + to.toAlgebraic(); }
}