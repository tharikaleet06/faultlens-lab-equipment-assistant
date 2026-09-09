
export const ERROR_CODES_CATALOG = [
  {
    code: 'E45',
    title: 'Cooling Loop Heat Exchanger Delta Exceeded',
    severity: 'CRITICAL',
    symptom: 'Thermal throttling detected; temperature delta across internal cooling radiator exceeds 18.5°C under nominal load.',
    possibleCauses: [
      'Debris clogging the heat sink fins or micro-channel coolant channels',
      'Coolant fluid cavitation or low coolant level in reservoir',
      'PWM auxiliary fan motor bearing degradation or RPM stall',
      'Thermal interface paste dry-out on the primary high-power laser/spindle assembly'
    ],
    recommendedChecks: [
      'Inspect liquid coolant reservoir level through the optical sight glass (must be above 75%)',
      'Check secondary heat-sink intake manifold using an infrared thermometer',
      'Verify auxiliary fan tachometer RPM in the diagnostic diagnostics bus (> 2800 RPM required)',
      'Inspect coolant return hose for kinks, bubbles, or sediment particulate'
    ],
    resolutionSteps: [
      'Power down the system and engage lockout-tagout (LOTO) for 15 minutes to allow cooling.',
      'Flush closed-loop coolant with ASTM Type 1 deionized lab-grade glycol fluid (Part #CLN-GLY-44).',
      'Clean radiator fins using 30 PSI dry nitrogen or high-purity filtered compressed air.',
      'Re-seat thermal pad with silver-based thermal interface material (Part #TIM-772).',
      'Re-execute automatic thermal calibration cycle via technician utility.'
    ],
    manualSection: 'Section 8.4: Closed-Loop Thermal Subsystem & Chiller Diagnostics'
  },
  {
    code: 'E12',
    title: 'Spindle Bearing Radial Vibration Harmonic Anomaly',
    severity: 'ERROR',
    symptom: 'Harmonic vibration amplitude > 4.8 mm/s at 12,000 RPM spindle operational frequency.',
    possibleCauses: [
      'Spindle ceramic hybrid bearing micro-spalling or raceway fatigue',
      'Collet chuck eccentricity or unbalance tooling assembly',
      'Belt tension looseness or harmonic resonance in motor coupling'
    ],
    recommendedChecks: [
      'Conduct dial indicator runout test on spindle taper (tolerance < 0.003 mm)',
      'Analyze accelerometer FFT spectrum for 2X harmonic peaks characteristic of inner race damage',
      'Inspect drive belt teeth for fraying and measure tension with acoustic meter'
    ],
    resolutionSteps: [
      'Inspect and clean the toolholder taper using solvent degreaser.',
      'Inspect pre-load spring washer stack on spindle bearing cartridge.',
      'If vibration persists above 3.5 mm/s, replace the high-speed spindle bearing cartridge (Part #SPN-BRG-88).',
      'Recalibrate accelerometer baseline and run zero-load 30-minute burn-in.'
    ],
    manualSection: 'Section 11.2: Mechanical Spindle Dynamics and Bearing Tolerance'
  },
  {
    code: 'E08',
    title: 'Optical Laser Diode Output Power Attenuation',
    severity: 'WARNING',
    symptom: 'Galvanometer optical sensor reports 22% reduction in target wavelength photon irradiance.',
    possibleCauses: [
      'F-theta scan lens optical window contamination or dust settling',
      'Laser diode current driver thermal drift',
      'Dichroic beam splitter optical coating degradation'
    ],
    recommendedChecks: [
      'Inspect optical window surface with 10x illuminated loupe',
      'Measure laser forward bias current across test points TP12 and TP14 (standard 1.85A)',
      'Check optical enclosure hermetic seal and desiccant cartridge indicator'
    ],
    resolutionSteps: [
      'Clean optical window with spectroscopy-grade anhydrous isopropanol and lint-free swabs.',
      'Replace internal desiccant cartridge if indicator has shifted to pink (Part #DSC-410).',
      'Run automated beam-profiler laser power recalibration routine from firmware.',
      'If optical power remains < 80% of factory rating, schedule diode module replacement.'
    ],
    manualSection: 'Section 6.1: Laser Engine Calibration & Optical Path Maintenance'
  },
  {
    code: 'E77',
    title: 'High-Vacuum Turbo Pump Pressure Differential Failure',
    severity: 'CRITICAL',
    symptom: 'Chamber vacuum fails to reach 10^-5 Pa within standard 45-minute bake-out window.',
    possibleCauses: [
      'Viton fluoropolymer door gasket seal micro-cracking or particle contamination',
      'Roughing scroll pump oil mist filter saturation',
      'Turbomolecular pump ceramic magnetic bearing levitation imbalance'
    ],
    recommendedChecks: [
      'Perform helium leak detection spray around chamber feedthrough flanges',
      'Verify roughing backing pump pressure via Pirani gauge (< 2.0 Pa before turbo switchover)',
      'Check turbo pump bearing temperature and drive inverter current draw'
    ],
    resolutionSteps: [
      'Isolate vacuum column with high-vacuum gate valve.',
      'Clean main chamber sealing O-ring and apply ultra-high-vacuum Krytox LVP grease.',
      'Replace roughing pump exhaust coalescing filter element (Part #FLT-VAK-19).',
      'Run 6-hour thermal bake-out cycle at 85°C to desorb trapped atmospheric water vapor.'
    ],
    manualSection: 'Section 14.3: Vacuum Column Maintenance, Leak Hunting & Turbo Pumps'
  },
  {
    code: 'E24',
    title: 'DC Power Bus Switching Ripple & Voltage Sag',
    severity: 'WARNING',
    symptom: '48V DC bus exhibits ripple voltage exceeding 850mV RMS; intermittent digital logic restarts.',
    possibleCauses: [
      'Primary electrolytic filter capacitor equivalent series resistance (ESR) increase',
      'AC input mains harmonic distortion or poor grounding impedance',
      'High-current switched-mode regulator MOSFET gate driver breakdown'
    ],
    recommendedChecks: [
      'Measure 48V rail ripple with oscilloscope AC coupling (50mV/div, 20MHz bandwidth)',
      'Test capacitor banks with in-circuit LCR meter for capacitance drop > 15%',
      'Verify laboratory PE ground resistance (< 0.5 Ohm to building earth grounding bus)'
    ],
    resolutionSteps: [
      'Discharge primary filter capacitor bank with 1kΩ ceramic resistor.',
      'Replace aged 2200uF 63V low-ESR capacitors on power distribution board (Part #CAP-48V-220).',
      'Torque power terminal busbar lugs to specified 2.8 Nm specification.',
      'Re-test full load power ripple under simulated peak load test.'
    ],
    manualSection: 'Section 4.7: Power Stage Diagnostics & DC Bus Filtering'
  }
];

