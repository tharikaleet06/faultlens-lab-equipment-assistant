package com.faultlens.maintenance.service;

import com.faultlens.maintenance.entity.ErrorCode;
import com.faultlens.maintenance.entity.MaintenanceTicket;
import com.faultlens.maintenance.entity.ManualDocument;
import com.faultlens.maintenance.entity.SparePart;
import com.faultlens.maintenance.repository.ErrorCodeRepository;
import com.faultlens.maintenance.repository.MaintenanceTicketRepository;
import com.faultlens.maintenance.repository.ManualDocumentRepository;
import com.faultlens.maintenance.repository.SparePartRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class MaintenanceService {

    private final MaintenanceTicketRepository ticketRepository;
    private final SparePartRepository sparePartRepository;
    private final ErrorCodeRepository errorCodeRepository;
    private final ManualDocumentRepository manualDocumentRepository;

    public MaintenanceService(MaintenanceTicketRepository ticketRepository,
                              SparePartRepository sparePartRepository,
                              ErrorCodeRepository errorCodeRepository,
                              ManualDocumentRepository manualDocumentRepository) {
        this.ticketRepository = ticketRepository;
        this.sparePartRepository = sparePartRepository;
        this.errorCodeRepository = errorCodeRepository;
        this.manualDocumentRepository = manualDocumentRepository;
    }

    public List<MaintenanceTicket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public MaintenanceTicket createTicket(MaintenanceTicket ticket) {
        if (ticket.getId() == null || ticket.getId().isBlank()) {
            ticket.setId("TKT-" + (1000 + (int)(Math.random() * 9000)));
        }
        ticket.setCreatedAt(LocalDateTime.now());
        if (ticket.getStatus() == null) ticket.setStatus("OPEN");
        return ticketRepository.save(ticket);
    }

    public MaintenanceTicket updateStatus(String ticketId, String status, String resolutionNotes) {
        MaintenanceTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));

        ticket.setStatus(status);
        if (resolutionNotes != null) {
            ticket.setResolutionNotes(resolutionNotes);
        }
        if ("RESOLVED".equalsIgnoreCase(status) || "CLOSED".equalsIgnoreCase(status)) {
            ticket.setResolvedAt(LocalDateTime.now());
        }
        return ticketRepository.save(ticket);
    }

    public MaintenanceTicket approveTicket(String ticketId, Map<String, Object> payload) {
        MaintenanceTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));

        boolean approved = Boolean.TRUE.equals(payload.get("approved"));
        if (approved) {
            ticket.setStatus("SCHEDULED");
        } else {
            ticket.setStatus("REJECTED");
        }
        if (payload.containsKey("priority") && payload.get("priority") != null) {
            ticket.setPriority(payload.get("priority").toString());
        }
        return ticketRepository.save(ticket);
    }

    public MaintenanceTicket assignTicket(String ticketId, Map<String, Object> payload) {
        MaintenanceTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));

        if (payload.containsKey("technician") && payload.get("technician") != null) {
            ticket.setAssignedTechnicianName(payload.get("technician").toString());
        }
        if (payload.containsKey("priority") && payload.get("priority") != null) {
            ticket.setPriority(payload.get("priority").toString());
        }
        ticket.setStatus("IN_PROGRESS");
        return ticketRepository.save(ticket);
    }

    public MaintenanceTicket recordRepair(String ticketId, Map<String, Object> payload) {
        MaintenanceTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));

        ticket.setStatus("RESOLVED");
        ticket.setResolvedAt(LocalDateTime.now());
        if (payload.containsKey("resolutionNotes") && payload.get("resolutionNotes") != null) {
            ticket.setResolutionNotes(payload.get("resolutionNotes").toString());
        }
        return ticketRepository.save(ticket);
    }

    public List<SparePart> getAllSpareParts() {
        return sparePartRepository.findAll();
    }

    public List<ErrorCode> getAllErrorCodes() {
        return errorCodeRepository.findAll();
    }

    public List<ManualDocument> getAllManuals() {
        return manualDocumentRepository.findAll();
    }
}
