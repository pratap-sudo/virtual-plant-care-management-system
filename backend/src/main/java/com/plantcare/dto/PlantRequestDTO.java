package com.plantcare.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/**
 * Data Transfer Object for creating or updating a plant.
 * Keeps API request fields separate from JPA entity fields.
 *
 * OOP CONCEPT: ENCAPSULATION — DTO controls what data
 * clients can send to the API.
 */
public class PlantRequestDTO {

    @NotBlank(message = "Plant name is required")
    private String name;

    @NotBlank(message = "Species is required")
    private String species;

    /**
     * "INDOOR" or "OUTDOOR"
     */
    @NotBlank(message = "Plant type is required (INDOOR or OUTDOOR)")
    private String plantType;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Watering interval is required")
    @Min(value = 1, message = "Watering interval must be at least 1 day")
    private Integer wateringIntervalDays;

    private LocalDate lastWateredDate;

    @NotBlank(message = "Sunlight requirement is required")
    private String sunlightRequirement;

    private String generalNotes;
    private String imageUrl;
    private String healthStatus;
    private Integer fertilizingIntervalDays;
    private LocalDate lastFertilizedDate;

    // Indoor-specific fields
    private String humidityPreference;
    private String potSize;
    private Integer repottingIntervalMonths;
    private LocalDate lastRepottedDate;

    // Outdoor-specific fields
    private String hardinessZone;
    private Boolean isFrostTolerant;
    private String soilTypePreference;
    private String pruningSeasonNote;

    public PlantRequestDTO() {
    }

    // Getters and Setters
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

    public String getPlantType() {
        return plantType;
    }

    public void setPlantType(String plantType) {
        this.plantType = plantType;
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

    public String getHumidityPreference() {
        return humidityPreference;
    }

    public void setHumidityPreference(String humidityPreference) {
        this.humidityPreference = humidityPreference;
    }

    public String getPotSize() {
        return potSize;
    }

    public void setPotSize(String potSize) {
        this.potSize = potSize;
    }

    public Integer getRepottingIntervalMonths() {
        return repottingIntervalMonths;
    }

    public void setRepottingIntervalMonths(Integer repottingIntervalMonths) {
        this.repottingIntervalMonths = repottingIntervalMonths;
    }

    public String getHardinessZone() {
        return hardinessZone;
    }

    public void setHardinessZone(String hardinessZone) {
        this.hardinessZone = hardinessZone;
    }

    public Boolean getIsFrostTolerant() {
        return isFrostTolerant;
    }

    public void setIsFrostTolerant(Boolean isFrostTolerant) {
        this.isFrostTolerant = isFrostTolerant;
    }

    public String getSoilTypePreference() {
        return soilTypePreference;
    }

    public void setSoilTypePreference(String soilTypePreference) {
        this.soilTypePreference = soilTypePreference;
    }

    public String getPruningSeasonNote() {
        return pruningSeasonNote;
    }

    public void setPruningSeasonNote(String pruningSeasonNote) {
        this.pruningSeasonNote = pruningSeasonNote;
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
        this.healthStatus = healthStatus;
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

    public LocalDate getLastRepottedDate() {
        return lastRepottedDate;
    }

    public void setLastRepottedDate(LocalDate lastRepottedDate) {
        this.lastRepottedDate = lastRepottedDate;
    }
}
