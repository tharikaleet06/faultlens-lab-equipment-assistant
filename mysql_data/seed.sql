-- ==========================================================
-- FaultLens - Laboratory Equipment Failure Prediction & Maintenance
-- Device-Specific Relational Seed Data
-- ==========================================================

USE fault_lens;

-- ----------------------------------------------------------
-- 1. Seed Roles & Users
-- ----------------------------------------------------------
INSERT INTO roles (id, name, description) VALUES
(1, 'ADMIN', 'Manage users, equipment, threshold configurations, and system settings.'),
(2, 'TECHNICIAN', 'Perform maintenance, update tickets, and record repairs and component replacements.');

INSERT INTO users (id, username, email, password_hash, full_name, badge_id, department, role, is_active) VALUES
(1, 'admin', 'admin@faultlens.lab', '$2b$10$YGf2rekMhuBt2/v1hiKV8eyaVCcbS40H3K7NSyRWCWCDmCQgZAxZq', 'Dr. Arthur Sterling', 'ADM-0001', 'Lab Operations & IT Systems', 'ADMIN', TRUE),
(2, 'technician', 'technician@faultlens.lab', '$2b$10$iNCX8lU5m2IlpqFo/hgMheJeudr3FC6OByCCceGIOJZFALBT48yBS', 'Dr. Elena Rostova', 'TECH-4109', 'Additive Manufacturing Lab', 'TECHNICIAN', TRUE);

-- ----------------------------------------------------------
-- 2. Seed Device Types, Models & Sensor Taxonomy
-- ----------------------------------------------------------
INSERT INTO device_types (code, name, description) VALUES
('3D_PRINTER', 'Industrial 3D Printer', 'Stereolithography and additive fabrication systems'),
('CNC_MACHINE', 'CNC Machining Center', 'High-speed computer numerical control milling and turning centers'),
('CENTRIFUGE', 'Ultracentrifuge', 'High-speed biological and chemical separation rotors'),
('OSCILLOSCOPE', 'Precision Oscilloscope', 'Multi-channel high-bandwidth signal analysis oscilloscopes'),
('LAB_SERVER', 'AI Compute Server', 'High-performance laboratory GPU compute node and database server'),
('HPLC', 'High-Performance Liquid Chromatograph', 'Analytical liquid chromatography systems'),
('ELECTRON_MICROSCOPE', 'Scanning Electron Microscope', 'Field emission scanning electron beam imaging systems'),
('NETWORK_SWITCH', 'Lab Core Network Switch', 'High-throughput laboratory data network switches');

INSERT INTO device_sensors (device_type_code, sensor_code, sensor_name, unit, description) VALUES
-- 3D Printer Sensors
('3D_PRINTER', 'CHILLER_DELTA', 'Cooling Radiator Temp Delta', '°C', 'Temperature difference across laser chiller heat exchanger'),
('3D_PRINTER', 'BED_TEMP', 'Print Bed Temperature', '°C', 'Thermal plate operating temperature'),
('3D_PRINTER', 'FAN_RPM', 'Auxiliary Fan Tachometer', 'RPM', 'Cooling fan rotational speed'),
('3D_PRINTER', 'VIB', 'Galvo Assembly Vibration', 'mm/s', 'Optical scanner head vibration'),

-- CNC Machine Sensors
('CNC_MACHINE', 'SPINDLE_RPM', 'Spindle Rotational Speed', 'RPM', 'Drive motor rotational frequency'),
('CNC_MACHINE', 'VIB', 'Spindle Radial Vibration', 'mm/s', 'RMS harmonic vibration amplitude'),
('CNC_MACHINE', 'COOLANT_FLOW', 'Coolant Flow Rate', 'L/min', 'Cutting fluid delivery rate'),
('CNC_MACHINE', 'TEMP', 'Motor Bearing Temperature', '°C', 'Spindle motor housing temperature'),

-- Ultracentrifuge Sensors
('CENTRIFUGE', 'RPM', 'Rotor Rotational Speed', 'RPM', 'Rotor spin speed (up to 100,000 RPM)'),
('CENTRIFUGE', 'TEMP', 'Chamber Temperature', '°C', 'Internal rotor chamber temperature'),
('CENTRIFUGE', 'VIB', 'Rotor Imbalance Vibration', 'mm/s', 'Gyroscopic imbalance signal'),
('CENTRIFUGE', 'VAC', 'Chamber Vacuum Pressure', 'mTorr', 'Diffusion pump vacuum level'),

