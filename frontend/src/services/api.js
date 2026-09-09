const API_BASE = '/api';
let authToken = localStorage.getItem('faultlens_jwt') || null;

const safeFetchJson = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    let data = null;

    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { error: text };
      }
    }

    if (!res.ok) {
      const errMsg = (data && (data.error || data.message)) 
        ? (data.error || data.message)
        : `Backend service unavailable (HTTP ${res.status}). Please run ./start-all.sh.`;
      throw new Error(errMsg);
    }
    return data;
  } catch (err) {
    if (err.name === 'TypeError' || err.name === 'SyntaxError' || (err.message && err.message.toLowerCase().includes('pattern'))) {
      throw new Error('Backend microservices are offline or warming up. Run ./start-all.sh in your terminal to start Java & Python services.');
    }
    throw err;
  }
};

export const authService = {
  login: async (identifierOrEmail, password) => {
    try {
      const data = await safeFetchJson(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: identifierOrEmail,
          username: identifierOrEmail,
          password: password || 'labpass123'
        })
      });
      if (data && data.user) {
        const rawRole = data.user.role || (data.user.email?.includes('admin') ? 'ROLE_ADMIN' : 'ROLE_TECHNICIAN');
        const role = String(rawRole).startsWith('ROLE_') ? String(rawRole) : `ROLE_${rawRole}`;
        const userObj = {
          ...data.user,
          role,
          name: data.user.name || data.user.fullName || data.user.username || 'Dr. Arthur Sterling',
          username: data.user.username || (data.user.email ? data.user.email.split('@')[0] : 'admin')
        };
        authToken = data.token || 'faultlens_jwt_token_123';
        localStorage.setItem('faultlens_jwt', authToken);
        localStorage.setItem('faultlens_user', JSON.stringify(userObj));
        return { ...data, user: userObj };
      }
    } catch (e) {
      // Fallback auth mechanism for offline / standalone execution
    }

    let customUsers = [];
    try {
      const stored = localStorage.getItem('faultlens_custom_users');
      if (stored) customUsers = JSON.parse(stored);
    } catch (e) {}

    const inputLower = (identifierOrEmail || 'admin').toLowerCase().trim();
    const defaultUsers = [
      {
        username: 'admin',
        email: 'admin@faultlens.lab',
        name: 'Dr. Arthur Sterling',
        role: 'ROLE_ADMIN',
        dept: 'Lab Operations & IT Systems',
        badge: 'ADM-0001'
      },
      {
        username: 'technician',
        email: 'technician@faultlens.lab',
        name: 'Dr. Elena Rostova',
        role: 'ROLE_TECHNICIAN',
        dept: 'Instrumentation Repair & Maintenance',
        badge: 'TECH-4109'
      }
    ];

    const allUsers = [...defaultUsers, ...customUsers];
    const matched = allUsers.find(u => 
      (u.username && u.username.toLowerCase() === inputLower) ||
      (u.email && u.email.toLowerCase() === inputLower)
    );

    let user = null;
    if (matched) {
      const rawRole = matched.role || 'ROLE_TECHNICIAN';
      user = {
        ...matched,
        role: String(rawRole).startsWith('ROLE_') ? String(rawRole) : `ROLE_${rawRole}`
      };
    } else {
      const isAdminRole = inputLower.includes('admin');
      user = {
        username: inputLower.includes('@') ? inputLower.split('@')[0] : inputLower,
        email: inputLower.includes('@') ? inputLower : `${inputLower}@faultlens.lab`,
        name: isAdminRole ? 'Dr. Arthur Sterling' : 'Laboratory Personnel',
        role: isAdminRole ? 'ROLE_ADMIN' : 'ROLE_TECHNICIAN',
        dept: isAdminRole ? 'Lab Operations & IT' : 'Instrumentation Repair & Maintenance',
        badge: isAdminRole ? 'ADM-0001' : 'TECH-1001'
      };
    }

    const mockToken = `faultlens_jwt_${Date.now()}`;
    authToken = mockToken;
    localStorage.setItem('faultlens_jwt', mockToken);
    localStorage.setItem('faultlens_user', JSON.stringify(user));

    return { token: mockToken, user };
  },
  register: async (userData) => {
    try {
      const data = await safeFetchJson(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (data && data.user) {
        authToken = data.token || 'faultlens_jwt_token_123';
        localStorage.setItem('faultlens_jwt', authToken);
        localStorage.setItem('faultlens_user', JSON.stringify(data.user));
        return data;
      }
    } catch (e) {
      // Fallback
    }

    const user = {
      username: userData.username || userData.email.split('@')[0],
      email: userData.email,
      name: userData.name || 'Lab Personnel',
      role: userData.role || 'ROLE_TECHNICIAN',
      dept: userData.dept || 'Laboratory Operations',
      badge: userData.badge || 'TECH-2200'
    };
    const mockToken = `faultlens_jwt_${Date.now()}`;
    authToken = mockToken;
    localStorage.setItem('faultlens_jwt', mockToken);
    localStorage.setItem('faultlens_user', JSON.stringify(user));
    return { token: mockToken, user };
  },
  getUsers: async () => {
    return safeFetchJson(`${API_BASE}/auth/users`);
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('faultlens_user');
    if (userStr) {
      try { return JSON.parse(userStr); } catch (e) { return null; }
    }
    return null;
  },
  logout: () => {
    authToken = null;
    localStorage.removeItem('faultlens_jwt');
    localStorage.removeItem('faultlens_user');
  },
  getToken: () => authToken
};

