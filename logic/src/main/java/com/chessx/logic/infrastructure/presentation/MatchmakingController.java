package com.chessx.logic.infrastructure.presentation;

import com.chessx.logic.application.service.MatchmakingService;
import com.chessx.logic.domain.model.ChallengeStatus;
import com.chessx.logic.infrastructure.persistence.entity.ChessMatchEntity;
import com.chessx.logic.infrastructure.persistence.entity.GameChallengeEntity;
import com.chessx.logic.infrastructure.persistence.repository.GameChallengeRepository;
import com.chessx.logic.infrastructure.presentation.dto.CreateChallengeRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/challenges")
public class MatchmakingController {

    private final MatchmakingService matchmakingService;
    private final GameChallengeRepository challengeRepository;

    public MatchmakingController(MatchmakingService matchmakingService, GameChallengeRepository challengeRepository) {
        this.matchmakingService = matchmakingService;
        this.challengeRepository = challengeRepository;
    }

    // Helper to get the logged-in user's ID from the JWT
    private String getAuthenticatedUserId() {
        return (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    /**
     * POST /api/challenges
     * Creates a new game invite.
     */
    @PostMapping
    public ResponseEntity<?> createChallenge(@RequestBody CreateChallengeRequest request) {
        try {
            String senderId = getAuthenticatedUserId();
            GameChallengeEntity challenge = matchmakingService.createChallenge(
                    senderId,
                    request.getReceiverUsername(),
                    request.getTimeControl(),
                    request.getColorPreference(),
                    request.isRated()
            );
            return ResponseEntity.ok(challenge);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/challenges/incoming
     * Fetches all pending invites for the logged-in user.
     */
    @GetMapping("/incoming")
    public ResponseEntity<List<GameChallengeEntity>> getIncomingChallenges() {
        String receiverId = getAuthenticatedUserId();
        List<GameChallengeEntity> pendingChallenges = challengeRepository.findByReceiverIdAndStatus(receiverId, ChallengeStatus.PENDING);
        return ResponseEntity.ok(pendingChallenges);
    }

    /**
     * POST /api/challenges/{id}/accept
     * Accepts an invite and spawns the live game session.
     */
    @PostMapping("/{id}/accept")
    public ResponseEntity<?> acceptChallenge(@PathVariable String id) {
        try {
            String receiverId = getAuthenticatedUserId();
            ChessMatchEntity match = matchmakingService.acceptChallenge(id, receiverId);
            
            // Return the match ID so the frontend can redirect to /play/{matchId}
            return ResponseEntity.ok(Map.of(
                    "message", "Challenge accepted",
                    "matchId", match.getId()
            ));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/challenges/{id}/decline
     * Declines an invite.
     */
    @PostMapping("/{id}/decline")
    public ResponseEntity<?> declineChallenge(@PathVariable String id) {
        try {
            String receiverId = getAuthenticatedUserId();
            matchmakingService.declineChallenge(id, receiverId);
            return ResponseEntity.ok(Map.of("message", "Challenge declined"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