-- Oscilloscope Sensors
('OSCILLOSCOPE', 'DC_RIPPLE', '48V DC Bus Ripple', 'mV', 'Power stage AC ripple voltage'),
('OSCILLOSCOPE', 'VOLTAGE', 'Supply Rail Voltage', 'V', 'Input AC/DC power supply rail'),
('OSCILLOSCOPE', 'TEMP', 'ADC Board Temperature', '°C', 'Digitizer thermal dissipation'),

-- Lab Server Sensors
('LAB_SERVER', 'CPU_UTIL', 'CPU Utilization', '%', 'Processor compute utilization percentage'),
('LAB_SERVER', 'MEM_UTIL', 'Memory Utilization', '%', 'System RAM utilization percentage'),
('LAB_SERVER', 'FAN_RPM', 'Chassis Fan Tachometer', 'RPM', 'Server enclosure cooling fan speed'),
('LAB_SERVER', 'CHASSIS_TEMP', 'Chassis Thermal Sensor', '°C', 'Motherboard ambient temperature'),

-- HPLC Sensors
('HPLC', 'PRESSURE_PULSE', 'Pump Pressure Pulsation', 'bar', 'Quaternary pump fluid pressure ripple'),
('HPLC', 'FLOW_RATE', 'Mobile Phase Flow Rate', 'mL/min', 'Solvent delivery rate'),
('HPLC', 'TEMP', 'Column Oven Temperature', '°C', 'Chromatography column enclosure temperature'),

-- Electron Microscope Sensors
('ELECTRON_MICROSCOPE', 'TURBOPUMP_VIB', 'Turbopump Bearing Vibration', 'mm/s', 'Magnetic levitation turbopump vibration'),
('ELECTRON_MICROSCOPE', 'VACUUM_PRESS', 'Column Vacuum Pressure', 'Pa', 'Electron gun chamber vacuum'),
('ELECTRON_MICROSCOPE', 'CHAMBER_TEMP', 'Column Thermal Sensor', '°C', 'EM column temperature'),

-- Network Switch Sensors
('NETWORK_SWITCH', 'ASIC_TEMP', 'Network ASIC Temperature', '°C', 'Switch fabric core temperature'),
('NETWORK_SWITCH', 'PACKET_DROP', 'Buffer Packet Drop Rate', '%', 'Port buffer drop percentage'),
('NETWORK_SWITCH', 'FAN_RPM', 'Power Supply Fan Speed', 'RPM', 'PSU fan speed');

-- ----------------------------------------------------------
-- 3. Seed Error Codes
-- ----------------------------------------------------------
INSERT INTO error_codes (code, title, severity, symptom, possible_causes, recommended_checks, resolution_steps, manual_section) VALUES
('E45', 'Cooling Loop Heat Exchanger Delta Exceeded', 'CRITICAL', 
 'Thermal throttling detected; temperature delta across internal cooling radiator exceeds 18.5°C under nominal load.',
 '["Debris clogging heat sink fins or micro-channels", "Coolant cavitation or low level in reservoir", "PWM auxiliary fan bearing degradation or RPM stall", "Thermal interface paste dry-out on laser/spindle"]',
 '["Inspect liquid coolant reservoir sight glass (>75% required)", "Check secondary heat sink intake manifold with IR thermometer", "Verify auxiliary fan tachometer RPM in diagnostics (>2800 RPM)", "Inspect coolant return hose for kinks, bubbles, or sediment"]',
 '["Power down and engage lockout-tagout (LOTO) for 15 minutes.", "Flush closed-loop coolant with ASTM Type 1 deionized lab-grade glycol (Part #CLN-GLY-44).", "Clean radiator fins using 30 PSI dry nitrogen.", "Re-seat thermal pad with silver TIM (Part #TIM-772).", "Re-execute automated thermal calibration cycle."]',
 'Section 8.4: Closed-Loop Thermal Subsystem & Chiller Diagnostics'),