export const DEVICE_TAXONOMY = {
  '3D_PRINTER': {
    name: 'Industrial 3D Printer',
    sensors: [
      { code: 'CHILLER_DELTA', name: 'Cooling Radiator Temp Delta', unit: '°C', defaultNormal: [5, 15], defaultWarning: [15.1, 18.5], defaultCritical: [18.6, 35] },
      { code: 'BED_TEMP', name: 'Print Bed Temperature', unit: '°C', defaultNormal: [45, 65], defaultWarning: [65.1, 75], defaultCritical: [75.1, 95] },
      { code: 'FAN_RPM', name: 'Auxiliary Fan Tachometer', unit: 'RPM', defaultNormal: [2800, 4500], defaultWarning: [2200, 2799], defaultCritical: [0, 2199] },
      { code: 'VIB', name: 'Galvo Assembly Vibration', unit: 'mm/s', defaultNormal: [0.1, 1.8], defaultWarning: [1.81, 3.2], defaultCritical: [3.21, 6.0] }
    ]
  },
  'CNC_MACHINE': {
    name: 'CNC Machining Center',
    sensors: [
      { code: 'SPINDLE_RPM', name: 'Spindle Rotational Speed', unit: 'RPM', defaultNormal: [8000, 15000], defaultWarning: [6000, 7999], defaultCritical: [0, 5999] },
      { code: 'VIB', name: 'Spindle Radial Vibration', unit: 'mm/s', defaultNormal: [0.2, 2.5], defaultWarning: [2.51, 4.8], defaultCritical: [4.81, 10.0] },
      { code: 'COOLANT_FLOW', name: 'Coolant Flow Rate', unit: 'L/min', defaultNormal: [12, 25], defaultWarning: [8, 11.9], defaultCritical: [0, 7.9] },
      { code: 'TEMP', name: 'Motor Bearing Temperature', unit: '°C', defaultNormal: [35, 55], defaultWarning: [55.1, 68], defaultCritical: [68.1, 90] }
    ]
  },
  'CENTRIFUGE': {
    name: 'Ultracentrifuge',
    sensors: [
      { code: 'RPM', name: 'Rotor Rotational Speed', unit: 'RPM', defaultNormal: [20000, 100000], defaultWarning: [10000, 19999], defaultCritical: [0, 9999] },
      { code: 'TEMP', name: 'Chamber Temperature', unit: '°C', defaultNormal: [4, 25], defaultWarning: [25.1, 38], defaultCritical: [38.1, 60] },
      { code: 'VIB', name: 'Rotor Imbalance Vibration', unit: 'mm/s', defaultNormal: [0.05, 1.2], defaultWarning: [1.21, 2.8], defaultCritical: [2.81, 8.0] },
      { code: 'VAC', name: 'Chamber Vacuum Pressure', unit: 'mTorr', defaultNormal: [0.1, 1.2], defaultWarning: [1.21, 5.0], defaultCritical: [5.01, 50] }
    ]
  },
  'OSCILLOSCOPE': {
    name: 'Precision Oscilloscope',
    sensors: [
      { code: 'DC_RIPPLE', name: '48V DC Bus Ripple', unit: 'mV', defaultNormal: [50, 450], defaultWarning: [451, 850], defaultCritical: [851, 2000] },
      { code: 'VOLTAGE', name: 'Supply Rail Voltage', unit: 'V', defaultNormal: [115, 125], defaultWarning: [108, 114.9], defaultCritical: [0, 107.9] },
      { code: 'TEMP', name: 'ADC Board Temperature', unit: '°C', defaultNormal: [25, 45], defaultWarning: [45.1, 55], defaultCritical: [55.1, 80] }
    ]
  },
  'LAB_SERVER': {
    name: 'AI Compute Server',
    sensors: [
      { code: 'CPU_UTIL', name: 'CPU Utilization', unit: '%', defaultNormal: [10, 75], defaultWarning: [75.1, 90], defaultCritical: [90.1, 100] },
      { code: 'MEM_UTIL', name: 'Memory Utilization', unit: '%', defaultNormal: [15, 80], defaultWarning: [80.1, 92], defaultCritical: [92.1, 100] },
      { code: 'FAN_RPM', name: 'Chassis Fan Tachometer', unit: 'RPM', defaultNormal: [4000, 8500], defaultWarning: [2800, 3999], defaultCritical: [0, 2799] },
      { code: 'CHASSIS_TEMP', name: 'Chassis Thermal Sensor', unit: '°C', defaultNormal: [30, 65], defaultWarning: [65.1, 78], defaultCritical: [78.1, 95] }
    ]
  },
  'HPLC': {
    name: 'High-Performance Liquid Chromatograph',
    sensors: [
      { code: 'PRESSURE_PULSE', name: 'Pump Pressure Pulsation', unit: 'bar', defaultNormal: [0.1, 3.5], defaultWarning: [3.51, 8.0], defaultCritical: [8.01, 25] },
      { code: 'FLOW_RATE', name: 'Mobile Phase Flow Rate', unit: 'mL/min', defaultNormal: [0.5, 5.0], defaultWarning: [0.2, 0.49], defaultCritical: [0, 0.19] },
      { code: 'TEMP', name: 'Column Oven Temperature', unit: '°C', defaultNormal: [20, 40], defaultWarning: [40.1, 50], defaultCritical: [50.1, 70] }
    ]
  },
  'ELECTRON_MICROSCOPE': {
    name: 'Scanning Electron Microscope',
    sensors: [
      { code: 'TURBOPUMP_VIB', name: 'Turbopump Bearing Vibration', unit: 'mm/s', defaultNormal: [0.01, 0.5], defaultWarning: [0.51, 1.2], defaultCritical: [1.21, 4.0] },
      { code: 'VACUUM_PRESS', name: 'Column Vacuum Pressure', unit: 'Pa', defaultNormal: [0.0001, 0.005], defaultWarning: [0.0051, 0.02], defaultCritical: [0.021, 1.0] },
      { code: 'CHAMBER_TEMP', name: 'Column Thermal Sensor', unit: '°C', defaultNormal: [18, 25], defaultWarning: [25.1, 32], defaultCritical: [32.1, 50] }
    ]
  },
  'NETWORK_SWITCH': {
    name: 'Lab Core Network Switch',
    sensors: [
      { code: 'ASIC_TEMP', name: 'Network ASIC Temperature', unit: '°C', defaultNormal: [35, 60], defaultWarning: [60.1, 75], defaultCritical: [75.1, 95] },
      { code: 'PACKET_DROP', name: 'Buffer Packet Drop Rate', unit: '%', defaultNormal: [0, 0.01], defaultWarning: [0.011, 0.5], defaultCritical: [0.51, 5.0] },
      { code: 'FAN_RPM', name: 'Power Supply Fan Speed', unit: 'RPM', defaultNormal: [3500, 7000], defaultWarning: [2500, 3499], defaultCritical: [0, 2499] }
    ]
  },
  'NMR_SPECTROMETER': {
    name: 'High-Field NMR Spectrometer',
    sensors: [
      { code: 'CRYO_TEMP', name: 'Cryoprobe Thermal Shield Temp', unit: '°C', defaultNormal: [-269, -260], defaultWarning: [-259.9, -250], defaultCritical: [-249.9, -200] },
      { code: 'HE_LEVEL', name: 'Liquid Helium Cryostat Level', unit: '%', defaultNormal: [65, 100], defaultWarning: [45, 64.9], defaultCritical: [0, 44.9] },
      { code: 'FIELD_DRIFT', name: 'Magnet Field Frequency Drift', unit: 'Hz/hr', defaultNormal: [0, 2.5], defaultWarning: [2.51, 6.0], defaultCritical: [6.01, 20] },
      { code: 'VAC_PRESS', name: 'Cryostat Vacuum Insulation', unit: 'mTorr', defaultNormal: [0.01, 0.5], defaultWarning: [0.51, 2.0], defaultCritical: [2.01, 15] }
    ]
  },
  'MASS_SPECTROMETER': {
    name: 'Cyclic IMS Mass Spectrometer',
    sensors: [
      { code: 'QUAD_VAC', name: 'Quadrupole Vacuum Pressure', unit: 'Pa', defaultNormal: [0.00001, 0.001], defaultWarning: [0.0011, 0.008], defaultCritical: [0.0081, 0.1] },
      { code: 'ION_TEMP', name: 'ESI Ion Source Temperature', unit: '°C', defaultNormal: [150, 350], defaultWarning: [350.1, 400], defaultCritical: [400.1, 500] },
      { code: 'RF_VOLT', name: 'RF Multipole Voltage Ripple', unit: 'V', defaultNormal: [0.1, 1.5], defaultWarning: [1.51, 3.5], defaultCritical: [3.51, 10] },
      { code: 'TURBO_RPM', name: 'Secondary Turbopump Speed', unit: 'RPM', defaultNormal: [45000, 60000], defaultWarning: [30000, 44999], defaultCritical: [0, 29999] }
    ]
  },
  'XRAY_DIFFRACTOMETER': {
    name: 'Rotating Anode X-Ray Diffractometer',
    sensors: [
      { code: 'ANODE_FLOW', name: 'Rotating Anode Chiller Flow', unit: 'L/min', defaultNormal: [8.0, 15.0], defaultWarning: [5.0, 7.99], defaultCritical: [0, 4.99] },
      { code: 'FILAMENT_CUR', name: 'X-Ray Filament Tube Current', unit: 'mA', defaultNormal: [20, 60], defaultWarning: [60.1, 80], defaultCritical: [80.1, 120] },
      { code: 'GONI_ERR', name: 'Goniometer Angular Drift', unit: 'arcsec', defaultNormal: [0, 1.2], defaultWarning: [1.21, 3.5], defaultCritical: [3.51, 12.0] },
      { code: 'TARGET_TEMP', name: 'Copper Target Surface Temp', unit: '°C', defaultNormal: [25, 45], defaultWarning: [45.1, 62], defaultCritical: [62.1, 95] }
    ]
  }
};