export const LAB_SPARE_PARTS = [
  { partNumber: 'CLN-GLY-44', name: 'Ultra-Pure Deionized Lab Glycol Coolant (2L)', category: 'Thermal', stockQty: 6, locationBin: 'Rack C-04', unitCostUsd: 85, leadTimeDays: 1 },
  { partNumber: 'TIM-772', name: 'High-Conductivity Diamond-Silver TIM Paste', category: 'Thermal', stockQty: 12, locationBin: 'Drawer T-02', unitCostUsd: 42, leadTimeDays: 1 },
  { partNumber: 'SPN-BRG-88', name: 'High-Precision Angular Contact Ceramic Bearing Set', category: 'Mechanical', stockQty: 2, locationBin: 'Vault M-11', unitCostUsd: 680, leadTimeDays: 4 },
  { partNumber: 'DSC-410', name: 'Hermetic Molecular Sieve Desiccant Pack (Pack of 4)', category: 'Optical', stockQty: 18, locationBin: 'Drawer O-01', unitCostUsd: 35, leadTimeDays: 2 },
  { partNumber: 'FLT-VAK-19', name: 'Oil-Mist Coalescing Vacuum Exhaust Filter', category: 'Vacuum', stockQty: 4, locationBin: 'Rack V-08', unitCostUsd: 145, leadTimeDays: 3 },
  { partNumber: 'CAP-48V-220', name: 'High-Ripple Low-ESR 2200uF 63V Electrolytic Cap Pack', category: 'Electrical', stockQty: 25, locationBin: 'Drawer E-05', unitCostUsd: 18, leadTimeDays: 1 },
  { partNumber: 'OPT-LNS-90', name: 'Anti-Reflective Quartz F-Theta Laser Window', category: 'Optical', stockQty: 3, locationBin: 'Vault O-03', unitCostUsd: 450, leadTimeDays: 5 },
  { partNumber: 'VLV-SOL-12', name: 'Fast-Acting Microfluidic Solenoid Valve 24V', category: 'Hydraulic', stockQty: 8, locationBin: 'Rack H-02', unitCostUsd: 190, leadTimeDays: 2 }
];

