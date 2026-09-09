package com.faultlens.maintenance.repository;

import com.faultlens.maintenance.entity.SparePart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SparePartRepository extends JpaRepository<SparePart, String> {
    List<SparePart> findByCategory(String category);
    List<SparePart> findByCompatibleEquipmentContaining(String equipmentId);
}
