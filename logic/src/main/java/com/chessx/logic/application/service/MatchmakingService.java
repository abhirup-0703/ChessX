package com.chessx.logic.application.service;

import com.chessx.logic.domain.model.ChallengeStatus;
import com.chessx.logic.domain.model.ColorPreference;
import com.chessx.logic.domain.model.GameSession;
import com.chessx.logic.infrastructure.persistence.entity.ChessMatchEntity;
import com.chessx.logic.infrastructure.persistence.entity.GameChallengeEntity;
import com.chessx.logic.infrastructure.persistence.entity.UserEntity;
import com.chessx.logic.infrastructure.persistence.repository.ChessMatchRepository;
import com.chessx.logic.infrastructure.persistence.repository.GameChallengeRepository;
import com.chessx.logic.infrastructure.persistence.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MatchmakingService {

    private final UserRepository userRepository;
    private final GameChallengeRepository challengeRepository;
    private final ChessMatchRepository matchRepository;

    // This is where live games live! ConcurrentHashMap ensures thread safety 
    // when multiple websockets try to access games at the same time.
    private final Map<String, GameSession> activeSessions = new ConcurrentHashMap<>();

    public MatchmakingService(UserRepository userRepository, 
                              GameChallengeRepository challengeRepository, 
                              ChessMatchRepository matchRepository) {
        this.userRepository = userRepository;
        this.challengeRepository = challengeRepository;
        this.matchRepository = matchRepository;
    }

    /**
     * Step 1: User A challenges User B
     */
    @Transactional
    public GameChallengeEntity createChallenge(String senderId, String receiverUsername, String timeControl, ColorPreference colorPref, boolean isRated) {
        UserEntity sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
        
        UserEntity receiver = userRepository.findByUsername(receiverUsername)
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("You cannot challenge yourself!");
        }

        GameChallengeEntity challenge = new GameChallengeEntity();
        challenge.setSender(sender);
        challenge.setReceiver(receiver);
        challenge.setTimeControl(timeControl);
        challenge.setColorPreference(colorPref);
        challenge.setRated(isRated);
        // Status defaults to PENDING based on our entity setup

        return challengeRepository.save(challenge);
    }

    /**
     * Step 2: User B accepts the challenge. We create the Match and start the Session!
     */
    @Transactional
    public ChessMatchEntity acceptChallenge(String challengeId, String receiverId) {
        GameChallengeEntity challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));

        if (!challenge.getReceiver().getId().equals(receiverId)) {
            throw new IllegalArgumentException("You are not authorized to accept this challenge");
        }

        if (challenge.getStatus() != ChallengeStatus.PENDING) {
            throw new IllegalStateException("Challenge is no longer pending");
        }

        // 1. Update challenge status
        challenge.setStatus(ChallengeStatus.ACCEPTED);
        challengeRepository.save(challenge);

        // 2. Determine colors
        UserEntity whitePlayer;
        UserEntity blackPlayer;

        if (challenge.getColorPreference() == ColorPreference.WHITE) {
            whitePlayer = challenge.getSender();
            blackPlayer = challenge.getReceiver();
        } else if (challenge.getColorPreference() == ColorPreference.BLACK) {
            whitePlayer = challenge.getReceiver();
            blackPlayer = challenge.getSender();
        } else {
            // Random assignment
            if (Math.random() < 0.5) {
                whitePlayer = challenge.getSender();
                blackPlayer = challenge.getReceiver();
            } else {
                whitePlayer = challenge.getReceiver();
                blackPlayer = challenge.getSender();
            }
        }

        // 3. Create the Database Record
        ChessMatchEntity match = new ChessMatchEntity();
        match.setWhitePlayer(whitePlayer);
        match.setBlackPlayer(blackPlayer);
        match.setTimeControl(challenge.getTimeControl());
        match.setRated(challenge.isRated());
        
        match = matchRepository.save(match); // Save to get the generated Match ID

        // 4. Parse time controls (e.g., "10+0" -> 10 mins, 0 sec increment)
        String[] tcParts = challenge.getTimeControl().split("\\+");
        int timeMinutes = Integer.parseInt(tcParts[0]);
        int incrementSeconds = tcParts.length > 1 ? Integer.parseInt(tcParts[1]) : 0;

        // 5. Spin up the live game session in memory!
        GameSession session = new GameSession(
                match.getId(),
                whitePlayer.getId(),
                blackPlayer.getId(),
                timeMinutes,
                incrementSeconds
        );
        
        activeSessions.put(match.getId(), session);

        return match;
    }

    /**
     * Helper to decline a challenge
     */
    @Transactional
    public void declineChallenge(String challengeId, String receiverId) {
        GameChallengeEntity challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));

        if (!challenge.getReceiver().getId().equals(receiverId)) {
            throw new IllegalArgumentException("Not authorized");
        }

        challenge.setStatus(ChallengeStatus.DECLINED);
        challengeRepository.save(challenge);
    }

    /**
     * Used by the WebSocket controllers to route moves to the correct live game
     */
    public GameSession getActiveSession(String matchId) {
        return activeSessions.get(matchId);
    }
    
    /**
     * Clean up when a game ends
     */
    public void removeActiveSession(String matchId) {
        activeSessions.remove(matchId);
    }
}