package com.chessx.logic.domain.model;

import java.util.Objects;

public class Square {
    private final int file; // 0 to 7 (a to h)
    private final int rank; // 0 to 7 (1 to 8)

    public Square(int file, int rank) {
        if (!isValid(file, rank)) {
            throw new IllegalArgumentException("Invalid square coordinates: " + file + ", " + rank);
        }
        this.file = file;
        this.rank = rank;
    }

    public static boolean isValid(int file, int rank) {
        return file >= 0 && file < 8 && rank >= 0 && rank < 8;
    }

    // Creates a square from standard algebraic notation (e.g., "e2")
    public static Square fromAlgebraic(String algebraic) {
        if (algebraic == null || algebraic.length() != 2) {
            throw new IllegalArgumentException("Invalid algebraic notation: " + algebraic);
        }
        int file = algebraic.charAt(0) - 'a';
        int rank = algebraic.charAt(1) - '1';
        return new Square(file, rank);
    }

    public String toAlgebraic() {
        char f = (char) ('a' + file);
        char r = (char) ('1' + rank);
        return "" + f + r;
    }

    public int getFile() { return file; }
    public int getRank() { return rank; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Square square = (Square) o;
        return file == square.file && rank == square.rank;
    }

    @Override
    public int hashCode() {
        return Objects.hash(file, rank);
    }

    @Override
    public String toString() {
        return toAlgebraic();
    }
}