package com.faultlens.maintenance.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "spare_parts")
public class SparePart {

    @Id
    @Column(name = "part_number", length = 50)
    private String partNumber;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @Column(name = "reorder_threshold", nullable = false)
    private Integer reorderThreshold;

    @Column(name = "unit_cost_usd", nullable = false)
    private Double unitCostUsd;

    @Column(name = "shelf_location", length = 50)
    private String shelfLocation;

    @Column(name = "compatible_equipment", length = 100)
    private String compatibleEquipment;

    public SparePart() {}

    public String getPartNumber() { return partNumber; }
    public void setPartNumber(String partNumber) { this.partNumber = partNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public Integer getReorderThreshold() { return reorderThreshold; }
    public void setReorderThreshold(Integer reorderThreshold) { this.reorderThreshold = reorderThreshold; }

    public Double getUnitCostUsd() { return unitCostUsd; }
    public void setUnitCostUsd(Double unitCostUsd) { this.unitCostUsd = unitCostUsd; }

    public String getShelfLocation() { return shelfLocation; }
    public void setShelfLocation(String shelfLocation) { this.shelfLocation = shelfLocation; }

    public String getCompatibleEquipment() { return compatibleEquipment; }
    public void setCompatibleEquipment(String compatibleEquipment) { this.compatibleEquipment = compatibleEquipment; }
}
