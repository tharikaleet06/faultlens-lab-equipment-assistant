package com.faultlens.maintenance.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_tickets")
public class MaintenanceTicket {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "equipment_id", nullable = false, length = 50)
    private String equipmentId;

    @Column(name = "equipment_name", nullable = false, length = 200)
    private String equipmentName;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 50)
    private String priority; // P1 - CRITICAL, P2 - HIGH, P3 - MEDIUM, P4 - LOW

    @Column(nullable = false, length = 50)
    private String status; // OPEN, SCHEDULED, IN_PROGRESS, RESOLVED

    @Column(name = "problem_description", columnDefinition = "TEXT")
    private String problemDescription;

    @Column(name = "suggested_spare_parts", columnDefinition = "TEXT")
    private String suggestedSpareParts;

    @Column(name = "recommended_actions", columnDefinition = "TEXT")
    private String recommendedActions;

    @Column(name = "assigned_technician_name", length = 150)
    private String assignedTechnicianName;

    @Column(name = "generated_by_ai")
    private Boolean generatedByAi = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "scheduled_date")
    private LocalDateTime scheduledDate;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    public MaintenanceTicket() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEquipmentId() { return equipmentId; }
    public void setEquipmentId(String equipmentId) { this.equipmentId = equipmentId; }

    public String getEquipmentName() { return equipmentName; }
    public void setEquipmentName(String equipmentName) { this.equipmentName = equipmentName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getProblemDescription() { return problemDescription; }
    public void setProblemDescription(String problemDescription) { this.problemDescription = problemDescription; }

    public String getSuggestedSpareParts() { return suggestedSpareParts; }
    public void setSuggestedSpareParts(String suggestedSpareParts) { this.suggestedSpareParts = suggestedSpareParts; }

    public String getRecommendedActions() { return recommendedActions; }
    public void setRecommendedActions(String recommendedActions) { this.recommendedActions = recommendedActions; }

    public String getAssignedTechnicianName() { return assignedTechnicianName; }
    public void setAssignedTechnicianName(String assignedTechnicianName) { this.assignedTechnicianName = assignedTechnicianName; }

    public Boolean getGeneratedByAi() { return generatedByAi; }
    public void setGeneratedByAi(Boolean generatedByAi) { this.generatedByAi = generatedByAi; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
}
