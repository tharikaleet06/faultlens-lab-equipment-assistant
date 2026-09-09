package com.faultlens.equipment.service;

import com.faultlens.equipment.entity.Equipment;
import com.faultlens.equipment.repository.EquipmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;

    public EquipmentService(EquipmentRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }

    public List<Equipment> getAllEquipment(String category, String risk) {
        if (category != null && !category.equalsIgnoreCase("ALL") && risk != null && !risk.equalsIgnoreCase("ALL")) {
            return equipmentRepository.findByCategoryAndFailureRisk(category, risk);
        } else if (category != null && !category.equalsIgnoreCase("ALL")) {
            return equipmentRepository.findByCategory(category);
        } else if (risk != null && !risk.equalsIgnoreCase("ALL")) {
            return equipmentRepository.findByFailureRisk(risk);
        }
        return equipmentRepository.findAll();
    }

    public Optional<Equipment> getEquipmentById(String id) {
        return equipmentRepository.findById(id);
    }

    public Equipment updateHealthAndRisk(String id, int healthScore, String risk, String predictedIssue, int rul) {
        Equipment eq = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found: " + id));

        eq.setHealthScore(healthScore);
        eq.setFailureRisk(risk);
        if (predictedIssue != null) eq.setPredictedIssue(predictedIssue);
        if (rul > 0) eq.setRemainingUsefulLifeHours(rul);
        eq.setUpdatedAt(LocalDateTime.now());

        return equipmentRepository.save(eq);
    }

    public Equipment saveEquipment(Equipment equipment) {
        equipment.setUpdatedAt(LocalDateTime.now());
        return equipmentRepository.save(equipment);
    }

    public void deleteEquipment(String id) {
        equipmentRepository.deleteById(id);
    }
}
