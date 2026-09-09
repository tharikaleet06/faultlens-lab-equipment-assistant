package com.faultlens.sensor.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sensor_telemetry")
public class SensorTelemetry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "equipment_id", nullable = false, length = 50)
    private String equipmentId;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    private Double temperature;
    private Double vibration;
    private Double voltage;
    private Double current;
    private Double pressure;
    private Double rpm;

    @Column(name = "is_anomaly")
    private Boolean isAnomaly = false;

    public SensorTelemetry() {}

    public Long getId() { return id; }
    public String getEquipmentId() { return equipmentId; }
    public void setEquipmentId(String equipmentId) { this.equipmentId = equipmentId; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Double getVibration() { return vibration; }
    public void setVibration(Double vibration) { this.vibration = vibration; }

    public Double getVoltage() { return voltage; }
    public void setVoltage(Double voltage) { this.voltage = voltage; }

    public Double getCurrent() { return current; }
    public void setCurrent(Double current) { this.current = current; }

    public Double getPressure() { return pressure; }
    public void setPressure(Double pressure) { this.pressure = pressure; }

    public Double getRpm() { return rpm; }
    public void setRpm(Double rpm) { this.rpm = rpm; }

    public Boolean getIsAnomaly() { return isAnomaly; }
    public void setIsAnomaly(Boolean isAnomaly) { this.isAnomaly = isAnomaly; }
}
