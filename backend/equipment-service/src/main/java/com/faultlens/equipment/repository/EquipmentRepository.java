package com.faultlens.equipment.repository;

import com.faultlens.equipment.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, String> {
    List<Equipment> findByCategory(String category);
    List<Equipment> findByFailureRisk(String failureRisk);
    List<Equipment> findByCategoryAndFailureRisk(String category, String failureRisk);
    List<Equipment> findByDepartment(String department);
}
