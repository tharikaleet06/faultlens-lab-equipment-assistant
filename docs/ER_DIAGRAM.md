# 🗄️ FaultLens — Entity Relationship (ER) Diagram & Schema Documentation

The **FaultLens** database (`faultlens_db` / `fault_lens`) is implemented on **MySQL 8.0** with normalized tables, primary keys, foreign key relationships, and indexes.

---

## 📐 ER Diagram (Mermaid Topology)

```mermaid
erDiagram
    USERS ||--o{ EQUIPMENT : "manages/assigned"
    EQUIPMENT ||--o{ SENSOR_TELEMETRY : "generates"
    EQUIPMENT ||--o{ MAINTENANCE_TICKETS : "has"
    MAINTENANCE_TICKETS ||--o{ SPARE_PARTS : "requires"
    EQUIPMENT ||--o{ REPLACEMENT_RECORDS : "audits"

    USERS {
        bigint id PK
        varchar email UK
        varchar username UK
        varchar password_hash
        varchar full_name
        enum role "ADMIN, TECHNICIAN"
        datetime created_at
    }

    EQUIPMENT {
        varchar id PK "e.g., EQ-3D-01"
        varchar name
        varchar device_type_code
        varchar manufacturer
        varchar model
        varchar lab_room
        int health_score "0 to 100"
        int priority_score "10 to 99"
        varchar failure_risk "CRITICAL, HIGH, MEDIUM, LOW"
        varchar active_error_code "e.g., E45, E12, E77"
        varchar recommendation "MONITOR, REPAIR, REPLACE"
        decimal original_cost_usd
        decimal cumulative_repair_cost_usd
        int operating_hours
        datetime created_at
    }

    SENSOR_TELEMETRY {
        bigint id PK
        varchar equipment_id FK
        float temperature_celsius
        float vibration_rms
        float voltage_volts
        float current_amps
        datetime timestamp
    }

    MAINTENANCE_TICKETS {
        varchar id PK "e.g., TKT-1051"
        varchar equipment_id FK
        varchar title
        varchar priority "P1_CRITICAL, P2_HIGH, P3_MEDIUM"
        varchar status "OPEN, IN_PROGRESS, RESOLVED"
        text problem_description
        text repair_log
        boolean ai_verified
        datetime created_at
        datetime resolved_at
    }

    SPARE_PARTS {
        varchar part_number PK "e.g., CLN-GLY-44"
        varchar name
        varchar category
        int quantity_in_stock
        decimal unit_cost_usd
        varchar compatible_device_code
    }

    REPLACEMENT_RECORDS {
        varchar id PK "e.g., REP-2026-001"
        varchar equipment_id FK
        varchar equipment_name
        varchar retired_oem_brand
        varchar recommended_oem_brand
        decimal acquisition_cost_usd
        decimal cumulative_repair_cost_usd
        int cost_ratio_pct
        text replacement_reason
        varchar status "RECOMMENDED_FOR_REPLACEMENT, REPLACED"
        decimal projected_five_year_savings_usd
        varchar logged_by
        date date_logged
    }
```

---

## 🗃️ Database Table Definitions

### 1. `users`
* Primary User Store with Role-Based Access Control (`ADMIN` vs `TECHNICIAN`).

### 2. `equipment`
* Central asset register tracking health score, active error code, failure risk classification, and cumulative repair cost ratio.

### 3. `sensor_telemetry`
* High-frequency time-series buffer storing temperature, vibration, voltage, and current streams.

### 4. `maintenance_tickets`
* Work orders lifecycle tracking ticket status (`OPEN` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED`) and AI post-repair verification flags.

### 5. `spare_parts`
* Laboratory consumable and replacement parts inventory with unit costs and stock levels.

### 6. `replacement_records`
* Financial audit ledger tracking retired equipment, recommended OEM models, cost ratios, and projected 5-year TCO savings.
