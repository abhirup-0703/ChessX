package com.chessx.logic.infrastructure.persistence.entity;

import com.chessx.logic.domain.model.MatchStatus;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "chess_matches")
public class ChessMatchEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "white_player_id", nullable = false)
    private UserEntity whitePlayer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "black_player_id", nullable = false)
    private UserEntity blackPlayer;

    @Column(name = "time_control", nullable = false)
    private String timeControl;

    @Column(name = "is_rated", nullable = false)
    private boolean isRated;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MatchStatus status = MatchStatus.ONGOING;

    @Column(columnDefinition = "TEXT")
    private String pgn;

    @Column(name = "result")
    private String result; // "1-0", "0-1", "1/2-1/2"

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "ended_at")
    private Instant endedAt;

    // Standard Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public UserEntity getWhitePlayer() { return whitePlayer; }
    public void setWhitePlayer(UserEntity whitePlayer) { this.whitePlayer = whitePlayer; }
    
    public UserEntity getBlackPlayer() { return blackPlayer; }
    public void setBlackPlayer(UserEntity blackPlayer) { this.blackPlayer = blackPlayer; }
    
    public String getTimeControl() { return timeControl; }
    public void setTimeControl(String timeControl) { this.timeControl = timeControl; }
    
    public boolean isRated() { return isRated; }
    public void setRated(boolean rated) { this.isRated = rated; }
    
    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }
    
    public String getPgn() { return pgn; }
    public void setPgn(String pgn) { this.pgn = pgn; }
    
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
    
    public Instant getCreatedAt() { return createdAt; }
    
    public Instant getEndedAt() { return endedAt; }
    public void setEndedAt(Instant endedAt) { this.endedAt = endedAt; }
}