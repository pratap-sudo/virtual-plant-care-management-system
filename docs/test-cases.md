# Test Cases & Verification Plan

This document records the unit, service, integration, and UI verification test cases for the **Virtual Plant Care Management System**.

---

## 1. Automated Java OOP Unit Tests (`OopDemonstrationTest.java`)

| Test ID | Test Name | Target Principle | Expected Outcome |
|---|---|---|---|
| **TC-OOP-01** | `testEncapsulation` | Encapsulation | Fields are private; values set via setters are accurately retrieved via getters without direct field mutation. |
| **TC-OOP-02** | `testInheritance` | Inheritance | `IndoorPlant` and `OutdoorPlant` pass `assertInstanceOf(Plant.class)`, proving correct parent-child relationship. |
| **TC-OOP-03** | `testAbstraction` | Abstraction | Abstract `getCareInstructions()` cannot be called on raw `Plant` without concrete subclass implementation. |
| **TC-OOP-04** | `testPolymorphism` | Polymorphism | Iterating over `List<Plant>` and executing `plant.getCareInstructions()` yields different, type-specific outputs dynamically. |
| **TC-OOP-05** | `testWateringDateCalculation` | Business Logic | Tests `getNextWateringDate()`, `isDueForWateringToday()`, and `isOverdueForWatering()` across various historical dates. |
| **TC-OOP-06** | `testCollections` | Collections Framework | Tests heterogeneous storage of `Plant` subtypes in `ArrayList<Plant>` and stream-based filtering. |
| **TC-OOP-07** | `testHealthAndExtendedCareSchedule` | Extended Domain Logic | Tests health ratings (`THRIVING`), photo URLs, fertilizing cycle math, and indoor repotting cycle thresholds. |

**Command to run**:
```powershell
cd backend
.\mvnw.cmd test -Dtest=OopDemonstrationTest
```

---

## 2. REST API Functional Test Cases

| Test ID | Endpoint | Method | Payload / Params | Expected Status | Validation Criteria |
|---|---|---|---|---|---|
| **TC-API-01** | `/api/plants` | GET | `?search=Snake` | `200 OK` | Array containing only plants matching search query. |
| **TC-API-02** | `/api/plants` | GET | `?type=INDOOR` | `200 OK` | Array containing only Indoor plant records. |
| **TC-API-03** | `/api/plants` | POST | Valid `PlantRequestDTO` | `201 Created` | Persisted entity returned with generated `id`, `careInstructions`, and `nextWateringDate`. |
| **TC-API-04** | `/api/plants` | POST | Invalid DTO (empty name) | `400 Bad Request` | Structured JSON containing `fieldErrors.name`. |
| **TC-API-05** | `/api/plants/{id}` | GET | Valid ID | `200 OK` | Correct plant entity. |
| **TC-API-06** | `/api/plants/{id}` | GET | Non-existent ID (e.g. 999999) | `404 Not Found` | JSON error body stating plant not found. |
| **TC-API-07** | `/api/plants/{id}/water` | POST | `{ "notes": "Thorough soak" }` | `200 OK` | `lastWateredDate` set to today; creates associated `care_activities` record. |
| **TC-API-08** | `/api/plants/{id}` | DELETE | Valid ID | `200 OK` | Plant and associated cascade activities removed. |
| **TC-API-09** | `/api/dashboard` | GET | None | `200 OK` | Statistical summary: `totalPlants`, `indoorPlants`, `dueToday`, `overdueWateringCount`. |
| **TC-API-10** | `/api/activities` | POST | Valid `CareActivityRequestDTO` | `201 Created` | Care entry logged and returned. |
| **TC-API-11** | `/api/plants/{id}/fertilize` | POST | `{ "notes": "Spring feed" }` | `200 OK` | `lastFertilizedDate` set to today; creates associated `care_activities` record. |
| **TC-API-12** | `/api/plants/{id}/repot` | POST | `{ "notes": "New 8-inch pot" }` | `200 OK` | `lastRepottedDate` set to today; creates associated `care_activities` record. |
| **TC-API-13** | `/api/plants/{id}/health` | PATCH | `{ "healthStatus": "THRIVING" }` | `200 OK` | Health updated and `GROWTH_MILESTONE` activity logged. |
| **TC-API-14** | `/api/plants/due-fertilizing` | GET | None | `200 OK` | Array of plants due or overdue for fertilizer. |
| **TC-API-15** | `/api/plants/due-repotting` | GET | None | `200 OK` | Array of indoor plants due for repotting. |

---

## 3. Frontend UI & Integration Verification

| Test ID | Component / Page | User Action | Expected UI Behavior |
|---|---|---|---|
| **TC-UI-01** | Dashboard | Load `/` | Displays metric cards (total, indoor, outdoor, due, overdue, fertilizing, repotting, health distribution) and local weather widget. |
| **TC-UI-02** | My Plants | Search input | Live filtering updates the plant card grid without page reload. |
| **TC-UI-03** | Plant Form | Submit with empty inputs | Shows field-level validation messages; prevents network dispatch. |
| **TC-UI-04** | Plant Form | Select Image Preset / Input URL | Displays instant live image preview and binds `imageUrl` to plant payload. |
| **TC-UI-05** | Plant Details | Click "Record Watering" / "Fertilize" / "Repot" | Sends respective API call, updates schedule badge, logs timeline record. |
| **TC-UI-06** | Plant Details | Update Health Rating | Changes status badge in real-time and logs a growth milestone entry. |
| **TC-UI-07** | Care Schedule | Toggle tabs (Watering / Fertilizing / Repotting) | Filters actionable reminders by category with one-click care actions. |
| **TC-UI-08** | Plant Guide | Click "Add to My Garden" | Pre-populates the new plant form with care specs and photo; user can save with one click. |
| **TC-UI-09** | Weather Advisory | Outdoor plants frost / rain alert | Displays contextual weather warnings (e.g. frost alert for non-frost-tolerant outdoor plants). |

