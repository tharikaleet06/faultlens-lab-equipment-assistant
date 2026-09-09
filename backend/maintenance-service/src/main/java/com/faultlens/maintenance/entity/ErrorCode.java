package com.faultlens.maintenance.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "error_codes")
public class ErrorCode {

    @Id
    @Column(length = 20)
    private String code;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 50)
    private String severity;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String symptom;

    @Column(columnDefinition = "TEXT")
    private String possibleCauses;

    @Column(columnDefinition = "TEXT")
    private String recommendedChecks;

    @Column(columnDefinition = "TEXT")
    private String resolutionSteps;

    @Column(name = "manual_section", length = 200)
    private String manualSection;

    public ErrorCode() {}

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getSymptom() { return symptom; }
    public void setSymptom(String symptom) { this.symptom = symptom; }

    public String getPossibleCauses() { return possibleCauses; }
    public void setPossibleCauses(String possibleCauses) { this.possibleCauses = possibleCauses; }

    public String getRecommendedChecks() { return recommendedChecks; }
    public void setRecommendedChecks(String recommendedChecks) { this.recommendedChecks = recommendedChecks; }

    public String getResolutionSteps() { return resolutionSteps; }
    public void setResolutionSteps(String resolutionSteps) { this.resolutionSteps = resolutionSteps; }

    public String getManualSection() { return manualSection; }
    public void setManualSection(String manualSection) { this.manualSection = manualSection; }
}
