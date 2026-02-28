package com.chessx.logic.application.port.in;

import com.chessx.logic.domain.model.GameState;
import java.util.List;

public record AnalysisResult(
    String fen,
    GameState state,
    List<String> legalMoves
) {}