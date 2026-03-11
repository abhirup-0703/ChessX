package com.chessx.logic.infrastructure.presentation.dto;

public class GameStateUpdate {
    private String fen; // The updated board state
    private String status; // ONGOING, CHECKMATE, STALEMATE
    private long whiteTimeMs;
    private long blackTimeMs;
    private String lastMove;

    public GameStateUpdate(String fen, String status, long whiteTimeMs, long blackTimeMs, String lastMove) {
        this.fen = fen;
        this.status = status;
        this.whiteTimeMs = whiteTimeMs;
        this.blackTimeMs = blackTimeMs;
        this.lastMove = lastMove;
    }

    // Getters...
    public String getFen() { return fen; }
    public String getStatus() { return status; }
    public long getWhiteTimeMs() { return whiteTimeMs; }
    public long getBlackTimeMs() { return blackTimeMs; }
    public String getLastMove() { return lastMove; }
}