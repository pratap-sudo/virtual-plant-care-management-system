package com.plantcare.controller;

import com.plantcare.dto.PlantRequestDTO;
import com.plantcare.dto.PlantResponseDTO;
import com.plantcare.service.PlantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for Plant CRUD operations.
 * All business logic is delegated to PlantService.
 *
 * Base URL: /api/plants
 */
@RestController
@RequestMapping("/api/plants")
public class PlantController {

    private final PlantService plantService;

    public PlantController(PlantService plantService) {
        this.plantService = plantService;
    }

    /** GET /api/plants — Get all plants (with optional search and filter) */
    @GetMapping
    public ResponseEntity<List<PlantResponseDTO>> getAllPlants(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type) {

        List<PlantResponseDTO> plants;
        if (search != null && !search.isBlank()) {
            plants = plantService.searchPlants(search);
        } else if (type != null && !type.isBlank()) {
            plants = plantService.getPlantsByType(type);
        } else {
            plants = plantService.getAllPlants();
        }
        return ResponseEntity.ok(plants);
    }

    /** GET /api/plants/{id} — Get a single plant by ID */
    @GetMapping("/{id}")
    public ResponseEntity<PlantResponseDTO> getPlantById(@PathVariable Long id) {
        return ResponseEntity.ok(plantService.getPlantById(id));
    }

    /** POST /api/plants — Create a new plant */
    @PostMapping
    public ResponseEntity<PlantResponseDTO> createPlant(@Valid @RequestBody PlantRequestDTO dto) {
        PlantResponseDTO created = plantService.createPlant(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /** PUT /api/plants/{id} — Update a plant */
    @PutMapping("/{id}")
    public ResponseEntity<PlantResponseDTO> updatePlant(
            @PathVariable Long id,
            @Valid @RequestBody PlantRequestDTO dto) {
        return ResponseEntity.ok(plantService.updatePlant(id, dto));
    }

    /** DELETE /api/plants/{id} — Delete a plant (and its care history) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePlant(@PathVariable Long id) {
        plantService.deletePlant(id);
        return ResponseEntity.ok(Map.of("message", "Plant deleted successfully"));
    }

    /** POST /api/plants/{id}/water — Record watering */
    @PostMapping("/{id}/water")
    public ResponseEntity<PlantResponseDTO> waterPlant(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String notes = body != null ? body.get("notes") : null;
        return ResponseEntity.ok(plantService.recordWatering(id, notes));
    }

    /** GET /api/plants/due-today — Plants due for watering today */
    @GetMapping("/due-today")
    public ResponseEntity<List<PlantResponseDTO>> getPlantsDueToday() {
        return ResponseEntity.ok(plantService.getPlantsDueToday());
    }

    /** GET /api/plants/overdue — Plants overdue for watering */
    @GetMapping("/overdue")
    public ResponseEntity<List<PlantResponseDTO>> getOverduePlants() {
        return ResponseEntity.ok(plantService.getOverduePlants());
    }
}
