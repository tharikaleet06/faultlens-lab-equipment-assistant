"""
RAG Vector Store & Similarity Retriever
Indexes laboratory equipment technical manuals, service bulletins, and error logs
"""
from typing import List, Dict, Any, Optional

class ManualRetriever:
    def __init__(self):
        # In-memory document corpus with keywords and semantic text
        self.documents = [
            {
                "id": "MAN-FL-4L-SEC-8.4",
                "equipment_id": "EQ-3D-01",
                "equipment_name": "Formlabs Form 4L Industrial 3D Printer",
                "title": "Form 4L Engineering Service Manual",
                "section": "Section 8.4: Closed-Loop Thermal Subsystem & Chiller Diagnostics",
                "content": (
                    "When error E45 is declared, the MCU has registered a radiator intake-to-exhaust thermal gradient delta > 18.5°C "
                    "or optical housing thermistor > 75°C. Immediate action requires inspecting coolant fill level through the optical "
                    "glass reservoir. If particulate turbidity is observed, drain and flush using 2.0L ASTM Type 1 glycol solution "
                    "(Part #CLN-GLY-44). Clean radiator fins using 30 PSI dry nitrogen. Re-apply thermal interface paste (Part #TIM-772)."
                ),
                "keywords": ["e45", "cooling", "chiller", "radiator", "glycol", "temperature", "overheat", "fan"]
            },
            {
                "id": "MAN-HS-MM-SEC-11.2",
                "equipment_id": "EQ-CNC-04",
                "equipment_name": "Haas Mini Mill 3-Axis CNC Machining Center",
                "title": "Haas Mini Mill Maintenance Guide",
                "section": "Section 11.2: Mechanical Spindle Dynamics and Bearing Tolerance",
                "content": (
                    "Spindle bearing wear produces distinct frequency peaks at ball pass frequency of outer ring (BPFO) and inner ring (BPFI). "
                    "Error code E12 triggers when RMS vibration exceeds 4.5 mm/s over 3 consecutive cutting cycles. Before bearing cartridge replacement, "
                    "verify toolholder taper contact using Prussian Blue dye (minimum 80% contact required). If replacement is necessary, install factory "
                    "matched pair ceramic hybrid bearings (Part #SPN-BRG-88) torqued to 35 Nm."
                ),
                "keywords": ["e12", "spindle", "vibration", "bearing", "taper", "runout", "harmonics", "resonance"]
            },
            {
                "id": "MAN-BC-XPN-SEC-14.3",
                "equipment_id": "EQ-CEN-05",
                "equipment_name": "Beckman Coulter Optima XPN-100 Ultracentrifuge",
                "title": "Optima XPN High-Vacuum Service Manual",
                "section": "Section 14.3: Vacuum Column Maintenance, Leak Hunting & Turbo Pumps",
                "content": (
                    "Error E77 indicates failure of diffusion/turbo vacuum pump system to achieve evacuation within programmed 45-minute window. "
                    "Inspect chamber lid fluoroelastomer O-ring for microscopic debris or dry cracks. Clean using ultra-high vacuum lintless wipes and "
                    "apply microscopic film of Krytox LVP grease. Replace oil-mist coalescing vacuum filter (Part #FLT-VAK-19) every 1,500 run hours."
                ),
                "keywords": ["e77", "vacuum", "diffusion", "turbo", "o-ring", "krytox", "rotor", "leak"]
            },
            {
                "id": "MAN-KS-MXR-SEC-4.7",
                "equipment_id": "EQ-OSC-07",
                "equipment_name": "Keysight Infiniium MXR-Series 6GHz",
                "title": "Keysight Infiniium Component-Level Service Manual",
                "section": "Section 4.7: Power Stage Diagnostics & DC Bus Filtering",
                "content": (
                    "Error E24 denotes excessive ripple (>850 mV) on 48V switching rail, commonly triggered by drying of high-temperature electrolytic "
                    "filter capacitors (Part #CAP-48V-220). Inspect power board test point TP-48 for sinusoidal AC ripple voltage using external multimeter or scope probe."
                ),
                "keywords": ["e24", "power", "dc bus", "ripple", "capacitor", "voltage", "sag"]
            }
        ]

    def search(self, query: str, equipment_id: Optional[str] = None, top_k: int = 2) -> List[Dict[str, Any]]:
        query_lower = query.lower()
        results = []

        for doc in self.documents:
            score = 0
            if equipment_id and doc["equipment_id"] == equipment_id:
                score += 5

            for kw in doc["keywords"]:
                if kw in query_lower:
                    score += 3

            # Word match
            for word in query_lower.split():
                if len(word) > 2 and word in doc["content"].lower():
                    score += 1

            if score > 0:
                results.append((score, doc))

        results.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in results[:top_k]]
