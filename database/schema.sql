-- ============================================================
-- Virtual Plant Care Management System
-- Supabase PostgreSQL Schema
-- ============================================================
-- Run this in Supabase SQL Editor to initialize the database.
-- After running this, set spring.jpa.hibernate.ddl-auto=validate
-- to prevent accidental schema changes.
-- ============================================================

-- Base plants table (JOINED inheritance strategy)
CREATE TABLE IF NOT EXISTS plants (
    id                    BIGSERIAL PRIMARY KEY,
    plant_type            VARCHAR(20)  NOT NULL CHECK (plant_type IN ('INDOOR', 'OUTDOOR')),
    name                  VARCHAR(255) NOT NULL,
    species               VARCHAR(255) NOT NULL,
    location              VARCHAR(255) NOT NULL,
    watering_interval_days INTEGER     NOT NULL CHECK (watering_interval_days >= 1),
    last_watered_date     DATE,
    sunlight_requirement  VARCHAR(100) NOT NULL,
    general_notes         TEXT,
    created_at            TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Indoor plants table (extends plants)
CREATE TABLE IF NOT EXISTS indoor_plants (
    id                        BIGINT PRIMARY KEY REFERENCES plants(id) ON DELETE CASCADE,
    humidity_preference       VARCHAR(50),
    pot_size                  VARCHAR(50),
    repotting_interval_months INTEGER
);

-- Outdoor plants table (extends plants)
CREATE TABLE IF NOT EXISTS outdoor_plants (
    id                    BIGINT PRIMARY KEY REFERENCES plants(id) ON DELETE CASCADE,
    hardiness_zone        VARCHAR(50),
    is_frost_tolerant     BOOLEAN,
    soil_type_preference  VARCHAR(100),
    pruning_season        VARCHAR(255)
);

-- Care activities table
CREATE TABLE IF NOT EXISTS care_activities (
    id            BIGSERIAL PRIMARY KEY,
    plant_id      BIGINT       NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
    activity_type VARCHAR(50)  NOT NULL CHECK (activity_type IN ('WATERING', 'FERTILIZING', 'PRUNING', 'REPOTTING', 'OTHER')),
    activity_date DATE         NOT NULL DEFAULT CURRENT_DATE,
    notes         TEXT,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_plants_plant_type ON plants(plant_type);
CREATE INDEX IF NOT EXISTS idx_plants_name ON plants(name);
CREATE INDEX IF NOT EXISTS idx_care_activities_plant_id ON care_activities(plant_id);
CREATE INDEX IF NOT EXISTS idx_care_activities_activity_type ON care_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_care_activities_date ON care_activities(activity_date DESC);

-- ============================================================
-- Trigger: auto-update updated_at on plants row change
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_plants_updated_at ON plants;
CREATE TRIGGER set_plants_updated_at
    BEFORE UPDATE ON plants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Sample data (optional — uncomment to insert test plants)
-- ============================================================
-- INSERT INTO plants (plant_type, name, species, location, watering_interval_days, last_watered_date, sunlight_requirement, general_notes)
-- VALUES ('INDOOR', 'Money Plant', 'Epipremnum aureum', 'Living Room', 7, CURRENT_DATE - INTERVAL '3 days', 'Low to Bright Indirect', 'Very hardy beginner plant');
--
-- INSERT INTO indoor_plants (id, humidity_preference, pot_size) VALUES (lastval(), 'Medium', 'Medium');
--
-- INSERT INTO plants (plant_type, name, species, location, watering_interval_days, last_watered_date, sunlight_requirement)
-- VALUES ('INDOOR', 'Snake Plant', 'Dracaena trifasciata', 'Bedroom', 14, CURRENT_DATE - INTERVAL '10 days', 'Low');
--
-- INSERT INTO indoor_plants (id, humidity_preference, pot_size) VALUES (lastval(), 'Low', 'Small');

