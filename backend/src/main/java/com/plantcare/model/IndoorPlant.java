package com.plantcare.model;

import jakarta.persistence.*;

/**
 * ============================================================
 * OOP CONCEPT: INHERITANCE
 * ============================================================
 *
 * IndoorPlant EXTENDS Plant (inherits all shared properties).
 * It adds indoor-specific attributes.
 *
 * OOP CONCEPT: POLYMORPHISM
 * getCareInstructions() is OVERRIDDEN here to provide
 * indoor-specific care advice.
 */
@Entity
@Table(name = "indoor_plants")
@DiscriminatorValue("INDOOR")
public class IndoorPlant extends Plant {

    @Column(name = "humidity_preference")
    private String humidityPreference; // e.g., "High", "Medium", "Low"

    @Column(name = "pot_size")
    private String potSize; // e.g., "Small", "Medium", "Large"

    @Column(name = "repotting_interval_months")
    private Integer repottingIntervalMonths;

    // Default constructor for JPA
    public IndoorPlant() {
        super();
    }

    // ============================================================
    // OOP CONCEPT: CONSTRUCTOR + super()
    // Calls the parent Plant constructor using super().
    // ============================================================
    public IndoorPlant(String name, String species, String location,
                       Integer wateringIntervalDays, String sunlightRequirement,
                       String humidityPreference) {
        super(name, species, location, wateringIntervalDays, sunlightRequirement);
        this.humidityPreference = humidityPreference;
    }

    // ============================================================
    // OOP CONCEPT: POLYMORPHISM — METHOD OVERRIDING
    // ============================================================
    @Override
    public String getCareInstructions() {
        StringBuilder sb = new StringBuilder();
        sb.append("Indoor Plant Care Guide:\n");
        sb.append("• Keep away from cold drafts and air conditioning vents.\n");
        sb.append("• Sunlight: ").append(getSunlightRequirement()).append(".\n");
        if (humidityPreference != null && !humidityPreference.isBlank()) {
            sb.append("• Humidity preference: ").append(humidityPreference).append(".\n");
        }
        sb.append("• Water every ").append(getWateringIntervalDays()).append(" day(s).\n");
        sb.append("• Check soil before watering — finger-test the top inch.\n");
        if (potSize != null && !potSize.isBlank()) {
            sb.append("• Pot size: ").append(potSize).append(".\n");
        }
        if (repottingIntervalMonths != null) {
            sb.append("• Repot every ").append(repottingIntervalMonths).append(" month(s).\n");
        }
        sb.append("• Wipe leaves monthly to remove dust.");
        return sb.toString();
    }

    @Override
    public String getPlantType() {
        return "INDOOR";
    }

    // Explicit Getters and Setters
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
}