('E12', 'Spindle Bearing Radial Vibration Harmonic Anomaly', 'ERROR',
 'Harmonic vibration amplitude > 4.8 mm/s at 12,000 RPM spindle operational frequency.',
 '["Spindle ceramic hybrid bearing raceway fatigue", "Collet chuck eccentricity or unbalance tooling assembly", "Belt tension looseness or harmonic resonance in motor coupling"]',
 '["Conduct dial indicator runout test on spindle taper (tolerance < 0.003 mm)", "Analyze accelerometer FFT spectrum for 2X harmonic peaks", "Inspect drive belt teeth and measure tension with acoustic meter"]',
 '["Clean toolholder taper using solvent degreaser.", "Inspect pre-load spring washer stack on spindle bearing cartridge.", "If vibration persists > 3.5 mm/s, replace high-speed spindle bearing cartridge (Part #SPN-BRG-88).", "Recalibrate accelerometer baseline and run 30-min zero-load burn-in."]',
 'Section 11.2: Mechanical Spindle Dynamics and Bearing Tolerance'),

('E77', 'High-Vacuum Turbo Pump Pressure Differential Failure', 'CRITICAL',
 'Chamber vacuum fails to reach 10^-5 Pa within standard 45-minute bake-out window.',
 '["Viton fluoropolymer door gasket seal micro-cracking", "Roughing scroll pump oil mist filter saturation", "Turbomolecular pump ceramic magnetic bearing levitation imbalance"]',
 '["Perform helium leak detection spray around chamber feedthrough flanges", "Verify roughing backing pump pressure via Pirani gauge (< 2.0 Pa)", "Check turbo pump bearing temperature and drive inverter current"]',
 '["Isolate vacuum column with high-vacuum gate valve.", "Clean main chamber sealing O-ring and apply ultra-high-vacuum Krytox LVP grease.", "Replace roughing pump exhaust coalescing filter element (Part #FLT-VAK-19).", "Run 6-hour thermal bake-out cycle at 85°C."]',
 'Section 14.3: Vacuum Column Maintenance, Leak Hunting & Turbo Pumps'),

('E24', 'DC Power Bus Switching Ripple & Voltage Sag', 'WARNING',
 '48V DC bus exhibits ripple voltage exceeding 850mV RMS; intermittent digital logic restarts.',
 '["Primary electrolytic filter capacitor ESR increase", "AC input mains harmonic distortion or poor grounding impedance", "High-current switched-mode regulator MOSFET gate driver breakdown"]',
 '["Measure 48V rail ripple with oscilloscope AC coupling (50mV/div)", "Test capacitor banks with in-circuit LCR meter for capacitance drop > 15%", "Verify laboratory PE ground resistance (< 0.5 Ohm to building earth bus)"]',
 '["Discharge primary filter capacitor bank with 1kΩ ceramic resistor.", "Replace aged 2200uF 63V low-ESR capacitors on power distribution board (Part #CAP-48V-220).", "Torque power terminal busbar lugs to 2.8 Nm specification.", "Re-test full load power ripple under simulated load."]',
 'Section 4.7: Power Stage Diagnostics & DC Bus Filtering');

-- ----------------------------------------------------------
-- 4. Seed Spare Parts Inventory
-- ----------------------------------------------------------
INSERT INTO spare_parts (part_number, name, category, stock_qty, min_required_qty, location_bin, unit_cost_usd, lead_time_days) VALUES
('CLN-GLY-44', 'Ultra-Pure Deionized Lab Glycol Coolant (2L)', 'Thermal', 6, 2, 'Rack C-04', 85.00, 1),
('TIM-772', 'High-Conductivity Diamond-Silver TIM Paste', 'Thermal', 12, 4, 'Drawer T-02', 42.00, 1),
('SPN-BRG-88', 'High-Precision Angular Contact Ceramic Bearing Set', 'Mechanical', 2, 1, 'Vault M-11', 680.00, 4),
('DSC-410', 'Hermetic Molecular Sieve Desiccant Pack (Pack of 4)', 'Optical', 18, 5, 'Drawer O-01', 35.00, 2),
('FLT-VAK-19', 'Oil-Mist Coalescing Vacuum Exhaust Filter', 'Vacuum', 4, 2, 'Rack V-08', 145.00, 3),
('CAP-48V-220', 'High-Ripple Low-ESR 2200uF 63V Electrolytic Cap Pack', 'Electrical', 25, 10, 'Drawer E-05', 18.00, 1),
('OPT-LNS-90', 'Anti-Reflective Quartz F-Theta Laser Window', 'Optical', 3, 1, 'Vault O-03', 450.00, 5),
('VLV-SOL-12', 'Fast-Acting Microfluidic Solenoid Valve 24V', 'Hydraulic', 8, 2, 'Rack H-02', 190.00, 2);

