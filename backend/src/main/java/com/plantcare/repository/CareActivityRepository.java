package com.plantcare.repository;

import com.plantcare.model.CareActivity;
import com.plantcare.model.CareActivity.ActivityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository for CareActivity — watering, fertilizing, pruning records.
 */
@Repository
public interface CareActivityRepository extends JpaRepository<CareActivity, Long> {

    // All activities for a specific plant, newest first
    List<CareActivity> findByPlantIdOrderByActivityDateDesc(Long plantId);

    // All activities of a specific type for a plant
    List<CareActivity> findByPlantIdAndActivityTypeOrderByActivityDateDesc(
            Long plantId, ActivityType activityType);

    // Most recent activities across all plants
    @Query("SELECT ca FROM CareActivity ca ORDER BY ca.activityDate DESC")
    List<CareActivity> findRecentActivities(org.springframework.data.domain.Pageable pageable);

    // Activities in a date range
    @Query("SELECT ca FROM CareActivity ca WHERE ca.activityDate BETWEEN :start AND :end ORDER BY ca.activityDate DESC")
    List<CareActivity> findByDateRange(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end);

    // Delete all activities for a plant (called before plant deletion)
    void deleteByPlantId(Long plantId);
}
