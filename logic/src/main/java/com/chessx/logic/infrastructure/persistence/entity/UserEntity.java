package com.chessx.logic.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "\"User\"") // Quotes are mandatory here for Postgres case-sensitivity
public class UserEntity {

    @Id
    @Column(name = "id", updatable = false, insertable = false)
    private String id;

    @Column(name = "username", updatable = false, insertable = false)
    private String username;

    // Only getters! No setters to enforce read-only behavior.
    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }
}