export const INITIAL_EQUIPMENT = [
  {
    id: 'EQ-3D-01',
    name: 'Formlabs Form 4L Industrial 3D Printer',
    category: '3D Printer',
    manufacturer: 'Formlabs',
    model: 'Form 4L Industrial SLA',
    serialNumber: 'FL-4L-2023-8821',
    location: 'Advanced Prototyping Lab',
    labRoom: 'Lab 102',
    installationDate: '2023-04-15',
    ageYears: 2.4,
    operatingHours: 4180,
    healthScore: 61,
    failureRisk: 'HIGH',
    predictedIssue: 'Cooling system degradation & Chiller loop thermal throttling',
    confidenceScore: 92.4,
    estimatedRemainingUsefulLifeHours: 58,
    activeErrorCode: 'E45',
    lastMaintenanceDate: '2026-06-12',
    nextScheduledMaintenance: '2026-09-15',
    thresholds: {
      tempWarning: 68,
      tempCritical: 82,
      vibrationWarning: 2.8,
      vibrationCritical: 4.5,
      voltageMin: 115,
      voltageMax: 125,
      currentMax: 12.0
    },
    currentTelemetry: {
      temperature: 78.4,
      vibration: 2.1,
      voltage: 121.2,
      current: 9.8
    },
    maintenanceHistory: [
      {
        id: 'MNT-101',
        date: '2026-06-12',
        type: 'PREVENTIVE',
        technician: 'Dr. Elena Rostova',
        description: 'Cleaned optical resin tank mirror, lubricated Z-axis ballscrew, firmware updated to v4.19.',
        partsReplaced: ['Resin wiper blade'],
        downtimeHours: 2.5,
        costEstimate: 120
      },
      {
        id: 'MNT-089',
        date: '2026-01-20',
        type: 'PART_REPLACEMENT',
        technician: 'Marcus Vance',
        description: 'Replaced high-speed Z-axis stepper motor due to position loss error.',
        partsReplaced: ['Stepper Motor Z-Axis #STP-42'],
        downtimeHours: 4.0,
        costEstimate: 450
      }
    ],
    telemetryHistory: [
      { timestamp: '08:00', temperature: 52, vibration: 1.2, voltage: 120.1, current: 7.2, operatingHours: 4172 },
      { timestamp: '09:00', temperature: 58, vibration: 1.3, voltage: 120.3, current: 8.0, operatingHours: 4173 },
      { timestamp: '10:00', temperature: 64, vibration: 1.5, voltage: 120.0, current: 8.5, operatingHours: 4174 },
      { timestamp: '11:00', temperature: 71, vibration: 1.8, voltage: 120.5, current: 9.1, operatingHours: 4175, anomalyDetected: true, anomalyReason: 'Thermal slope abnormal' },
      { timestamp: '12:00', temperature: 75, vibration: 1.9, voltage: 120.8, current: 9.4, operatingHours: 4176, anomalyDetected: true, anomalyReason: 'Temp approaching critical' },
      { timestamp: '13:00', temperature: 78.4, vibration: 2.1, voltage: 121.2, current: 9.8, operatingHours: 4177, anomalyDetected: true, anomalyReason: 'E45 threshold triggered: Chiller delta exceeded' }
    ]
  },
  {
    id: 'EQ-CNC-04',
    name: 'Haas Mini Mill 3-Axis CNC Machining Center',
    category: 'CNC Machine',
    manufacturer: 'Haas Automation',
    model: 'Mini Mill HE-30',
    serialNumber: 'HS-MM-2022-4419',
    location: 'Precision Fabrication Facility',
    labRoom: 'Lab 108',
    installationDate: '2022-08-10',
    ageYears: 4.1,
    operatingHours: 7890,
    healthScore: 54,
    failureRisk: 'HIGH',
    predictedIssue: 'Spindle bearing wear & radial harmonic resonance',
    confidenceScore: 88.7,
    estimatedRemainingUsefulLifeHours: 42,
    activeErrorCode: 'E12',
    lastMaintenanceDate: '2026-05-18',
    nextScheduledMaintenance: '2026-09-12',
    thresholds: {
      tempWarning: 55,
      tempCritical: 70,
      vibrationWarning: 3.2,
      vibrationCritical: 5.0,
      voltageMin: 200,
      voltageMax: 220,
      currentMax: 24.0
    },
    currentTelemetry: {
      temperature: 52.8,
      vibration: 4.6,
      voltage: 209.4,
      current: 18.6
    },
    maintenanceHistory: [
      {
        id: 'MNT-112',
        date: '2026-05-18',
        type: 'CORRECTIVE',
        technician: 'Dave Gallagher',
        description: 'Tensioned drive belt on X-axis and flushed way lube reservoir.',
        downtimeHours: 3.0,
        costEstimate: 280
      }
    ],
    telemetryHistory: [
      { timestamp: '08:00', temperature: 40, vibration: 2.4, voltage: 208, current: 14.2, operatingHours: 7882 },
      { timestamp: '09:00', temperature: 44, vibration: 2.8, voltage: 209, current: 15.0, operatingHours: 7883 },
      { timestamp: '10:00', temperature: 48, vibration: 3.5, voltage: 208, current: 16.1, operatingHours: 7884, anomalyDetected: true, anomalyReason: 'Vibration warning threshold exceeded' },
      { timestamp: '11:00', temperature: 50, vibration: 4.1, voltage: 209, current: 17.5, operatingHours: 7885, anomalyDetected: true, anomalyReason: 'Radial harmonic anomaly' },
      { timestamp: '12:00', temperature: 52, vibration: 4.4, voltage: 210, current: 18.2, operatingHours: 7886, anomalyDetected: true, anomalyReason: 'Bearing raceway micro-spall signature' },
      { timestamp: '13:00', temperature: 52.8, vibration: 4.6, voltage: 209.4, current: 18.6, operatingHours: 7887, anomalyDetected: true, anomalyReason: 'E12 active error' }
    ]
  },
  {
    id: 'EQ-SEM-02',
    name: 'Thermo Fisher Apreo 2 Scanning Electron Microscope',
    category: 'Electron Microscope',
    manufacturer: 'Thermo Fisher Scientific',
    model: 'Apreo 2 FEG-SEM',
    serialNumber: 'TF-AP-2024-0091',
    location: 'Nanomaterials Characterization Lab',
    labRoom: 'Lab 204',
    installationDate: '2024-01-14',
    ageYears: 1.6,
    operatingHours: 2340,
    healthScore: 89,
    failureRisk: 'LOW',
    predictedIssue: 'Optimal operating state; minor turbopump vibration variance',
    confidenceScore: 95.1,
    estimatedRemainingUsefulLifeHours: 420,
    lastMaintenanceDate: '2026-07-22',
    nextScheduledMaintenance: '2026-11-01',
    thresholds: {
      tempWarning: 26,
      tempCritical: 32,
      vibrationWarning: 0.8,
      vibrationCritical: 1.5,
      voltageMin: 225,
      voltageMax: 235,
      currentMax: 16.0
    },
    currentTelemetry: {
      temperature: 22.4,
      vibration: 0.42,
      voltage: 229.8,
      current: 9.1
    },
    maintenanceHistory: [
      {
        id: 'MNT-125',
        date: '2026-07-22',
        type: 'CALIBRATION',
        technician: 'Dr. Sarah Jenkins',
        description: 'Certified gun alignment, aperture centering, and high-vacuum bake-out completed.',
        partsReplaced: ['Aperture strip #AP-12'],
        downtimeHours: 8.0,
        costEstimate: 1400
      }
    ],
    telemetryHistory: [
      { timestamp: '08:00', temperature: 21.8, vibration: 0.38, voltage: 230.1, current: 8.9, operatingHours: 2335 },
      { timestamp: '09:00', temperature: 22.0, vibration: 0.40, voltage: 230.0, current: 9.0, operatingHours: 2336 },
      { timestamp: '10:00', temperature: 22.2, vibration: 0.41, voltage: 229.9, current: 9.0, operatingHours: 2337 },
      { timestamp: '11:00', temperature: 22.3, vibration: 0.41, voltage: 229.8, current: 9.1, operatingHours: 2338 },
      { timestamp: '12:00', temperature: 22.4, vibration: 0.42, voltage: 229.8, current: 9.1, operatingHours: 2339 },
      { timestamp: '13:00', temperature: 22.4, vibration: 0.42, voltage: 229.8, current: 9.1, operatingHours: 2340 }
    ]
  },
  {
    id: 'EQ-OSC-07',
    name: 'Keysight Infiniium MXR-Series 6GHz Oscilloscope',
    category: 'Oscilloscope',
    manufacturer: 'Keysight Technologies',
    model: 'MXR608B 8-Channel 6GHz',
    serialNumber: 'KS-MXR-2023-1102',
    location: 'RF & Mixed-Signal Electronics Lab',
    labRoom: 'Lab 105',
    installationDate: '2023-09-05',
    ageYears: 2.0,
    operatingHours: 3620,
    healthScore: 76,
    failureRisk: 'MEDIUM',
    predictedIssue: 'Power stage DC ripple voltage drift in Channel 5-8 ADC front-end',
    confidenceScore: 84.2,
    estimatedRemainingUsefulLifeHours: 180,
    activeErrorCode: 'E24',
    lastMaintenanceDate: '2026-03-10',
    nextScheduledMaintenance: '2026-09-25',
    thresholds: {
      tempWarning: 45,
      tempCritical: 55,
      vibrationWarning: 1.0,
      vibrationCritical: 2.0,
      voltageMin: 110,
      voltageMax: 125,
      currentMax: 5.0
    },
    currentTelemetry: {
      temperature: 42.1,
      vibration: 0.25,
      voltage: 117.8,
      current: 3.8
    },
    maintenanceHistory: [
      {
        id: 'MNT-098',
        date: '2026-03-10',
        type: 'CALIBRATION',
        technician: 'Leo Tran',
        description: 'NIST traceable timebase and vertical amplifier calibration performed.',
        downtimeHours: 2.0,
        costEstimate: 350
      }
    ],
    telemetryHistory: [
      { timestamp: '08:00', temperature: 36.5, vibration: 0.21, voltage: 119.5, current: 3.4, operatingHours: 3615 },
      { timestamp: '09:00', temperature: 38.0, vibration: 0.22, voltage: 119.0, current: 3.5, operatingHours: 3616 },
      { timestamp: '10:00', temperature: 39.8, vibration: 0.23, voltage: 118.6, current: 3.6, operatingHours: 3617 },
      { timestamp: '11:00', temperature: 41.0, vibration: 0.24, voltage: 118.2, current: 3.7, operatingHours: 3618 },
      { timestamp: '12:00', temperature: 41.8, vibration: 0.25, voltage: 117.9, current: 3.8, operatingHours: 3619 },
      { timestamp: '13:00', temperature: 42.1, vibration: 0.25, voltage: 117.8, current: 3.8, operatingHours: 3620, anomalyDetected: true, anomalyReason: 'DC bus ripple > 600mV' }
    ]
  },
  {
    id: 'EQ-SRV-09',
    name: 'Dell PowerEdge R760 AI Lab Compute Server',
    category: 'Lab Server',
    manufacturer: 'Dell Technologies',
    model: 'PowerEdge R760 4x H100',
    serialNumber: 'DL-PE-2024-7718',
    location: 'Central Laboratory Server Vault',
    labRoom: 'Server Room B',
    installationDate: '2024-03-01',
    ageYears: 1.5,
    operatingHours: 9450,
    healthScore: 72,
    failureRisk: 'MEDIUM',
    predictedIssue: 'Chassis Fan 3 tachometer fluctuation & localized GPU 2 thermal accumulation',
    confidenceScore: 81.5,
    estimatedRemainingUsefulLifeHours: 140,
    lastMaintenanceDate: '2026-04-14',
    nextScheduledMaintenance: '2026-10-10',
    thresholds: {
      tempWarning: 74,
      tempCritical: 88,
      vibrationWarning: 1.5,
      vibrationCritical: 3.0,
      voltageMin: 200,
      voltageMax: 240,
      currentMax: 32.0
    },
    currentTelemetry: {
      temperature: 71.3,
      vibration: 1.1,
      voltage: 228.4,
      current: 21.2
    },
    maintenanceHistory: [
      {
        id: 'MNT-109',
        date: '2026-04-14',
        type: 'PREVENTIVE',
        technician: 'Marcus Vance',
        description: 'Cleaned front air bezel, replaced hot-plug redundant power supply unit PSU2.',
        partsReplaced: ['Dell Titanium 2400W PSU'],
        downtimeHours: 0.5,
        costEstimate: 720
      }
    ],
    telemetryHistory: [
      { timestamp: '08:00', temperature: 62.0, vibration: 0.8, voltage: 230, current: 16.5, operatingHours: 9444 },
      { timestamp: '09:00', temperature: 65.5, vibration: 0.9, voltage: 230, current: 18.0, operatingHours: 9445 },
      { timestamp: '10:00', temperature: 68.2, vibration: 1.0, voltage: 229, current: 19.8, operatingHours: 9446 },
      { timestamp: '11:00', temperature: 70.1, vibration: 1.1, voltage: 228, current: 20.7, operatingHours: 9447 },
      { timestamp: '12:00', temperature: 70.9, vibration: 1.1, voltage: 228, current: 21.0, operatingHours: 9448 },
      { timestamp: '13:00', temperature: 71.3, vibration: 1.1, voltage: 228.4, current: 21.2, operatingHours: 9449 }
    ]
  },
  {
    id: 'EQ-HPL-03',
    name: 'Agilent 1260 Infinity II HPLC System',
    category: 'Chromatography (HPLC)',
    manufacturer: 'Agilent Technologies',
    model: '1260 Infinity II Quaternary',
    serialNumber: 'AG-1260-2023-3114',
    location: 'Analytical Chemistry Core',
    labRoom: 'Lab 201',
    installationDate: '2023-05-18',
    ageYears: 2.3,
    operatingHours: 5120,
    healthScore: 82,
    failureRisk: 'LOW',
    predictedIssue: 'Quaternary pump piston seal minor pressure pulsation variance',
    confidenceScore: 89.0,
    estimatedRemainingUsefulLifeHours: 290,
    lastMaintenanceDate: '2026-06-30',
    nextScheduledMaintenance: '2026-10-15',
    thresholds: {
      tempWarning: 42,
      tempCritical: 55,
      vibrationWarning: 1.8,
      vibrationCritical: 3.5,
      voltageMin: 110,
      voltageMax: 125,
      currentMax: 8.0
    },
    currentTelemetry: {
      temperature: 31.5,
      vibration: 0.75,
      voltage: 120.4,
      current: 4.2
    },
    maintenanceHistory: [
      {
        id: 'MNT-121',
        date: '2026-06-30',
        type: 'PART_REPLACEMENT',
        technician: 'Dr. Sarah Jenkins',
        description: 'Replaced autosampler metering syringe PTFE seal and inlet check valve.',
        partsReplaced: ['PTFE Syringe Seal', 'Inlet Check Valve Cartridge'],
        downtimeHours: 3.5,
        costEstimate: 420
      }
    ],
    telemetryHistory: [
      { timestamp: '08:00', temperature: 29.8, vibration: 0.65, voltage: 120.2, current: 3.9, operatingHours: 5115 },
      { timestamp: '09:00', temperature: 30.4, vibration: 0.68, voltage: 120.3, current: 4.0, operatingHours: 5116 },
      { timestamp: '10:00', temperature: 31.0, vibration: 0.71, voltage: 120.3, current: 4.1, operatingHours: 5117 },
      { timestamp: '11:00', temperature: 31.2, vibration: 0.73, voltage: 120.4, current: 4.1, operatingHours: 5118 },
      { timestamp: '12:00', temperature: 31.4, vibration: 0.74, voltage: 120.4, current: 4.2, operatingHours: 5119 },
      { timestamp: '13:00', temperature: 31.5, vibration: 0.75, voltage: 120.4, current: 4.2, operatingHours: 5120 }
    ]
  },
  {
    id: 'EQ-CEN-05',
    name: 'Beckman Coulter Optima XPN-100 Ultracentrifuge',
    category: 'Ultracentrifuge',
    manufacturer: 'Beckman Coulter',
    model: 'Optima XPN-100 (100,000 RPM)',
    serialNumber: 'BC-OPT-2022-9012',
    location: 'Biochemistry & Molecular Biology',
    labRoom: 'Lab 203',
    installationDate: '2022-11-20',
    ageYears: 3.8,
    operatingHours: 6410,
    healthScore: 48,
    failureRisk: 'CRITICAL',
    predictedIssue: 'Chamber vacuum diffusion pump seal leak & rotor imbalance trip',
    confidenceScore: 94.6,
    estimatedRemainingUsefulLifeHours: 19,
    activeErrorCode: 'E77',
    lastMaintenanceDate: '2026-02-15',
    nextScheduledMaintenance: '2026-09-09',
    thresholds: {
      tempWarning: 38,
      tempCritical: 50,
      vibrationWarning: 2.0,
      vibrationCritical: 3.8,
      voltageMin: 208,
      voltageMax: 240,
      currentMax: 30.0
    },
    currentTelemetry: {
      temperature: 46.2,
      vibration: 3.7,
      voltage: 218.0,
      current: 24.5
    },
    maintenanceHistory: [
      {
        id: 'MNT-092',
        date: '2026-02-15',
        type: 'PREVENTIVE',
        technician: 'Dave Gallagher',
        description: 'Inspected armor steel barrier ring, lubricated vacuum gasket, tested overspeed governor.',
        downtimeHours: 4.0,
        costEstimate: 600
      }
    ],
    telemetryHistory: [
      { timestamp: '08:00', temperature: 32.0, vibration: 1.4, voltage: 220, current: 18.0, operatingHours: 6404 },
      { timestamp: '09:00', temperature: 36.5, vibration: 1.9, voltage: 219, current: 20.2, operatingHours: 6405 },
      { timestamp: '10:00', temperature: 40.8, vibration: 2.6, voltage: 219, current: 22.0, operatingHours: 6406, anomalyDetected: true, anomalyReason: 'Chamber vacuum loss detected' },
      { timestamp: '11:00', temperature: 43.1, vibration: 3.1, voltage: 218, current: 23.4, operatingHours: 6407, anomalyDetected: true, anomalyReason: 'Vibration spike near critical' },
      { timestamp: '12:00', temperature: 45.4, vibration: 3.5, voltage: 218, current: 24.1, operatingHours: 6408, anomalyDetected: true, anomalyReason: 'High vacuum turbo pump load overload' },
      { timestamp: '13:00', temperature: 46.2, vibration: 3.7, voltage: 218.0, current: 24.5, operatingHours: 6409, anomalyDetected: true, anomalyReason: 'E77 error code active' }
    ]
  },
  {
    id: 'EQ-NET-11',
    name: 'Cisco Nexus 9300 100G Lab Core Network Switch',
    category: 'Network Device',
    manufacturer: 'Cisco Systems',
    model: 'Nexus 9336C-FX2',
    serialNumber: 'CS-NX-2023-5591',
    location: 'Lab Infrastructure Distribution Frame',
    labRoom: 'Network MDF',
    installationDate: '2023-01-10',
    ageYears: 3.7,
    operatingHours: 24800,
    healthScore: 91,
    failureRisk: 'LOW',
    predictedIssue: 'Normal continuous telemetry; ASIC thermal dissipation nominal',
    confidenceScore: 96.2,
    estimatedRemainingUsefulLifeHours: 850,
    lastMaintenanceDate: '2026-05-02',
    nextScheduledMaintenance: '2026-11-20',
    thresholds: {
      tempWarning: 60,
      tempCritical: 75,
      vibrationWarning: 0.5,
      vibrationCritical: 1.2,
      voltageMin: 100,
      voltageMax: 125,
      currentMax: 6.0
    },
    currentTelemetry: {
      temperature: 44.5,
      vibration: 0.12,
      voltage: 120.2,
      current: 3.1
    },
    maintenanceHistory: [
      {
        id: 'MNT-115',
        date: '2026-05-02',
        type: 'PREVENTIVE',
        technician: 'Leo Tran',
        description: 'Installed NX-OS security patch 10.3(4a), cleaned fan tray 2 and power supply dust screens.',
        downtimeHours: 0.25,
        costEstimate: 150
      }
    ],
    telemetryHistory: [
      { timestamp: '08:00', temperature: 43.8, vibration: 0.11, voltage: 120.1, current: 3.0, operatingHours: 24795 },
      { timestamp: '09:00', temperature: 44.0, vibration: 0.11, voltage: 120.2, current: 3.0, operatingHours: 24796 },
      { timestamp: '10:00', temperature: 44.2, vibration: 0.12, voltage: 120.2, current: 3.1, operatingHours: 24797 },
      { timestamp: '11:00', temperature: 44.3, vibration: 0.12, voltage: 120.1, current: 3.1, operatingHours: 24798 },
      { timestamp: '12:00', temperature: 44.4, vibration: 0.12, voltage: 120.2, current: 3.1, operatingHours: 24799 },
      { timestamp: '13:00', temperature: 44.5, vibration: 0.12, voltage: 120.2, current: 3.1, operatingHours: 24800 }
    ]
  }
];

