# 🌿 Virtual Plant Care Management System

A complete full-stack college OOP project built with **Java Spring Boot** (backend) and **React + Vite** (frontend), using **Supabase PostgreSQL** as the cloud database.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [Quick Start](#quick-start)
5. [Supabase Setup](#supabase-setup)
6. [Running the Application](#running-the-application)
7. [Environment Variables](#environment-variables)
8. [Project Structure](#project-structure)
9. [OOP Concepts Implemented](#oop-concepts-implemented)
10. [API Endpoints](#api-endpoints)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

This system helps users manage their plant collection digitally. Users can:
- Add, edit, and delete plants (Indoor and Outdoor)
- Record watering and fertilizer activities
- View care schedules — overdue and due-today plants
- View care history
- Read a plant guide with common houseplant profiles

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, Axios |
| Backend | Java 21+, Spring Boot 3.4, Spring Web, Spring Data JPA, Hibernate |
| Database | Supabase PostgreSQL (cloud) |
| Build | Maven Wrapper (no system Maven needed) |

---

## Prerequisites

Install these on every computer you use:

| Tool | Required Version | Download |
|------|-----------------|---------|
| Java JDK | 21 or higher | https://adoptium.net/ |
| Node.js | 18 or higher | https://nodejs.org/ |
| Git | Any recent version | https://git-scm.com/ |

> **Note:** Maven is **not** required — the Maven Wrapper (`mvnw.cmd`) downloads it automatically.

### Verify Installation (PowerShell)

```powershell
java -version
node --version
npm --version
git --version
```

---

## Quick Start

### Step 1 — Clone or copy the project

```powershell
git clone <your-repo-url>
cd "virtual plant care mangement system"
```

### Step 2 — Set up environment variables (see Supabase Setup below first)

```powershell
# In the backend directory, set these in PowerShell before starting:
$env:DB_URL = "jdbc:postgresql://YOUR_HOST:5432/postgres"
$env:DB_USERNAME = "postgres.YOUR_PROJECT_REF"
$env:DB_PASSWORD = "YOUR_PASSWORD"
```

### Step 3 — Start the backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### Step 4 — Start the frontend (new PowerShell window)

```powershell
cd frontend
npm install
npm run dev
```

### Step 5 — Open the application

Visit: **http://localhost:5173**

---

## Supabase Setup

### 1. Create a Supabase account and project

1. Go to https://supabase.com
2. Sign up with your email (free plan is sufficient)
3. Click **New Project**
4. Choose a name (e.g., `virtual-plant-care`) and set a strong database password
5. Choose the nearest region
6. Wait ~2 minutes for the project to initialize

### 2. Get your connection details

1. In your Supabase project, go to **Settings → Database**
2. Scroll to **Connection string** → choose **JDBC**
3. Copy the connection string. It looks like:
   ```
   jdbc:postgresql://db.XXXXXXXXXXXX.supabase.co:5432/postgres
   ```
4. Your username is: `postgres.YOUR_PROJECT_REF` (shown on the same page)
5. Your password is what you set when creating the project

### 3. Run the schema

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Open `database/schema.sql` from this project
4. Paste the entire contents into the SQL editor
5. Click **Run**
6. You should see: `Success. No rows returned`

### 4. Configure the connection string

Supabase may block direct port 5432 connections on some college networks.

**If port 5432 is blocked**, use the **Session pooler** connection instead:
- Go to **Settings → Database → Connection pooling**
- Under **Session mode**, copy the connection string (port 5432 via pooler)
- Use this URL in your `DB_URL` environment variable

**If that is also blocked**, use the **Transaction pooler** (port 6543):
- Same page, switch to **Transaction mode**, port 6543
- Note: Transaction pooler does not support all JPA features; use it only as a last resort

---

## Running the Application

### Backend (Spring Boot)

Open a PowerShell window in the `backend` directory:

```powershell
# Set environment variables (required every new PowerShell session)
$env:DB_URL = "jdbc:postgresql://db.XXXX.supabase.co:5432/postgres"
$env:DB_USERNAME = "postgres.XXXX"
$env:DB_PASSWORD = "your_password_here"

# Start the backend
.\mvnw.cmd spring-boot:run
```

The backend will start on **http://localhost:8080**

First run will download Maven (~10 MB) and all dependencies (~150 MB). Subsequent runs are fast.

### Frontend (React)

Open a **second** PowerShell window in the `frontend` directory:

```powershell
npm install      # Only needed once, or after pulling changes
npm run dev
```

The frontend will start on **http://localhost:5173**

### Run OOP Tests (without database)

```powershell
cd backend
.\mvnw.cmd test -Dtest=OopDemonstrationTest -DfailIfNoTests=false
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_URL` | JDBC connection string to Supabase | `jdbc:postgresql://db.xxx.supabase.co:5432/postgres` |
| `DB_USERNAME` | Supabase database username | `postgres.abcdefghijk` |
| `DB_PASSWORD` | Supabase database password | `your_secure_password` |

**Never commit these values to Git.** Only the `.env.example` placeholder file is committed.

---

## Project Structure

```
VirtualPlantCare/
├── frontend/                      # React + Vite app
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page-level components
│   │   ├── services/api.js        # All API calls (Axios)
│   │   └── hooks/usePlants.js     # Custom React hooks
│   ├── vite.config.js             # Vite + API proxy config
│   └── package.json
│
├── backend/                       # Spring Boot + Maven
│   ├── src/main/java/com/plantcare/
│   │   ├── model/                 # Plant (abstract), IndoorPlant, OutdoorPlant, CareActivity
│   │   ├── dto/                   # Request/Response DTOs
│   │   ├── controller/            # REST controllers
│   │   ├── service/               # Business logic
│   │   ├── repository/            # Spring Data JPA
│   │   ├── exception/             # Error handling
│   │   └── config/                # CORS configuration
│   ├── src/main/resources/
│   │   └── application.properties # Spring configuration
│   ├── src/test/                  # OOP demonstration tests
│   ├── pom.xml                    # Maven dependencies
│   └── mvnw.cmd                   # Maven wrapper (Windows)
│
├── database/
│   └── schema.sql                 # Supabase schema initialization
│
├── .gitignore
├── .env.example                   # Environment variable template
└── README.md
```

---

## OOP Concepts Implemented

| Concept | Where |
|---------|-------|
| **Encapsulation** | `Plant.java` — all fields private, accessed via getters/setters |
| **Inheritance** | `IndoorPlant extends Plant`, `OutdoorPlant extends Plant` |
| **Abstraction** | `Plant` is abstract; `getCareInstructions()` is abstract |
| **Polymorphism** | `PlantService.mapEntityToDto()` — calls `plant.getCareInstructions()` on `Plant` reference, dispatched to correct subtype at runtime |
| **Constructors / super()** | `IndoorPlant(String name, ...)` calls `super(name, ...)` |
| **Method Overriding** | Both subclasses `@Override getCareInstructions()` |
| **Collections** | `List<Plant>`, `ArrayList`, Java Streams |
| **Exception Handling** | `PlantNotFoundException`, `GlobalExceptionHandler` |
| **Interfaces** | `JpaRepository`, Spring component annotations |

**JPA Inheritance Strategy:** `JOINED` — shared columns in `plants` table, type-specific columns in `indoor_plants` and `outdoor_plants` tables. Chosen because it is normalized, has no null columns, and each type is independently queryable.

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/plants` | All plants (supports `?search=` and `?type=`) |
| GET | `/api/plants/{id}` | Single plant by ID |
| POST | `/api/plants` | Create plant |
| PUT | `/api/plants/{id}` | Update plant |
| DELETE | `/api/plants/{id}` | Delete plant |
| POST | `/api/plants/{id}/water` | Record watering |
| GET | `/api/plants/due-today` | Plants due for watering today |
| GET | `/api/plants/overdue` | Overdue plants |
| GET | `/api/dashboard` | Dashboard statistics |
| GET | `/api/activities` | All care activities |
| POST | `/api/activities` | Record care activity |
| GET | `/api/activities/plant/{id}` | Activities for one plant |

---

## Troubleshooting

### Java not found / JAVA_HOME error

```powershell
# Find Java installation
where java
# Set JAVA_HOME (example path — adjust to your installation)
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.5.11-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

### npm install fails

```powershell
# Clear npm cache
npm cache clean --force
# Retry
npm install
```

### CORS error in browser

Make sure the Spring Boot backend is running on port 8080 **before** opening the React app. The Vite dev server proxies `/api` to `localhost:8080`.

### Database connection refused

1. Check that your `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` are set correctly in your PowerShell session.
2. Verify your Supabase project is active (not paused — free tier pauses after 1 week of inactivity).
3. Try the Session Pooler URL from Supabase → Settings → Database → Connection pooling.
4. If on college WiFi, port 5432 may be blocked — try the Transaction Pooler on port 6543.

### Backend starts but shows "Supabase project is paused"

Go to https://supabase.com, log in, and click **Resume Project** on your project dashboard.

### mvnw.cmd: Permission denied

```powershell
# The wrapper script sometimes needs the .cmd extension explicitly
.\mvnw.cmd spring-boot:run
# NOT: mvnw spring-boot:run (without .cmd)
```

"# virtual-plant-care-management-system" 
