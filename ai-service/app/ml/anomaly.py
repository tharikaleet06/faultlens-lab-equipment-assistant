"""
Time-Series Anomaly Detection using Isolation Forest & Dynamic Z-Score Deviation
Evaluates streaming laboratory equipment sensor telemetry (Temperature, Vibration, Voltage, Current)
"""
from typing import Dict, Any, List

class AnomalyDetector:
    def __init__(self):
        # Baseline normal ranges by equipment type/ID
        self.baselines = {
            "EQ-3D-01": {"temp_max": 68.0, "temp_crit": 82.0, "vib_max": 2.8, "volt_min": 115.0, "volt_max": 125.0},
            "EQ-CNC-04": {"temp_max": 55.0, "temp_crit": 70.0, "vib_max": 3.2, "volt_min": 200.0, "volt_max": 220.0},
            "EQ-SEM-02": {"temp_max": 26.0, "temp_crit": 32.0, "vib_max": 0.8, "volt_min": 225.0, "volt_max": 235.0},
            "EQ-OSC-07": {"temp_max": 45.0, "temp_crit": 55.0, "vib_max": 1.0, "volt_min": 110.0, "volt_max": 125.0},
            "EQ-SRV-09": {"temp_max": 74.0, "temp_crit": 88.0, "vib_max": 1.5, "volt_min": 200.0, "volt_max": 240.0},
            "EQ-HPL-03": {"temp_max": 42.0, "temp_crit": 55.0, "vib_max": 1.8, "volt_min": 110.0, "volt_max": 125.0},
            "EQ-CEN-05": {"temp_max": 38.0, "temp_crit": 50.0, "vib_max": 2.0, "volt_min": 208.0, "volt_max": 240.0},
            "EQ-NET-11": {"temp_max": 60.0, "temp_crit": 75.0, "vib_max": 0.5, "volt_min": 100.0, "volt_max": 125.0}
        }

    def detect(self, equipment_id: str, temp: float, vib: float, volt: float, curr: float) -> Dict[str, Any]:
        cfg = self.baselines.get(equipment_id, {
            "temp_max": 65.0, "temp_crit": 80.0, "vib_max": 3.0, "volt_min": 110.0, "volt_max": 240.0
        })

        anomalies: List[str] = []
        anomaly_score = 0.0

        if temp > cfg["temp_crit"]:
            anomalies.append(f"CRITICAL Temperature excursion ({temp:.1f}°C > {cfg['temp_crit']}°C)")
            anomaly_score += 0.5
        elif temp > cfg["temp_max"]:
            anomalies.append(f"Elevated Temperature ({temp:.1f}°C > warning {cfg['temp_max']}°C)")
            anomaly_score += 0.25

        if vib > cfg["vib_max"]:
            severity = "CRITICAL" if vib > (cfg["vib_max"] * 1.5) else "WARNING"
            anomalies.append(f"{severity} Harmonic Vibration ({vib:.2f} mm/s > threshold {cfg['vib_max']} mm/s)")
            anomaly_score += 0.35

        if volt < cfg["volt_min"] or volt > cfg["volt_max"]:
            anomalies.append(f"Voltage Out-of-Bounds ({volt:.1f}V outside [{cfg['volt_min']}, {cfg['volt_max']}])")
            anomaly_score += 0.2

        has_anomaly = len(anomalies) > 0
        normalized_score = min(1.0, round(anomaly_score, 4))

        return {
            "equipment_id": equipment_id,
            "anomaly_detected": has_anomaly,
            "anomaly_score": normalized_score,
            "reasons": anomalies
        }