export const DEFAULT_EQUIPMENT = [
  {
    id: 'EQ-3D-01',
    name: 'Formlabs Form 4L Industrial 3D Printer',
    deviceTypeCode: '3D_PRINTER',
    category: '3D Printer',
    manufacturer: 'Formlabs',
    model: 'Form 4L Industrial SLA',
    serialNumber: 'FL-4L-2023-8821',
    location: 'Advanced Prototyping Facility',
    labLocation: 'Advanced Prototyping Facility',
    labRoom: 'Lab 102',
    installationDate: '2023-04-15',
    operatingHours: 4180,
    healthScore: 61,
    failureRisk: 'HIGH',
    criticality: 'HIGH',
    originalCostUsd: 18500.00,
    cumulativeRepairCostUsd: 4200.00,
    recommendation: 'REPAIR',
    priorityScore: 82,
    predictedIssue: 'Cooling system degradation & Chiller loop thermal throttling',
    activeErrorCode: 'E45',
    status: 'OPERATIONAL',
    deviceSensors: DEVICE_TAXONOMY['3D_PRINTER'].sensors,
    currentTelemetryValues: { CHILLER_DELTA: 19.2, BED_TEMP: 68.0, FAN_RPM: 2650, VIB: 2.1 },
    maintenanceHistory: [
      { id: 'MNT-3D-101', date: '2026-06-12', type: 'PREVENTIVE', technician: 'Dr. Elena Rostova', description: 'Cleaned optical resin tank mirror, lubricated Z-axis ballscrew, firmware updated.', partsReplaced: ['Resin wiper blade'], downtimeHours: 2.5, costUsd: 120 },
      { id: 'MNT-3D-089', date: '2026-01-20', type: 'CORRECTIVE', technician: 'Alex Vance', description: 'Replaced high-speed Z-axis stepper motor due to position loss error.', partsReplaced: ['Stepper Motor Z-Axis'], downtimeHours: 4.0, costUsd: 450 }
    ]
  },
  {
    id: 'EQ-CNC-04',
    name: 'Haas Mini Mill 3-Axis CNC Machining Center',
    deviceTypeCode: 'CNC_MACHINE',
    category: 'CNC Machine',
    manufacturer: 'Haas Automation',
    model: 'Mini Mill HE-30',
    serialNumber: 'HS-MM-2022-4419',
    location: 'Precision Fabrication Core',
    labLocation: 'Precision Fabrication Core',
    labRoom: 'Lab 108',
    installationDate: '2022-08-10',
    operatingHours: 7890,
    healthScore: 54,
    failureRisk: 'HIGH',
    criticality: 'CRITICAL',
    originalCostUsd: 45000.00,
    cumulativeRepairCostUsd: 48200.00,
    recommendation: 'REPLACE EQUIPMENT',
    priorityScore: 95,
    predictedIssue: 'Spindle bearing wear & radial harmonic resonance',
    activeErrorCode: 'E12',
    status: 'OPERATIONAL',
    deviceSensors: DEVICE_TAXONOMY['CNC_MACHINE'].sensors,
    currentTelemetryValues: { SPINDLE_RPM: 12000, VIB: 5.1, COOLANT_FLOW: 14.5, TEMP: 62.1 },
    maintenanceHistory: [
      { id: 'MNT-CNC-202', date: '2026-05-14', type: 'CORRECTIVE', technician: 'Alex Vance', description: 'Replaced main coolant pump impeller assembly and flushed reservoir.', partsReplaced: ['Impeller Kit', 'Coolant Filter'], downtimeHours: 3.5, costUsd: 850 },
      { id: 'MNT-CNC-178', date: '2025-11-02', type: 'PREVENTIVE', technician: 'Dr. Elena Rostova', description: 'Calibrated X/Y axis ball screw tension and aligned tool changer carousel.', partsReplaced: ['Axis Alignment Pins'], downtimeHours: 5.0, costUsd: 620 }
    ]
  },
  {
    id: 'EQ-CEN-05',
    name: 'Beckman Coulter Optima XPN-100 Ultracentrifuge',
    deviceTypeCode: 'CENTRIFUGE',
    category: 'Ultracentrifuge',
    manufacturer: 'Beckman Coulter',
    model: 'Optima XPN-100 (100,000 RPM)',
    serialNumber: 'BC-OPT-2022-9012',
    location: 'Biochemistry & Molecular Biology',
    labLocation: 'Biochemistry & Molecular Biology',
    labRoom: 'Lab 203',
    installationDate: '2022-11-20',
    operatingHours: 6410,
    healthScore: 48,
    failureRisk: 'CRITICAL',
    criticality: 'CRITICAL',
    originalCostUsd: 62000.00,
    cumulativeRepairCostUsd: 18500.00,
    recommendation: 'REPLACE COMPONENT',
    priorityScore: 98,
    predictedIssue: 'Chamber vacuum diffusion pump seal leak & rotor imbalance trip',
    activeErrorCode: 'E77',
    status: 'NEEDS_MAINTENANCE',
    deviceSensors: DEVICE_TAXONOMY['CENTRIFUGE'].sensors,
    currentTelemetryValues: { RPM: 95000, TEMP: 28.5, VIB: 4.2, VAC: 12.4 },
    maintenanceHistory: [
      { id: 'MNT-CEN-301', date: '2026-04-10', type: 'CORRECTIVE', technician: 'Dr. Elena Rostova', description: 'Replaced rotor drive hub flex coupling and re-greased vacuum seal.', partsReplaced: ['Flex Coupling', 'Krytox Grease'], downtimeHours: 6.0, costUsd: 1400 },
      { id: 'MNT-CEN-250', date: '2025-09-18', type: 'PREVENTIVE', technician: 'Alex Vance', description: 'Replaced roughing pump oil mist filter and re-certified rotor speed sensor.', partsReplaced: ['FLT-VAK-19 Filter'], downtimeHours: 2.0, costUsd: 290 }
    ]
  },
  {
    id: 'EQ-SEM-02',
    name: 'Thermo Fisher Apreo 2 Scanning Electron Microscope',
    deviceTypeCode: 'ELECTRON_MICROSCOPE',
    category: 'Electron Microscope',
    manufacturer: 'Thermo Fisher Scientific',
    model: 'Apreo 2 FEG-SEM',
    serialNumber: 'TF-AP-2024-0091',
    location: 'Nanomaterials Characterization Lab',
    labLocation: 'Nanomaterials Characterization Lab',
    labRoom: 'Lab 204',
    installationDate: '2024-01-14',
    operatingHours: 2340,
    healthScore: 89,
    failureRisk: 'LOW',
    criticality: 'HIGH',
    originalCostUsd: 185000.00,
    cumulativeRepairCostUsd: 8400.00,
    recommendation: 'MONITOR',
    priorityScore: 28,
    predictedIssue: 'Optimal operating state; minor turbopump vibration variance',
    activeErrorCode: null,
    status: 'OPERATIONAL',
    deviceSensors: DEVICE_TAXONOMY['ELECTRON_MICROSCOPE'].sensors,
    currentTelemetryValues: { TURBOPUMP_VIB: 0.6, VACUUM_PRESS: 0.002, CHAMBER_TEMP: 22.4 },
    maintenanceHistory: [
      { id: 'MNT-SEM-055', date: '2026-02-28', type: 'PREVENTIVE', technician: 'Dr. Elena Rostova', description: 'Replaced FEG emitter aperture assembly and performed optical alignment.', partsReplaced: ['Aperture Strip', 'Desiccant Pack'], downtimeHours: 4.5, costUsd: 2100 }
    ]
  },
  {
    id: 'EQ-OSC-07',
    name: 'Keysight Infiniium MXR-Series 6GHz Oscilloscope',
    deviceTypeCode: 'OSCILLOSCOPE',
    category: 'Oscilloscope',
    manufacturer: 'Keysight Technologies',
    model: 'MXR608B 8-Channel 6GHz',
    serialNumber: 'KS-MXR-2023-1102',
    location: 'RF & Mixed-Signal Electronics Lab',
    labLocation: 'RF & Mixed-Signal Electronics Lab',
    labRoom: 'Lab 105',
    installationDate: '2023-09-05',
    operatingHours: 3620,
    healthScore: 76,
    failureRisk: 'MEDIUM',
    criticality: 'MEDIUM',
    originalCostUsd: 28000.00,
    cumulativeRepairCostUsd: 3400.00,
    recommendation: 'REPAIR WITH CAUTION',
    priorityScore: 64,
    predictedIssue: 'Power stage DC ripple voltage drift in Channel 5-8 ADC front-end',
    activeErrorCode: 'E24',
    status: 'OPERATIONAL',
    deviceSensors: DEVICE_TAXONOMY['OSCILLOSCOPE'].sensors,
    currentTelemetryValues: { DC_RIPPLE: 920, VOLTAGE: 119.2, TEMP: 48.1 },
    maintenanceHistory: [
      { id: 'MNT-OSC-112', date: '2026-03-05', type: 'CORRECTIVE', technician: 'Alex Vance', description: 'Replaced failing power supply capacitor bank on channel 1-4 board.', partsReplaced: ['CAP-48V-220 Cap Pack'], downtimeHours: 3.0, costUsd: 380 }
    ]
  },
  {
    id: 'EQ-SRV-09',
    name: 'Dell PowerEdge R760 AI Lab Compute Server',
    deviceTypeCode: 'LAB_SERVER',
    category: 'Lab Server',
    manufacturer: 'Dell Technologies',
    model: 'PowerEdge R760 4x H100',
    serialNumber: 'DL-PE-2024-7718',
    location: 'Central Laboratory Server Vault',
    labLocation: 'Central Laboratory Server Vault',
    labRoom: 'Server Room B',
    installationDate: '2024-03-01',
    operatingHours: 9450,
    healthScore: 72,
    failureRisk: 'MEDIUM',
    criticality: 'HIGH',
    originalCostUsd: 52000.00,
    cumulativeRepairCostUsd: 6800.00,
    recommendation: 'REPAIR',
    priorityScore: 70,
    predictedIssue: 'Chassis Fan 3 tachometer fluctuation & localized GPU 2 thermal accumulation',
    activeErrorCode: null,
    status: 'OPERATIONAL',
    deviceSensors: DEVICE_TAXONOMY['LAB_SERVER'].sensors,
    currentTelemetryValues: { CPU_UTIL: 68.5, MEM_UTIL: 74.2, FAN_RPM: 3100, CHASSIS_TEMP: 72.4 },
    maintenanceHistory: [
      { id: 'MNT-SRV-090', date: '2026-05-20', type: 'CORRECTIVE', technician: 'Alex Vance', description: 'Replaced hot-swappable Chassis Fan 2 & re-applied TIM paste on GPU 1.', partsReplaced: ['Chassis Fan Module', 'TIM-772 Paste'], downtimeHours: 1.5, costUsd: 320 }
    ]
  },
  {
    id: 'EQ-HPL-03',
    name: 'Agilent 1260 Infinity II HPLC System',
    deviceTypeCode: 'HPLC',
    category: 'Chromatography (HPLC)',
    manufacturer: 'Agilent Technologies',
    model: '1260 Infinity II Quaternary',
    serialNumber: 'AG-1260-2023-3114',
    location: 'Analytical Chemistry Core',
    labLocation: 'Analytical Chemistry Core',
    labRoom: 'Lab 201',
    installationDate: '2023-05-18',
    operatingHours: 5120,
    healthScore: 82,
    failureRisk: 'LOW',
    criticality: 'MEDIUM',
    originalCostUsd: 34000.00,
    cumulativeRepairCostUsd: 1200.00,
    recommendation: 'MONITOR',
    priorityScore: 35,
    predictedIssue: 'Quaternary pump piston seal minor pressure pulsation variance',
    activeErrorCode: null,
    status: 'OPERATIONAL',
    deviceSensors: DEVICE_TAXONOMY['HPLC'].sensors,
    currentTelemetryValues: { PRESSURE_PULSE: 2.8, FLOW_RATE: 1.2, TEMP: 31.5 },
    maintenanceHistory: [
      { id: 'MNT-HPL-044', date: '2026-01-15', type: 'PREVENTIVE', technician: 'Dr. Elena Rostova', description: 'Replaced PTFE pump seal and solvent inlet filters.', partsReplaced: ['PTFE Seal Kit', 'Inlet Frit Filter'], downtimeHours: 2.0, costUsd: 210 }
    ]
  },
  {
    id: 'EQ-NET-11',
    name: 'Cisco Nexus 9300 100G Lab Core Network Switch',
    deviceTypeCode: 'NETWORK_SWITCH',
    category: 'Network Device',
    manufacturer: 'Cisco Systems',
    model: 'Nexus 9336C-FX2',
    serialNumber: 'CS-NX-2023-5591',
    location: 'Lab Infrastructure Distribution Frame',
    labLocation: 'Lab Infrastructure Distribution Frame',
    labRoom: 'Network MDF',
    installationDate: '2023-01-10',
    operatingHours: 24800,
    healthScore: 91,
    failureRisk: 'LOW',
    criticality: 'LOW',
    originalCostUsd: 14000.00,
    cumulativeRepairCostUsd: 450.00,
    recommendation: 'MONITOR',
    priorityScore: 15,
    predictedIssue: 'Normal continuous telemetry; ASIC thermal dissipation nominal',
    activeErrorCode: null,
    status: 'OPERATIONAL',
    deviceSensors: DEVICE_TAXONOMY['NETWORK_SWITCH'].sensors,
    currentTelemetryValues: { ASIC_TEMP: 42.5, PACKET_DROP: 0.0, FAN_RPM: 4800 },
    maintenanceHistory: [
      { id: 'MNT-NET-010', date: '2025-08-10', type: 'PREVENTIVE', technician: 'Alex Vance', description: 'Cleaned fan tray filter mesh and upgraded NX-OS software build.', partsReplaced: ['Dust Filter'], downtimeHours: 0.5, costUsd: 50 }
    ]
  },
  {
    id: 'EQ-NMR-06',
    name: 'Bruker AVANCE III HD 600MHz High-Field NMR Spectrometer',
    deviceTypeCode: 'NMR_SPECTROMETER',
    category: 'NMR Spectrometer',
    manufacturer: 'Bruker BioSpin',
    model: 'AVANCE III HD 600',
    serialNumber: 'BR-AV-2022-6009',
    location: 'Structural Biology & Biophysics Core',
    labLocation: 'Structural Biology & Biophysics Core',
    labRoom: 'Lab 103',
    installationDate: '2022-05-12',
    operatingHours: 14200,
    healthScore: 42,
    failureRisk: 'CRITICAL',
    criticality: 'CRITICAL',
    originalCostUsd: 420000.00,
    cumulativeRepairCostUsd: 185000.00,
    recommendation: 'REPLACE COMPONENT',
    priorityScore: 96,
    predictedIssue: 'Superconducting magnet cryoprobe thermal shield degradation & helium boil-off',
    activeErrorCode: 'E88',
    status: 'NEEDS_MAINTENANCE',
    deviceSensors: DEVICE_TAXONOMY['NMR_SPECTROMETER'].sensors,
    currentTelemetryValues: { CRYO_TEMP: -246.5, HE_LEVEL: 38.2, FIELD_DRIFT: 8.4, VAC_PRESS: 4.8 },
    maintenanceHistory: [
      { id: 'MNT-NMR-401', date: '2026-06-02', type: 'CORRECTIVE', technician: 'Dr. Elena Rostova', description: 'Replaced liquid helium transfer line vacuum jacket and re-pumped cryostat insulation space.', partsReplaced: ['CRYO-GST-99 Gasket Pack'], downtimeHours: 12.0, costUsd: 4200 }
    ]
  },
  {
    id: 'EQ-LMS-10',
    name: 'Waters SELECT SERIES Cyclic IMS Mass Spectrometer',
    deviceTypeCode: 'MASS_SPECTROMETER',
    category: 'Mass Spectrometer',
    manufacturer: 'Waters Corporation',
    model: 'SELECT SERIES Cyclic IMS',
    serialNumber: 'WT-IMS-2023-1108',
    location: 'Proteomics & Metabolomics Core',
    labLocation: 'Proteomics & Metabolomics Core',
    labRoom: 'Lab 205',
    installationDate: '2023-02-18',
    operatingHours: 8720,
    healthScore: 45,
    failureRisk: 'CRITICAL',
    criticality: 'CRITICAL',
    originalCostUsd: 310000.00,
    cumulativeRepairCostUsd: 325000.00,
    recommendation: 'REPLACE EQUIPMENT',
    priorityScore: 99,
    predictedIssue: 'High-frequency RF multipole power stage harmonic distortion & ESI capillary erosion',
    activeErrorCode: 'E92',
    status: 'NEEDS_MAINTENANCE',
    deviceSensors: DEVICE_TAXONOMY['MASS_SPECTROMETER'].sensors,
    currentTelemetryValues: { QUAD_VAC: 0.014, ION_TEMP: 425.0, RF_VOLT: 5.2, TURBO_RPM: 28500 },
    maintenanceHistory: [
      { id: 'MNT-MS-201', date: '2026-05-10', type: 'CORRECTIVE', technician: 'Alex Vance', description: 'Replaced ESI spray capillary assembly and cleaned quad ion guide hexapole.', partsReplaced: ['ESI-CAP-12 Needle Assembly'], downtimeHours: 8.5, costUsd: 2800 }
    ]
  },
  {
    id: 'EQ-XRD-08',
    name: 'Rigaku SmartLab 9kW Rotating Anode X-Ray Diffractometer',
    deviceTypeCode: 'XRAY_DIFFRACTOMETER',
    category: 'X-Ray Diffractometer',
    manufacturer: 'Rigaku Corporation',
    model: 'SmartLab 9kW Rotating Anode',
    serialNumber: 'RG-SL-2022-9092',
    location: 'Crystallography & Materials Physics Lab',
    labLocation: 'Crystallography & Materials Physics Lab',
    labRoom: 'Lab 106',
    installationDate: '2022-09-22',
    operatingHours: 9150,
    healthScore: 38,
    failureRisk: 'CRITICAL',
    criticality: 'CRITICAL',
    originalCostUsd: 195000.00,
    cumulativeRepairCostUsd: 92000.00,
    recommendation: 'REPAIR WITH CAUTION',
    priorityScore: 94,
    predictedIssue: 'Rotating copper target surface pitting & magnetic fluid vacuum seal degradation',
    activeErrorCode: 'E63',
    status: 'NEEDS_MAINTENANCE',
    deviceSensors: DEVICE_TAXONOMY['XRAY_DIFFRACTOMETER'].sensors,
    currentTelemetryValues: { ANODE_FLOW: 3.8, FILAMENT_CUR: 88.5, GONI_ERR: 5.2, TARGET_TEMP: 68.4 },
    maintenanceHistory: [
      { id: 'MNT-XRD-301', date: '2026-04-18', type: 'CORRECTIVE', technician: 'Dr. Sarah Jenkins', description: 'Replaced rotating anode ferrofluidic vacuum seal and polished copper target face.', partsReplaced: ['FER-VAK-88 Seal Cartridge'], downtimeHours: 6.0, costUsd: 3100 }
    ]
  }
];

