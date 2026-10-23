package com.plantcare.service;

import com.plantcare.dto.*;
import com.plantcare.exception.PlantNotFoundException;
import com.plantcare.model.*;
import com.plantcare.repository.CareActivityRepository;
import com.plantcare.repository.PlantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Service layer — contains business logic for plant management.
 * Controllers delegate to this class; controllers contain no business logic.
 *
 * OOP CONCEPT: POLYMORPHISM demonstrated here:
 * - plantRepository.findAll() returns a List<Plant>
 * - Each element may be an IndoorPlant or OutdoorPlant
 * - Calling plant.getCareInstructions() invokes the correct override
 *   at RUNTIME — dynamic method dispatch.
 */
@Service
@Transactional
public class PlantService {

    private final PlantRepository plantRepository;
    private final CareActivityRepository careActivityRepository;

    public PlantService(PlantRepository plantRepository, CareActivityRepository careActivityRepository) {
        this.plantRepository = plantRepository;
        this.careActivityRepository = careActivityRepository;
    }

    // ----------------------------------------------------------------
    // CREATE
    // ----------------------------------------------------------------

    public PlantResponseDTO createPlant(PlantRequestDTO dto) {
        Plant plant = mapDtoToEntity(dto);
        Plant saved = plantRepository.save(plant);
        return mapEntityToDto(saved);
    }

    // ----------------------------------------------------------------
    // READ
    // ----------------------------------------------------------------

    public List<PlantResponseDTO> getAllPlants() {
        return plantRepository.findAllOrderByCreatedAtDesc()
                .stream()
                .map(this::mapEntityToDto)
                .toList();
    }

    public PlantResponseDTO getPlantById(Long id) {
        Plant plant = findPlantOrThrow(id);
        return mapEntityToDto(plant);
    }

