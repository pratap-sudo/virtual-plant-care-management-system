# Object-Oriented Programming (OOP) Concepts in Action

This document details how fundamental and advanced Object-Oriented Programming principles are applied in the **Virtual Plant Care Management System**.

---

## 1. Encapsulation

### Concept
Encapsulation binds data with the methods that manipulate that data, hiding the internal state of objects from arbitrary external tampering and enforcing valid transitions.

### Implementation in Code
- **Class**: `com.plantcare.model.Plant`, `IndoorPlant`, `OutdoorPlant`, and `CareActivity`
- **Mechanism**:
  - All attributes (`id`, `name`, `wateringIntervalDays`, `lastWateredDate`, etc.) are declared `private`.
  - Field access is mediated by controlled getters and setters (facilitated by Lombok `@Getter` and `@Setter`).
  - Business methods such as `isOverdueForWatering()` and `getNextWateringDate()` operate directly on internal state:
  ```java
  public LocalDate getNextWateringDate() {
      if (lastWateredDate == null) {
          return LocalDate.now();
      }
      return lastWateredDate.plusDays(wateringIntervalDays);
  }
  ```
  - Input validation is enforced with Bean Validation annotations (`@NotBlank`, `@Min`, `@NotNull`) ensuring invalid data cannot enter entity instances.

---

## 2. Abstraction

### Concept
Abstraction hides complex implementation details and exposes only essential features through clear interfaces or abstract base classes.

### Implementation in Code
- **Class**: `public abstract class Plant`
- **Abstract Method**: `public abstract String getCareInstructions();`
- **Mechanism**:
  - The `Plant` class cannot be directly instantiated (`new Plant()` is illegal).
  - Common attributes and schedule logic (`getNextWateringDate()`, `isDueForWateringToday()`) live in `Plant`.
  - Because care requirements vary fundamentally between indoor and outdoor specimens, `getCareInstructions()` has no universal implementation at the base level and is declared `abstract`.

---

## 3. Inheritance

### Concept
Inheritance enables code reuse and relationship modeling where specialized classes inherit properties and behaviors from a general base class.

### Implementation in Code
- **Subclasses**:
  - `public class IndoorPlant extends Plant`
  - `public class OutdoorPlant extends Plant`
- **Mechanism**:
  - `IndoorPlant` inherits all base fields (`name`, `species`, `wateringIntervalDays`, etc.) and adds indoor-specific state (`humidityPreference`, `potSize`, `repottingIntervalMonths`).
  - `OutdoorPlant` inherits the same base fields and adds outdoor attributes (`hardinessZone`, `isFrostTolerant`, `soilTypePreference`, `pruningSeasonNote`).
  - Subclass constructors invoke `super(...)` to delegate common state initialization to the parent class:
  ```java
  public IndoorPlant(String name, String species, String location,
                     Integer wateringIntervalDays, String sunlightRequirement,
                     String humidityPreference) {
      super(name, species, location, wateringIntervalDays, sunlightRequirement);
      this.humidityPreference = humidityPreference;
  }
  ```

### JPA Inheritance Strategy: `JOINED`
- Chosen over `SINGLE_TABLE` and `TABLE_PER_CLASS` because:
  1. High normalization: Base attributes live in `plants`; specialized attributes reside strictly in `indoor_plants` and `outdoor_plants`.
  2. No wasted `NULL` columns in the database for non-applicable fields.
  3. Supports referential integrity and polymorphic SQL queries cleanly.

---

## 4. Polymorphism

### Concept
Polymorphism allows objects of different classes to be treated through a uniform interface while executing subclass-specific behavior at runtime (dynamic method dispatch).

### Implementation in Code
- **Method Overriding**:
  - `IndoorPlant.java`: Overrides `getCareInstructions()` to generate indoor-tailored advice (misting, draft avoidance, pot sizing).
  - `OutdoorPlant.java`: Overrides `getCareInstructions()` to deliver outdoor-tailored advice (soil drainage, mulching, seasonal pruning, frost precautions).
- **Runtime Polymorphic Dispatch**:
  In `PlantService.java`:
  ```java
  public PlantResponseDTO mapEntityToDto(Plant plant) {
      ...
      // Polymorphic invocation: Dispatches to IndoorPlant or OutdoorPlant implementation
      dto.setCareInstructions(plant.getCareInstructions());
      ...
  }
  ```
  The compiler only knows `plant` is of type `Plant`, but at runtime the JVM executes the appropriate override based on the concrete instance.

---

## 5. Summary Matrix for College Viva

| OOP Principle | Java Class / Interface | Method / Attribute Demonstration |
|---|---|---|
| **Encapsulation** | `Plant.java`, `CareActivity.java` | Private fields, `getNextWateringDate()`, Bean Validation |
| **Abstraction** | `Plant.java` | `abstract class Plant`, `abstract String getCareInstructions()` |
| **Inheritance** | `IndoorPlant.java`, `OutdoorPlant.java` | `extends Plant`, constructor `super(...)` invocation |
| **Polymorphism** | `IndoorPlant`, `OutdoorPlant`, `PlantService` | `@Override getCareInstructions()`, dynamic dispatch in `mapEntityToDto` |
| **Collections** | `PlantService`, `OopDemonstrationTest` | `List<Plant>`, `ArrayList<Plant>`, Stream API filtering |
| **Exception Handling** | `PlantNotFoundException`, `GlobalExceptionHandler` | Custom unchecked exception, `@RestControllerAdvice` handling |
| **Separation of Concerns** | Layered Package Structure | Model ↔ DTO ↔ Repository ↔ Service ↔ Controller |

