package com.chessx.logic.application.service;

import com.chessx.logic.application.port.in.AnalysisResult;
import com.chessx.logic.application.port.in.AnalyzePositionUseCase;
import com.chessx.logic.domain.model.FEN;
import com.chessx.logic.domain.model.Game;
import com.chessx.logic.domain.move.Move;
import com.chessx.logic.domain.rules.GameStateEvaluator;
import com.chessx.logic.domain.rules.MoveGenerator;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalysisService implements AnalyzePositionUseCase {

    private final MoveGenerator moveGenerator;
    private final GameStateEvaluator stateEvaluator;

    public AnalysisService() {
        this.moveGenerator = new MoveGenerator();
        this.stateEvaluator = new GameStateEvaluator();
    }

    @Override
    public AnalysisResult analyze(String fen, String moveAlgebraic) {
        // 1. Reconstruct the game state from the FEN string
        Game game = FEN.fromString(fen);

        // 2. Generate all legal moves for the current player
        List<Move> currentLegalMoves = moveGenerator.generateLegalMoves(game);

        // 3. If the user provided a move, attempt to play it
        if (moveAlgebraic != null && !moveAlgebraic.trim().isEmpty()) {
            Move matchedMove = findMove(currentLegalMoves, moveAlgebraic);
            
            if (matchedMove == null) {
                throw new IllegalArgumentException("Illegal move: " + moveAlgebraic);
            }
            
            // Execute the move on the board and flip turns
            game.makeMove(matchedMove);
            
            // Re-evaluate game state (Checkmate, Draw, etc.) for the NEXT player
            stateEvaluator.updateGameState(game);
            
            // Generate the legal moves for the NEXT player to return to the UI
            currentLegalMoves = moveGenerator.generateLegalMoves(game);
        } else {
            // No move provided, just evaluate the current FEN state
            stateEvaluator.updateGameState(game);
        }

        // 4. Convert the engine state back to simple data formats
        String newFen = FEN.toFEN(game);
        List<String> legalMovesAlgebraic = currentLegalMoves.stream()
                .map(Move::toString)
                .collect(Collectors.toList());

        return new AnalysisResult(newFen, game.getState(), legalMovesAlgebraic);
    }

    /**
     * Helper to match an algebraic string (e.g. "e2e4") to a generated Move object.
     */
    private Move findMove(List<Move> legalMoves, String moveAlgebraic) {
        for (Move move : legalMoves) {
            if (move.toString().equalsIgnoreCase(moveAlgebraic)) {
                return move;
            }
        }
        return null; // Move not found in the legal list
    }
}