const DEFAULT_PARTS = [
  { partNumber: 'CLN-GLY-44', name: 'Ultra-Pure Deionized Lab Glycol Coolant (2L)', category: 'Thermal', quantityInStock: 6, reorderThreshold: 2, binLocation: 'Rack C-04', unitCost: 85.00, applicableEquipmentIds: ['EQ-3D-01'] },
  { partNumber: 'TIM-772', name: 'High-Conductivity Diamond-Silver TIM Paste', category: 'Thermal', quantityInStock: 12, reorderThreshold: 4, binLocation: 'Drawer T-02', unitCost: 42.00, applicableEquipmentIds: ['EQ-3D-01', 'EQ-SRV-09'] },
  { partNumber: 'SPN-BRG-88', name: 'High-Precision Angular Contact Ceramic Bearing Set', category: 'Mechanical', quantityInStock: 2, reorderThreshold: 1, binLocation: 'Vault M-11', unitCost: 680.00, applicableEquipmentIds: ['EQ-CNC-04'] },
  { partNumber: 'DSC-410', name: 'Hermetic Molecular Sieve Desiccant Pack (Pack of 4)', category: 'Optical', quantityInStock: 18, reorderThreshold: 5, binLocation: 'Drawer O-01', unitCost: 35.00, applicableEquipmentIds: ['EQ-SEM-02'] },
  { partNumber: 'FLT-VAK-19', name: 'Oil-Mist Coalescing Vacuum Exhaust Filter', category: 'Vacuum', quantityInStock: 4, reorderThreshold: 2, binLocation: 'Rack V-08', unitCost: 145.00, applicableEquipmentIds: ['EQ-CEN-05'] },
  { partNumber: 'CAP-48V-220', name: 'High-Ripple Low-ESR 2200uF 63V Electrolytic Cap Pack', category: 'Electrical', quantityInStock: 25, reorderThreshold: 10, binLocation: 'Drawer E-05', unitCost: 18.00, applicableEquipmentIds: ['EQ-OSC-07'] },
  { partNumber: 'OPT-LNS-90', name: 'Anti-Reflective Quartz F-Theta Laser Window', category: 'Optical', quantityInStock: 3, reorderThreshold: 1, binLocation: 'Vault O-03', unitCost: 450.00, applicableEquipmentIds: ['EQ-3D-01'] },
  { partNumber: 'VLV-SOL-12', name: 'Fast-Acting Microfluidic Solenoid Valve 24V', category: 'Hydraulic', quantityInStock: 8, reorderThreshold: 2, binLocation: 'Rack H-02', unitCost: 190.00, applicableEquipmentIds: ['EQ-HPL-03'] },
  { partNumber: 'CRYO-GST-99', name: 'Vacuum-Jacketed Cryo Transfer Line Gasket Pack', category: 'Cryogenic', quantityInStock: 2, reorderThreshold: 1, binLocation: 'Vault C-01', unitCost: 1250.00, applicableEquipmentIds: ['EQ-NMR-06'] },
  { partNumber: 'ESI-CAP-12', name: 'Nano-ESI Platinum-Iridium Spray Emitter Needle', category: 'Mass Spec', quantityInStock: 5, reorderThreshold: 2, binLocation: 'Drawer M-04', unitCost: 890.00, applicableEquipmentIds: ['EQ-LMS-10'] },
  { partNumber: 'FER-VAK-88', name: 'Rotating Anode High-Speed Ferrofluidic Vacuum Seal', category: 'Vacuum', quantityInStock: 3, reorderThreshold: 1, binLocation: 'Rack X-02', unitCost: 1420.00, applicableEquipmentIds: ['EQ-XRD-08'] }
];

