package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * Entity representing the composition of materials in products
 */
@Entity
@Table(name = "productcomposition")
public class ProductComposition extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "productCompositionId")
    private Integer productCompositionId;

    @Column(name = "productId")
    private Integer productId;

    @Column(name = "materialId")
    private Integer materialId;

    @Column(name = "productGroupId")
    private Integer productGroupId;

    @Column(name = "weight")
    private BigDecimal weight;

    @Column(name = "compositionPercentage")
    private BigDecimal compositionPercentage;

    @Column(name = "notes")
    private String notes;

    // Removed all relationship constraints

    // Default constructor
    public ProductComposition() {
        super();
    }

    // Constructor with required fields
    public ProductComposition(Integer productId, Integer materialId, Integer productGroupId,
                            BigDecimal weight, BigDecimal compositionPercentage) {
        this();
        this.productId = productId;
        this.materialId = materialId;
        this.productGroupId = productGroupId;
        this.weight = weight;
        this.compositionPercentage = compositionPercentage;
    }

    // Getters and Setters
    public Integer getProductCompositionId() {
        return productCompositionId;
    }

    public void setProductCompositionId(Integer productCompositionId) {
        this.productCompositionId = productCompositionId;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getMaterialId() {
        return materialId;
    }

    public void setMaterialId(Integer materialId) {
        this.materialId = materialId;
    }

    public Integer getProductGroupId() {
        return productGroupId;
    }

    public void setProductGroupId(Integer productGroupId) {
        this.productGroupId = productGroupId;
    }

    public BigDecimal getWeight() {
        return weight;
    }

    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }

    public BigDecimal getCompositionPercentage() {
        return compositionPercentage;
    }

    public void setCompositionPercentage(BigDecimal compositionPercentage) {
        this.compositionPercentage = compositionPercentage;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    // Removed relationship getter/setter methods

    @Override
    public String toString() {
        return "ProductComposition{" +
                "productCompositionId=" + productCompositionId +
                ", productId=" + productId +
                ", materialId=" + materialId +
                ", productGroupId=" + productGroupId +
                ", weight=" + weight +
                ", compositionPercentage=" + compositionPercentage +
                '}';
    }
}
