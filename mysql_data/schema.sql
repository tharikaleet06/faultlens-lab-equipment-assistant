-- ==========================================================
-- FaultLens - Laboratory Equipment Failure Prediction & Maintenance
-- Device-Specific Relational Database Schema
-- Compatible with MySQL 8.0+ / InnoDB
-- ==========================================================

DROP DATABASE IF EXISTS fault_lens;
CREATE DATABASE fault_lens CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fault_lens;

-- ----------------------------------------------------------
-- 1. Authentication & User Management
-- ----------------------------------------------------------
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    badge_id VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'TECHNICIAN',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 2. Device Types, Models, and Sensor Taxonomy
-- ----------------------------------------------------------
CREATE TABLE device_types (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE device_models (
    id VARCHAR(50) PRIMARY KEY,
    device_type_code VARCHAR(50) NOT NULL,
    model_name VARCHAR(150) NOT NULL,
    manufacturer VARCHAR(150) NOT NULL,
    FOREIGN KEY (device_type_code) REFERENCES device_types(code) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE device_sensors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_type_code VARCHAR(50) NOT NULL,
    sensor_code VARCHAR(50) NOT NULL,
    sensor_name VARCHAR(150) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    description VARCHAR(255),
    UNIQUE KEY uk_device_sensor (device_type_code, sensor_code),
    FOREIGN KEY (device_type_code) REFERENCES device_types(code) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 3. Laboratory Equipment Master Profile
-- ----------------------------------------------------------
CREATE TABLE equipment (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    device_type_code VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(150) NOT NULL,
    model VARCHAR(150) NOT NULL,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    location_building VARCHAR(100) NOT NULL,
    lab_room VARCHAR(50) NOT NULL,
    installation_date DATE NOT NULL,
    age_years DECIMAL(4, 2) NOT NULL,
    operating_hours INT UNSIGNED NOT NULL DEFAULT 0,
    health_score INT NOT NULL DEFAULT 100,
    failure_risk ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'LOW',
    criticality ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW') NOT NULL DEFAULT 'MEDIUM',
    original_cost_usd DECIMAL(10, 2) NOT NULL DEFAULT 10000.00,
    cumulative_repair_cost_usd DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    recommendation ENUM('MONITOR', 'REPAIR', 'REPAIR WITH CAUTION', 'REPLACE COMPONENT', 'REPLACE EQUIPMENT') NOT NULL DEFAULT 'MONITOR',
    priority_score INT NOT NULL DEFAULT 10,
    predicted_issue TEXT,
    confidence_score DECIMAL(5, 2) DEFAULT 90.00,
    remaining_useful_life_hours INT DEFAULT 500,
    active_error_code VARCHAR(20) DEFAULT NULL,
    last_maintenance_date DATE,
    next_scheduled_maintenance DATE,
    is_operational BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (device_type_code) REFERENCES device_types(code) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 4. Device-Specific & Model Template Threshold Configurations
-- ----------------------------------------------------------
CREATE TABLE equipment_thresholds (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_type_code VARCHAR(50) NOT NULL,
    model_id VARCHAR(50) NULL,
    equipment_id VARCHAR(50) NULL,
    sensor_code VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    normal_min DECIMAL(8, 2) NOT NULL,
    normal_max DECIMAL(8, 2) NOT NULL,
    warning_min DECIMAL(8, 2) NOT NULL,
    warning_max DECIMAL(8, 2) NOT NULL,
    critical_min DECIMAL(8, 2) NOT NULL,
    critical_max DECIMAL(8, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_type_code) REFERENCES device_types(code) ON DELETE CASCADE,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 5. Time-Series Sensor Telemetry
-- ----------------------------------------------------------
CREATE TABLE sensor_telemetry (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    equipment_id VARCHAR(50) NOT NULL,
    sensor_code VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL,
    sensor_value DECIMAL(10, 3) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    status ENUM('NORMAL', 'WARNING', 'CRITICAL') NOT NULL DEFAULT 'NORMAL',
    anomaly_detected BOOLEAN DEFAULT FALSE,
    anomaly_score DECIMAL(5, 4) DEFAULT 0.0000,
    anomaly_reason VARCHAR(255) DEFAULT NULL,
    INDEX idx_eq_sensor_time (equipment_id, sensor_code, timestamp),
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 6. Standard Error Codes & Diagnostic Catalog
-- ----------------------------------------------------------
CREATE TABLE error_codes (
    code VARCHAR(20) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    severity ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL') NOT NULL,
    symptom TEXT NOT NULL,
    possible_causes JSON NOT NULL,
    recommended_checks JSON NOT NULL,
    resolution_steps JSON NOT NULL,
    manual_section VARCHAR(200) NOT NULL
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 7. Historical Maintenance Records
-- ----------------------------------------------------------
CREATE TABLE maintenance_records (
    id VARCHAR(50) PRIMARY KEY,
    equipment_id VARCHAR(50) NOT NULL,
    maintenance_date DATE NOT NULL,
    type ENUM('PREVENTIVE', 'CORRECTIVE', 'CALIBRATION', 'PART_REPLACEMENT') NOT NULL,
    technician_id BIGINT,
    technician_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    parts_replaced JSON,
    downtime_hours DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    cost_estimate_usd DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 8. Spare Parts Inventory
-- ----------------------------------------------------------
CREATE TABLE spare_parts (
    part_number VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    stock_qty INT NOT NULL DEFAULT 0,
    min_required_qty INT NOT NULL DEFAULT 2,
    location_bin VARCHAR(50) NOT NULL,
    unit_cost_usd DECIMAL(10, 2) NOT NULL,
    lead_time_days INT NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 9. Predictive Maintenance Tickets
-- ----------------------------------------------------------
CREATE TABLE maintenance_tickets (
    id VARCHAR(50) PRIMARY KEY,
    equipment_id VARCHAR(50) NOT NULL,
    equipment_name VARCHAR(200) NOT NULL,
    title VARCHAR(255) NOT NULL,
    priority ENUM('P1 - CRITICAL', 'P2 - HIGH', 'P3 - MEDIUM', 'P4 - LOW') NOT NULL,
    status ENUM('OPEN', 'SCHEDULED', 'IN_PROGRESS', 'RESOLVED') NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_date DATETIME,
    problem_description TEXT NOT NULL,
    suggested_spare_parts JSON,
    recommended_actions JSON,
    assigned_technician_name VARCHAR(150),
    generated_by_ai BOOLEAN DEFAULT TRUE,
    resolution_notes TEXT,
    resolved_at DATETIME,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 11. Role-Aware Notifications Table
-- ----------------------------------------------------------
CREATE TABLE notifications (
    id VARCHAR(50) PRIMARY KEY,
    recipient_user_id BIGINT NULL,
    recipient_username VARCHAR(100) NULL,
    recipient_role VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_equipment_id VARCHAR(50) NULL,
    related_ticket_id VARCHAR(50) NULL,
    severity ENUM('INFO', 'WARNING', 'CRITICAL') NOT NULL DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME NULL,
    FOREIGN KEY (related_equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
) ENGINE=InnoDB;

