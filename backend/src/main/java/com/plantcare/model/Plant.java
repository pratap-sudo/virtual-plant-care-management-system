package com.plantcare.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * ============================================================
 * OOP CONCEPT: ABSTRACTION + INHERITANCE BASE CLASS
 * ============================================================
 *
 * Plant is an ABSTRACT class — it cannot be instantiated directly.
 * It defines the common blueprint for all plant types.
 *
 * Subclasses (IndoorPlant, OutdoorPlant) must implement
 * getCareInstructions() — this is ABSTRACTION.
 *
 * JPA Inheritance Strategy: JOINED
 * - A 'plants' table holds all shared columns.
 * - 'indoor_plants' and 'outdoor_plants' tables hold type-specific columns.
 */
@Entity
@Table(name = "plants")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "plant_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Plant {

    // ============================================================
    // OOP CONCEPT: ENCAPSULATION
    // All fields are private. Access is strictly controlled through
    // explicit getters and setters.
    // ============================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Plant name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Species is required")
    @Column(nullable = false)
    private String species;

    @NotBlank(message = "Location is required")
    @Column(nullable = false)
    private String location;

    @NotNull(message = "Watering interval is required")
    @Min(value = 1, message = "Watering interval must be at least 1 day")
    @Column(name = "watering_interval_days", nullable = false)
    private Integer wateringIntervalDays;

    @Column(name = "last_watered_date")
    private LocalDate lastWateredDate;

    @NotBlank(message = "Sunlight requirement is required")
    @Column(name = "sunlight_requirement", nullable = false)
    private String sunlightRequirement;

    @Column(name = "general_notes", columnDefinition = "TEXT")
    private String generalNotes;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "health_status", length = 30)
    private String healthStatus = "HEALTHY";

    @Column(name = "fertilizing_interval_days")
    private Integer fertilizingIntervalDays;

    @Column(name = "last_fertilized_date")
    private LocalDate lastFertilizedDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Default constructor for JPA
    public Plant() {
    }

    // ============================================================
    // OOP CONCEPT: CONSTRUCTOR + super()
    // This constructor initializes base properties and is invoked
    // by subclasses via super(...).
    // ============================================================
    protected Plant(String name, String species, String location,
                    Integer wateringIntervalDays, String sunlightRequirement) {
        this.name = name;
        this.species = species;
        this.location = location;
        this.wateringIntervalDays = wateringIntervalDays;
        this.sunlightRequirement = sunlightRequirement;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ============================================================
    // OOP CONCEPT: ABSTRACTION
    // Abstract method: each subclass must provide its own implementation.
    // ============================================================
    public abstract String getCareInstructions();

    public abstract String getPlantType();

    // ============================================================
    // Business logic methods
    // ============================================================
    public LocalDate getNextWateringDate() {
        if (lastWateredDate == null) {
            return LocalDate.now(); // overdue if never watered
        }
        return lastWateredDate.plusDays(wateringIntervalDays);
    }

    public boolean isOverdueForWatering() {
        return getNextWateringDate().isBefore(LocalDate.now());
    }

    public boolean isDueForWateringToday() {
        return getNextWateringDate().isEqual(LocalDate.now());
    }

    public LocalDate getNextFertilizingDate() {
        if (fertilizingIntervalDays == null || fertilizingIntervalDays <= 0) {
            return null;
        }
        if (lastFertilizedDate == null) {
            return LocalDate.now();
        }
        return lastFertilizedDate.plusDays(fertilizingIntervalDays);
    }

    public boolean isDueForFertilizingToday() {
        LocalDate next = getNextFertilizingDate();
        return next != null && next.isEqual(LocalDate.now());
    }

    public boolean isOverdueForFertilizing() {
        LocalDate next = getNextFertilizingDate();
        return next != null && next.isBefore(LocalDate.now());
    }

    // ============================================================
    // Explicit Getters and Setters (Encapsulation)
    // ============================================================
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getWateringIntervalDays() {
        return wateringIntervalDays;
    }

    public void setWateringIntervalDays(Integer wateringIntervalDays) {
        this.wateringIntervalDays = wateringIntervalDays;
    }

    public LocalDate getLastWateredDate() {
        return lastWateredDate;
    }

    public void setLastWateredDate(LocalDate lastWateredDate) {
        this.lastWateredDate = lastWateredDate;
    }

    public String getSunlightRequirement() {
        return sunlightRequirement;
    }

    public void setSunlightRequirement(String sunlightRequirement) {
        this.sunlightRequirement = sunlightRequirement;
    }

    public String getGeneralNotes() {
        return generalNotes;
    }

    public void setGeneralNotes(String generalNotes) {
        this.generalNotes = generalNotes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getHealthStatus() {
        return healthStatus;
    }

    public void setHealthStatus(String healthStatus) {
        this.healthStatus = (healthStatus != null && !healthStatus.isBlank()) ? healthStatus : "HEALTHY";
    }

    public Integer getFertilizingIntervalDays() {
        return fertilizingIntervalDays;
    }

    public void setFertilizingIntervalDays(Integer fertilizingIntervalDays) {
        this.fertilizingIntervalDays = fertilizingIntervalDays;
    }

    public LocalDate getLastFertilizedDate() {
        return lastFertilizedDate;
    }

    public void setLastFertilizedDate(LocalDate lastFertilizedDate) {
        this.lastFertilizedDate = lastFertilizedDate;
    }
}
