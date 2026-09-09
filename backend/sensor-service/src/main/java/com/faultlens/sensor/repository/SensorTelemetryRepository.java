package com.faultlens.sensor.repository;

import com.faultlens.sensor.entity.SensorTelemetry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorTelemetryRepository extends JpaRepository<SensorTelemetry, Long> {
    List<SensorTelemetry> findTop50ByEquipmentIdOrderByTimestampDesc(String equipmentId);
    List<SensorTelemetry> findByEquipmentIdAndIsAnomalyTrue(String equipmentId);
}
