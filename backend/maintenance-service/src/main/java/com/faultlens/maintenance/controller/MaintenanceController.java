package com.faultlens.maintenance.controller;

import com.faultlens.maintenance.entity.ErrorCode;
import com.faultlens.maintenance.entity.MaintenanceTicket;
import com.faultlens.maintenance.entity.ManualDocument;
import com.faultlens.maintenance.entity.SparePart;
import com.faultlens.maintenance.service.MaintenanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "*")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping("/tickets")
    public ResponseEntity<List<MaintenanceTicket>> getTickets() {
        return ResponseEntity.ok(maintenanceService.getAllTickets());
    }

    @PostMapping("/tickets")
    public ResponseEntity<MaintenanceTicket> createTicket(@RequestBody MaintenanceTicket ticket) {
        return ResponseEntity.status(HttpStatus.CREATED).body(maintenanceService.createTicket(ticket));
    }

    @PutMapping("/tickets/{id}/status")
    public ResponseEntity<MaintenanceTicket> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        String notes = payload.get("resolutionNotes");
        return ResponseEntity.ok(maintenanceService.updateStatus(id, status, notes));
    }

    @PostMapping("/tickets/{id}/approve")
    public ResponseEntity<MaintenanceTicket> approveTicket(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(maintenanceService.approveTicket(id, payload));
    }

    @PutMapping("/tickets/{id}/assign")
    public ResponseEntity<MaintenanceTicket> assignTicket(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(maintenanceService.assignTicket(id, payload));
    }

    @PostMapping("/tickets/{id}/repair")
    public ResponseEntity<MaintenanceTicket> recordRepair(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(maintenanceService.recordRepair(id, payload));
    }

    @GetMapping("/spare-parts")
    public ResponseEntity<List<SparePart>> getSpareParts() {
        return ResponseEntity.ok(maintenanceService.getAllSpareParts());
    }

    @GetMapping("/error-codes")
    public ResponseEntity<List<ErrorCode>> getErrorCodes() {
        return ResponseEntity.ok(maintenanceService.getAllErrorCodes());
    }

    @GetMapping("/manuals")
    public ResponseEntity<List<ManualDocument>> getManuals() {
        return ResponseEntity.ok(maintenanceService.getAllManuals());
    }
}