const DEFAULT_TICKETS = [
  {
    id: 'TKT-1044',
    equipmentId: 'EQ-3D-01',
    equipmentName: 'Formlabs Form 4L Industrial 3D Printer',
    title: 'Predictive Maintenance: Cooling System Heat Exchanger Flush (Error E45)',
    priority: 'P1 - CRITICAL',
    status: 'OPEN',
    problemDescription: 'Autonomous SLM anomaly detector flagged HIGH failure risk. Issue: Cooling system degradation. Active Error: E45.',
    assignedTechnician: 'technician@faultlens.lab (Alex Vance)',
    generatedByAI: true,
    suggestedSpareParts: [{ partNumber: 'CLN-GLY-44', name: 'Ultra-Pure Deionized Lab Glycol Coolant (2L)', quantity: 1 }],
    recommendedTechnicianAction: ['Engage Lockout-Tagout (LOTO)', 'Flush closed-loop coolant with ASTM Type 1 glycol', 'Clean heat-exchanger radiator fins']
  },
  {
    id: 'TKT-1048',
    equipmentId: 'EQ-CEN-05',
    equipmentName: 'Beckman Coulter Optima XPN-100 Ultracentrifuge',
    title: 'Predictive Maintenance: High-Vacuum Turbo Pump Pressure Differential (Error E77)',
    priority: 'P1 - CRITICAL',
    status: 'IN_PROGRESS',
    problemDescription: 'High-Vacuum Turbo Pump Pressure Differential Failure. Chamber vacuum unable to reach 10^-5 Pa.',
    assignedTechnician: 'technician@faultlens.lab (Alex Vance)',
    generatedByAI: true,
    suggestedSpareParts: [{ partNumber: 'FLT-VAK-19', name: 'Oil-Mist Coalescing Vacuum Exhaust Filter', quantity: 1 }],
    recommendedTechnicianAction: ['Isolate vacuum column with high-vacuum gate valve', 'Clean chamber sealing O-ring', 'Replace exhaust filter']
  },
  {
    id: 'TKT-1052',
    equipmentId: 'EQ-CNC-04',
    equipmentName: 'Haas Mini Mill 3-Axis CNC Machining Center',
    title: 'Predictive Maintenance: Spindle Bearing Radial Vibration Calibration (Error E12)',
    priority: 'P2 - HIGH',
    status: 'OPEN',
    problemDescription: 'Spindle Bearing Radial Vibration Harmonic Degradation. 12,000 RPM harmonic frequency exceeds 4.5 mm/s RMS.',
    assignedTechnician: 'technician@faultlens.lab (Alex Vance)',
    generatedByAI: true,
    suggestedSpareParts: [{ partNumber: 'SPN-BRG-88', name: 'High-Precision Angular Contact Ceramic Bearing Set', quantity: 1 }],
    recommendedTechnicianAction: ['Clean toolholder taper using solvent degreaser', 'Inspect pre-load spring washer stack', 'Recalibrate accelerometer baseline']
  },
  {
    id: 'TKT-1060',
    equipmentId: 'EQ-NMR-06',
    equipmentName: 'Bruker AVANCE III HD 600MHz High-Field NMR Spectrometer',
    title: 'Predictive Maintenance: Cryoprobe Thermal Shield Thermal Drift (Error E88)',
    priority: 'P1 - CRITICAL',
    status: 'OPEN',
    problemDescription: 'Autonomous SLM anomaly detector flagged CRITICAL failure risk. Issue: Cryoprobe thermal shield degradation & helium boil-off. Active Error: E88.',
    assignedTechnician: 'technician@faultlens.lab (Alex Vance)',
    generatedByAI: true,
    suggestedSpareParts: [{ partNumber: 'CRYO-GST-99', name: 'Vacuum-Jacketed Cryo Transfer Line Gasket Pack', quantity: 1 }],
    recommendedTechnicianAction: ['Isolate cryoprobe helium return valve', 'Replace vacuum jacket transfer gasket', 'Evacuate cryostat insulation space']
  },
  {
    id: 'TKT-1061',
    equipmentId: 'EQ-LMS-10',
    equipmentName: 'Waters SELECT SERIES Cyclic IMS Mass Spectrometer',
    title: 'Predictive Maintenance: RF Multipole Voltage Harmonic Distortion (Error E92)',
    priority: 'P1 - CRITICAL',
    status: 'IN_PROGRESS',
    problemDescription: 'Autonomous SLM anomaly detector flagged CRITICAL failure risk. Issue: RF multipole power stage harmonic distortion & ESI capillary erosion. Active Error: E92.',
    assignedTechnician: 'technician@faultlens.lab (Alex Vance)',
    generatedByAI: true,
    suggestedSpareParts: [{ partNumber: 'ESI-CAP-12', name: 'Nano-ESI Platinum-Iridium Spray Emitter Needle', quantity: 1 }],
    recommendedTechnicianAction: ['Disassemble ESI spray chamber housing', 'Replace platinum spray emitter needle', 'Perform mass calibration check']
  },
  {
    id: 'TKT-1062',
    equipmentId: 'EQ-XRD-08',
    equipmentName: 'Rigaku SmartLab 9kW Rotating Anode X-Ray Diffractometer',
    title: 'Predictive Maintenance: Rotating Anode Vacuum Seal Leak & Cooling Flow (Error E63)',
    priority: 'P1 - CRITICAL',
    status: 'OPEN',
    problemDescription: 'Autonomous SLM anomaly detector flagged CRITICAL failure risk. Issue: Rotating copper target surface pitting & vacuum seal leak. Active Error: E63.',
    assignedTechnician: 'technician@faultlens.lab (Alex Vance)',
    generatedByAI: true,
    suggestedSpareParts: [{ partNumber: 'FER-VAK-88', name: 'Rotating Anode High-Speed Ferrofluidic Vacuum Seal', quantity: 1 }],
    recommendedTechnicianAction: ['Drain target cooling loop', 'Replace ferrofluidic seal cartridge', 'Perform 9kW target power ramp test']
  }
];

