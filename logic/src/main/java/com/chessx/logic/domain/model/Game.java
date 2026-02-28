package com.chessx.logic.domain.model;

import com.chessx.logic.domain.move.Move;
import java.util.ArrayList;
import java.util.List;

public class Game {
    private final Board board;
    private Color currentTurn;
    private GameState state;
    private final List<Move> moveHistory;

    // Constructor for a brand new game (or loading from a FEN parser later)
    public Game(Board board, Color startingTurn) {
        this.board = board;
        this.currentTurn = startingTurn;
        this.state = GameState.ONGOING;
        this.moveHistory = new ArrayList<>();
    }

    public Board getBoard() {
        return board;
    }

    public Color getCurrentTurn() {
        return currentTurn;
    }

    public GameState getState() {
        return state;
    }

    public void setState(GameState state) {
        this.state = state;
    }

    public List<Move> getMoveHistory() {
        return moveHistory;
    }

    /**
     * Executes a move, adds it to the history, and switches turns.
     * NOTE: This assumes the move has ALREADY been validated as legal.
     */
    public void makeMove(Move move) {
        move.execute(board);
        moveHistory.add(move);
        currentTurn = currentTurn.opposite();
    }

    /**
     * Undoes the last move, removes it from history, and switches turns back.
     * This is heavily used by the MoveValidator to test for King safety.
     */
    public void undoLastMove() {
        if (moveHistory.isEmpty()) {
            return;
        }
        Move lastMove = moveHistory.remove(moveHistory.size() - 1);
        lastMove.undo(board);
        currentTurn = currentTurn.opposite();
        
        // If we undo a move, the game is definitely back to being ongoing
        // (unless we are undoing past a previous checkmate, but typically we 
        // only undo during move calculation, not active gameplay).
        this.state = GameState.ONGOING;
    }
}