-- ----------------------------------------------------------
-- 5. Seed Equipment Master Profiles (with Device Types & Costs)
-- ----------------------------------------------------------
INSERT INTO equipment (id, name, device_type_code, category, manufacturer, model, serial_number, location_building, lab_room, installation_date, age_years, operating_hours, health_score, failure_risk, criticality, original_cost_usd, cumulative_repair_cost_usd, recommendation, priority_score, predicted_issue, confidence_score, remaining_useful_life_hours, active_error_code, last_maintenance_date, next_scheduled_maintenance, is_operational) VALUES
('EQ-3D-01', 'Formlabs Form 4L Industrial 3D Printer', '3D_PRINTER', '3D Printer', 'Formlabs', 'Form 4L Industrial SLA', 'FL-4L-2023-8821', 'Advanced Prototyping Facility', 'Lab 102', '2023-04-15', 2.40, 4180, 61, 'HIGH', 'HIGH', 18500.00, 4200.00, 'REPAIR', 82, 'Cooling system degradation & Chiller loop thermal throttling', 92.40, 58, 'E45', '2026-06-12', '2026-09-15', TRUE),
('EQ-CNC-04', 'Haas Mini Mill 3-Axis CNC Machining Center', 'CNC_MACHINE', 'CNC Machine', 'Haas Automation', 'Mini Mill HE-30', 'HS-MM-2022-4419', 'Precision Fabrication Core', 'Lab 108', '2022-08-10', 4.10, 7890, 54, 'HIGH', 'CRITICAL', 45000.00, 48200.00, 'REPLACE EQUIPMENT', 95, 'Spindle bearing wear & radial harmonic resonance', 88.70, 42, 'E12', '2026-05-18', '2026-09-12', TRUE),
('EQ-CEN-05', 'Beckman Coulter Optima XPN-100 Ultracentrifuge', 'CENTRIFUGE', 'Ultracentrifuge', 'Beckman Coulter', 'Optima XPN-100 (100,000 RPM)', 'BC-OPT-2022-9012', 'Biochemistry & Molecular Biology', 'Lab 203', '2022-11-20', 3.80, 6410, 48, 'CRITICAL', 'CRITICAL', 62000.00, 18500.00, 'REPLACE COMPONENT', 98, 'Chamber vacuum diffusion pump seal leak & rotor imbalance trip', 94.60, 19, 'E77', '2026-02-15', '2026-09-09', TRUE),
('EQ-OSC-07', 'Keysight Infiniium MXR-Series 6GHz Oscilloscope', 'OSCILLOSCOPE', 'Oscilloscope', 'Keysight Technologies', 'MXR608B 8-Channel 6GHz', 'KS-MXR-2023-1102', 'RF & Mixed-Signal Electronics Lab', 'Lab 105', '2023-09-05', 2.00, 3620, 76, 'MEDIUM', 'MEDIUM', 28000.00, 3400.00, 'REPAIR WITH CAUTION', 64, 'Power stage DC ripple voltage drift in Channel 5-8 ADC front-end', 84.20, 180, 'E24', '2026-03-10', '2026-09-25', TRUE),
('EQ-SRV-09', 'Dell PowerEdge R760 AI Lab Compute Server', 'LAB_SERVER', 'Lab Server', 'Dell Technologies', 'PowerEdge R760 4x H100', 'DL-PE-2024-7718', 'Central Laboratory Server Vault', 'Server Room B', '2024-03-01', 1.50, 9450, 72, 'MEDIUM', 'HIGH', 52000.00, 6800.00, 'REPAIR', 70, 'Chassis Fan 3 tachometer fluctuation & localized GPU 2 thermal accumulation', 81.50, 140, NULL, '2026-04-14', '2026-10-10', TRUE),
('EQ-HPL-03', 'Agilent 1260 Infinity II HPLC System', 'HPLC', 'Chromatography (HPLC)', 'Agilent Technologies', '1260 Infinity II Quaternary', 'AG-1260-2023-3114', 'Analytical Chemistry Core', 'Lab 201', '2023-05-18', 2.30, 5120, 82, 'LOW', 'MEDIUM', 34000.00, 1200.00, 'MONITOR', 35, 'Quaternary pump piston seal minor pressure pulsation variance', 89.00, 290, NULL, '2026-06-30', '2026-10-15', TRUE),
('EQ-SEM-02', 'Thermo Fisher Apreo 2 Scanning Electron Microscope', 'ELECTRON_MICROSCOPE', 'Electron Microscope', 'Thermo Fisher Scientific', 'Apreo 2 FEG-SEM', 'TF-AP-2024-0091', 'Nanomaterials Characterization Lab', 'Lab 204', '2024-01-14', 1.60, 2340, 89, 'LOW', 'HIGH', 185000.00, 8400.00, 'MONITOR', 28, 'Optimal operating state; minor turbopump vibration variance', 95.10, 420, NULL, '2026-07-22', '2026-11-01', TRUE),
('EQ-NET-11', 'Cisco Nexus 9300 100G Lab Core Network Switch', 'NETWORK_SWITCH', 'Network Device', 'Cisco Systems', 'Nexus 9336C-FX2', 'CS-NX-2023-5591', 'Lab Infrastructure Distribution Frame', 'Network MDF', '2023-01-10', 3.70, 24800, 91, 'LOW', 'LOW', 14000.00, 450.00, 'MONITOR', 15, 'Normal continuous telemetry; ASIC thermal dissipation nominal', 96.20, 850, NULL, '2026-05-02', '2026-11-20', TRUE);

