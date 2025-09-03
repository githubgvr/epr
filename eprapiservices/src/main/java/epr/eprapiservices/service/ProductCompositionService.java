package epr.eprapiservices.service;

import epr.eprapiservices.entity.ProductComposition;
import epr.eprapiservices.dao.repository.ProductCompositionRepository;
import epr.eprapiservices.dao.repository.ProductRepository;
import epr.eprapiservices.dao.repository.MaterialRepository;
import epr.eprapiservices.dao.repository.ProductGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Service class for ProductComposition business logic
 */
@Service
@Transactional
public class ProductCompositionService {

    @Autowired
    private ProductCompositionRepository productCompositionRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private ProductGroupRepository productGroupRepository;

    /**
     * Get all active product compositions
     */
    @Transactional(readOnly = true)
    public List<ProductComposition> getAllActiveCompositions() {
        return productCompositionRepository.findAllActiveWithDetails();
    }

    /**
     * Get product composition by ID
     */
    @Transactional(readOnly = true)
    public Optional<ProductComposition> getCompositionById(Integer id) {
        return productCompositionRepository.findById(id);
    }

    /**
     * Get compositions for a specific product
     */
    @Transactional(readOnly = true)
    public List<ProductComposition> getCompositionsByProductId(Integer productId) {
        return productCompositionRepository.findByProductIdWithDetails(productId);
    }

    /**
     * Get compositions using a specific material
     */
    @Transactional(readOnly = true)
    public List<ProductComposition> getCompositionsByMaterialId(Integer materialId) {
        return productCompositionRepository.findByMaterialId(materialId);
    }

    /**
     * Create a new product composition
     */
    public ProductComposition createComposition(ProductComposition composition) {
        // Validate that product exists
        if (!productRepository.existsById(composition.getProductId())) {
            throw new RuntimeException("Product with ID " + composition.getProductId() + " does not exist");
        }

        // Validate that material exists
        if (!materialRepository.existsById(composition.getMaterialId())) {
            throw new RuntimeException("Material with ID " + composition.getMaterialId() + " does not exist");
        }

        // Validate that product group exists
        if (!productGroupRepository.existsById(composition.getProductGroupId())) {
            throw new RuntimeException("Product group with ID " + composition.getProductGroupId() + " does not exist");
        }

        // Check if composition already exists for this product-material combination
        if (productCompositionRepository.existsByProductIdAndMaterialId(
                composition.getProductId(), composition.getMaterialId())) {
            throw new RuntimeException("Composition already exists for this product-material combination");
        }

        // Validate that total composition percentage doesn't exceed 100%
        Double currentTotal = productCompositionRepository.getTotalCompositionPercentageByProductId(composition.getProductId());
        if (currentTotal == null) currentTotal = 0.0;

        double newTotal = currentTotal + composition.getCompositionPercentage().doubleValue();
        if (newTotal > 100.0) {
            throw new RuntimeException("Total composition percentage would exceed 100%. Current total: " +
                                     currentTotal + "%, Adding: " + composition.getCompositionPercentage() + "%");
        }

        // Validate that total material weight doesn't exceed product weight
        validateTotalWeight(composition.getProductId(), composition.getWeight(), null);

        return productCompositionRepository.save(composition);
    }

    /**
     * Update an existing product composition
     */
    public ProductComposition updateComposition(Integer id, ProductComposition updatedComposition) {
        Optional<ProductComposition> existingOpt = productCompositionRepository.findById(id);
        if (!existingOpt.isPresent()) {
            throw new RuntimeException("Product composition with ID " + id + " not found");
        }

        ProductComposition existing = existingOpt.get();

        // Validate that total composition percentage doesn't exceed 100%
        Double currentTotal = productCompositionRepository.getTotalCompositionPercentageByProductId(existing.getProductId());
        if (currentTotal == null) currentTotal = 0.0;

        // Subtract the existing percentage and add the new one
        double newTotal = currentTotal - existing.getCompositionPercentage().doubleValue() +
                         updatedComposition.getCompositionPercentage().doubleValue();
        if (newTotal > 100.0) {
            throw new RuntimeException("Total composition percentage would exceed 100%. Current total: " +
                                     currentTotal + "%, New percentage: " + updatedComposition.getCompositionPercentage() + "%");
        }

        // Validate that total material weight doesn't exceed product weight
        validateTotalWeight(existing.getProductId(), updatedComposition.getWeight(), existing.getWeight());

        // Update fields
        existing.setWeight(updatedComposition.getWeight());
        existing.setCompositionPercentage(updatedComposition.getCompositionPercentage());
        existing.setNotes(updatedComposition.getNotes());

        return productCompositionRepository.save(existing);
    }

