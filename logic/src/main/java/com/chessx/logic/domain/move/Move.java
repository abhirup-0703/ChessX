package com.chessx.logic.domain.move;

import com.chessx.logic.domain.model.Board;
import com.chessx.logic.domain.model.Piece;
import com.chessx.logic.domain.model.Square;

public interface Move {
    Square getFrom();
    Square getTo();
    Piece getMovedPiece();
    
    // Executes the move on the given board
    void execute(Board board);
    
    // Reverts the move (crucial for validating checks and AI algorithms)
    void undo(Board board);
}