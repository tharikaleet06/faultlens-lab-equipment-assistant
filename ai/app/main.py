"""
FaultLens AI Service - FastAPI Entry Point
Exposes Predictive ML, Anomaly Detection, Vector RAG Retrieval, and SLM Assistant
"""
from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import numpy as np

from app.ml.anomaly import AnomalyDetector
from app.ml.failure_prediction import FailurePredictor
from app.ml.health_score import HealthScoreEngine
from app.ml.train_eval_pipeline import ml_pipeline
from app.rag.retriever import ManualRetriever
from app.slm.assistant import SLMAssistant

app = FastAPI(
    title="FaultLens AI Service",
    description="SLM-powered Laboratory Equipment Failure Prediction & Maintenance Assistant",
    version="1.0.0"
)

# Initialize engines
anomaly_detector = AnomalyDetector()
failure_predictor = FailurePredictor()
health_engine = HealthScoreEngine()
retriever = ManualRetriever()
slm_assistant = SLMAssistant(retriever=retriever)

class TelemetryInput(BaseModel):
    equipment_id: str
    temperature: float
    vibration: float
    voltage: float
    current: float
    operating_hours: int
    active_error_code: Optional[str] = None

class PredictionResponse(BaseModel):
    equipment_id: str
    health_score: int
    failure_risk: str
    predicted_issue: str
    confidence_score: float
    remaining_useful_life_hours: int
    anomaly_detected: bool
    anomaly_reasons: List[str]

class DiagnoseRequest(BaseModel):
    equipment_id: Optional[str] = None
    equipment_name: Optional[str] = None
    query: str
    error_code: Optional[str] = None
    telemetry: Optional[Dict[str, float]] = None

class TicketGenRequest(BaseModel):
    equipment_id: str
    predicted_issue: str
    failure_risk: str
    error_code: Optional[str] = None

class DeviceEvaluationRequest(BaseModel):
    equipment_id: str
    device_type_code: Optional[str] = "3D_PRINTER"
    health_score: Optional[int] = 75
    criticality: Optional[str] = "MEDIUM"
    original_cost: Optional[float] = 18500.0
    cumulative_repair_cost: Optional[float] = 4200.0
    age_years: Optional[float] = 2.4
    active_error_code: Optional[str] = None
    telemetry: Optional[Dict[str, float]] = None

@app.post("/api/ai/evaluate-device")
def evaluate_device(req: DeviceEvaluationRequest):
    eval_result = failure_predictor.predict(
        equipment_id=req.equipment_id,
        health_score=req.health_score or 75,
        device_type_code=req.device_type_code or "3D_PRINTER",
        criticality=req.criticality or "MEDIUM",
        original_cost=req.original_cost or 18500.0,
        cumulative_repair_cost=req.cumulative_repair_cost or 4200.0,
        age_years=req.age_years or 2.4,
        telemetry_payload=req.telemetry,
        active_error_code=req.active_error_code
    )
    return eval_result

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "FaultLens AI Service",
        "engine": "Device-Aware SLM + RAG + 70:20:10 ML Pipeline",
        "ml_split": "70% Train / 20% Test / 10% Separate Evaluation",
        "metrics": ml_pipeline.get_metrics()
    }

@app.get("/api/ai/train-eval-metrics")
def get_train_eval_metrics():
    return ml_pipeline.get_metrics()

@app.post("/api/ai/anomaly", response_model=Dict[str, Any])
def detect_anomaly(telemetry: TelemetryInput):
    result = anomaly_detector.detect(
        equipment_id=telemetry.equipment_id,
        temp=telemetry.temperature,
        vib=telemetry.vibration,
        volt=telemetry.voltage,
        curr=telemetry.current
    )
    return result

@app.post("/api/ai/predict", response_model=PredictionResponse)
def predict_failure(telemetry: TelemetryInput):
    # Anomaly detection
    anomaly_res = anomaly_detector.detect(
        telemetry.equipment_id,
        telemetry.temperature,
        telemetry.vibration,
        telemetry.voltage,
        telemetry.current
    )
    # ML Health score calculation
    health_res = health_engine.calculate(
        operating_hours=telemetry.operating_hours,
        temp=telemetry.temperature,
        vib=telemetry.vibration,
        volt=telemetry.voltage,
        error_code=telemetry.active_error_code,
        has_anomaly=anomaly_res["anomaly_detected"]
    )
    # ML Failure prediction & RUL
    ml_pred = failure_predictor.predict(
        equipment_id=telemetry.equipment_id,
        health_score=health_res["health_score"],
        device_type_code="3D_PRINTER",
        active_error_code=telemetry.active_error_code
    )

    return PredictionResponse(
        equipment_id=telemetry.equipment_id,
        health_score=health_res["health_score"],
        failure_risk=ml_pred["failure_risk"],
        predicted_issue=ml_pred["predicted_issue"],
        confidence_score=ml_pred["confidence_score"],
        remaining_useful_life_hours=ml_pred["remaining_useful_life_hours"],
        anomaly_detected=anomaly_res["anomaly_detected"],
        anomaly_reasons=anomaly_res["reasons"]
    )

@app.post("/api/ai/diagnose")
def diagnose_equipment(req: DiagnoseRequest):
    diagnosis = slm_assistant.diagnose(
        query=req.query,
        equipment_id=req.equipment_id,
        equipment_name=req.equipment_name,
        error_code=req.error_code,
        telemetry=req.telemetry
    )
    return diagnosis

@app.post("/api/ai/generate-ticket")
def generate_ticket(req: TicketGenRequest):
    ticket_data = slm_assistant.generate_maintenance_ticket(
        equipment_id=req.equipment_id,
        predicted_issue=req.predicted_issue,
        failure_risk=req.failure_risk,
        error_code=req.error_code
    )
    return ticket_data

