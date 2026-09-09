package com.faultlens.maintenance.repository;

import com.faultlens.maintenance.entity.ManualDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ManualDocumentRepository extends JpaRepository<ManualDocument, String> {
    List<ManualDocument> findByEquipmentId(String equipmentId);
}
