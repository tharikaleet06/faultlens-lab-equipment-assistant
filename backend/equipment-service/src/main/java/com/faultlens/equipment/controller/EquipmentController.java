package com.faultlens.equipment.controller;

import com.faultlens.equipment.entity.Equipment;
import com.faultlens.equipment.service.EquipmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment")
@CrossOrigin(origins = "*")
public class EquipmentController {

    private final EquipmentService equipmentService;

    public EquipmentController(EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
    }

    @GetMapping
    public ResponseEntity<List<Equipment>> getAllEquipment(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String risk) {
        return ResponseEntity.ok(equipmentService.getAllEquipment(category, risk));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipment> getEquipmentById(@PathVariable String id) {
        return equipmentService.getEquipmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Equipment> createEquipment(@RequestBody Equipment equipment) {
        if (equipment.getId() == null || equipment.getId().isBlank()) {
            equipment.setId("EQ-" + (1000 + (int)(Math.random() * 9000)));
        }
        return ResponseEntity.status(201).body(equipmentService.saveEquipment(equipment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteEquipment(@PathVariable String id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.ok(Map.of("message", "Equipment deleted successfully", "id", id));
    }

    @PostMapping("/{id}/telemetry")
    public ResponseEntity<Map<String, Object>> updateTelemetry(
            @PathVariable String id,
            @RequestBody Map<String, Object> telemetry) {
        return ResponseEntity.ok(Map.of(
                "status", "INGESTED",
                "equipmentId", id,
                "telemetry", telemetry,
                "timestamp", System.currentTimeMillis()
        ));
    }
}
