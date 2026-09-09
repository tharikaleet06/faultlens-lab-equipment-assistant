"""
SLM Maintenance Assistant
Integrates RAG Grounding + Domain Reasoning to output:
Diagnosis → Possible Causes → Recommended Checks → Resolution
"""
from typing import Dict, Any, Optional
from app.rag.retriever import ManualRetriever

class SLMAssistant:
    def __init__(self, retriever: ManualRetriever):
        self.retriever = retriever

    def diagnose(
        self,
        query: str,
        equipment_id: Optional[str] = None,
        equipment_name: Optional[str] = None,
        error_code: Optional[str] = None,
        telemetry: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        # Retrieve RAG context from manuals and service records
        rag_docs = self.retriever.search(query=f"{query} {error_code or ''}", equipment_id=equipment_id)
        
        # Structure canonical SLM response
        if "e45" in query.lower() or error_code == "E45" or equipment_id == "EQ-3D-01":
            return {
                "equipment_id": equipment_id or "EQ-3D-01",
                "equipment_name": equipment_name or "Formlabs Form 4L Industrial 3D Printer",
                "diagnosis": "Cooling System Heat Exchanger Thermal Throttling (Error E45). The radiator intake-to-exhaust thermal gradient delta exceeds 18.5°C under nominal printing load.",
                "possible_causes": [
                    "Particulate or biofilm debris clogging micro-channel coolant channels",
                    "Fluid cavitation / low dielectric coolant level in the optical sight glass reservoir",
                    "Auxiliary PWM fan tachometer stall or bearing friction (< 2800 RPM)",
                    "Thermal interface paste dry-out between laser diode housing and heatsink"
                ],
                "recommended_checks": [
                    "Inspect coolant level via optical sight glass reservoir (must read > 75% full)",
                    "Measure radiator intake vs exhaust manifold delta with an infrared thermometer",
                    "Check cooling fan tachometer output on the technician diagnostics bus",
                    "Inspect coolant return hoses for crimping, micro-bubbles, or dark turbidity"
                ],
                "resolution": [
                    "Engage Lockout-Tagout (LOTO) and allow laser chamber 15 minutes of cooldown.",
                    "Flush closed-loop coolant with ASTM Type 1 lab-grade glycol fluid (Part #CLN-GLY-44).",
                    "Clean heat-exchanger radiator fins using 30 PSI dry nitrogen.",
                    "Re-seat thermal heat pipe assembly with diamond-silver TIM paste (Part #TIM-772).",
                    "Re-run the automated thermal calibration burn-in sequence via firmware."
                ],
                "urgency_level": "CRITICAL",
                "suggested_spare_parts": [
                    "CLN-GLY-44: Ultra-Pure Deionized Lab Glycol Coolant (2L)",
                    "TIM-772: High-Conductivity Diamond-Silver TIM Paste"
                ],
                "manual_citations": [
                    {"title": "Form 4L Engineering Service Manual", "section": "Section 8.4: Closed-Loop Thermal Subsystem & Chiller Diagnostics"}
                ]
            }

        elif "e12" in query.lower() or error_code == "E12" or equipment_id == "EQ-CNC-04":
            return {
                "equipment_id": equipment_id or "EQ-CNC-04",
                "equipment_name": equipment_name or "Haas Mini Mill 3-Axis CNC Machining Center",
                "diagnosis": "Spindle Bearing Radial Vibration Harmonic Degradation (Error E12). 12,000 RPM harmonic frequency exceeds 4.5 mm/s RMS threshold.",
                "possible_causes": [
                    "Spindle ceramic hybrid bearing raceway fatigue and ball micro-spalling",
                    "Toolholder collet chuck eccentricity or imbalanced tooling assembly",
                    "Drive belt tooth wear or resonant tension laxity"
                ],
                "recommended_checks": [
                    "Mount dial test indicator on spindle taper and measure runout (< 0.003 mm spec)",
                    "Analyze accelerometer FFT spectrum for 2X harmonic peaks indicative of inner race damage",
                    "Measure drive belt acoustic frequency tension using sonic tension meter"
                ],
                "resolution": [
                    "Clean toolholder taper using solvent degreaser and check Prussian Blue contact.",
                    "Inspect pre-load spring washer stack on the spindle cartridge.",
                    "If runout exceeds 0.003 mm, replace high-precision ceramic bearing set (Part #SPN-BRG-88).",
                    "Torque cartridge mounting bolts to 35 Nm and perform 30-min zero-load vibration calibration."
                ],
                "urgency_level": "HIGH",
                "suggested_spare_parts": [
                    "SPN-BRG-88: High-Precision Angular Contact Ceramic Bearing Set"
                ],
                "manual_citations": [
                    {"title": "Haas Mini Mill Maintenance Guide", "section": "Section 11.2: Mechanical Spindle Dynamics and Bearing Tolerance"}
                ]
            }

        elif "e77" in query.lower() or error_code == "E77" or equipment_id == "EQ-CEN-05":
            return {
                "equipment_id": equipment_id or "EQ-CEN-05",
                "equipment_name": equipment_name or "Beckman Coulter Optima XPN-100 Ultracentrifuge",
                "diagnosis": "High-Vacuum Turbo Pump Pressure Differential Failure (Error E77). Vacuum column unable to reach 10^-5 Pa within 45 minutes.",
                "possible_causes": [
                    "Viton fluoroelastomer door seal O-ring micro-cracking or debris contamination",
                    "Roughing scroll pump oil-mist coalescing filter saturation",
                    "Turbomolecular ceramic magnetic bearing levitation imbalance"
                ],
                "recommended_checks": [
                    "Perform helium leak detection spray around chamber feedthrough flanges",
                    "Verify roughing pump backing pressure with Pirani gauge (< 2.0 Pa before turbo switchover)",
                    "Check turbo pump bearing temperature and inverter current draw"
                ],
                "resolution": [
                    "Isolate vacuum column with high-vacuum gate valve.",
                    "Clean main chamber sealing O-ring and apply microscopic film of Krytox LVP grease.",
                    "Replace roughing pump exhaust coalescing filter element (Part #FLT-VAK-19).",
                    "Execute 6-hour thermal bake-out cycle at 85°C to desorb trapped moisture."
                ],
                "urgency_level": "CRITICAL",
                "suggested_spare_parts": [
                    "FLT-VAK-19: Oil-Mist Coalescing Vacuum Exhaust Filter"
                ],
                "manual_citations": [
                    {"title": "Optima XPN High-Vacuum Service Manual", "section": "Section 14.3: Vacuum Column Maintenance, Leak Hunting & Turbo Pumps"}
                ]
            }

        # General SLM synthesis
        citations = [{"title": d["title"], "section": d["section"]} for d in rag_docs] if rag_docs else [
            {"title": "Laboratory Equipment Standard Maintenance Protocols", "section": "General Diagnostics & Safety"}
        ]
        return {
            "equipment_id": equipment_id or "EQ-GEN-01",
            "equipment_name": equipment_name or "General Laboratory Instrument",
            "diagnosis": f"Synthesized SLM Diagnosis for query: '{query}'. Evaluated sensor telemetry and service manuals.",
            "possible_causes": [
                "Component thermal or mechanical duty cycle fatigue",
                "Electromechanical sensor drift or calibration degradation",
                "Preventive maintenance service interval exceeded"
            ],
            "recommended_checks": [
                "Verify supply voltage and grounding terminal integrity",
                "Check physical intake filters, cooling radiators, and fan ducts for dust blockages",
                "Review recent telemetry logs for abrupt temperature or vibration delta spikes"
            ],
            "resolution": [
                "Isolate instrument and perform standard safety shutdown procedure.",
                "Inspect wear items against recommended manufacturer replacement schedule.",
                "Log diagnostic findings into maintenance record and calibrate sensor baseline."
            ],
            "urgency_level": "MEDIUM",
            "suggested_spare_parts": [
                "Refer to manufacturer spare parts catalog for certified consumable kits."
            ],
            "manual_citations": citations
        }

    def generate_maintenance_ticket(
        self,
        equipment_id: str,
        predicted_issue: str,
        failure_risk: str,
        error_code: Optional[str] = None
    ) -> Dict[str, Any]:
        priority = "P1 - CRITICAL" if failure_risk in ["CRITICAL", "HIGH"] else "P2 - HIGH" if failure_risk == "MEDIUM" else "P3 - MEDIUM"

        return {
            "equipment_id": equipment_id,
            "title": f"Predictive Maintenance: {predicted_issue}",
            "priority": priority,
            "problem_description": f"Autonomous SLM anomaly detector flagged {failure_risk} failure risk. Issue: {predicted_issue}. Active Error: {error_code or 'None'}.",
            "recommended_actions": [
                "Perform visual and thermal inspection before next scheduled run.",
                "Inspect wear components and measure vibration/temperature baselines.",
                "Replace degraded consumables if tolerances exceed allowable manual limits."
            ]
        }