    public List<PlantResponseDTO> searchPlants(String name) {
        return plantRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapEntityToDto)
                .toList();
    }

    public List<PlantResponseDTO> getPlantsByType(String type) {
        Class<?> typeClass = "INDOOR".equalsIgnoreCase(type)
                ? IndoorPlant.class : OutdoorPlant.class;
        return plantRepository.findByType(typeClass)
                .stream()
                .map(this::mapEntityToDto)
                .toList();
    }

    // ----------------------------------------------------------------
    // UPDATE
    // ----------------------------------------------------------------

    public PlantResponseDTO updatePlant(Long id, PlantRequestDTO dto) {
        Plant existing = findPlantOrThrow(id);
        updateEntityFromDto(existing, dto);
        Plant saved = plantRepository.save(existing);
        return mapEntityToDto(saved);
    }

    // ----------------------------------------------------------------
    // DELETE
    // ----------------------------------------------------------------

    public void deletePlant(Long id) {
        Plant plant = findPlantOrThrow(id);
        // Delete all care activities first to avoid orphaned records
        careActivityRepository.deleteByPlantId(id);
        plantRepository.delete(plant);
    }

    // ----------------------------------------------------------------
    // CARE ACTIONS: WATERING, FERTILIZING, REPOTTING, HEALTH
    // ----------------------------------------------------------------

    public PlantResponseDTO recordWatering(Long plantId, String notes) {
        Plant plant = findPlantOrThrow(plantId);
        plant.setLastWateredDate(LocalDate.now());
        Plant saved = plantRepository.save(plant);

        CareActivity activity = new CareActivity(
                saved,
                CareActivity.ActivityType.WATERING,
                LocalDate.now(),
                notes
        );
        careActivityRepository.save(activity);

        return mapEntityToDto(saved);
    }

    public PlantResponseDTO recordFertilizing(Long plantId, String notes) {
        Plant plant = findPlantOrThrow(plantId);
        plant.setLastFertilizedDate(LocalDate.now());
        Plant saved = plantRepository.save(plant);

        CareActivity activity = new CareActivity(
                saved,
                CareActivity.ActivityType.FERTILIZING,
                LocalDate.now(),
                notes
        );
        careActivityRepository.save(activity);

        return mapEntityToDto(saved);
    }

    public PlantResponseDTO recordRepotting(Long plantId, String notes) {
        Plant plant = findPlantOrThrow(plantId);
        if (plant instanceof IndoorPlant ip) {
            ip.setLastRepottedDate(LocalDate.now());
        }
        Plant saved = plantRepository.save(plant);

        CareActivity activity = new CareActivity(
                saved,
                CareActivity.ActivityType.REPOTTING,
                LocalDate.now(),
                notes
        );
        careActivityRepository.save(activity);

        return mapEntityToDto(saved);
    }

    public PlantResponseDTO updateHealthStatus(Long plantId, String healthStatus, String note) {
        Plant plant = findPlantOrThrow(plantId);
        plant.setHealthStatus(healthStatus);
        Plant saved = plantRepository.save(plant);

        String activityNote = (note != null && !note.isBlank())
                ? "Health updated to " + healthStatus + ": " + note
                : "Health updated to " + healthStatus;

        CareActivity activity = new CareActivity(
                saved,
                CareActivity.ActivityType.GROWTH_MILESTONE,
                LocalDate.now(),
                activityNote
        );
        careActivityRepository.save(activity);

        return mapEntityToDto(saved);
    }

    public List<PlantResponseDTO> getPlantsDueToday() {
        return plantRepository.findAll()
                .stream()
                .filter(Plant::isDueForWateringToday)
                .map(this::mapEntityToDto)
                .toList();
    }

    public List<PlantResponseDTO> getOverduePlants() {
        return plantRepository.findAll()
                .stream()
                .filter(Plant::isOverdueForWatering)
                .map(this::mapEntityToDto)
                .toList();
    }

    public List<PlantResponseDTO> getPlantsDueForFertilizing() {
        return plantRepository.findAll()
                .stream()
                .filter(p -> p.isDueForFertilizingToday() || p.isOverdueForFertilizing())
                .map(this::mapEntityToDto)
                .toList();
    }

    public List<PlantResponseDTO> getPlantsDueForRepotting() {
        return plantRepository.findAll()
                .stream()
                .filter(p -> p instanceof IndoorPlant ip && ip.isDueForRepotting())
                .map(this::mapEntityToDto)
                .toList();
    }

    // ----------------------------------------------------------------
    // DASHBOARD STATS
    // ----------------------------------------------------------------

    public DashboardStatsDTO getDashboardStats() {
        List<Plant> allPlants = plantRepository.findAll();

        long total = allPlants.size();
        long indoor = allPlants.stream().filter(p -> p instanceof IndoorPlant).count();
        long outdoor = allPlants.stream().filter(p -> p instanceof OutdoorPlant).count();

        // Polymorphic watering checks
        List<PlantResponseDTO> dueToday = allPlants.stream()
                .filter(Plant::isDueForWateringToday)
                .map(this::mapEntityToDto)
                .toList();

        List<PlantResponseDTO> overdue = allPlants.stream()
                .filter(Plant::isOverdueForWatering)
                .map(this::mapEntityToDto)
                .toList();

        List<PlantResponseDTO> dueFertilizing = allPlants.stream()
                .filter(p -> p.isDueForFertilizingToday() || p.isOverdueForFertilizing())
                .map(this::mapEntityToDto)
                .toList();

        List<PlantResponseDTO> dueRepotting = allPlants.stream()
                .filter(p -> p instanceof IndoorPlant ip && ip.isDueForRepotting())
                .map(this::mapEntityToDto)
                .toList();

        long thriving = allPlants.stream().filter(p -> "THRIVING".equalsIgnoreCase(p.getHealthStatus())).count();
        long healthy = allPlants.stream().filter(p -> p.getHealthStatus() == null || "HEALTHY".equalsIgnoreCase(p.getHealthStatus())).count();
        long needsAttention = allPlants.stream().filter(p -> "NEEDS_ATTENTION".equalsIgnoreCase(p.getHealthStatus())).count();
        long sick = allPlants.stream().filter(p -> "SICK".equalsIgnoreCase(p.getHealthStatus())).count();

        // Recent activities (last 10)
        List<CareActivity> recentActivities = careActivityRepository
                .findRecentActivities(org.springframework.data.domain.PageRequest.of(0, 10));

        List<CareActivityResponseDTO> recentDTOs = recentActivities.stream()
                .map(this::mapActivityToDto)
                .toList();

        DashboardStatsDTO stats = new DashboardStatsDTO(
                total, indoor, outdoor,
                dueToday.size(), overdue.size(),
                dueToday, overdue, recentDTOs
        );
        stats.setPlantsNeedingFertilizingCount(dueFertilizing.size());
        stats.setPlantsNeedingRepottingCount(dueRepotting.size());
        stats.setPlantsNeedingFertilizing(dueFertilizing);
        stats.setPlantsNeedingRepotting(dueRepotting);
        stats.setThrivingCount(thriving);
        stats.setHealthyCount(healthy);
        stats.setNeedsAttentionCount(needsAttention);
        stats.setSickCount(sick);

        return stats;
    }

    // ----------------------------------------------------------------
    // CARE ACTIVITIES
    // ----------------------------------------------------------------

    public CareActivityResponseDTO recordActivity(CareActivityRequestDTO dto) {
        Plant plant = findPlantOrThrow(dto.getPlantId());
        CareActivity.ActivityType type = CareActivity.ActivityType.valueOf(dto.getActivityType().toUpperCase());
        LocalDate date = dto.getActivityDate() != null ? dto.getActivityDate() : LocalDate.now();

        CareActivity activity = new CareActivity(plant, type, date, dto.getNotes());
        CareActivity saved = careActivityRepository.save(activity);

        // Update timestamps based on activity type
        if (type == CareActivity.ActivityType.WATERING) {
            plant.setLastWateredDate(date);
            plantRepository.save(plant);
        } else if (type == CareActivity.ActivityType.FERTILIZING) {
            plant.setLastFertilizedDate(date);
            plantRepository.save(plant);
        } else if (type == CareActivity.ActivityType.REPOTTING && plant instanceof IndoorPlant ip) {
            ip.setLastRepottedDate(date);
            plantRepository.save(plant);
        }

        return mapActivityToDto(saved);
    }

    public List<CareActivityResponseDTO> getActivitiesForPlant(Long plantId) {
        findPlantOrThrow(plantId); // verify plant exists
        return careActivityRepository.findByPlantIdOrderByActivityDateDesc(plantId)
                .stream()
                .map(this::mapActivityToDto)
                .toList();
    }

    public List<CareActivityResponseDTO> getAllActivities() {
        return careActivityRepository
                .findRecentActivities(org.springframework.data.domain.PageRequest.of(0, 100))
                .stream()
                .map(this::mapActivityToDto)
                .toList();
    }

    // ----------------------------------------------------------------
    // PRIVATE HELPERS
    // ----------------------------------------------------------------

    private Plant findPlantOrThrow(Long id) {
        return plantRepository.findById(id)
                .orElseThrow(() -> new PlantNotFoundException("Plant not found with id: " + id));
    }

    /**
     * Maps PlantRequestDTO → Plant entity (IndoorPlant or OutdoorPlant).
     * OOP: Factory-style creation based on plantType string.
     */
    private Plant mapDtoToEntity(PlantRequestDTO dto) {
        Plant plant;
        if ("INDOOR".equalsIgnoreCase(dto.getPlantType())) {
            IndoorPlant ip = new IndoorPlant();
            ip.setHumidityPreference(dto.getHumidityPreference());
            ip.setPotSize(dto.getPotSize());
            ip.setRepottingIntervalMonths(dto.getRepottingIntervalMonths());
            ip.setLastRepottedDate(dto.getLastRepottedDate());
            plant = ip;
        } else {
            OutdoorPlant op = new OutdoorPlant();
            op.setHardinessZone(dto.getHardinessZone());
            op.setIsFrostTolerant(dto.getIsFrostTolerant());
            op.setSoilTypePreference(dto.getSoilTypePreference());
            op.setPruningSeasonNote(dto.getPruningSeasonNote());
            plant = op;
        }

        plant.setName(dto.getName());
        plant.setSpecies(dto.getSpecies());
        plant.setLocation(dto.getLocation());
        plant.setWateringIntervalDays(dto.getWateringIntervalDays());
        plant.setLastWateredDate(dto.getLastWateredDate());
        plant.setSunlightRequirement(dto.getSunlightRequirement());
        plant.setGeneralNotes(dto.getGeneralNotes());
        plant.setImageUrl(dto.getImageUrl());
        plant.setHealthStatus(dto.getHealthStatus());
        plant.setFertilizingIntervalDays(dto.getFertilizingIntervalDays());
        plant.setLastFertilizedDate(dto.getLastFertilizedDate());
        return plant;
    }

    private void updateEntityFromDto(Plant existing, PlantRequestDTO dto) {
        existing.setName(dto.getName());
        existing.setSpecies(dto.getSpecies());
        existing.setLocation(dto.getLocation());
        existing.setWateringIntervalDays(dto.getWateringIntervalDays());
        if (dto.getLastWateredDate() != null) {
            existing.setLastWateredDate(dto.getLastWateredDate());
        }
        existing.setSunlightRequirement(dto.getSunlightRequirement());
        existing.setGeneralNotes(dto.getGeneralNotes());
        if (dto.getImageUrl() != null) {
            existing.setImageUrl(dto.getImageUrl());
        }
        if (dto.getHealthStatus() != null) {
            existing.setHealthStatus(dto.getHealthStatus());
        }
        if (dto.getFertilizingIntervalDays() != null) {
            existing.setFertilizingIntervalDays(dto.getFertilizingIntervalDays());
        }
        if (dto.getLastFertilizedDate() != null) {
            existing.setLastFertilizedDate(dto.getLastFertilizedDate());
        }

        if (existing instanceof IndoorPlant ip) {
            ip.setHumidityPreference(dto.getHumidityPreference());
            ip.setPotSize(dto.getPotSize());
            ip.setRepottingIntervalMonths(dto.getRepottingIntervalMonths());
            if (dto.getLastRepottedDate() != null) {
                ip.setLastRepottedDate(dto.getLastRepottedDate());
            }
        } else if (existing instanceof OutdoorPlant op) {
            op.setHardinessZone(dto.getHardinessZone());
            op.setIsFrostTolerant(dto.getIsFrostTolerant());
            op.setSoilTypePreference(dto.getSoilTypePreference());
            op.setPruningSeasonNote(dto.getPruningSeasonNote());
        }
    }

    /**
     * Maps Plant entity → PlantResponseDTO.
     * OOP CONCEPT: POLYMORPHISM demonstrated here.
     * plant.getCareInstructions() calls IndoorPlant or OutdoorPlant
     * version at runtime — even though 'plant' is typed as Plant.
     */
    public PlantResponseDTO mapEntityToDto(Plant plant) {
        PlantResponseDTO dto = new PlantResponseDTO();
        dto.setId(plant.getId());
        dto.setName(plant.getName());
        dto.setSpecies(plant.getSpecies());
        dto.setPlantType(plant.getPlantType());
        dto.setLocation(plant.getLocation());
        dto.setWateringIntervalDays(plant.getWateringIntervalDays());
        dto.setLastWateredDate(plant.getLastWateredDate());
        dto.setNextWateringDate(plant.getNextWateringDate());
        dto.setSunlightRequirement(plant.getSunlightRequirement());
        dto.setGeneralNotes(plant.getGeneralNotes());
        dto.setImageUrl(plant.getImageUrl());
        dto.setHealthStatus(plant.getHealthStatus());
        dto.setFertilizingIntervalDays(plant.getFertilizingIntervalDays());
        dto.setLastFertilizedDate(plant.getLastFertilizedDate());
        dto.setNextFertilizingDate(plant.getNextFertilizingDate());
        dto.setDueForFertilizingToday(plant.isDueForFertilizingToday());
        dto.setOverdueForFertilizing(plant.isOverdueForFertilizing());

        // POLYMORPHISM: runtime dispatch
        dto.setCareInstructions(plant.getCareInstructions());
        dto.setOverdueForWatering(plant.isOverdueForWatering());
        dto.setDueForWateringToday(plant.isDueForWateringToday());
        dto.setCreatedAt(plant.getCreatedAt());

        if (plant instanceof IndoorPlant ip) {
            dto.setHumidityPreference(ip.getHumidityPreference());
            dto.setPotSize(ip.getPotSize());
            dto.setRepottingIntervalMonths(ip.getRepottingIntervalMonths());
            dto.setLastRepottedDate(ip.getLastRepottedDate());
            dto.setNextRepottingDate(ip.getNextRepottingDate());
            dto.setDueForRepotting(ip.isDueForRepotting());
        } else if (plant instanceof OutdoorPlant op) {
            dto.setHardinessZone(op.getHardinessZone());
            dto.setIsFrostTolerant(op.getIsFrostTolerant());
            dto.setSoilTypePreference(op.getSoilTypePreference());
            dto.setPruningSeasonNote(op.getPruningSeasonNote());
        }
        return dto;
    }

    private CareActivityResponseDTO mapActivityToDto(CareActivity activity) {
        CareActivityResponseDTO dto = new CareActivityResponseDTO();
        dto.setId(activity.getId());
        dto.setPlantId(activity.getPlant().getId());
        dto.setPlantName(activity.getPlant().getName());
        dto.setActivityType(activity.getActivityType().name());
        dto.setActivityDate(activity.getActivityDate());
        dto.setNotes(activity.getNotes());
        dto.setCreatedAt(activity.getCreatedAt());
        return dto;
    }
}
