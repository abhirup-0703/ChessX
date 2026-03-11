package com.chessx.logic.domain.model;

import com.chessx.logic.domain.move.Move;

public class GameSession {
    private final String matchId;
    private final String whitePlayerId;
    private final String blackPlayerId;
    
    private final Game game;
    private final ChessClock clock;

    public GameSession(String matchId, String whitePlayerId, String blackPlayerId, int timeMinutes, int incrementSeconds) {
        this.matchId = matchId;
        this.whitePlayerId = whitePlayerId;
        this.blackPlayerId = blackPlayerId;
        
        // Initialize your core game logic
        this.game = new Game(BoardFactory.createStandardBoard(), Color.WHITE);
        
        // Initialize the clock
        this.clock = new ChessClock(timeMinutes, incrementSeconds);
    }

    /**
     * Attempts to make a move. Returns true if successful, false if illegal or wrong turn.
     */
    public boolean handlePlayerMove(String playerId, Move move) {
        // 1. Check if the game is already over
        if (game.getState() != GameState.ONGOING || clock.isFlagFallen()) {
            return false;
        }

        // 2. Verify it is actually this player's turn
        Color currentTurn = game.getCurrentTurn();
        boolean isWhiteTurn = currentTurn == Color.WHITE;
        
        if (isWhiteTurn && !playerId.equals(whitePlayerId)) return false;
        if (!isWhiteTurn && !playerId.equals(blackPlayerId)) return false;

        // 3. Validate and execute the move (Assuming MoveValidator is handled before passing the move here, or handle it inside)
        // For now, we assume the move object passed in has been validated by your MoveValidator.
        try {
            // Start the clock on White's first move
            if (game.getMoveHistory().isEmpty() && isWhiteTurn) {
                clock.start();
            }

            game.makeMove(move); // This adds to history and switches game's internal turn
            clock.switchTurn();  // This deducts time, adds increment, and switches clock's turn
            
            return true;
        } catch (Exception e) {
            // Move was illegal
            return false;
        }
    }

    // --- Getters ---
    public String getMatchId() { return matchId; }
    public String getWhitePlayerId() { return whitePlayerId; }
    public String getBlackPlayerId() { return blackPlayerId; }
    public Game getGame() { return game; }
    public ChessClock getClock() { return clock; }
}