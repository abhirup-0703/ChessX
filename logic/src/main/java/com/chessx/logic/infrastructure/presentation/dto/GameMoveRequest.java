package com.chessx.logic.infrastructure.presentation.dto;

public class GameMoveRequest {
    private String playerId;
    private String fromSquare; // e.g., "e2"
    private String toSquare;   // e.g., "e4"
    private String promotion;  // e.g., "q" (optional)

    // Getters and Setters
    public String getPlayerId() { return playerId; }
    public void setPlayerId(String playerId) { this.playerId = playerId; }
    public String getFromSquare() { return fromSquare; }
    public void setFromSquare(String fromSquare) { this.fromSquare = fromSquare; }
    public String getToSquare() { return toSquare; }
    public void setToSquare(String toSquare) { this.toSquare = toSquare; }
    public String getPromotion() { return promotion; }
    public void setPromotion(String promotion) { this.promotion = promotion; }
}