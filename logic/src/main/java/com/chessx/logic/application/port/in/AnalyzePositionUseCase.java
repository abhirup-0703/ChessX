package com.chessx.logic.application.port.in;

public interface AnalyzePositionUseCase {
    
    /**
     * Analyzes a position and optionally applies a move.
     * * @param fen The current Forsyth-Edwards Notation string.
     * @param moveAlgebraic The attempted move in algebraic notation (e.g., "e2e4"). Can be null.
     * @return An AnalysisResult containing the new FEN, game state, and next legal moves.
     */
    AnalysisResult analyze(String fen, String moveAlgebraic);
}