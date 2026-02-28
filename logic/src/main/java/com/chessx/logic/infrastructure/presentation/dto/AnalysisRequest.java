package com.chessx.logic.infrastructure.presentation.dto;

public class AnalysisRequest {
    private String fen;
    private String move; // Algebraic notation, e.g., "e2e4". Can be null.

    // Getters and Setters (or use @Data if you have Lombok enabled)
    public String getFen() {
        return fen;
    }

    public void setFen(String fen) {
        this.fen = fen;
    }

    public String getMove() {
        return move;
    }

    public void setMove(String move) {
        this.move = move;
    }
}