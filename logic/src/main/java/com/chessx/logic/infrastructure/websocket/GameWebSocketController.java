package com.chessx.logic.infrastructure.websocket;

import com.chessx.logic.application.service.MatchmakingService;
import com.chessx.logic.domain.model.FEN;
import com.chessx.logic.domain.model.GameSession;
import com.chessx.logic.domain.move.Move;
import com.chessx.logic.domain.move.StandardMove;
import com.chessx.logic.infrastructure.presentation.dto.GameMoveRequest;
import com.chessx.logic.infrastructure.presentation.dto.GameStateUpdate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GameWebSocketController {

    private final MatchmakingService matchmakingService;

    public GameWebSocketController(MatchmakingService matchmakingService) {
        this.matchmakingService = matchmakingService;
    }

    /**
     * Frontend sends messages to: /app/game/{matchId}/move
     * Spring broadcasts the return value to: /topic/game/{matchId}
     */
    @MessageMapping("/game/{matchId}/move")
    @SendTo("/topic/game/{matchId}")
    public GameStateUpdate handleMove(@DestinationVariable String matchId, @Payload GameMoveRequest moveRequest) {
        
        // 1. Fetch the active game from memory
        GameSession session = matchmakingService.getActiveSession(matchId);
        
        if (session == null) {
            throw new IllegalArgumentException("Game session not found or already ended.");
        }

        // 2. Convert raw string move ("e2", "e4") to your Domain Move object.
        // NOTE: You may need to use your Board/Square classes here to construct the correct move type.
        // This is a simplified example assuming you have a way to build a move from strings.
        Move attemptedMove = new StandardMove(
                // You will need to fetch the actual Pieces/Squares from session.getGame().getBoard()
                null, null, null // Placeholder for your actual move construction logic
        );

        // 3. Process the move
        boolean success = session.handlePlayerMove(moveRequest.getPlayerId(), attemptedMove);

        if (!success) {
            // If illegal, you might want to return an error object instead, or just the current un-changed state
            throw new IllegalArgumentException("Illegal move or not your turn.");
        }

        // 4. Generate the FEN to send back to Next.js (so the chessboard updates)
        String currentFen = FEN.toFEN(session.getGame());
        
        // 5. Build and broadcast the update to BOTH players instantly
        return new GameStateUpdate(
                currentFen,
                session.getGame().getState().name(),
                session.getClock().getWhiteTimeRemainingMs(),
                session.getClock().getBlackTimeRemainingMs(),
                moveRequest.getFromSquare() + moveRequest.getToSquare()
        );
    }
}