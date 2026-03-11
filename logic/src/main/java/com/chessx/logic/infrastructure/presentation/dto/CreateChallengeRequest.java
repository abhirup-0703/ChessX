package com.chessx.logic.infrastructure.presentation.dto;

import com.chessx.logic.domain.model.ColorPreference;

public class CreateChallengeRequest {
    private String receiverUsername;
    private String timeControl;
    private ColorPreference colorPreference;
    private boolean isRated;

    // Getters and Setters
    public String getReceiverUsername() { return receiverUsername; }
    public void setReceiverUsername(String receiverUsername) { this.receiverUsername = receiverUsername; }

    public String getTimeControl() { return timeControl; }
    public void setTimeControl(String timeControl) { this.timeControl = timeControl; }

    public ColorPreference getColorPreference() { return colorPreference; }
    public void setColorPreference(ColorPreference colorPreference) { this.colorPreference = colorPreference; }

    public boolean isRated() { return isRated; }
    public void setRated(boolean rated) { this.isRated = rated; }
}