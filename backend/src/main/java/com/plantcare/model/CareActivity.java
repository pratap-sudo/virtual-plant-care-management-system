package com.plantcare.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Represents a care activity performed on a plant.
 * Examples: WATERING, FERTILIZING, PRUNING, REPOTTING, OTHER
 *
 * OOP CONCEPT: ENCAPSULATION
 * All fields are private with controlled access.
 */
@Entity
@Table(name = "care_activities")
public class CareActivity {

    public enum ActivityType {
        WATERING, FERTILIZING, PRUNING, REPOTTING, OTHER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Plant reference is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_id", nullable = false)
    private Plant plant;

    @NotNull(message = "Activity type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false)
    private ActivityType activityType;

    @NotNull(message = "Activity date is required")
    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public CareActivity() {
    }

    public CareActivity(Plant plant, ActivityType activityType, LocalDate activityDate, String notes) {
        this.plant = plant;
        this.activityType = activityType;
        this.activityDate = activityDate;
        this.notes = notes;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.activityDate == null) {
            this.activityDate = LocalDate.now();
        }
    }

    // Explicit Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Plant getPlant() {
        return plant;
    }

    public void setPlant(Plant plant) {
        this.plant = plant;
    }

    public ActivityType getActivityType() {
        return activityType;
    }

    public void setActivityType(ActivityType activityType) {
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
