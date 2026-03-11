package com.chessx.logic.domain.model;

public class ChessClock {
    private long whiteTimeRemainingMs;
    private long blackTimeRemainingMs;
    private final long incrementMs;
    
    private long lastMoveTimestampMs;
    private boolean isRunning;
    private Color activeTurn; // Tracks whose clock is currently ticking

    public ChessClock(int initialTimeMinutes, int incrementSeconds) {
        long initialTimeMs = initialTimeMinutes * 60L * 1000L;
        this.whiteTimeRemainingMs = initialTimeMs;
        this.blackTimeRemainingMs = initialTimeMs;
        this.incrementMs = incrementSeconds * 1000L;
        this.isRunning = false;
        this.activeTurn = Color.WHITE; // White always moves first
    }

    public void start() {
        if (!isRunning) {
            this.lastMoveTimestampMs = System.currentTimeMillis();
            this.isRunning = true;
        }
    }

    public void stop() {
        if (isRunning) {
            updateClocks();
            this.isRunning = false;
        }
    }

    public void switchTurn() {
        if (!isRunning) return;
        
        // 1. Deduct time spent on this move
        updateClocks();
        
        // 2. Add increment to the player who just moved
        if (activeTurn == Color.WHITE) {
            whiteTimeRemainingMs += incrementMs;
            activeTurn = Color.BLACK;
        } else {
            blackTimeRemainingMs += incrementMs;
            activeTurn = Color.WHITE;
        }
        
        // 3. Reset the timestamp for the next player
        this.lastMoveTimestampMs = System.currentTimeMillis();
    }

    private void updateClocks() {
        long now = System.currentTimeMillis();
        long elapsed = now - lastMoveTimestampMs;
        
        if (activeTurn == Color.WHITE) {
            whiteTimeRemainingMs = Math.max(0, whiteTimeRemainingMs - elapsed);
        } else {
            blackTimeRemainingMs = Math.max(0, blackTimeRemainingMs - elapsed);
        }
        
        this.lastMoveTimestampMs = now; // Prevent double-deduction if polled
    }

    public boolean isFlagFallen() {
        updateClocks();
        return whiteTimeRemainingMs <= 0 || blackTimeRemainingMs <= 0;
    }

    public Color getLoserOnTime() {
        if (whiteTimeRemainingMs <= 0) return Color.WHITE;
        if (blackTimeRemainingMs <= 0) return Color.BLACK;
        return null; // No one has lost on time yet
    }

    // Getters
    public long getWhiteTimeRemainingMs() { 
        if (isRunning && activeTurn == Color.WHITE) updateClocks();
        return whiteTimeRemainingMs; 
    }
    
    public long getBlackTimeRemainingMs() { 
        if (isRunning && activeTurn == Color.BLACK) updateClocks();
        return blackTimeRemainingMs; 
    }
}