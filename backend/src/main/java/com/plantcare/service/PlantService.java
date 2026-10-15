package com.plantcare.service;

import com.plantcare.dto.*;
import com.plantcare.exception.PlantNotFoundException;
import com.plantcare.model.*;
import com.plantcare.repository.CareActivityRepository;
import com.plantcare.repository.PlantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Service layer — contains ALL business logic for plant management.
 * Controllers delegate to this class; controllers contain no business logic.
 *
 * OOP CONCEPT: POLYMORPHISM demonstrated here:
 * - plantRepository.findAll() returns a List<Plant>
 * - Each element may be an IndoorPlant or OutdoorPlant
 * - Calling plant.getCareInstructions() invokes the correct override
 *   at RUNTIME — this is runtime polymorphism.
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
    // WATERING
    // ----------------------------------------------------------------

    public PlantResponseDTO recordWatering(Long plantId, String notes) {
        Plant plant = findPlantOrThrow(plantId);
        plant.setLastWateredDate(LocalDate.now());
        Plant saved = plantRepository.save(plant);

        // Also record a CareActivity
        CareActivity activity = new CareActivity(
                saved,
                CareActivity.ActivityType.WATERING,
                LocalDate.now(),
                notes
        );
        careActivityRepository.save(activity);

        return mapEntityToDto(saved);
    }

    public List<PlantResponseDTO> getPlantsDueToday() {
        // OOP: Calls polymorphic isDueForWateringToday() on each Plant subtype
        return plantRepository.findAll()
                .stream()
                .filter(Plant::isDueForWateringToday)
                .map(this::mapEntityToDto)
                .toList();
    }

    public List<PlantResponseDTO> getOverduePlants() {
        // OOP: Calls polymorphic isOverdueForWatering() on each Plant subtype
        return plantRepository.findAll()
                .stream()
                .filter(Plant::isOverdueForWatering)
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

        // Recent activities (last 10)
        List<CareActivity> recentActivities = careActivityRepository
                .findRecentActivities(org.springframework.data.domain.PageRequest.of(0, 10));

        List<CareActivityResponseDTO> recentDTOs = recentActivities.stream()
                .map(this::mapActivityToDto)
                .toList();

        return new DashboardStatsDTO(
                total, indoor, outdoor,
                dueToday.size(), overdue.size(),
                dueToday, overdue, recentDTOs
        );
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

        // If watering, update plant's lastWateredDate
        if (type == CareActivity.ActivityType.WATERING) {
            plant.setLastWateredDate(date);
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
        if ("INDOOR".equalsIgnoreCase(dto.getPlantType())) {
            IndoorPlant plant = new IndoorPlant();
            plant.setName(dto.getName());
            plant.setSpecies(dto.getSpecies());
            plant.setLocation(dto.getLocation());
            plant.setWateringIntervalDays(dto.getWateringIntervalDays());
            plant.setLastWateredDate(dto.getLastWateredDate());
            plant.setSunlightRequirement(dto.getSunlightRequirement());
            plant.setGeneralNotes(dto.getGeneralNotes());
            plant.setHumidityPreference(dto.getHumidityPreference());
            plant.setPotSize(dto.getPotSize());
            plant.setRepottingIntervalMonths(dto.getRepottingIntervalMonths());
            return plant;
        } else {
            OutdoorPlant plant = new OutdoorPlant();
            plant.setName(dto.getName());
            plant.setSpecies(dto.getSpecies());
            plant.setLocation(dto.getLocation());
            plant.setWateringIntervalDays(dto.getWateringIntervalDays());
            plant.setLastWateredDate(dto.getLastWateredDate());
            plant.setSunlightRequirement(dto.getSunlightRequirement());
            plant.setGeneralNotes(dto.getGeneralNotes());
            plant.setHardinessZone(dto.getHardinessZone());
            plant.setIsFrostTolerant(dto.getIsFrostTolerant());
            plant.setSoilTypePreference(dto.getSoilTypePreference());
            plant.setPruningSeasonNote(dto.getPruningSeasonNote());
            return plant;
        }
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

        if (existing instanceof IndoorPlant ip) {
            ip.setHumidityPreference(dto.getHumidityPreference());
            ip.setPotSize(dto.getPotSize());
            ip.setRepottingIntervalMonths(dto.getRepottingIntervalMonths());
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
        // POLYMORPHISM: runtime dispatch
        dto.setCareInstructions(plant.getCareInstructions());
        dto.setOverdueForWatering(plant.isOverdueForWatering());
        dto.setDueForWateringToday(plant.isDueForWateringToday());
        dto.setCreatedAt(plant.getCreatedAt());

        if (plant instanceof IndoorPlant ip) {
            dto.setHumidityPreference(ip.getHumidityPreference());
            dto.setPotSize(ip.getPotSize());
            dto.setRepottingIntervalMonths(ip.getRepottingIntervalMonths());
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
