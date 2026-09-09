"""
Health Score Engineering Calculation
Blends Operating Hours, Anomaly Degradation, and Active Error Codes
"""
from typing import Dict, Any, Optional

class HealthScoreEngine:
    def calculate(
        self,
        operating_hours: int,
        temp: float,
        vib: float,
        volt: float,
        error_code: Optional[str] = None,
        has_anomaly: bool = False
    ) -> Dict[str, Any]:
        base_score = 100.0

        # Hours penalty: ~1 point per 800 hours
        hours_penalty = min(20.0, operating_hours / 800.0)
        base_score -= hours_penalty

        # Anomaly penalty
        if has_anomaly:
            base_score -= 15.0

        # Error code penalty
        if error_code == "E77":
            base_score -= 30.0
        elif error_code in ["E45", "E12"]:
            base_score -= 22.0
        elif error_code in ["E24", "E08"]:
            base_score -= 12.0

        # Clamp between 20 and 100
        health_score = int(max(20, min(100, round(base_score))))

        return {
            "health_score": health_score,
            "hours_penalty": round(hours_penalty, 2),
            "anomaly_factor_applied": has_anomaly
        }
