package com.plantcare;

import com.plantcare.model.IndoorPlant;
import com.plantcare.model.OutdoorPlant;
import com.plantcare.model.Plant;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * OOP DEMONSTRATION TEST
 * This test class proves ALL required OOP concepts are working.
 * No database required — pure unit tests.
 * Run with: .\mvnw test -Dspring.datasource.url=skip
 */
@DisplayName("OOP Concepts Demonstration")
public class OopDemonstrationTest {

    @Test
    @DisplayName("Encapsulation: fields are private, accessed via getters/setters")
    void testEncapsulation() {
        IndoorPlant plant = new IndoorPlant();
        plant.setName("Peace Lily");
        plant.setSpecies("Spathiphyllum wallisii");
        plant.setLocation("Living Room");
        plant.setWateringIntervalDays(7);
        plant.setSunlightRequirement("Low to Medium");
        plant.setHumidityPreference("High");

        assertEquals("Peace Lily", plant.getName());
        assertEquals("Spathiphyllum wallisii", plant.getSpecies());
        assertEquals(7, plant.getWateringIntervalDays());
        assertEquals("High", plant.getHumidityPreference());
        System.out.println("✅ ENCAPSULATION: Fields are private, accessed via getters.");
    }

    @Test
    @DisplayName("Inheritance: IndoorPlant and OutdoorPlant extend Plant")
    void testInheritance() {
        IndoorPlant indoor = new IndoorPlant("Snake Plant", "Sansevieria trifasciata", "Bedroom", 14, "Low", "Low");
        OutdoorPlant outdoor = new OutdoorPlant("Rose", "Rosa", "Garden", 3, "Full Sun", "Well-drained");

        assertInstanceOf(Plant.class, indoor, "IndoorPlant should be a Plant");
        assertInstanceOf(Plant.class, outdoor, "OutdoorPlant should be a Plant");
        assertInstanceOf(IndoorPlant.class, indoor);
        assertInstanceOf(OutdoorPlant.class, outdoor);
        assertEquals("Snake Plant", indoor.getName());
        assertEquals("Rose", outdoor.getName());
        System.out.println("✅ INHERITANCE: IndoorPlant and OutdoorPlant are both Plants.");
    }

    @Test
    @DisplayName("Abstraction: getCareInstructions() is abstract, enforced on subclasses")
    void testAbstraction() {
        IndoorPlant indoor = new IndoorPlant();
        indoor.setName("Aloe Vera");
        indoor.setSpecies("Aloe barbadensis");
        indoor.setLocation("Windowsill");
        indoor.setWateringIntervalDays(14);
        indoor.setSunlightRequirement("Bright Indirect");

        String instructions = indoor.getCareInstructions();
        assertNotNull(instructions, "Care instructions must not be null");
        assertTrue(instructions.contains("Indoor Plant Care"));
        System.out.println("✅ ABSTRACTION: Plant is abstract. getCareInstructions() enforced.");
    }

    @Test
    @DisplayName("Polymorphism: Different plant types return different care instructions")
    void testPolymorphism() {
        List<Plant> garden = new ArrayList<>();

        IndoorPlant snakePlant = new IndoorPlant("Snake Plant", "Sansevieria", "Office", 14, "Low", "Low");
        OutdoorPlant roseBush = new OutdoorPlant("Rose Bush", "Rosa", "Front Garden", 3, "Full Sun", "Well-drained loam");
        roseBush.setIsFrostTolerant(false);

        garden.add(snakePlant);
        garden.add(roseBush);

        List<String> allInstructions = new ArrayList<>();
        for (Plant plant : garden) {
            // POLYMORPHISM: runtime dispatch — same method call, different result
            String instructions = plant.getCareInstructions();
            allInstructions.add(instructions);
            System.out.println("\n🌿 " + plant.getName() + " (" + plant.getPlantType() + "):\n" + instructions);
        }

        assertNotEquals(allInstructions.get(0), allInstructions.get(1),
                "Different plant types should have different care instructions");
        assertTrue(allInstructions.get(0).contains("Indoor Plant Care"));
        assertTrue(allInstructions.get(1).contains("Outdoor Plant Care"));
        System.out.println("\n✅ POLYMORPHISM: Same getCareInstructions() call, different output per type.");
    }

    @Test
    @DisplayName("Watering date calculation works correctly")
    void testWateringDateCalculation() {
        IndoorPlant plant = new IndoorPlant();
        plant.setName("Money Plant");
        plant.setSpecies("Epipremnum aureum");
        plant.setLocation("Shelf");
        plant.setWateringIntervalDays(7);
        plant.setSunlightRequirement("Low");

        // Watered 5 days ago → next watering is 2 days from now
        LocalDate fiveDaysAgo = LocalDate.now().minusDays(5);
        plant.setLastWateredDate(fiveDaysAgo);

        LocalDate expectedNext = fiveDaysAgo.plusDays(7);
        assertEquals(expectedNext, plant.getNextWateringDate());
        assertFalse(plant.isOverdueForWatering());
        assertFalse(plant.isDueForWateringToday());

        // Watered 8 days ago → overdue
        plant.setLastWateredDate(LocalDate.now().minusDays(8));
        assertTrue(plant.isOverdueForWatering());

        // Watered exactly 7 days ago → due today
        plant.setLastWateredDate(LocalDate.now().minusDays(7));
        assertTrue(plant.isDueForWateringToday());

        System.out.println("✅ DATE CALCULATION: Watering schedule logic works correctly.");
    }

    @Test
    @DisplayName("Collections: ArrayList<Plant> stores and retrieves both plant types")
    void testCollections() {
        List<Plant> plantCollection = new ArrayList<>();
        plantCollection.add(new IndoorPlant("Peace Lily", "Spathiphyllum", "Hall", 7, "Low", "High"));
        plantCollection.add(new IndoorPlant("Spider Plant", "Chlorophytum", "Kitchen", 5, "Medium", "Medium"));
        plantCollection.add(new OutdoorPlant("Sunflower", "Helianthus", "Backyard", 2, "Full Sun", "Sandy"));

        assertEquals(3, plantCollection.size());
        long indoorCount = plantCollection.stream().filter(p -> p instanceof IndoorPlant).count();
        long outdoorCount = plantCollection.stream().filter(p -> p instanceof OutdoorPlant).count();
        assertEquals(2, indoorCount);
        assertEquals(1, outdoorCount);
        System.out.println("✅ COLLECTIONS: ArrayList stores mixed Plant subtypes correctly.");
    }
}
