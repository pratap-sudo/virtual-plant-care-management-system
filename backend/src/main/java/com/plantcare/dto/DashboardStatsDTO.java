package com.plantcare.dto;

import java.util.List;

/**
 * DTO containing all statistics for the Dashboard page.
 * All values are calculated from real database data.
 */
public class DashboardStatsDTO {
    private long totalPlants;
    private long indoorPlants;
    private long outdoorPlants;
    private long plantsNeedingWateringToday;
    private long overdueWateringCount;
    private List<PlantResponseDTO> plantsNeedingWatering;
    private List<PlantResponseDTO> overduePlants;
    private List<CareActivityResponseDTO> recentActivities;

    public DashboardStatsDTO() {
    }

    public DashboardStatsDTO(long totalPlants, long indoorPlants, long outdoorPlants,
                             long plantsNeedingWateringToday, long overdueWateringCount,
                             List<PlantResponseDTO> plantsNeedingWatering,
                             List<PlantResponseDTO> overduePlants,
                             List<CareActivityResponseDTO> recentActivities) {
        this.totalPlants = totalPlants;
        this.indoorPlants = indoorPlants;
        this.outdoorPlants = outdoorPlants;
        this.plantsNeedingWateringToday = plantsNeedingWateringToday;
        this.overdueWateringCount = overdueWateringCount;
        this.plantsNeedingWatering = plantsNeedingWatering;
        this.overduePlants = overduePlants;
        this.recentActivities = recentActivities;
    }

    public long getTotalPlants() {
        return totalPlants;
    }

    public void setTotalPlants(long totalPlants) {
        this.totalPlants = totalPlants;
    }

    public long getIndoorPlants() {
        return indoorPlants;
    }

    public void setIndoorPlants(long indoorPlants) {
        this.indoorPlants = indoorPlants;
    }

    public long getOutdoorPlants() {
        return outdoorPlants;
    }

    public void setOutdoorPlants(long outdoorPlants) {
        this.outdoorPlants = outdoorPlants;
    }

    public long getPlantsNeedingWateringToday() {
        return plantsNeedingWateringToday;
    }

    public void setPlantsNeedingWateringToday(long plantsNeedingWateringToday) {
        this.plantsNeedingWateringToday = plantsNeedingWateringToday;
    }

    public long getOverdueWateringCount() {
        return overdueWateringCount;
    }

    public void setOverdueWateringCount(long overdueWateringCount) {
        this.overdueWateringCount = overdueWateringCount;
    }

    public List<PlantResponseDTO> getPlantsNeedingWatering() {
        return plantsNeedingWatering;
    }

    public void setPlantsNeedingWatering(List<PlantResponseDTO> plantsNeedingWatering) {
        this.plantsNeedingWatering = plantsNeedingWatering;
    }

    public List<PlantResponseDTO> getOverduePlants() {
        return overduePlants;
    }

    public void setOverduePlants(List<PlantResponseDTO> overduePlants) {
        this.overduePlants = overduePlants;
    }

    public List<CareActivityResponseDTO> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<CareActivityResponseDTO> recentActivities) {
        this.recentActivities = recentActivities;
    }
}
