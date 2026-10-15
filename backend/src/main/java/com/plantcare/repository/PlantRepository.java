package com.plantcare.repository;

import com.plantcare.model.Plant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for Plant entities.
 * Spring auto-generates all SQL from these method signatures.
 */
@Repository
public interface PlantRepository extends JpaRepository<Plant, Long> {

    // Search plants by name (case-insensitive)
    List<Plant> findByNameContainingIgnoreCase(String name);

    // Filter by plant type discriminator value
    @Query("SELECT p FROM Plant p WHERE TYPE(p) = :type")
    List<Plant> findByType(@org.springframework.data.repository.query.Param("type") Class<?> type);

    // Count by discriminator value stored in the plants table
    @Query("SELECT COUNT(p) FROM Plant p WHERE p.class = com.plantcare.model.IndoorPlant")
    long countIndoorPlants();

    @Query("SELECT COUNT(p) FROM Plant p WHERE p.class = com.plantcare.model.OutdoorPlant")
    long countOutdoorPlants();

    // Find all plants (used to compute watering stats in Java)
    @Query("SELECT p FROM Plant p ORDER BY p.createdAt DESC")
    List<Plant> findAllOrderByCreatedAtDesc();
}