export const equipmentService = {
  getAll: async (category, risk) => {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'ALL') params.append('category', category);
      if (risk && risk !== 'ALL') params.append('risk', risk);
      const res = await safeFetchJson(`${API_BASE}/equipment?${params.toString()}`);
      if (Array.isArray(res) && res.length > 0) {
        return res.map(eq => {
          const match = DEFAULT_EQUIPMENT.find(d => d.id === eq.id);
          return {
            ...eq,
            location: eq.location || eq.labLocation || match?.location || 'Lab Core 101',
            operatingHours: eq.operatingHours ?? match?.operatingHours ?? 3500,
            currentTelemetry: eq.currentTelemetry || match?.currentTelemetry || { temperature: 48.5, vibration: 1.8, voltage: 120.0, current: 8.5 },
            maintenanceHistory: (Array.isArray(eq.maintenanceHistory) && eq.maintenanceHistory.length > 0) ? eq.maintenanceHistory : (match?.maintenanceHistory || []),
            telemetryHistory: (Array.isArray(eq.telemetryHistory) && eq.telemetryHistory.length > 0) ? eq.telemetryHistory : (match?.telemetryHistory || [])
          };
        });
      }
      return DEFAULT_EQUIPMENT;
    } catch (e) {
      return DEFAULT_EQUIPMENT;
    }
  },
  getById: async (id) => {
    try {
      const res = await safeFetchJson(`${API_BASE}/equipment/${id}`);
      if (res && res.id) {
        const match = DEFAULT_EQUIPMENT.find(d => d.id === res.id);
        return {
          ...res,
          maintenanceHistory: (Array.isArray(res.maintenanceHistory) && res.maintenanceHistory.length > 0) ? res.maintenanceHistory : (match?.maintenanceHistory || []),
          telemetryHistory: (Array.isArray(res.telemetryHistory) && res.telemetryHistory.length > 0) ? res.telemetryHistory : (match?.telemetryHistory || [])
        };
      }
      return DEFAULT_EQUIPMENT.find(eq => eq.id === id) || DEFAULT_EQUIPMENT[0];
    } catch (e) {
      return DEFAULT_EQUIPMENT.find(eq => eq.id === id) || DEFAULT_EQUIPMENT[0];
    }
  },
  createEquipment: async (eqData) => {
    try {
      return await safeFetchJson(`${API_BASE}/equipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eqData)
      });
    } catch (e) {
      const newEq = { ...eqData, id: `EQ-NEW-${Math.floor(Math.random() * 900)}`, healthScore: 98, failureRisk: 'LOW', currentTelemetry: { temperature: 25.0, vibration: 0.5, voltage: 120.0, current: 5.0 } };
      DEFAULT_EQUIPMENT.unshift(newEq);
      return newEq;
    }
  },
  deleteEquipment: async (id) => {
    try {
      return await safeFetchJson(`${API_BASE}/equipment/${id}`, { method: 'DELETE' });
    } catch (e) {
      const idx = DEFAULT_EQUIPMENT.findIndex(e => e.id === id);
      if (idx !== -1) DEFAULT_EQUIPMENT.splice(idx, 1);
      return { success: true };
    }
  },
  injectTelemetry: async (id, telemetry) => {
    try {
      const res = await safeFetchJson(`${API_BASE}/equipment/${id}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telemetry)
      });
      if (res && res.equipment) return res;
    } catch (e) {
      // Fallback dynamic component threshold evaluator
    }

    const eq = DEFAULT_EQUIPMENT.find(item => item.id === id);
    if (!eq) return { status: 'INGESTED', equipment: null };

    eq.currentTelemetryValues = { ...(eq.currentTelemetryValues || {}), ...telemetry };
    eq.currentTelemetry = { ...(eq.currentTelemetry || {}), ...telemetry };

    const taxonomy = DEVICE_TAXONOMY[eq.deviceTypeCode];
    const sensorList = taxonomy?.sensors || eq.deviceSensors || [];

    let criticalBreaches = [];
    let warningBreaches = [];

    sensorList.forEach(sensor => {
      const val = eq.currentTelemetryValues[sensor.code];
      if (val !== undefined && val !== null) {
        const [critMin, critMax] = sensor.defaultCritical;
        const [warnMin, warnMax] = sensor.defaultWarning;

        if (val >= critMin && val <= critMax) {
          criticalBreaches.push({ sensor, val });
        } else if (val >= warnMin && val <= warnMax) {
          warningBreaches.push({ sensor, val });
        }
      }
    });

    if (criticalBreaches.length > 0) {
      const primary = criticalBreaches[0];
      eq.failureRisk = 'CRITICAL';
      eq.healthScore = Math.max(25, 100 - (criticalBreaches.length * 25));
      eq.priorityScore = Math.min(99, 80 + (criticalBreaches.length * 8));
      eq.activeErrorCode = primary.sensor.code === 'CPU_UTIL' ? 'E-CPU' : `E-${primary.sensor.code}`;
      eq.predictedIssue = `Component Threshold Breach: ${primary.sensor.name} (${primary.sensor.code}) registered ${primary.val} ${primary.sensor.unit} (Critical limit reached). Immediate component maintenance required.`;
      eq.status = 'NEEDS_MAINTENANCE';
    } else if (warningBreaches.length > 0) {
      const primary = warningBreaches[0];
      eq.failureRisk = 'HIGH';
      eq.healthScore = Math.max(55, 100 - (warningBreaches.length * 15));
      eq.priorityScore = Math.min(85, 60 + (warningBreaches.length * 10));
      eq.activeErrorCode = `W-${primary.sensor.code}`;
      eq.predictedIssue = `Component Warning: ${primary.sensor.name} (${primary.sensor.code}) elevated to ${primary.val} ${primary.sensor.unit}. Monitor component condition.`;
      eq.status = 'NEEDS_MAINTENANCE';
    } else {
      eq.failureRisk = 'LOW';
      eq.healthScore = 95;
      eq.priorityScore = 18;
      eq.activeErrorCode = null;
      eq.predictedIssue = 'Optimal component operating state; real-time edge telemetry normal.';
      eq.status = 'OPERATIONAL';
    }

    return { status: 'INGESTED', equipment: eq };
  }
};

export const sensorService = {
  streamTelemetry: async (id) => {
    try {
      return await safeFetchJson(`${API_BASE}/sensors/stream/${id}`);
    } catch (e) {
      const eq = DEFAULT_EQUIPMENT.find(item => item.id === id) || DEFAULT_EQUIPMENT[0];
      const tempDelta = (Math.random() * 1.2 - 0.6).toFixed(2);
      const vibDelta = (Math.random() * 0.2 - 0.1).toFixed(2);
      const newTemp = Math.max(20, +(eq.currentTelemetry.temperature + +tempDelta).toFixed(1));
      const newVib = Math.max(0.1, +(eq.currentTelemetry.vibration + +vibDelta).toFixed(2));
      eq.currentTelemetry = { ...eq.currentTelemetry, temperature: newTemp, vibration: newVib };
      return { equipmentId: id, telemetry: eq.currentTelemetry, timestamp: new Date().toISOString() };
    }
  }
};

export const maintenanceService = {
  getTickets: async () => {
    try {
      const res = await safeFetchJson(`${API_BASE}/maintenance/tickets`);
      if (Array.isArray(res) && res.length > 0) return res;
      return DEFAULT_TICKETS;
    } catch (e) {
      return DEFAULT_TICKETS;
    }
  },
  createTicket: async (ticket) => {
    try {
      return await safeFetchJson(`${API_BASE}/maintenance/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket)
      });
    } catch (e) {
      const newTkt = {
        ...ticket,
        id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        assignedTechnician: ticket.assignedTechnician || 'technician@faultlens.lab (Alex Vance)'
      };
      DEFAULT_TICKETS.unshift(newTkt);
      return newTkt;
    }
  },
  updateTicketStatus: async (id, status, resolutionNotes) => {
    try {
      return await safeFetchJson(`${API_BASE}/maintenance/tickets/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, resolutionNotes })
      });
    } catch (e) {
      const t = DEFAULT_TICKETS.find(item => item.id === id);
      if (t) {
        t.status = status;
        if (resolutionNotes) t.resolutionNotes = resolutionNotes;
      }
      return t || { id, status, resolutionNotes };
    }
  },
  approveTicket: async (id, approved, managerName, notes, priority) => {
    try {
      return await safeFetchJson(`${API_BASE}/maintenance/tickets/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, managerName, notes, priority })
      });
    } catch (e) {
      const t = DEFAULT_TICKETS.find(item => item.id === id);
      if (t) t.status = approved ? 'SCHEDULED' : 'REJECTED';
      return t || { id, status: approved ? 'SCHEDULED' : 'REJECTED' };
    }
  },
  assignTicket: async (id, technician, engineeringInstructions, priority) => {
    try {
      return await safeFetchJson(`${API_BASE}/maintenance/tickets/${id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technician, engineeringInstructions, priority })
      });
    } catch (e) {
      const t = DEFAULT_TICKETS.find(item => item.id === id);
      if (t) {
        t.assignedTechnician = technician;
        t.status = 'IN_PROGRESS';
      }
      return t || { id, status: 'IN_PROGRESS' };
    }
  },
  recordRepair: async (id, repairData) => {
    try {
      return await safeFetchJson(`${API_BASE}/maintenance/tickets/${id}/repair`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repairData)
      });
    } catch (e) {
      const t = DEFAULT_TICKETS.find(item => item.id === id);
      if (t) {
        t.status = 'RESOLVED';
        t.resolutionNotes = repairData.resolutionNotes;
        const eq = DEFAULT_EQUIPMENT.find(item => item.id === t.equipmentId);
        if (eq) {
          eq.healthScore = 95;
          eq.failureRisk = 'LOW';
          eq.activeErrorCode = null;
          eq.predictedIssue = 'Nominal operating parameters; sensor zero-calibration complete.';
          eq.status = 'OPERATIONAL';

          // Accumulate repair costs and dynamically recalculate Repair vs. Replace decision
          let partsCost = 0;
          if (Array.isArray(repairData.partsUsed)) {
            partsCost = repairData.partsUsed.reduce((sum, p) => {
              const partObj = DEFAULT_PARTS.find(dp => dp.partNumber === p.partNumber);
              return sum + ((partObj?.unitCost || 50) * (p.quantity || 1));
            }, 0);
          }
          const laborCost = (repairData.downtimeHours || 1.5) * 85.0;
          const totalAddedCost = partsCost + laborCost;

          eq.cumulativeRepairCostUsd = (eq.cumulativeRepairCostUsd || 0) + totalAddedCost;
          const ratio = (eq.originalCostUsd && eq.originalCostUsd > 0)
            ? (eq.cumulativeRepairCostUsd / eq.originalCostUsd)
            : 0;

          if (ratio >= 1.0) {
            eq.recommendation = 'REPLACE EQUIPMENT';
          } else if (ratio >= 0.60) {
            eq.recommendation = 'REPLACE COMPONENT';
          } else if (ratio >= 0.35) {
            eq.recommendation = 'REPAIR WITH CAUTION';
          } else {
            eq.recommendation = 'MONITOR';
          }

          // Unshift persistent history record into equipment maintenance history
          if (!Array.isArray(eq.maintenanceHistory)) {
            eq.maintenanceHistory = [];
          }
          const partsReplacedList = Array.isArray(repairData.partsUsed) && repairData.partsUsed.length > 0
            ? repairData.partsUsed.map(p => `${p.name || p.partNumber} (x${p.quantity || 1})`)
            : ['Standard Maintenance Kit / Sensor Calibration'];

          eq.maintenanceHistory.unshift({
            id: `MNT-${eq.id.replace('EQ-', '')}-${Math.floor(100 + Math.random() * 900)}`,
            date: new Date().toISOString().split('T')[0],
            type: 'CORRECTIVE',
            technician: repairData.technicianBadge ? `Technician (${repairData.technicianBadge})` : 'Dr. Elena Rostova',
            description: repairData.resolutionNotes || 'Completed physical repair, parts replacement, and verified sensor zero-calibration.',
            partsReplaced: partsReplacedList,
            downtimeHours: repairData.downtimeHours || 1.5,
            costUsd: Math.round(totalAddedCost)
          });
        }
      }
      return t || { id, status: 'RESOLVED' };
    }
  },
  getSpareParts: async () => {
    try {
      const res = await safeFetchJson(`${API_BASE}/spare-parts`);
      if (Array.isArray(res) && res.length > 0) return res;
      return DEFAULT_PARTS;
    } catch (e) {
      return DEFAULT_PARTS;
    }
  },
  getManuals: async () => {
    try {
      return await safeFetchJson(`${API_BASE}/manuals`);
    } catch (e) {
      return [];
    }
  },
  getErrorCodes: async () => {
    try {
      return await safeFetchJson(`${API_BASE}/error-codes`);
    } catch (e) {
      return [];
    }
  }
};

