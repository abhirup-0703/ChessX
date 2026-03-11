package com.chessx.logic.infrastructure.persistence.entity;

import com.chessx.logic.domain.model.ChallengeStatus;
import com.chessx.logic.domain.model.ColorPreference;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "game_challenges")
public class GameChallengeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private UserEntity sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private UserEntity receiver;

    @Column(name = "time_control", nullable = false)
    private String timeControl; // e.g., "10+0"

    @Enumerated(EnumType.STRING)
    @Column(name = "color_preference", nullable = false)
    private ColorPreference colorPreference = ColorPreference.RANDOM;

    @Column(name = "is_rated", nullable = false)
    private boolean isRated = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ChallengeStatus status = ChallengeStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    // Standard Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public UserEntity getSender() { return sender; }
    public void setSender(UserEntity sender) { this.sender = sender; }
    
    public UserEntity getReceiver() { return receiver; }
    public void setReceiver(UserEntity receiver) { this.receiver = receiver; }
    
    public String getTimeControl() { return timeControl; }
    public void setTimeControl(String timeControl) { this.timeControl = timeControl; }
    
    public ColorPreference getColorPreference() { return colorPreference; }
    public void setColorPreference(ColorPreference colorPreference) { this.colorPreference = colorPreference; }
    
    public boolean isRated() { return isRated; }
    public void setRated(boolean rated) { this.isRated = rated; }
    
    public ChallengeStatus getStatus() { return status; }
    public void setStatus(ChallengeStatus status) { this.status = status; }
    
    public Instant getCreatedAt() { return createdAt; }
}