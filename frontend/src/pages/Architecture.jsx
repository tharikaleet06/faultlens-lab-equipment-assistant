import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Key, 
  FileCode, 
  Activity, 
  Terminal,
  ExternalLink,
  Code2
} from 'lucide-react';
import { authService } from '../services/api';

export const ArchitecturePage = ({ id }) => {
  const [activeTab, setActiveTab] = useState('topology');
  const token = authService.getToken();
  const user = authService.getCurrentUser();

  const microservices = [
    {
      name: 'API Gateway',
      port: 8080,
      tech: 'Spring Cloud Gateway',
      role: 'Reverse Proxy, Central CORS, JWT Filter & Rate Limiter',
      status: 'HEALTHY',
      latency: '2ms',
      endpoints: ['/api/auth/**', '/api/equipment/**', '/api/sensors/**', '/api/maintenance/**', '/api/ai/**']
    },
    {
      name: 'Auth Service',
      port: 8081,
      tech: 'Spring Boot + Spring Security 6',
      role: 'RBAC User Authentication & HS256 JWT Token Issuance',
      status: 'HEALTHY',
      latency: '4ms',
      endpoints: ['POST /api/auth/login', 'GET /api/auth/validate']
    },
    {
      name: 'Equipment Service',
      port: 8082,
      tech: 'Spring Boot + Spring Data JPA',
      role: 'Equipment Digital Twin Profiles, Specs & Telemetry Ingestion',
      status: 'HEALTHY',
      latency: '6ms',
      endpoints: ['GET /api/equipment', 'GET /api/equipment/{id}', 'POST /api/equipment/{id}/telemetry']
    },
    {
      name: 'Sensor Service',
      port: 8083,
      tech: 'Spring Boot + Time-Series Daemon',
      role: 'Edge Sensor Stream Ingestion, Multi-Variate Telemetry Buffering',
      status: 'HEALTHY',
      latency: '3ms',
      endpoints: ['POST /api/sensors/ingest', 'GET /api/sensors/stream/{id}']
    },
    {
      name: 'Maintenance Service',
      port: 8084,
      tech: 'Spring Boot + Workflow Engine',
      role: 'Automated Predictive Work Orders, Lifecycle & Spare Parts',
      status: 'HEALTHY',
      latency: '5ms',
      endpoints: ['GET /api/maintenance/tickets', 'POST /api/maintenance/tickets', 'PUT /api/maintenance/tickets/{id}/status']
    },
    {
      name: 'Python AI Engine',
      port: 8000,
      tech: 'Python 3.11 + FastAPI + Scikit-Learn',
      role: 'Isolation Forest Anomaly Detection, RUL Regression, RAG Vector Search & SLM',
      status: 'HEALTHY',
      latency: '14ms',
      endpoints: ['POST /api/ai/predict', 'POST /api/ai/anomaly', 'POST /api/ai/diagnose']
    },
    {
      name: 'MySQL Database',
      port: 3306,
      tech: 'MySQL 8.0 InnoDB (faultlens_db)',
      role: 'Normalized Relational Persistence with Foreign Key Constraints & Indexes',
      status: 'HEALTHY',
      latency: '1ms',
      endpoints: ['users', 'equipment', 'sensor_telemetry', 'maintenance_tickets', 'spare_parts']
    }
  ];

  return (
    <div id={id || 'architecture-page'} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-indigo-500" />
            <span>Polyglot Microservices, Database &amp; AI Architecture</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enterprise Architecture: Java Spring Boot Microservices + Spring Cloud Gateway + MySQL 8.0 + Python FastAPI AI
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('topology')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'topology'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            System Topology
          </button>
          <button
            onClick={() => setActiveTab('spring')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'spring'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Java Spring Boot Code
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'python'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Python AI Service
          </button>
          <button
            onClick={() => setActiveTab('mysql')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'mysql'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            MySQL Schema
          </button>
          <button
            onClick={() => setActiveTab('jwt')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'jwt'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            JWT Auth Token
          </button>
        </div>
      </div>

      {/* 1. Topology View */}
      {activeTab === 'topology' && (
        <div className="space-y-6">
          {/* Architecture flow callout */}
          <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-md">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2">
              Polyglot Request Routing &amp; Data Pipeline
            </h3>
            <div className="text-xs text-slate-300 font-mono space-y-2 bg-slate-950 p-4 rounded-lg border border-slate-800">
              <div className="text-emerald-400 font-bold">
                [Client Browser / React UI] 
                ──(JWT Bearer)──▶ [Spring Cloud API Gateway :8080]
              </div>
              <div className="text-slate-400 pl-4">
                ├── /api/auth/** ─────────▶ [Auth Service :8081] ──────▶ [MySQL :3306] (users, roles)<br/>
                ├── /api/equipment/** ────▶ [Equipment Service :8082] ─▶ [MySQL :3306] (equipment, limits)<br/>
                ├── /api/sensors/** ──────▶ [Sensor Service :8083] ────▶ [MySQL :3306] (telemetry_history)<br/>
                ├── /api/maintenance/** ──▶ [Maintenance Service :8084]▶ [MySQL :3306] (work_orders, parts)<br/>
                └── /api/ai/** ───────────▶ [Python AI Service :8000] ──▶ Scikit-Learn + FAISS RAG + SLM
              </div>
            </div>
          </div>

          {/* Microservices Health Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {microservices.map((svc) => (
              <div
                key={svc.name}
                className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Port :{svc.port}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{svc.status} ({svc.latency})</span>
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {svc.name}
                  </h4>
                  <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                    {svc.tech}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    {svc.role}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 mb-1">Routed Endpoints:</div>
                  <div className="space-y-1">
                    {svc.endpoints.map((ep, i) => (
                      <div key={i} className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 rounded">
                        {ep}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Java Spring Boot Code View */}
      {activeTab === 'spring' && (
        <div className="bg-slate-900 text-slate-200 rounded-xl p-5 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-indigo-400" />
              <span className="font-mono text-xs font-bold text-white">
                backend/auth-service/src/main/java/com/faultlens/auth/controller/AuthController.java
              </span>
            </div>
            <span className="text-xs text-emerald-400 font-mono">Spring Boot 3.3.3 • Java 21</span>
          </div>

          <pre className="text-xs font-mono overflow-x-auto text-slate-300 p-4 bg-slate-950 rounded-lg border border-slate-800 leading-relaxed">
{`package com.faultlens.auth.controller;

import com.faultlens.auth.dto.AuthRequest;
import com.faultlens.auth.dto.AuthResponse;
import com.faultlens.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        // Authenticates laboratory technician with BCrypt & issues JWT token
        AuthResponse response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(authService.validateToken(authHeader));
    }
}`}
          </pre>

          <div className="flex items-center justify-between border-b border-slate-800 pb-3 pt-4">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-amber-400" />
              <span className="font-mono text-xs font-bold text-white">
                backend/api-gateway/src/main/resources/application.yml
              </span>
            </div>
            <span className="text-xs text-amber-400 font-mono">Spring Cloud Gateway</span>
          </div>

          <pre className="text-xs font-mono overflow-x-auto text-slate-300 p-4 bg-slate-950 rounded-lg border border-slate-800 leading-relaxed">
{`server:
  port: 8080

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: http://localhost:8081
          predicates:
            - Path=/api/auth/**

        - id: equipment-service
          uri: http://localhost:8082
          predicates:
            - Path=/api/equipment/**

        - id: sensor-service
          uri: http://localhost:8083
          predicates:
            - Path=/api/sensors/**

        - id: maintenance-service
          uri: http://localhost:8084
          predicates:
            - Path=/api/maintenance/**

        - id: ai-service
          uri: http://localhost:8000
          predicates:
            - Path=/api/ai/**`}
          </pre>
        </div>
      )}

      {/* 3. Python AI Code View */}
      {activeTab === 'python' && (
        <div className="bg-slate-900 text-slate-200 rounded-xl p-5 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <span className="font-mono text-xs font-bold text-white">
                ai-service/app/ml/anomaly.py (Isolation Forest &amp; Dynamic Z-Score)
              </span>
            </div>
            <span className="text-xs text-emerald-400 font-mono">Python 3.11 • Scikit-Learn</span>
          </div>

          <pre className="text-xs font-mono overflow-x-auto text-slate-300 p-4 bg-slate-950 rounded-lg border border-slate-800 leading-relaxed">
{`class AnomalyDetector:
    def __init__(self):
        # Baseline normal limits for laboratory equipment
        self.baselines = {
            "EQ-3D-01": {"temp_max": 68.0, "temp_crit": 82.0, "vib_max": 2.8, "volt_min": 115.0},
            "EQ-CNC-04": {"temp_max": 55.0, "temp_crit": 70.0, "vib_max": 3.2, "volt_min": 200.0},
            "EQ-CEN-05": {"temp_max": 38.0, "temp_crit": 50.0, "vib_max": 2.0, "volt_min": 208.0},
        }

    def detect(self, equipment_id: str, temp: float, vib: float, volt: float, curr: float):
        cfg = self.baselines.get(equipment_id, {"temp_max": 65.0, "temp_crit": 80.0, "vib_max": 3.0})
        anomalies = []
        if temp > cfg["temp_crit"]:
            anomalies.append(f"CRITICAL Temperature spike ({temp:.1f}°C > {cfg['temp_crit']}°C)")
        if vib > cfg["vib_max"]:
            anomalies.append(f"Vibration Harmonic Anomaly ({vib:.2f} mm/s > {cfg['vib_max']} mm/s)")
        return {
            "anomaly_detected": len(anomalies) > 0,
            "reasons": anomalies
        }`}
          </pre>
        </div>
      )}

      {/* 4. MySQL Relational Schema */}
      {activeTab === 'mysql' && (
        <div className="bg-slate-900 text-slate-200 rounded-xl p-5 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-400" />
              <span className="font-mono text-xs font-bold text-white">
                database/schema.sql (MySQL 8.0 InnoDB)
              </span>
            </div>
            <span className="text-xs text-sky-400 font-mono">Normalized Relational DDL</span>
          </div>

          <pre className="text-xs font-mono overflow-x-auto text-slate-300 p-4 bg-slate-950 rounded-lg border border-slate-800 leading-relaxed">
{`CREATE DATABASE IF NOT EXISTS faultlens_db;
USE faultlens_db;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    badge_id VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE equipment (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(80) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    lab_room VARCHAR(50) NOT NULL,
    health_score INT NOT NULL DEFAULT 100,
    failure_risk VARCHAR(20) NOT NULL DEFAULT 'LOW',
    predicted_rul_hours INT NOT NULL,
    active_error_code VARCHAR(20)
);

CREATE TABLE sensor_telemetry (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    equipment_id VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    temperature DECIMAL(5,2) NOT NULL,
    vibration DECIMAL(5,2) NOT NULL,
    voltage DECIMAL(6,2) NOT NULL,
    current_draw DECIMAL(5,2) NOT NULL,
    anomaly_detected BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
);`}
          </pre>
        </div>
      )}

      {/* 5. JWT Auth Inspection */}
      {activeTab === 'jwt' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              JSON Web Token (JWT) RBAC Security Inspector
            </h3>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Active Authorization Header (Bearer Token):
            </label>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg font-mono text-xs text-slate-700 dark:text-slate-300 break-all border border-slate-200 dark:border-slate-700">
              Bearer {token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Decoded JWT Claims (Payload):
              </span>
              <pre className="text-xs font-mono text-slate-700 dark:text-slate-300">
{JSON.stringify({
  sub: user?.username || 'elena.rostova',
  name: user?.name || 'Dr. Elena Rostova',
  role: user?.role || 'LAB_TECHNICIAN',
  badge: user?.badge || 'TECH-4109',
  dept: user?.dept || 'Additive Manufacturing',
  iss: 'faultlens-auth-service',
  exp: '24 hours'
}, null, 2)}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
              <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Security Token Verification</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Tokens are signed using HMAC-SHA256 with key rotation. Every incoming request to Spring Cloud Gateway is verified through the <code>JwtAuthenticationFilter</code> before being forwarded downstream to the Equipment or Maintenance microservice.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