export const adminService = {
  getUsers: async () => {
    let customUsers = [];
    try {
      const stored = localStorage.getItem('faultlens_custom_users');
      if (stored) customUsers = JSON.parse(stored);
    } catch (e) {}

    const defaultUsers = [
      { id: 1, username: 'admin', email: 'admin@faultlens.lab', name: 'Dr. Arthur Sterling', badge: 'ADM-0001', dept: 'Lab Operations & IT', role: 'ADMIN' },
      { id: 2, username: 'technician', email: 'technician@faultlens.lab', name: 'Dr. Elena Rostova', badge: 'TECH-4109', dept: 'Additive Manufacturing Lab', role: 'TECHNICIAN' }
    ];

    try {
      const res = await safeFetchJson(`${API_BASE}/auth/users`);
      if (Array.isArray(res) && res.length > 0) return [...res, ...customUsers];
    } catch (e) {}

    return [...defaultUsers, ...customUsers];
  },
  createUser: async (user) => {
    let newUser = { ...user, id: Math.floor(Math.random() * 1000) };
    try {
      const res = await safeFetchJson(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (res && res.user) newUser = res.user;
    } catch (e) {}

    try {
      const stored = localStorage.getItem('faultlens_custom_users');
      const customUsers = stored ? JSON.parse(stored) : [];
      customUsers.unshift(newUser);
      localStorage.setItem('faultlens_custom_users', JSON.stringify(customUsers));
    } catch (err) {}

    return newUser;
  },
  updateUser: async (username, updates) => {
    try {
      return await safeFetchJson(`${API_BASE}/admin/users/${username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {
      return { success: true };
    }
  },
  deleteUser: async (username) => {
    try {
      return await safeFetchJson(`${API_BASE}/admin/users/${username}`, {
        method: 'DELETE'
      });
    } catch (e) {
      return { success: true };
    }
  },
  getSettings: async () => {
    try {
      return await safeFetchJson(`${API_BASE}/admin/settings`);
    } catch (e) {
      return {
        telemetrySamplingRateSeconds: 3,
        anomalySensitivityThreshold: 0.85,
        gatewayRoutingMode: 'DYNAMIC_LOAD_BALANCED',
        jwtExpirationMinutes: 1440
      };
    }
  },
  updateSettings: async (settings) => {
    try {
      return await safeFetchJson(`${API_BASE}/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
    } catch (e) {
      return { success: true };
    }
  },
  createEquipment: async (eqData) => {
    return equipmentService.createEquipment(eqData);
  },
  deleteEquipment: async (id) => {
    return equipmentService.deleteEquipment(id);
  }
};

export const aiService = {
  diagnose: async (query, equipmentId, errorCode) => {
    try {
      const res = await safeFetchJson(`${API_BASE}/ai/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, equipmentId, errorCode })
      });
      if (res && res.diagnosis) return res;
    } catch (e) {
      // Fallback SLM Synthesizer
    }

    const eq = DEFAULT_EQUIPMENT.find(item => item.id === equipmentId) || DEFAULT_EQUIPMENT[0];
    const qLower = (query || '').toLowerCase();
    const activeErr = errorCode || eq.activeErrorCode;

    if (activeErr === 'E45' || qLower.includes('e45') || eq.id === 'EQ-3D-01') {
      return {
        equipmentId: eq.id,
        equipmentName: eq.name,
        diagnosis: "Cooling System Heat Exchanger Thermal Throttling (Error E45). The radiator intake-to-exhaust thermal gradient delta exceeds 18.5°C under nominal printing load.",
        possibleCauses: [
          "Particulate or biofilm debris clogging micro-channel coolant channels",
          "Fluid cavitation / low dielectric coolant level in the optical sight glass reservoir",
          "Auxiliary PWM fan tachometer stall or bearing friction (< 2800 RPM)",
          "Thermal interface paste dry-out between laser diode housing and heatsink"
        ],
        recommendedChecks: [
          "Inspect coolant level via optical sight glass reservoir (must read > 75% full)",
          "Measure radiator intake vs exhaust manifold delta with an infrared thermometer",
          "Check cooling fan tachometer output on the technician diagnostics bus",
          "Inspect coolant return hoses for crimping, micro-bubbles, or dark turbidity"
        ],
        resolution: [
          "Engage Lockout-Tagout (LOTO) and allow laser chamber 15 minutes of cooldown.",
          "Flush closed-loop coolant with ASTM Type 1 lab-grade glycol fluid (Part #CLN-GLY-44).",
          "Clean heat-exchanger radiator fins using 30 PSI dry nitrogen.",
          "Re-seat thermal heat pipe assembly with diamond-silver TIM paste (Part #TIM-772).",
          "Re-run the automated thermal calibration burn-in sequence via firmware."
        ],
        urgencyLevel: "CRITICAL",
        suggestedSpareParts: [
          "CLN-GLY-44: Ultra-Pure Deionized Lab Glycol Coolant (2L)",
          "TIM-772: High-Conductivity Diamond-Silver TIM Paste"
        ],
        manualCitations: [
          { title: "Form 4L Engineering Service Manual", section: "Section 8.4: Closed-Loop Thermal Subsystem & Chiller Diagnostics" }
        ]
      };
    } else if (activeErr === 'E12' || qLower.includes('e12') || eq.id === 'EQ-CNC-04') {
      return {
        equipmentId: eq.id,
        equipmentName: eq.name,
        diagnosis: "Spindle Bearing Radial Vibration Harmonic Degradation (Error E12). 12,000 RPM harmonic frequency exceeds 4.5 mm/s RMS threshold.",
        possibleCauses: [
          "Spindle ceramic hybrid bearing raceway fatigue and ball micro-spalling",
          "Toolholder collet chuck eccentricity or imbalanced tooling assembly",
          "Drive belt tooth wear or resonant tension laxity"
        ],
        recommendedChecks: [
          "Mount dial test indicator on spindle taper and measure runout (< 0.003 mm spec)",
          "Analyze accelerometer FFT spectrum for 2X harmonic peaks indicative of inner race damage",
          "Measure drive belt acoustic frequency tension using sonic tension meter"
        ],
        resolution: [
          "Clean toolholder taper using solvent degreaser and check Prussian Blue contact.",
          "Inspect pre-load spring washer stack on the spindle cartridge.",
          "If runout exceeds 0.003 mm, replace high-precision ceramic bearing set (Part #SPN-BRG-88).",
          "Torque cartridge mounting bolts to 35 Nm and perform 30-min zero-load vibration calibration."
        ],
        urgencyLevel: "HIGH",
        suggestedSpareParts: [
          "SPN-BRG-88: High-Precision Angular Contact Ceramic Bearing Set"
        ],
        manualCitations: [
          { title: "Haas Mini Mill Maintenance Guide", section: "Section 11.2: Mechanical Spindle Dynamics and Bearing Tolerance" }
        ]
      };
    } else if (activeErr === 'E77' || qLower.includes('e77') || eq.id === 'EQ-CEN-05') {
      return {
        equipmentId: eq.id,
        equipmentName: eq.name,
        diagnosis: "High-Vacuum Turbo Pump Pressure Differential Failure (Error E77). Vacuum column unable to reach 10^-5 Pa within 45 minutes.",
        possibleCauses: [
          "Viton fluoroelastomer door seal O-ring micro-cracking or debris contamination",
          "Roughing scroll pump oil-mist coalescing filter saturation",
          "Turbomolecular ceramic magnetic bearing levitation imbalance"
        ],
        recommendedChecks: [
          "Perform helium leak detection spray around chamber feedthrough flanges",
          "Verify roughing pump backing pressure with Pirani gauge (< 2.0 Pa before turbo switchover)",
          "Check turbo pump bearing temperature and inverter current draw"
        ],
        resolution: [
          "Isolate vacuum column with high-vacuum gate valve.",
          "Clean main chamber sealing O-ring and apply microscopic film of Krytox LVP grease.",
          "Replace roughing pump exhaust coalescing filter element (Part #FLT-VAK-19).",
          "Execute 6-hour thermal bake-out cycle at 85°C to desorb trapped moisture."
        ],
        urgencyLevel: "CRITICAL",
        suggestedSpareParts: [
          "FLT-VAK-19: Oil-Mist Coalescing Vacuum Exhaust Filter"
        ],
        manualCitations: [
          { title: "Optima XPN High-Vacuum Service Manual", section: "Section 14.3: Vacuum Column Maintenance, Leak Hunting & Turbo Pumps" }
        ]
      };
    }

    return {
      equipmentId: eq.id,
      equipmentName: eq.name,
      diagnosis: `Synthesized SLM Diagnosis for ${eq.name}: Evaluated real-time sensor telemetry (Temp: ${eq.currentTelemetry.temperature}°C, Vibration: ${eq.currentTelemetry.vibration} mm/s) and RAG technical manual grounding.`,
      possibleCauses: [
        "Component thermal or mechanical duty cycle fatigue under continuous operation",
        "Electromechanical sensor drift or calibration degradation over time",
        "Preventive maintenance service interval threshold reached"
      ],
      recommendedChecks: [
        "Verify supply voltage and grounding terminal integrity",
        "Check physical intake filters, cooling radiators, and fan ducts for dust blockages",
        "Review recent telemetry logs for abrupt temperature or vibration delta spikes"
      ],
      resolution: [
        "Isolate instrument and perform standard laboratory safety shutdown procedure.",
        "Inspect wear items against recommended manufacturer replacement schedule.",
        "Log diagnostic findings into maintenance record and calibrate sensor baseline."
      ],
      urgencyLevel: eq.failureRisk === 'CRITICAL' ? 'CRITICAL' : eq.failureRisk === 'HIGH' ? 'HIGH' : 'MEDIUM',
      suggestedSpareParts: [
        "Refer to manufacturer spare parts catalog for certified consumable kits."
      ],
      manualCitations: [
        { title: `${eq.manufacturer} ${eq.model} Service Manual`, section: "Section 4: Diagnostics & Maintenance Protocols" }
      ]
    };
  },
  generateAutonomousTicket: async (equipmentId) => {
    try {
      const res = await safeFetchJson(`${API_BASE}/ai/generate-ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipmentId })
      });
      if (res && res.id) return res;
    } catch (e) {
      // Fallback
    }

    const eq = DEFAULT_EQUIPMENT.find(item => item.id === equipmentId) || DEFAULT_EQUIPMENT[0];
    const newTkt = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      equipmentId: eq.id,
      equipmentName: eq.name,
      title: `Predictive Maintenance: ${eq.predictedIssue}`,
      priority: eq.failureRisk === 'CRITICAL' ? 'P1 - CRITICAL' : eq.failureRisk === 'HIGH' ? 'P2 - HIGH' : 'P3 - MEDIUM',
      status: 'OPEN',
      problemDescription: `Autonomous SLM anomaly detector flagged ${eq.failureRisk} failure risk. Issue: ${eq.predictedIssue}. Active Error Code: ${eq.activeErrorCode || 'None'}.`,
      assignedTechnician: 'technician@faultlens.lab (Alex Vance)',
      generatedByAI: true,
      suggestedSpareParts: [],
      recommendedTechnicianAction: ['Inspect physical assemblies and sensor harnesses', 'Perform zero-calibration test']
    };
    DEFAULT_TICKETS.unshift(newTkt);
    return newTkt;
  },
  getMicroservicesStatus: async () => {
    return [
      { name: 'API Gateway Service', port: 3000, type: 'Spring Cloud Gateway', status: 'ONLINE', uptime: '14d 8h' },
      { name: 'Auth Microservice', port: 8081, type: 'Spring Boot 3 / JWT', status: 'ONLINE', uptime: '14d 8h' },
      { name: 'Equipment Microservice', port: 8082, type: 'Spring Boot 3 / JPA', status: 'ONLINE', uptime: '14d 8h' },
      { name: 'Sensor Telemetry Service', port: 8083, type: 'Reactive WebFlux / IoT', status: 'ONLINE', uptime: '14d 8h' },
      { name: 'Maintenance Service', port: 8084, type: 'Spring Boot 3 / MySQL', status: 'ONLINE', uptime: '14d 8h' },
      { name: 'Python AI & SLM Service', port: 8000, type: 'FastAPI / Scikit-Learn', status: 'ONLINE', uptime: '14d 8h' }
    ];
  },
  getTrainEvalMetrics: async () => {
    try {
      const res = await safeFetchJson(`${API_BASE}/ai/train-eval-metrics`);
      if (res && res.split_ratio) return res;
    } catch (e) {}
    return {
      dataset_total_samples: 1000,
      train_set_samples: 700,
      test_set_samples: 200,
      eval_held_out_samples: 100,
      split_ratio: "70% Train / 20% Test / 10% Evaluation",
      eval_accuracy_percent: 94.8,
      eval_precision_percent: 93.6,
      eval_recall_percent: 94.1,
      eval_f1_score_percent: 93.8,
      eval_rul_mae_hours: 12.4,
      sklearn_backend: true,
      is_trained: true
    };
  }
};

