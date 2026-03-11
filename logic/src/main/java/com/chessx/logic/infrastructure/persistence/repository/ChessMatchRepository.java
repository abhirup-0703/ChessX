package com.chessx.logic.infrastructure.persistence.repository;

import com.chessx.logic.infrastructure.persistence.entity.ChessMatchEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChessMatchRepository extends JpaRepository<ChessMatchEntity, String> {
}