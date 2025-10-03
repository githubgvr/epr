package epr.eprapiservices.service;

import epr.eprapiservices.entity.Component;
import epr.eprapiservices.entity.ComponentMaterialComposition;
import epr.eprapiservices.entity.Material;
import epr.eprapiservices.dao.repository.ComponentRepository;
import epr.eprapiservices.dao.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ComponentService {

    @Autowired
    private ComponentRepository componentRepository;

    @Autowired
    private MaterialRepository materialRepository;

    public List<Component> getAllComponents() {
        return componentRepository.findAll();
    }

    public List<Component> getActiveComponents() {
        return componentRepository.findByIsActive(true);
    }

    public Component getComponentById(Long id) {
        return componentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Component not found with id: " + id));
    }

    @Transactional
    public Component createComponent(Component component) {
        // Check if component code already exists
        if (componentRepository.existsByComponentCode(component.getComponentCode())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Component with code '" + component.getComponentCode() + "' already exists");
        }

        // Set default values
        if (component.getIsActive() == null) {
            component.setIsActive(true);
        }
        if (component.getSortOrder() == null) {
            component.setSortOrder(1);
        }

        // Process material compositions
        if (component.getMaterialCompositions() != null && !component.getMaterialCompositions().isEmpty()) {
            BigDecimal totalWeight = BigDecimal.ZERO;
            for (ComponentMaterialComposition composition : component.getMaterialCompositions()) {
                // Get materialId from either the transient field or the material object
                Integer materialId = composition.getMaterialId();
                if (materialId == null || materialId == 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Material ID is required");
                }

                Material material = materialRepository.findById(materialId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Material not found with id: " + materialId));

                composition.setMaterial(material);
                composition.setComponent(component);

                // Set default active status
                if (composition.getIsActive() == null) {
                    composition.setIsActive(true);
                }

                // Calculate total weight
                if (composition.getWeight() != null) {
                    totalWeight = totalWeight.add(composition.getWeight());
                }
            }
            // Set the calculated total weight
            component.setComponentWeight(totalWeight.doubleValue());
        } else {
            component.setComponentWeight(0.0);
        }

        return componentRepository.save(component);
    }

    @Transactional
    public Component updateComponent(Long id, Component componentDetails) {
        Component component = getComponentById(id);

        // Check if component code is being changed and if it already exists
        if (!component.getComponentCode().equals(componentDetails.getComponentCode())) {
            if (componentRepository.existsByComponentCodeAndComponentIdNot(componentDetails.getComponentCode(), id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Component with code '" + componentDetails.getComponentCode() + "' already exists");
            }
        }

        // Update basic fields
        component.setComponentName(componentDetails.getComponentName());
        component.setComponentCode(componentDetails.getComponentCode());
        component.setDescription(componentDetails.getDescription());
        component.setSortOrder(componentDetails.getSortOrder());
        component.setIsActive(componentDetails.getIsActive());
        component.setComponentLabel(componentDetails.getComponentLabel());

        // Update material compositions
        if (componentDetails.getMaterialCompositions() != null) {
            // Clear existing compositions
            component.getMaterialCompositions().clear();

            BigDecimal totalWeight = BigDecimal.ZERO;
            // Add new compositions
            for (ComponentMaterialComposition composition : componentDetails.getMaterialCompositions()) {
                // Get materialId from either the transient field or the material object
                Integer materialId = composition.getMaterialId();
                if (materialId == null || materialId == 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Material ID is required");
                }

                Material material = materialRepository.findById(materialId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Material not found with id: " + materialId));

                composition.setMaterial(material);
                composition.setComponent(component);

                // Set default active status
                if (composition.getIsActive() == null) {
                    composition.setIsActive(true);
                }

                // Calculate total weight
                if (composition.getWeight() != null) {
                    totalWeight = totalWeight.add(composition.getWeight());
                }

                component.getMaterialCompositions().add(composition);
            }
            // Set the calculated total weight
            component.setComponentWeight(totalWeight.doubleValue());
        } else {
            component.setComponentWeight(0.0);
        }

        return componentRepository.save(component);
    }

    @Transactional
    public void deleteComponent(Long id) {
        Component component = getComponentById(id);
        componentRepository.delete(component);
    }

    @Transactional
    public Component markAsInactive(Long id) {
        Component component = getComponentById(id);
        component.setIsActive(false);
        return componentRepository.save(component);
    }

    @Transactional
    public Component markAsActive(Long id) {
        Component component = getComponentById(id);
        component.setIsActive(true);
        return componentRepository.save(component);
    }
}

