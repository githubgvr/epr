package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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

    @NotNull(message = "Product ID is required")
    @Column(name = "productId", nullable = false)
    private Integer productId;

    @NotNull(message = "Material ID is required")
    @Column(name = "materialId", nullable = false)
    private Integer materialId;

    @NotNull(message = "Product group ID is required")
    @Column(name = "productGroupId", nullable = false)
    private Integer productGroupId;

    @NotNull(message = "Weight is required")
    @DecimalMin(value = "0.01", message = "Weight must be at least 0.01 kg")
    @Digits(integer = 10, fraction = 3, message = "Weight must be a valid decimal with up to 3 decimal places")
    @Column(name = "weight", nullable = false, precision = 13, scale = 3)
    private BigDecimal weight;

    @NotNull(message = "Composition percentage is required")
    @DecimalMin(value = "0.01", message = "Composition percentage must be at least 0.01%")
    @DecimalMax(value = "100.0", message = "Composition percentage must not exceed 100%")
    @Digits(integer = 3, fraction = 2, message = "Composition percentage must be a valid percentage")
    @Column(name = "compositionPercentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal compositionPercentage;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    @Column(name = "notes", length = 500)
    private String notes;

    // Relationship with Product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productId", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "certifications", "compositions"})
    private Product product;

    // Relationship with Material
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "materialId", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Material material;

    // Relationship with ProductGroup
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productGroupId", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ProductGroup productGroup;

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

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }

    public ProductGroup getProductGroup() {
        return productGroup;
    }

    public void setProductGroup(ProductGroup productGroup) {
        this.productGroup = productGroup;
    }

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
