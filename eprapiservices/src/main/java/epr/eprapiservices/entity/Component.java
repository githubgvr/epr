package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "components")
public class Component extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "component_id")
    private Long componentId;

    @Column(name = "component_name", nullable = false, length = 255)
    private String componentName;

    @Column(name = "component_code", nullable = false, unique = true, length = 50)
    private String componentCode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 1;

    @Column(name = "component_weight")
    private Double componentWeight;

    @Column(name = "component_label", length = 255)
    private String componentLabel;

    @OneToMany(mappedBy = "component", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ComponentMaterialComposition> materialCompositions = new ArrayList<>();

    // Constructors
    public Component() {
    }

    public Component(String componentName, String componentCode) {
        this.componentName = componentName;
        this.componentCode = componentCode;
    }

    // Getters and Setters
    public Long getComponentId() {
        return componentId;
    }

    public void setComponentId(Long componentId) {
        this.componentId = componentId;
    }

    public String getComponentName() {
        return componentName;
    }

    public void setComponentName(String componentName) {
        this.componentName = componentName;
    }

    public String getComponentCode() {
        return componentCode;
    }

    public void setComponentCode(String componentCode) {
        this.componentCode = componentCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public List<ComponentMaterialComposition> getMaterialCompositions() {
        return materialCompositions;
    }

    public void setMaterialCompositions(List<ComponentMaterialComposition> materialCompositions) {
        this.materialCompositions = materialCompositions;
    }

    public Double getComponentWeight() {
        return componentWeight;
    }

    public void setComponentWeight(Double componentWeight) {
        this.componentWeight = componentWeight;
    }

    public String getComponentLabel() {
        return componentLabel;
    }

    public void setComponentLabel(String componentLabel) {
        this.componentLabel = componentLabel;
    }

    // Helper methods
    public void addMaterialComposition(ComponentMaterialComposition composition) {
        materialCompositions.add(composition);
        composition.setComponent(this);
    }

    public void removeMaterialComposition(ComponentMaterialComposition composition) {
        materialCompositions.remove(composition);
        composition.setComponent(null);
    }
}

