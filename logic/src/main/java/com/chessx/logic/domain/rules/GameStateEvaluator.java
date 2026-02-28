package com.chessx.logic.domain.rules;

import com.chessx.logic.domain.model.Game;
import com.chessx.logic.domain.model.GameState;
import com.chessx.logic.domain.model.Color;
import com.chessx.logic.domain.move.Move;

import java.util.List;

public class GameStateEvaluator {

    private final MoveGenerator moveGenerator;
    private final MoveValidator moveValidator;

    public GameStateEvaluator() {
        this.moveGenerator = new MoveGenerator();
        this.moveValidator = new MoveValidator();
    }

    public void updateGameState(Game game) {
        Color currentTurn = game.getCurrentTurn();
        List<Move> legalMoves = moveGenerator.generateLegalMoves(game);

        boolean isInCheck = moveValidator.isKingInCheck(game.getBoard(), currentTurn);

        if (legalMoves.isEmpty()) {
            if (isInCheck) {
                // No legal moves and in check = Checkmate
                game.setState(currentTurn == Color.WHITE ? GameState.BLACK_WON : GameState.WHITE_WON);
            } else {
                // No legal moves but NOT in check = Stalemate (Draw)
                game.setState(GameState.DRAW);
            }
        } else {
            // Game continues
            game.setState(GameState.ONGOING);
        }
    }
}