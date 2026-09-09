package com.faultlens.maintenance.repository;

import com.faultlens.maintenance.entity.MaintenanceTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceTicketRepository extends JpaRepository<MaintenanceTicket, String> {
    List<MaintenanceTicket> findByEquipmentIdOrderByCreatedAtDesc(String equipmentId);
    List<MaintenanceTicket> findByStatus(String status);
    List<MaintenanceTicket> findByPriority(String priority);
}
