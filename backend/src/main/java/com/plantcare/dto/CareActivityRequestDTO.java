package com.plantcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/**
 * DTO for recording a care activity (watering, fertilizing, etc.)
 */
public class CareActivityRequestDTO {

    @NotNull(message = "Plant ID is required")
    private Long plantId;

    @NotBlank(message = "Activity type is required")
    private String activityType; // WATERING, FERTILIZING, PRUNING, REPOTTING, OTHER

    private LocalDate activityDate; // defaults to today if null

    private String notes;

    public CareActivityRequestDTO() {
    }

    public Long getPlantId() {
        return plantId;
    }

    public void setPlantId(Long plantId) {
        this.plantId = plantId;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public LocalDate getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(LocalDate activityDate) {
        this.activityDate = activityDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
