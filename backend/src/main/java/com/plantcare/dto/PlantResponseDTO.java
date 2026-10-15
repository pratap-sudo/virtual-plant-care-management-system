package com.plantcare.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for sending plant data to the frontend.
 * Includes computed fields like nextWateringDate and careInstructions.
 */
public class PlantResponseDTO {

    private Long id;
    private String name;
    private String species;
    private String plantType;
    private String location;
    private Integer wateringIntervalDays;
    private LocalDate lastWateredDate;
    private LocalDate nextWateringDate;
    private String sunlightRequirement;
    private String generalNotes;
    private String careInstructions;   // Polymorphic result from getCareInstructions()
    private boolean overdueForWatering;
    private boolean dueForWateringToday;
    private LocalDateTime createdAt;

    // Indoor-specific
    private String humidityPreference;
    private String potSize;
    private Integer repottingIntervalMonths;

    // Outdoor-specific
    private String hardinessZone;
    private Boolean isFrostTolerant;
    private String soilTypePreference;
    private String pruningSeasonNote;

    public PlantResponseDTO() {
    }

    // Getters and Setters
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

    public LocalDate getNextWateringDate() {
        return nextWateringDate;
    }

    public void setNextWateringDate(LocalDate nextWateringDate) {
        this.nextWateringDate = nextWateringDate;
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

    public String getCareInstructions() {
        return careInstructions;
    }

    public void setCareInstructions(String careInstructions) {
        this.careInstructions = careInstructions;
    }

    public boolean isOverdueForWatering() {
        return overdueForWatering;
    }

    public void setOverdueForWatering(boolean overdueForWatering) {
        this.overdueForWatering = overdueForWatering;
    }

    public boolean isDueForWateringToday() {
        return dueForWateringToday;
    }

    public void setDueForWateringToday(boolean dueForWateringToday) {
        this.dueForWateringToday = dueForWateringToday;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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
}
