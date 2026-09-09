package com.faultlens.sensor.controller;

import com.faultlens.sensor.entity.SensorTelemetry;
import com.faultlens.sensor.service.SensorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sensors")
@CrossOrigin(origins = "*")
public class SensorController {

    private final SensorService sensorService;

    public SensorController(SensorService sensorService) {
        this.sensorService = sensorService;
    }

    @PostMapping("/ingest")
    public ResponseEntity<SensorTelemetry> ingestTelemetry(@RequestBody SensorTelemetry telemetry) {
        return ResponseEntity.ok(sensorService.ingestTelemetry(telemetry));
    }

    @GetMapping("/stream/{equipmentId}")
    public ResponseEntity<Map<String, Object>> getTelemetryStream(@PathVariable String equipmentId) {
        return ResponseEntity.ok(sensorService.calculateRealTimeTelemetry(equipmentId));
    }

    @GetMapping("/history/{equipmentId}")
    public ResponseEntity<List<SensorTelemetry>> getHistory(@PathVariable String equipmentId) {
        return ResponseEntity.ok(sensorService.getHistory(equipmentId));
    }
}
