package com.faultlens.maintenance.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "manual_documents")
public class ManualDocument {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "equipment_id", length = 50, nullable = false)
    private String equipmentId;

    @Column(name = "equipment_model", length = 150, nullable = false)
    private String equipmentModel;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "section_number", length = 50, nullable = false)
    private String sectionNumber;

    @Column(name = "section_title", length = 255, nullable = false)
    private String sectionTitle;

    @Column(name = "content_text", columnDefinition = "LONGTEXT", nullable = false)
    private String contentText;

    @Column(name = "embedding_vector_id", length = 100)
    private String embeddingVectorId;

    @Column(columnDefinition = "TEXT")
    private String keywords;

    public ManualDocument() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEquipmentId() { return equipmentId; }
    public void setEquipmentId(String equipmentId) { this.equipmentId = equipmentId; }

    public String getEquipmentModel() { return equipmentModel; }
    public void setEquipmentModel(String equipmentModel) { this.equipmentModel = equipmentModel; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSectionNumber() { return sectionNumber; }
    public void setSectionNumber(String sectionNumber) { this.sectionNumber = sectionNumber; }

    public String getSectionTitle() { return sectionTitle; }
    public void setSectionTitle(String sectionTitle) { this.sectionTitle = sectionTitle; }

    public String getContentText() { return contentText; }
    public void setContentText(String contentText) { this.contentText = contentText; }

    public String getEmbeddingVectorId() { return embeddingVectorId; }
    public void setEmbeddingVectorId(String embeddingVectorId) { this.embeddingVectorId = embeddingVectorId; }

    public String getKeywords() { return keywords; }
    public void setKeywords(String keywords) { this.keywords = keywords; }
}
