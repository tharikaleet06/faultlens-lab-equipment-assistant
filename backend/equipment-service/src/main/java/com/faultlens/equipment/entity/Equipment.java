package com.faultlens.equipment.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipment")
public class Equipment {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String model;

    @Column(nullable = false, unique = true, length = 100)
    private String serialNumber;

    @Column(nullable = false, length = 100)
    private String labLocation;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, length = 50)
    private String status; // OPERATIONAL, WARNING, CRITICAL_FAULT, MAINTENANCE_REQUIRED, OFFLINE

    @Column(nullable = false)
    private Integer healthScore;

    @Column(nullable = false, length = 50)
    private String failureRisk; // NOMINAL, LOW, ELEVATED, HIGH, CRITICAL

    @Column(nullable = false)
    private Integer operatingHours;

    private LocalDate lastServiceDate;
    private LocalDate nextScheduledService;

    @Column(length = 50)
    private String activeErrorCode;

    @Column(length = 255)
    private String predictedIssue;

    private Double confidenceScore;
    private Integer remainingUsefulLifeHours;

    @Column(columnDefinition = "TEXT")
    private String specificationsJson;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Equipment() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getLabLocation() { return labLocation; }
    public void setLabLocation(String labLocation) { this.labLocation = labLocation; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getHealthScore() { return healthScore; }
    public void setHealthScore(Integer healthScore) { this.healthScore = healthScore; }

    public String getFailureRisk() { return failureRisk; }
    public void setFailureRisk(String failureRisk) { this.failureRisk = failureRisk; }

    public Integer getOperatingHours() { return operatingHours; }
    public void setOperatingHours(Integer operatingHours) { this.operatingHours = operatingHours; }

    public LocalDate getLastServiceDate() { return lastServiceDate; }
    public void setLastServiceDate(LocalDate lastServiceDate) { this.lastServiceDate = lastServiceDate; }

    public LocalDate getNextScheduledService() { return nextScheduledService; }
    public void setNextScheduledService(LocalDate nextScheduledService) { this.nextScheduledService = nextScheduledService; }

    public String getActiveErrorCode() { return activeErrorCode; }
    public void setActiveErrorCode(String activeErrorCode) { this.activeErrorCode = activeErrorCode; }

    public String getPredictedIssue() { return predictedIssue; }
    public void setPredictedIssue(String predictedIssue) { this.predictedIssue = predictedIssue; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public Integer getRemainingUsefulLifeHours() { return remainingUsefulLifeHours; }
    public void setRemainingUsefulLifeHours(Integer remainingUsefulLifeHours) { this.remainingUsefulLifeHours = remainingUsefulLifeHours; }

    public String getSpecificationsJson() { return specificationsJson; }
    public void setSpecificationsJson(String specificationsJson) { this.specificationsJson = specificationsJson; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
