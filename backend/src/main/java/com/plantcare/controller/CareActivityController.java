package com.plantcare.controller;

import com.plantcare.dto.CareActivityRequestDTO;
import com.plantcare.dto.CareActivityResponseDTO;
import com.plantcare.dto.DashboardStatsDTO;
import com.plantcare.service.PlantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for care activities and dashboard statistics.
 *
 * Base URLs:
 *   /api/activities — care activity management
 *   /api/dashboard  — dashboard statistics
 */
@RestController
public class CareActivityController {

    private final PlantService plantService;

    public CareActivityController(PlantService plantService) {
        this.plantService = plantService;
    }

    /** GET /api/dashboard — Dashboard statistics */
    @GetMapping("/api/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboard() {
        return ResponseEntity.ok(plantService.getDashboardStats());
    }

    /** GET /api/activities — All care activities (recent 100) */
    @GetMapping("/api/activities")
    public ResponseEntity<List<CareActivityResponseDTO>> getAllActivities() {
        return ResponseEntity.ok(plantService.getAllActivities());
    }

    /** POST /api/activities — Record a care activity */
    @PostMapping("/api/activities")
    public ResponseEntity<CareActivityResponseDTO> recordActivity(
            @Valid @RequestBody CareActivityRequestDTO dto) {
        CareActivityResponseDTO created = plantService.recordActivity(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /** GET /api/activities/plant/{plantId} — Activities for a specific plant */
    @GetMapping("/api/activities/plant/{plantId}")
    public ResponseEntity<List<CareActivityResponseDTO>> getActivitiesForPlant(
            @PathVariable Long plantId) {
        return ResponseEntity.ok(plantService.getActivitiesForPlant(plantId));
    }
}
