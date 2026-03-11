package com.chessx.logic.infrastructure.persistence.repository;

import com.chessx.logic.domain.model.ChallengeStatus;
import com.chessx.logic.infrastructure.persistence.entity.GameChallengeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GameChallengeRepository extends JpaRepository<GameChallengeEntity, String> {
    // Custom query to let a user fetch all their pending invites
    List<GameChallengeEntity> findByReceiverIdAndStatus(String receiverId, ChallengeStatus status);
}