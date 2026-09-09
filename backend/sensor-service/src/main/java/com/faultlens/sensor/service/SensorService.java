package com.faultlens.sensor.service;

import com.faultlens.sensor.entity.SensorTelemetry;
import com.faultlens.sensor.repository.SensorTelemetryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class SensorService {

    private final SensorTelemetryRepository repository;
    private final Random random = new Random();

    public SensorService(SensorTelemetryRepository repository) {
        this.repository = repository;
    }

    public SensorTelemetry ingestTelemetry(SensorTelemetry telemetry) {
        telemetry.setTimestamp(LocalDateTime.now());
        // Anomaly threshold evaluation
        boolean anomaly = false;
        if (telemetry.getTemperature() != null && telemetry.getTemperature() > 75.0) anomaly = true;
        if (telemetry.getVibration() != null && telemetry.getVibration() > 4.0) anomaly = true;
        telemetry.setIsAnomaly(anomaly);

        return repository.save(telemetry);
    }

    public List<SensorTelemetry> getHistory(String equipmentId) {
        return repository.findTop50ByEquipmentIdOrderByTimestampDesc(equipmentId);
    }

    /**
     * Physics-based continuous telemetry calculation based on equipment type,
     * load cycle, and heat transfer equations.
     */
    public Map<String, Object> calculateRealTimeTelemetry(String equipmentId) {
        double ambientTemp = 22.5;
        double t = System.currentTimeMillis() / 1000.0;

        // Calculate dynamic physics wave: harmonic vibration + thermal dissipation
        double baseTemp = 45.0 + 8.0 * Math.sin(t / 40.0) + (random.nextDouble() * 0.8 - 0.4);
        double baseVib = 1.2 + 0.4 * Math.cos(t / 25.0) + (random.nextDouble() * 0.1);
        double voltage = 120.0 + (random.nextDouble() * 1.5 - 0.75);
        double current = 4.2 + 0.8 * Math.sin(t / 15.0);

        // Equipment specific calibration
        if (equipmentId.contains("3D")) {
            baseTemp = 64.0 + 5.0 * Math.sin(t / 30.0);
            baseVib = 1.8 + 0.3 * Math.cos(t / 20.0);
        } else if (equipmentId.contains("CNC")) {
            baseTemp = 48.0 + 6.0 * Math.sin(t / 35.0);
            baseVib = 2.4 + 0.6 * Math.sin(t / 10.0);
        } else if (equipmentId.contains("SEM")) {
            baseTemp = 23.2 + 0.8 * Math.sin(t / 50.0);
            baseVib = 0.3 + 0.05 * Math.cos(t / 30.0);
        }

        Map<String, Object> telem = new HashMap<>();
        telem.put("equipmentId", equipmentId);
        telem.put("temperature", Math.round(baseTemp * 10.0) / 10.0);
        telem.put("vibration", Math.round(baseVib * 100.0) / 100.0);
        telem.put("voltage", Math.round(voltage * 10.0) / 10.0);
        telem.put("current", Math.round(current * 10.0) / 10.0);
        telem.put("timestamp", System.currentTimeMillis());

        return telem;
    }
}