-- ----------------------------------------------------------
-- 6. Seed Device-Specific Threshold Configurations
-- ----------------------------------------------------------
INSERT INTO equipment_thresholds (device_type_code, equipment_id, sensor_code, unit, normal_min, normal_max, warning_min, warning_max, critical_min, critical_max) VALUES
-- 3D Printer (EQ-3D-01)
('3D_PRINTER', 'EQ-3D-01', 'CHILLER_DELTA', '°C', 5.0, 15.0, 15.1, 18.5, 18.6, 35.0),
('3D_PRINTER', 'EQ-3D-01', 'BED_TEMP', '°C', 45.0, 65.0, 65.1, 75.0, 75.1, 95.0),
('3D_PRINTER', 'EQ-3D-01', 'FAN_RPM', 'RPM', 2800, 4500, 2200, 2799, 0, 2199),
('3D_PRINTER', 'EQ-3D-01', 'VIB', 'mm/s', 0.1, 1.8, 1.81, 3.2, 3.21, 6.0),

-- CNC Machine (EQ-CNC-04)
('CNC_MACHINE', 'EQ-CNC-04', 'SPINDLE_RPM', 'RPM', 8000, 15000, 6000, 7999, 0, 5999),
('CNC_MACHINE', 'EQ-CNC-04', 'VIB', 'mm/s', 0.2, 2.5, 2.51, 4.8, 4.81, 10.0),
('CNC_MACHINE', 'EQ-CNC-04', 'COOLANT_FLOW', 'L/min', 12.0, 25.0, 8.0, 11.9, 0.0, 7.9),
('CNC_MACHINE', 'EQ-CNC-04', 'TEMP', '°C', 35.0, 55.0, 55.1, 68.0, 68.1, 90.0),

-- Ultracentrifuge (EQ-CEN-05)
('CENTRIFUGE', 'EQ-CEN-05', 'RPM', 'RPM', 20000, 100000, 10000, 19999, 0, 9999),
('CENTRIFUGE', 'EQ-CEN-05', 'TEMP', '°C', 4.0, 25.0, 25.1, 38.0, 38.1, 60.0),
('CENTRIFUGE', 'EQ-CEN-05', 'VIB', 'mm/s', 0.05, 1.2, 1.21, 2.8, 2.81, 8.0),
('CENTRIFUGE', 'EQ-CEN-05', 'VAC', 'mTorr', 0.1, 1.2, 1.21, 5.0, 5.01, 50.0),

