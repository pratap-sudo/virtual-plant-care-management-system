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
    private long plantsNeedingFertilizingCount;
    private long plantsNeedingRepottingCount;
    private long thrivingCount;
    private long healthyCount;
    private long needsAttentionCount;
    private long sickCount;
    private List<PlantResponseDTO> plantsNeedingWatering;
    private List<PlantResponseDTO> overduePlants;
    private List<PlantResponseDTO> plantsNeedingFertilizing;
    private List<PlantResponseDTO> plantsNeedingRepotting;
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

    public long getPlantsNeedingFertilizingCount() {
        return plantsNeedingFertilizingCount;
    }

    public void setPlantsNeedingFertilizingCount(long plantsNeedingFertilizingCount) {
        this.plantsNeedingFertilizingCount = plantsNeedingFertilizingCount;
    }

    public long getPlantsNeedingRepottingCount() {
        return plantsNeedingRepottingCount;
    }

    public void setPlantsNeedingRepottingCount(long plantsNeedingRepottingCount) {
        this.plantsNeedingRepottingCount = plantsNeedingRepottingCount;
    }

    public long getThrivingCount() {
        return thrivingCount;
    }

    public void setThrivingCount(long thrivingCount) {
        this.thrivingCount = thrivingCount;
    }

    public long getHealthyCount() {
        return healthyCount;
    }

    public void setHealthyCount(long healthyCount) {
        this.healthyCount = healthyCount;
    }

    public long getNeedsAttentionCount() {
        return needsAttentionCount;
    }

    public void setNeedsAttentionCount(long needsAttentionCount) {
        this.needsAttentionCount = needsAttentionCount;
    }

    public long getSickCount() {
        return sickCount;
    }

    public void setSickCount(long sickCount) {
        this.sickCount = sickCount;
    }

    public List<PlantResponseDTO> getPlantsNeedingFertilizing() {
        return plantsNeedingFertilizing;
    }

    public void setPlantsNeedingFertilizing(List<PlantResponseDTO> plantsNeedingFertilizing) {
        this.plantsNeedingFertilizing = plantsNeedingFertilizing;
    }

    public List<PlantResponseDTO> getPlantsNeedingRepotting() {
        return plantsNeedingRepotting;
    }

    public void setPlantsNeedingRepotting(List<PlantResponseDTO> plantsNeedingRepotting) {
        this.plantsNeedingRepotting = plantsNeedingRepotting;
    }
}
