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
 * REST controller for Plant CRUD and care schedule operations.
 * Specific static sub-paths are declared before parameterized {id} paths,
 * with numeric regex {id:[0-9]+} to prevent string routing ambiguity.
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

    /** GET /api/plants/due-fertilizing — Plants due for fertilizing */
    @GetMapping("/due-fertilizing")
    public ResponseEntity<List<PlantResponseDTO>> getDueFertilizing() {
        return ResponseEntity.ok(plantService.getPlantsDueForFertilizing());
    }

    /** GET /api/plants/due-repotting — Plants due for repotting */
    @GetMapping("/due-repotting")
    public ResponseEntity<List<PlantResponseDTO>> getDueRepotting() {
        return ResponseEntity.ok(plantService.getPlantsDueForRepotting());
    }

    /** GET /api/plants/{id} — Get a single plant by numeric ID */
    @GetMapping("/{id:[0-9]+}")
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
    @PutMapping("/{id:[0-9]+}")
    public ResponseEntity<PlantResponseDTO> updatePlant(
            @PathVariable Long id,
            @Valid @RequestBody PlantRequestDTO dto) {
        return ResponseEntity.ok(plantService.updatePlant(id, dto));
    }

    /** DELETE /api/plants/{id} — Delete a plant (and its care history) */
    @DeleteMapping("/{id:[0-9]+}")
    public ResponseEntity<Map<String, String>> deletePlant(@PathVariable Long id) {
        plantService.deletePlant(id);
        return ResponseEntity.ok(Map.of("message", "Plant deleted successfully"));
    }

    /** POST /api/plants/{id}/water — Record watering */
    @PostMapping("/{id:[0-9]+}/water")
    public ResponseEntity<PlantResponseDTO> waterPlant(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String notes = body != null ? body.get("notes") : null;
        return ResponseEntity.ok(plantService.recordWatering(id, notes));
    }

    /** POST /api/plants/{id}/fertilize — Record fertilizing */
    @PostMapping("/{id:[0-9]+}/fertilize")
    public ResponseEntity<PlantResponseDTO> fertilizePlant(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String notes = body != null ? body.get("notes") : null;
        return ResponseEntity.ok(plantService.recordFertilizing(id, notes));
    }

    /** POST /api/plants/{id}/repot — Record repotting */
    @PostMapping("/{id:[0-9]+}/repot")
    public ResponseEntity<PlantResponseDTO> repotPlant(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String notes = body != null ? body.get("notes") : null;
        return ResponseEntity.ok(plantService.recordRepotting(id, notes));
    }

    /** PATCH /api/plants/{id}/health — Update health status & record milestone */
    @PatchMapping("/{id:[0-9]+}/health")
    public ResponseEntity<PlantResponseDTO> updateHealthStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body != null ? body.get("healthStatus") : "HEALTHY";
        String note = body != null ? body.get("notes") : null;
        return ResponseEntity.ok(plantService.updateHealthStatus(id, status, note));
    }
}