-- Oscilloscope (EQ-OSC-07)
('OSCILLOSCOPE', 'EQ-OSC-07', 'DC_RIPPLE', 'mV', 50, 450, 451, 850, 851, 2000),
('OSCILLOSCOPE', 'EQ-OSC-07', 'VOLTAGE', 'V', 115.0, 125.0, 108.0, 114.9, 0.0, 107.9),
('OSCILLOSCOPE', 'EQ-OSC-07', 'TEMP', '°C', 25.0, 45.0, 45.1, 55.0, 55.1, 80.0),

-- Lab Server (EQ-SRV-09)
('LAB_SERVER', 'EQ-SRV-09', 'CPU_UTIL', '%', 10.0, 75.0, 75.1, 90.0, 90.1, 100.0),
('LAB_SERVER', 'EQ-SRV-09', 'MEM_UTIL', '%', 15.0, 80.0, 80.1, 92.0, 92.1, 100.0),
('LAB_SERVER', 'EQ-SRV-09', 'FAN_RPM', 'RPM', 4000, 8500, 2800, 3999, 0, 2799),
('LAB_SERVER', 'EQ-SRV-09', 'CHASSIS_TEMP', '°C', 30.0, 65.0, 65.1, 78.0, 78.1, 95.0),

-- HPLC (EQ-HPL-03)
('HPLC', 'EQ-HPL-03', 'PRESSURE_PULSE', 'bar', 0.1, 3.5, 3.51, 8.0, 8.01, 25.0),
('HPLC', 'EQ-HPL-03', 'FLOW_RATE', 'mL/min', 0.5, 5.0, 0.2, 0.49, 0.0, 0.19),
('HPLC', 'EQ-HPL-03', 'TEMP', '°C', 20.0, 40.0, 40.1, 50.0, 50.1, 70.0),

-- Electron Microscope (EQ-SEM-02)
('ELECTRON_MICROSCOPE', 'EQ-SEM-02', 'TURBOPUMP_VIB', 'mm/s', 0.01, 0.5, 0.51, 1.2, 1.21, 4.0),
('ELECTRON_MICROSCOPE', 'EQ-SEM-02', 'VACUUM_PRESS', 'Pa', 0.0001, 0.005, 0.0051, 0.02, 0.021, 1.0),
('ELECTRON_MICROSCOPE', 'EQ-SEM-02', 'CHAMBER_TEMP', '°C', 18.0, 25.0, 25.1, 32.0, 32.1, 50.0),

-- ----------------------------------------------------------
-- 7. Seed Role-Aware Notifications Data
-- ----------------------------------------------------------
INSERT INTO notifications (id, recipient_user_id, recipient_username, recipient_role, type, title, message, related_equipment_id, related_ticket_id, severity, is_read) VALUES
('NOTIF-101', 1, 'admin', 'ROLE_ADMIN', 'CRITICAL_EQUIPMENT_ALERT', 'Critical Anomaly Detected: Formlabs Form 4L', 'Error E45: Cooling radiator thermal delta exceeded 19.2°C threshold under print load.', 'EQ-3D-01', 'TKT-1044', 'CRITICAL', FALSE),
('NOTIF-102', 2, 'technician', 'ROLE_TECHNICIAN', 'TICKET_ASSIGNED', 'New Maintenance Ticket Assigned: TKT-1044', 'You have been assigned to perform closed-loop glycol flush on Formlabs 3D Printer (EQ-3D-01).', 'EQ-3D-01', 'TKT-1044', 'WARNING', FALSE),
('NOTIF-103', 1, 'admin', 'ROLE_ADMIN', 'REPLACEMENT_RECOMMENDED', 'Replacement Recommendation: Haas Mini Mill (EQ-CNC-04)', 'Cumulative repair costs ($48,200) have exceeded original equipment cost ($45,000). Decision Engine recommends REPLACE EQUIPMENT.', 'EQ-CNC-04', NULL, 'WARNING', FALSE),
('NOTIF-104', 2, 'technician', 'ROLE_TECHNICIAN', 'HIGH_RISK_PREDICTION', 'High Risk Failure Alert: Optima Centrifuge (EQ-CEN-05)', 'Error E77: Chamber vacuum diffusion pump seal leak flagged by SLM anomaly detector.', 'EQ-CEN-05', 'TKT-1048', 'CRITICAL', TRUE);