export const INITIAL_TICKETS = [
  {
    id: 'TKT-8941',
    equipmentId: 'EQ-3D-01',
    equipmentName: 'Formlabs Form 4L Industrial 3D Printer',
    title: 'Predicted Chiller Failure & E45 Thermal Trip Prevention',
    priority: 'P1 - CRITICAL',
    status: 'OPEN',
    createdAt: '2026-09-08 08:30',
    scheduledDate: '2026-09-08 14:00',
    problemDescription: 'Real-time telemetry detected severe thermal slope anomaly (78.4°C vs 68°C threshold) with active E45 code. Small Language Model prediction indicates imminent cooling radiator clogging & laser module thermal degradation within 58 operating hours.',
    suggestedSpareParts: [
      { partNumber: 'CLN-GLY-44', name: 'Ultra-Pure Deionized Lab Glycol Coolant (2L)', quantity: 2, inStock: true, estimatedCost: 170 },
      { partNumber: 'TIM-772', name: 'High-Conductivity Diamond-Silver TIM Paste', quantity: 1, inStock: true, estimatedCost: 42 }
    ],
    recommendedTechnicianAction: [
      'Engage Lockout-Tagout (LOTO) and allow laser chamber 15-minute cooldown.',
      'Inspect coolant level through reservoir glass and purge particulate sediment.',
      'Flush closed-loop chiller line with ASTM Type 1 glycol fluid.',
      'Clean radiator fins with dry nitrogen and verify auxiliary PWM fan tachometer > 2800 RPM.'
    ],
    assignedTechnician: 'Dr. Elena Rostova',
    generatedByAI: true
  },
  {
    id: 'TKT-8938',
    equipmentId: 'EQ-CEN-05',
    equipmentName: 'Beckman Coulter Optima XPN-100 Ultracentrifuge',
    title: 'Critical Vacuum Leak & Radial Vibration Spike (E77)',
    priority: 'P1 - CRITICAL',
    status: 'SCHEDULED',
    createdAt: '2026-09-07 16:45',
    scheduledDate: '2026-09-08 10:00',
    problemDescription: 'Chamber vacuum level failing to meet 10^-5 Pa specification; radial vibration approaching 3.7 mm/s under spin-up test. RUL estimated at only 19 operating hours remaining.',
    suggestedSpareParts: [
      { partNumber: 'FLT-VAK-19', name: 'Oil-Mist Coalescing Vacuum Exhaust Filter', quantity: 1, inStock: true, estimatedCost: 145 }
    ],
    recommendedTechnicianAction: [
      'Verify roughing backing pump Pirani gauge reading.',
      'Perform helium leak detection spray around chamber feedthrough seals.',
      'Replace vacuum coalescing filter and re-grease O-ring with Krytox LVP.'
    ],
    assignedTechnician: 'Dave Gallagher',
    generatedByAI: true
  },
  {
    id: 'TKT-8924',
    equipmentId: 'EQ-CNC-04',
    equipmentName: 'Haas Mini Mill 3-Axis CNC Machining Center',
    title: 'Spindle Bearing Radial Vibration Harmonic Degradation (E12)',
    priority: 'P2 - HIGH',
    status: 'IN_PROGRESS',
    createdAt: '2026-09-06 11:20',
    scheduledDate: '2026-09-07 09:30',
    problemDescription: 'Harmonic vibration at 12,000 RPM reaching 4.6 mm/s with 2X spindle frequency signature. Ceramic bearing cartridge wear detected by predictive model.',
    suggestedSpareParts: [
      { partNumber: 'SPN-BRG-88', name: 'High-Precision Angular Contact Ceramic Bearing Set', quantity: 1, inStock: true, estimatedCost: 680 }
    ],
    recommendedTechnicianAction: [
      'Measure spindle taper runout using dial test indicator.',
      'Check drive belt acoustic tension.',
      'Prepare spindle cartridge swap if runout exceeds 0.003 mm.'
    ],
    assignedTechnician: 'Marcus Vance',
    generatedByAI: true
  }
];