    /**
     * Delete a product composition (soft delete)
     */
    public void deleteComposition(Integer id) {
        Optional<ProductComposition> compositionOpt = productCompositionRepository.findById(id);
        if (!compositionOpt.isPresent()) {
            throw new RuntimeException("Product composition with ID " + id + " not found");
        }

        ProductComposition composition = compositionOpt.get();
        composition.setIsActive(false);
        productCompositionRepository.save(composition);
    }

    /**
     * Get total composition percentage for a product
     */
    @Transactional(readOnly = true)
    public Double getTotalCompositionPercentage(Integer productId) {
        Double total = productCompositionRepository.getTotalCompositionPercentageByProductId(productId);
        return total != null ? total : 0.0;
    }

    /**
     * Validate composition percentages for a product
     */
    @Transactional(readOnly = true)
    public boolean isCompositionValid(Integer productId) {
        Double total = getTotalCompositionPercentage(productId);
        return total <= 100.0;
    }

    /**
     * Get remaining composition percentage available for a product
     */
    @Transactional(readOnly = true)
    public Double getRemainingCompositionPercentage(Integer productId) {
        Double total = getTotalCompositionPercentage(productId);
        return 100.0 - total;
    }

    /**
     * Get total material weight for a product
     */
    @Transactional(readOnly = true)
    public Double getTotalMaterialWeight(Integer productId) {
        List<ProductComposition> compositions = productCompositionRepository.findByProductId(productId);
        return compositions.stream()
                .mapToDouble(comp -> comp.getWeight().doubleValue())
                .sum();
    }

    /**
     * Get remaining weight capacity for a product
     */
    @Transactional(readOnly = true)
    public Double getRemainingWeight(Integer productId) {
        Optional<epr.eprapiservices.entity.Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product with ID " + productId + " not found");
        }