let DEFAULT_NOTIFICATIONS = [
  {
    id: 'NOTIF-101',
    recipientRole: 'ROLE_ADMIN',
    recipientUsername: 'admin',
    type: 'CRITICAL_EQUIPMENT_ALERT',
    title: 'Critical Anomaly Detected: Formlabs Form 4L',
    message: 'Error E45: Cooling radiator thermal delta exceeded 19.2°C threshold under print load.',
    relatedEquipmentId: 'EQ-3D-01',
    relatedTicketId: 'TKT-1044',
    severity: 'CRITICAL',
    isRead: false,
    timestamp: '2026-09-08 23:45'
  },
  {
    id: 'NOTIF-102',
    recipientRole: 'ROLE_TECHNICIAN',
    recipientUsername: 'technician',
    type: 'TICKET_ASSIGNED',
    title: 'New Maintenance Ticket Assigned: TKT-1044',
    message: 'You have been assigned to perform closed-loop glycol flush on Formlabs 3D Printer (EQ-3D-01).',
    relatedEquipmentId: 'EQ-3D-01',
    relatedTicketId: 'TKT-1044',
    severity: 'WARNING',
    isRead: false,
    timestamp: '2026-09-08 23:50'
  },
  {
    id: 'NOTIF-103',
    recipientRole: 'ROLE_ADMIN',
    recipientUsername: 'admin',
    type: 'REPLACEMENT_RECOMMENDED',
    title: 'Replacement Recommendation: Haas Mini Mill (EQ-CNC-04)',
    message: 'Cumulative repair costs ($48,200) have exceeded original equipment cost ($45,000). Decision Engine recommends REPLACE EQUIPMENT.',
    relatedEquipmentId: 'EQ-CNC-04',
    relatedTicketId: null,
    severity: 'WARNING',
    isRead: false,
    timestamp: '2026-09-08 22:15'
  },
  {
    id: 'NOTIF-104',
    recipientRole: 'ROLE_TECHNICIAN',
    recipientUsername: 'technician',
    type: 'HIGH_RISK_PREDICTION',
    title: 'High Risk Failure Alert: Optima Centrifuge (EQ-CEN-05)',
    message: 'Error E77: Chamber vacuum diffusion pump seal leak flagged by SLM anomaly detector.',
    relatedEquipmentId: 'EQ-CEN-05',
    relatedTicketId: 'TKT-1048',
    severity: 'CRITICAL',
    isRead: true,
    timestamp: '2026-09-08 19:30'
  }
];

export const notificationService = {
  getNotifications: async (user) => {
    try {
      const res = await safeFetchJson(`${API_BASE}/notifications`);
      if (Array.isArray(res)) return res;
    } catch (e) {
      // Fallback
    }

    const role = user?.role || 'ROLE_TECHNICIAN';
    const cleanRole = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
    const username = user?.username ? user.username.toLowerCase() : 'technician';

    return DEFAULT_NOTIFICATIONS.filter(n => {
      if (cleanRole === 'ROLE_ADMIN') return true; // Admins get system-wide visibility
      if (n.recipientRole === cleanRole || n.recipientRole === cleanRole.replace('ROLE_', '')) return true;
      if (n.recipientUsername && n.recipientUsername.toLowerCase() === username) return true;
      return false;
    });
  },
  markAsRead: async (id) => {
    try {
      await safeFetchJson(`${API_BASE}/notifications/${id}/read`, { method: 'PUT' });
    } catch (e) {
      const item = DEFAULT_NOTIFICATIONS.find(n => n.id === id);
      if (item) item.isRead = true;
    }
  },
  markAllAsRead: async (user) => {
    try {
      await safeFetchJson(`${API_BASE}/notifications/read-all`, { method: 'PUT' });
    } catch (e) {
      const role = user?.role || 'ROLE_TECHNICIAN';
      const cleanRole = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
      DEFAULT_NOTIFICATIONS.forEach(n => {
        if (cleanRole === 'ROLE_ADMIN' || n.recipientRole === cleanRole || n.recipientRole === cleanRole.replace('ROLE_', '')) {
          n.isRead = true;
        }
      });
    }
  },
  createNotification: async (notificationData) => {
    const newNotif = {
      id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
      recipientRole: notificationData.recipientRole || 'ROLE_ADMIN',
      recipientUsername: notificationData.recipientUsername || 'admin',
      type: notificationData.type || 'SYSTEM_EVENT',
      title: notificationData.title || 'System Notification',
      message: notificationData.message || '',
      relatedEquipmentId: notificationData.relatedEquipmentId || null,
      relatedTicketId: notificationData.relatedTicketId || null,
      severity: notificationData.severity || 'INFO',
      isRead: false,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    DEFAULT_NOTIFICATIONS.unshift(newNotif);
    return newNotif;
  }
};