export const EQUIPMENT_MANUALS = [
  {
    id: 'MAN-FL-4L',
    equipmentId: 'EQ-3D-01',
    equipmentModel: 'Formlabs Form 4L Industrial SLA',
    title: 'Form 4L Engineering Service & Preventative Maintenance Manual (Rev 4.2)',
    category: 'SERVICE_GUIDE',
    sections: [
      {
        sectionNumber: 'Section 8.4',
        title: 'Closed-Loop Thermal Subsystem & Chiller Diagnostics',
        content: 'The Form 4L uses a sealed closed-loop dielectric liquid heat pipe with auxiliary dual-radiator cooling to maintain laser diode array temperature at 45.0°C ± 1.5°C. When error E45 is declared, the MCU has registered a radiator intake-to-exhaust thermal gradient delta > 18.5°C or optical housing thermistor > 75°C. Immediate action requires inspecting coolant fill level through the optical glass reservoir. If particulate turbidity is observed, drain and flush using 2.0L ASTM Type 1 glycol solution (Part #CLN-GLY-44). Re-apply thermal interface paste (Part #TIM-772) if heatsink contact pressure has relaxed.',
        keywords: ['E45', 'cooling', 'chiller', 'radiator', 'glycol', 'temperature', 'fan', 'thermal paste']
      },
      {
        sectionNumber: 'Section 4.1',
        title: 'Galvanometer Optical Assembly Cleaning & Laser Power Calibration',
        content: 'Optical window contamination directly degrades cured polymer mechanical properties. Clean the optical quartz window weekly using spectroscopic-grade anhydrous isopropyl alcohol (IPA > 99.8%) and polyester cleanroom swabs (Class 100). Never use cotton swabs which shed fibers. Perform laser power photodiode verification using the internal calibration test grid.',
        keywords: ['optical', 'laser', 'galvo', 'cleaning', 'window', 'IPA', 'calibration']
      },
      {
        sectionNumber: 'Section 12.3',
        title: 'Lead Screw & Linear Z-Axis Rail Lubrication Schedule',
        content: 'Every 500 operating hours, apply 1.5 mL of synthetic lithium-PTFE grease along the precision ground ballscrew. Wipe excess build-up to prevent contamination of the optical engine chamber beneath the resin tank.',
        keywords: ['ballscrew', 'lubrication', 'grease', 'z-axis', 'stepper']
      }
    ]
  },
  {
    id: 'MAN-HS-MM',
    equipmentId: 'EQ-CNC-04',
    equipmentModel: 'Haas Mini Mill HE-30',
    title: 'Haas Mini Mill Maintenance, Spindle Dynamics & Diagnostics Guide',
    category: 'SERVICE_GUIDE',
    sections: [
      {
        sectionNumber: 'Section 11.2',
        title: 'Mechanical Spindle Dynamics and Bearing Tolerance (Code E12)',
        content: 'Spindle bearing wear produces distinct frequency peaks at the ball pass frequency of the outer ring (BPFO) and inner ring (BPFI). Error code E12 triggers when RMS vibration exceeds 4.5 mm/s over 3 consecutive cutting cycles. Before bearing cartridge replacement, verify toolholder taper contact using Prussian Blue dye (minimum 80% contact required). If replacement is necessary, install factory matched pair ceramic hybrid bearings (Part #SPN-BRG-88) torqued to 35 Nm.',
        keywords: ['E12', 'spindle', 'vibration', 'bearing', 'taper', 'runout', 'harmonics']
      },
      {
        sectionNumber: 'Section 3.5',
        title: 'Way Lube & Pneumatic Purge Pressure Verification',
        content: 'Ensure pneumatic regulator supplies 85–90 PSI clean, dry air. Low air pressure results in poor tool clamp retention and spindle taper contamination during automatic tool changes (ATC).',
        keywords: ['pneumatic', 'way lube', 'ATC', 'air pressure', 'toolholder']
      }
    ]
  },
  {
    id: 'MAN-BC-XPN',
    equipmentId: 'EQ-CEN-05',
    equipmentModel: 'Beckman Coulter Optima XPN-100',
    title: 'Optima XPN Ultracentrifuge High-Vacuum and Drive System Manual',
    category: 'SERVICE_GUIDE',
    sections: [
      {
        sectionNumber: 'Section 14.3',
        title: 'Vacuum Column Maintenance, Leak Hunting & Turbo Pumps (Code E77)',
        content: 'Error E77 indicates failure of the diffusion/turbo vacuum pump system to achieve evacuation within the programmed 45-minute window. Inspect the chamber lid fluoroelastomer O-ring for microscopic debris or dry cracks. Clean using ultra-high vacuum lintless wipes and apply a microscopic film of Krytox LVP grease. Replace the oil-mist coalescing vacuum filter (Part #FLT-VAK-19) every 1,500 run hours.',
        keywords: ['E77', 'vacuum', 'diffusion pump', 'turbo', 'O-ring', 'Krytox', 'rotor']
      },
      {
        sectionNumber: 'Section 7.2',
        title: 'Imbalance Sensor Calibration and Dynamic Gyro Stabilization',
        content: 'The dynamic imbalance sensor protects laboratory personnel from rotor catastrophic failure. The system will automatically shut down drive power if optical wobble exceeds 0.25 mm. Ensure rotor samples are balanced within 0.10 grams using analytical balance.',
        keywords: ['imbalance', 'rotor', 'safety', 'gyro', 'shutdown']
      }
    ]
  },
  {
    id: 'MAN-KS-MXR',
    equipmentId: 'EQ-OSC-07',
    equipmentModel: 'Keysight Infiniium MXR-Series 6GHz',
    title: 'Keysight Infiniium MXR Operating and Component-Level Service Manual',
    category: 'OPERATING_MANUAL',
    sections: [
      {
        sectionNumber: 'Section 4.7',
        title: 'Power Stage Diagnostics & DC Bus Filtering (Code E24)',
        content: 'The internal power distribution assembly converts AC mains into regulated +48V, +12V, +3.3V, and -5V analog rails for the 10-bit high-speed ADC converters. Error E24 denotes excessive ripple (>850 mV) on the 48V switching rail, commonly triggered by drying of high-temperature electrolytic filter capacitors (Part #CAP-48V-220). Inspect power board test point TP-48 for sinusoidal AC ripple voltage using external multimeter or scope probe.',
        keywords: ['E24', 'power supply', 'DC bus', 'ripple', 'capacitor', 'voltage', 'ADC']
      }
    ]
  }
];