        Double productWeight = productOpt.get().getProductWeight().doubleValue();
        Double totalMaterialWeight = getTotalMaterialWeight(productId);
        return productWeight - totalMaterialWeight;
    }

    /**
     * Validate that total material weight doesn't exceed product weight
     */
    private void validateTotalWeight(Integer productId, BigDecimal newWeight, BigDecimal existingWeight) {
        Optional<epr.eprapiservices.entity.Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product with ID " + productId + " not found");
        }

        BigDecimal productWeight = productOpt.get().getProductWeight();

        // Validate individual weight is not negative or zero
        if (newWeight.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Material weight must be greater than 0 kg");
        }

        // Validate individual weight doesn't exceed product weight
        if (newWeight.compareTo(productWeight) > 0) {
            throw new RuntimeException("Individual material weight (" + newWeight + " kg) cannot exceed product weight (" + productWeight + " kg)");
        }

        Double currentTotalWeight = getTotalMaterialWeight(productId);

        // Subtract existing weight if this is an update
        if (existingWeight != null) {
            currentTotalWeight -= existingWeight.doubleValue();
        }

        double newTotalWeight = currentTotalWeight + newWeight.doubleValue();

        // Strict validation: total must be <= product weight
        if (newTotalWeight > productWeight.doubleValue()) {
            double remainingCapacity = productWeight.doubleValue() - currentTotalWeight;
            throw new RuntimeException("Total material weight would exceed product weight. " +
                    "Product weight: " + productWeight + " kg, " +
                    "Current material total: " + String.format("%.3f", currentTotalWeight) + " kg, " +
                    "Remaining capacity: " + String.format("%.3f", remainingCapacity) + " kg, " +
                    "Attempting to add: " + newWeight + " kg, " +
                    "New total would be: " + String.format("%.3f", newTotalWeight) + " kg. " +
                    "Maximum allowed for this material: " + String.format("%.3f", remainingCapacity) + " kg");
        }
    }

    /**
     * Validate material weights for a product
     */
    @Transactional(readOnly = true)
    public boolean isWeightValid(Integer productId) {
        Optional<epr.eprapiservices.entity.Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return false;
        }

        Double productWeight = productOpt.get().getProductWeight().doubleValue();
        Double totalMaterialWeight = getTotalMaterialWeight(productId);
        return totalMaterialWeight <= productWeight;
    }

    /**
     * Get detailed weight validation information for a product
     */
    @Transactional(readOnly = true)
    public WeightValidationResult validateProductWeights(Integer productId) {
        Optional<epr.eprapiservices.entity.Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return new WeightValidationResult(false, "Product not found", 0.0, 0.0, 0.0);
        }

        epr.eprapiservices.entity.Product product = productOpt.get();
        Double productWeight = product.getProductWeight().doubleValue();
        Double totalMaterialWeight = getTotalMaterialWeight(productId);
        Double remainingWeight = productWeight - totalMaterialWeight;

        boolean isValid = totalMaterialWeight <= productWeight;
        String message;

        if (isValid) {
            if (totalMaterialWeight == productWeight) {
                message = "Material weights perfectly match product weight";
            } else {
                message = String.format("Material weights are valid. Remaining capacity: %.3f kg", remainingWeight);
            }
        } else {
            double excess = totalMaterialWeight - productWeight;
            message = String.format("Material weights exceed product weight by %.3f kg", excess);
        }

        return new WeightValidationResult(isValid, message, productWeight, totalMaterialWeight, remainingWeight);
    }

    /**
     * Validate all compositions for consistency
     */
    @Transactional(readOnly = true)
    public void validateAllProductCompositions(Integer productId) {
        List<ProductComposition> compositions = productCompositionRepository.findByProductId(productId);

        if (compositions.isEmpty()) {
            return; // No compositions to validate
        }

        Optional<epr.eprapiservices.entity.Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product with ID " + productId + " not found");
        }

        epr.eprapiservices.entity.Product product = productOpt.get();
        BigDecimal productWeight = product.getProductWeight();

        // Calculate totals
        double totalWeight = compositions.stream()
                .mapToDouble(comp -> comp.getWeight().doubleValue())
                .sum();

        double totalPercentage = compositions.stream()
                .mapToDouble(comp -> comp.getCompositionPercentage().doubleValue())
                .sum();

        // Validate weight constraint
        if (totalWeight > productWeight.doubleValue()) {
            throw new RuntimeException(String.format(
                "Total material weight (%.3f kg) exceeds product weight (%.3f kg) by %.3f kg. " +
                "Please adjust material weights to not exceed the product weight.",
                totalWeight, productWeight.doubleValue(), totalWeight - productWeight.doubleValue()
            ));
        }

        // Validate percentage constraint
        if (totalPercentage > 100.0) {
            throw new RuntimeException(String.format(
                "Total composition percentage (%.2f%%) exceeds 100%% by %.2f%%. " +
                "Please adjust composition percentages.",
                totalPercentage, totalPercentage - 100.0
            ));
        }
    }

    // Inner class for weight validation result
    public static class WeightValidationResult {
        private final boolean valid;
        private final String message;
        private final double productWeight;
        private final double totalMaterialWeight;
        private final double remainingWeight;

        public WeightValidationResult(boolean valid, String message, double productWeight,
                                    double totalMaterialWeight, double remainingWeight) {
            this.valid = valid;
            this.message = message;
            this.productWeight = productWeight;
            this.totalMaterialWeight = totalMaterialWeight;
            this.remainingWeight = remainingWeight;
        }

        // Getters
        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
        public double getProductWeight() { return productWeight; }
        public double getTotalMaterialWeight() { return totalMaterialWeight; }
        public double getRemainingWeight() { return remainingWeight; }
    }
}
