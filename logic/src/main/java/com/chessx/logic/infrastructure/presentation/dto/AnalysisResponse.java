package com.chessx.logic.infrastructure.presentation.dto;

import java.util.List;

public class AnalysisResponse {
    private String fen;
    private String gameState;
    private List<String> legalMoves;

    public AnalysisResponse(String fen, String gameState, List<String> legalMoves) {
        this.fen = fen;
        this.gameState = gameState;
        this.legalMoves = legalMoves;
    }

    // Getters
    public String getFen() { return fen; }
    public String getGameState() { return gameState; }
    public List<String> getLegalMoves() { return legalMoves; }
}