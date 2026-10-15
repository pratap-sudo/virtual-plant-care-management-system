package com.plantcare.model;

import jakarta.persistence.*;

/**
 * ============================================================
 * OOP CONCEPT: INHERITANCE
 * ============================================================
 *
 * OutdoorPlant EXTENDS Plant (inherits all shared properties).
 * It adds outdoor-specific attributes.
 *
 * OOP CONCEPT: POLYMORPHISM
 * getCareInstructions() is OVERRIDDEN here to provide
 * outdoor-specific care advice.
 */
@Entity
@Table(name = "outdoor_plants")
@DiscriminatorValue("OUTDOOR")
public class OutdoorPlant extends Plant {

    @Column(name = "hardiness_zone")
    private String hardinessZone; // e.g., "Zone 9-11"

    @Column(name = "is_frost_tolerant")
    private Boolean isFrostTolerant;

    @Column(name = "soil_type_preference")
    private String soilTypePreference; // e.g., "Well-drained", "Sandy", "Clay"

    @Column(name = "pruning_season")
    private String pruningSeasonNote; // e.g., "Prune in spring"

    // Default constructor for JPA
    public OutdoorPlant() {
        super();
    }

    // ============================================================
    // OOP CONCEPT: CONSTRUCTOR + super()
    // ============================================================
    public OutdoorPlant(String name, String species, String location,
                        Integer wateringIntervalDays, String sunlightRequirement,
                        String soilTypePreference) {
        super(name, species, location, wateringIntervalDays, sunlightRequirement);
        this.soilTypePreference = soilTypePreference;
    }

    // ============================================================
    // OOP CONCEPT: POLYMORPHISM — METHOD OVERRIDING
    // ============================================================
    @Override
    public String getCareInstructions() {
        StringBuilder sb = new StringBuilder();
        sb.append("Outdoor Plant Care Guide:\n");
        sb.append("• Sunlight: ").append(getSunlightRequirement()).append(".\n");
        sb.append("• Water every ").append(getWateringIntervalDays()).append(" day(s).\n");
        if (soilTypePreference != null && !soilTypePreference.isBlank()) {
            sb.append("• Preferred soil: ").append(soilTypePreference).append(".\n");
        }
        if (isFrostTolerant != null) {
            sb.append("• Frost tolerant: ").append(isFrostTolerant ? "Yes" : "No").append(".\n");
        }
        if (hardinessZone != null && !hardinessZone.isBlank()) {
            sb.append("• Hardiness zone: ").append(hardinessZone).append(".\n");
        }
        if (pruningSeasonNote != null && !pruningSeasonNote.isBlank()) {
            sb.append("• Pruning: ").append(pruningSeasonNote).append(".\n");
        }
        sb.append("• Mulch around the base to retain moisture.\n");
        sb.append("• Adjust watering based on rainfall and season.");
        return sb.toString();
    }

    @Override
    public String getPlantType() {
        return "OUTDOOR";
    }

    // Explicit Getters and Setters
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
