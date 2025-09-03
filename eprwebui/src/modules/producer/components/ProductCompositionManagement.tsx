import React, { useState, useEffect } from 'react'
import { 
  ProductComposition, 
  CreateProductCompositionRequest,
  Material,
  ProductOption,
  MaterialOption,
  ProductCategoryOption,
  ProductCompositionFormErrors
} from '../../../types/productComposition'
import { Product, ProductCategory } from '../../../types/product'
import productCompositionService from '../../../services/productCompositionService'
import productService from '../../../services/productService'
import productCategoryService from '../../../services/productCategoryService'
import './ProductCompositionManagement.css'

const ProductCompositionManagement: React.FC = () => {
  const [compositions, setCompositions] = useState<ProductComposition[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingComposition, setEditingComposition] = useState<ProductComposition | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [totalPercentage, setTotalPercentage] = useState<number>(0)
  const [remainingPercentage, setRemainingPercentage] = useState<number>(100)
  const [totalWeight, setTotalWeight] = useState<number>(0)
  const [remainingWeight, setRemainingWeight] = useState<number>(0)
  const [productWeight, setProductWeight] = useState<number>(0)

  // Form state
  const [formData, setFormData] = useState<CreateProductCompositionRequest>({
    productId: 0,
    materialId: 0,
    productCategoryId: 0,
    weight: 0,
    compositionPercentage: 0,
    notes: ''
  })
  const [formErrors, setFormErrors] = useState<ProductCompositionFormErrors>({})

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (selectedProductId) {
      loadCompositionsForProduct(selectedProductId)
      loadCompositionValidation(selectedProductId)
    }
  }, [selectedProductId])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [productsData, materialsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        productCompositionService.getAllMaterials(),
        productCategoryService.getAllCategories()
      ])
      
      setProducts(productsData)
      setMaterials(materialsData)
      setProductCategories(categoriesData)
      
      // Load all compositions initially
      const compositionsData = await productCompositionService.getAllCompositions()
      setCompositions(compositionsData)
    } catch (err) {
      setError('Failed to load data: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const loadCompositionsForProduct = async (productId: number) => {
    try {
      const compositionsData = await productCompositionService.getCompositionsByProductId(productId)
      setCompositions(compositionsData)
    } catch (err) {
      setError('Failed to load compositions: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const loadCompositionValidation = async (productId: number) => {
    try {
      const fullValidation = await productCompositionService.getFullValidation(productId)

      // Set percentage validation
      setTotalPercentage(fullValidation.percentageValidation.totalPercentage)
      setRemainingPercentage(fullValidation.percentageValidation.remainingPercentage)

      // Set weight validation
      setTotalWeight(fullValidation.weightValidation.totalWeight)
      setRemainingWeight(fullValidation.weightValidation.remainingWeight)

      // Get product weight from the selected product
      const selectedProduct = products.find(p => p.productId === productId)
      if (selectedProduct) {
        setProductWeight(selectedProduct.productWeight)
      }
    } catch (err) {
      console.error('Failed to load validation:', err)
    }
  }

  const handleProductChange = (productId: number) => {
    setSelectedProductId(productId)
    setFormData(prev => ({ ...prev, productId }))
  }

  const handleInputChange = (field: keyof CreateProductCompositionRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }

    // Real-time validation for percentage
    if (field === 'compositionPercentage' && Number(value) > 0) {
      const currentPercentageForEdit = editingComposition ? editingComposition.compositionPercentage : 0
      const newTotal = totalPercentage - currentPercentageForEdit + Number(value)

      if (newTotal > 100) {
        const maxAllowed = 100 - (totalPercentage - currentPercentageForEdit)
        setFormErrors(prev => ({
          ...prev,
          compositionPercentage: `Total would exceed 100%. Maximum allowed: ${maxAllowed.toFixed(2)}%`
        }))
      }
    }

    // Real-time validation for weight
    if (field === 'weight' && Number(value) > 0) {
      const weightValue = Number(value)
      const percValue = (weightValue/productWeight)*100
     
      formData.compositionPercentage = percValue
     
       //setFormData(field.co: value }))
      //setEditingComposition(percValue)
      // Check individual weight doesn't exceed product weight
      if (weightValue > productWeight) {
        setFormErrors(prev => ({
          ...prev,
          weight: `Individual material weight (${weightValue.toFixed(3)} kg) cannot exceed product weight (${productWeight.toFixed(3)} kg)`
        }))
      } else {
        // Check aggregated weight doesn't exceed product weight
        const currentWeightForEdit = editingComposition ? editingComposition.weight : 0
        const newTotalWeight = totalWeight - currentWeightForEdit + weightValue

        if (newTotalWeight > productWeight) {
          const maxAllowed = productWeight - (totalWeight - currentWeightForEdit)
          setFormErrors(prev => ({
            ...prev,
            weight: `Total material weight would exceed product weight (${productWeight.toFixed(3)} kg). ` +
                   `Current total: ${(totalWeight - currentWeightForEdit).toFixed(3)} kg, ` +
                   `Maximum allowed: ${maxAllowed.toFixed(3)} kg`
          }))
        }
      }
    }
  }

  const validateForm = (): boolean => {
    const errors: ProductCompositionFormErrors = {}

    if (!formData.productId) errors.productId = 'Product is required'
    if (!formData.materialId) errors.materialId = 'Material is required'
    if (!formData.productCategoryId) errors.productCategoryId = 'Product category is required'
    if (!formData.weight || formData.weight <= 0) {
      errors.weight = 'Weight must be greater than 0'
    } else {
      // Individual weight validation
      if (formData.weight > productWeight) {
        errors.weight = `Individual material weight (${formData.weight} kg) cannot exceed product weight (${productWeight} kg)`
      } else {
        // Aggregated weight validation - check if total weight would exceed product weight
        const currentWeightForEdit = editingComposition ? editingComposition.weight : 0
        const newTotalWeight = totalWeight - currentWeightForEdit + formData.weight

        if (newTotalWeight > productWeight) {
          const maxAllowed = productWeight - (totalWeight - currentWeightForEdit)
          errors.weight = `Total material weight would exceed product weight (${productWeight.toFixed(3)} kg). ` +
                         `Current total: ${(totalWeight - currentWeightForEdit).toFixed(3)} kg, ` +
                         `Maximum allowed for this material: ${maxAllowed.toFixed(3)} kg`
        }
      }
    }

    // Enhanced percentage validation
    if (!formData.compositionPercentage || formData.compositionPercentage <= 0) {
      errors.compositionPercentage = 'Composition percentage must be greater than 0'
    } else if (formData.compositionPercentage > 100) {
      errors.compositionPercentage = 'Composition percentage cannot exceed 100%'
    } else {
      // Calculate what the new total would be
      const currentPercentageForEdit = editingComposition ? editingComposition.compositionPercentage : 0
      const newTotal = totalPercentage - currentPercentageForEdit + formData.compositionPercentage

      if (newTotal > 100) {
        const maxAllowed = 100 - (totalPercentage - currentPercentageForEdit)
        errors.compositionPercentage = `Total would exceed 100%. Maximum allowed: ${maxAllowed.toFixed(2)}%`
      }
    }

    // Check for duplicate material in same product (only for new compositions)
    if (!editingComposition && formData.productId && formData.materialId) {
      const existingComposition = compositions.find(c =>
        c.productId === formData.productId &&
        c.materialId === formData.materialId &&
        c.isActive
      )
      if (existingComposition) {
        errors.materialId = 'This material is already used in this product'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      if (editingComposition) {
        await productCompositionService.updateComposition(editingComposition.productCompositionId, {
          ...formData,
          productCompositionId: editingComposition.productCompositionId
        })
      } else {
        await productCompositionService.createComposition(formData)
      }

      // Reload data
      if (selectedProductId) {
        await loadCompositionsForProduct(selectedProductId)
        await loadCompositionValidation(selectedProductId)
      } else {
        await loadInitialData()
      }

      // Reset form
      resetForm()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'

      // Check if it's a percentage validation error from backend
      if (errorMessage.includes('exceed 100') || errorMessage.includes('percentage')) {
        setFormErrors(prev => ({
          ...prev,
          compositionPercentage: errorMessage
        }))
      } else if (errorMessage.includes('weight') || errorMessage.includes('Weight')) {
        setFormErrors(prev => ({
          ...prev,
          weight: errorMessage
        }))
      } else if (errorMessage.includes('already exists')) {
        setFormErrors(prev => ({
          ...prev,
          materialId: 'This material is already used in this product'
        }))
      } else {
        setError('Failed to save composition: ' + errorMessage)
      }
    }
  }

  const handleEdit = (composition: ProductComposition) => {
    setEditingComposition(composition)
    setFormData({
      productId: composition.productId,
      materialId: composition.materialId,
      productCategoryId: composition.productCategoryId,
      weight: composition.weight,
      compositionPercentage: composition.compositionPercentage,
      notes: composition.notes || ''
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this composition?')) return

    try {
      await productCompositionService.deleteComposition(id)
      
      // Reload data
      if (selectedProductId) {
        await loadCompositionsForProduct(selectedProductId)
        await loadCompositionValidation(selectedProductId)
      } else {
        await loadInitialData()
      }
    } catch (err) {
      setError('Failed to delete composition: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const validateAllCompositions = async () => {
    if (!selectedProductId) return

    try {
      const response = await fetch(`http://localhost:8080/api/product-compositions/product/${selectedProductId}/validate-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const message = await response.text()
        alert(`✅ Validation Successful: ${message}`)
      } else {
        const errorMessage = await response.text()
        alert(`❌ Validation Failed: ${errorMessage}`)
      }
    } catch (err) {
      alert('❌ Validation Error: Failed to validate compositions')
      console.error('Validation error:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      productId: selectedProductId || 0,
      materialId: 0,
      productCategoryId: 0,
      weight: 0,
      compositionPercentage: 0,
      notes: ''
    })
    setFormErrors({})
    setEditingComposition(null)
    setShowAddForm(false)
  }

  const getProductOptions = (): ProductOption[] => {
    return products.map(product => ({
      value: product.productId,
      label: product.productName,
      skuCode: product.skuProductCode
    }))
  }

  const getProductCompositionSummary = () => {
    const summary = new Map<number, {
      product: any,
      totalPercentage: number,
      totalWeight: number,
      compositions: ProductComposition[]
    }>()

    compositions.forEach(comp => {
      if (!summary.has(comp.productId)) {
        summary.set(comp.productId, {
          product: comp.product,
          totalPercentage: 0,
          totalWeight: 0,
          compositions: []
        })
      }
      const entry = summary.get(comp.productId)!
      entry.totalPercentage += comp.compositionPercentage
      entry.totalWeight += comp.weight
      entry.compositions.push(comp)
    })

    return Array.from(summary.values())
  }

  const getMaterialOptions = (): MaterialOption[] => {
    return materials.map(material => ({
      value: material.materialId,
      label: material.materialName,
      code: material.materialCode
    }))
  }

  const getCategoryOptions = (): ProductCategoryOption[] => {
    return productCategories.map(category => ({
      value: category.productCategoryId,
      label: category.productCategoryName
    }))
  }

  if (loading) {
    return <div className="loading">Loading product compositions...</div>
  }

  return (
    <div className="product-composition-management">
      <div className="header">
        <h2>Product Composition Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add New Composition
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Product Filter */}
      <div className="filters">
        <div className="filter-group">
          <label>Filter by Product:</label>
          <select 
            value={selectedProductId || ''} 
            onChange={(e) => handleProductChange(Number(e.target.value) || 0)}
          >
            <option value="">All Products</option>
            {getProductOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.skuCode})
              </option>
            ))}
          </select>
        </div>

        {selectedProductId && (
          <div className="composition-summary">
            <div className="validation-section">
              <h4>Percentage Validation</h4>
              <div className="percentage-info">
                <span className={`percentage ${totalPercentage > 100 ? 'invalid' : 'valid'}`}>
                  Total: {totalPercentage.toFixed(2)}%
                </span>
                <span className="remaining">
                  Remaining: {remainingPercentage.toFixed(2)}%
                </span>
              </div>
              <div className="percentage-bar">
                <div
                  className={`percentage-fill ${totalPercentage > 100 ? 'over-limit' : ''}`}
                  style={{ width: `${Math.min(totalPercentage, 100)}%` }}
                ></div>
                {totalPercentage > 100 && (
                  <div
                    className="percentage-overflow"
                    style={{ width: `${totalPercentage - 100}%` }}
                  ></div>
                )}
              </div>
              {totalPercentage > 100 && (
                <div className="validation-warning">
                  ⚠️ Total composition exceeds 100%! Please adjust the percentages.
                </div>
              )}
            </div>

            <div className="validation-section">
              <h4>Weight Validation (Aggregation)</h4>
              <div className="weight-info">
                <span className={`weight ${totalWeight > productWeight ? 'invalid' : totalWeight === productWeight ? 'complete' : 'valid'}`}>
                  Total Materials: {totalWeight.toFixed(3)} kg
                </span>
                <span className="product-weight">
                  Product Weight: {productWeight.toFixed(3)} kg
                </span>
                <span className="remaining">
                  {totalWeight <= productWeight ?
                    `Remaining: ${remainingWeight.toFixed(3)} kg` :
                    `Excess: ${(totalWeight - productWeight).toFixed(3)} kg`
                  }
                </span>
              </div>
              <div className="weight-bar">
                <div
                  className={`weight-fill ${totalWeight > productWeight ? 'over-limit' : totalWeight === productWeight ? 'complete' : ''}`}
                  style={{ width: `${Math.min((totalWeight / productWeight) * 100, 100)}%` }}
                ></div>
                {totalWeight > productWeight && (
                  <div
                    className="weight-overflow"
                    style={{ width: `${((totalWeight - productWeight) / productWeight) * 100}%` }}
                  ></div>
                )}
              </div>
              <div className="weight-constraint-info">
                <small>
                  <strong>Constraint:</strong> Total material weight ≤ Product weight
                </small>
              </div>
              {totalWeight > productWeight && (
                <div className="validation-warning">
                  ❌ <strong>Constraint Violation:</strong> Total material weight ({totalWeight.toFixed(3)} kg) exceeds product weight ({productWeight.toFixed(3)} kg) by {(totalWeight - productWeight).toFixed(3)} kg
                </div>
              )}
              {totalWeight === productWeight && (
                <div className="validation-success">
                  ✅ <strong>Perfect Match:</strong> Total material weight equals product weight
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingComposition ? 'Edit Composition' : 'Add New Composition'}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="composition-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product *</label>
                  <select
                    value={formData.productId}
                    onChange={(e) => handleInputChange('productId', Number(e.target.value))}
                    disabled={!!editingComposition}
                  >
                    <option value="">Select Product</option>
                    {getProductOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label} ({option.skuCode})
                      </option>
                    ))}
                  </select>
                  {formErrors.productId && <span className="error">{formErrors.productId}</span>}
                </div>

                <div className="form-group">
                  <label>Material *</label>
                  <select
                    value={formData.materialId}
                    onChange={(e) => handleInputChange('materialId', Number(e.target.value))}
                    disabled={!!editingComposition}
                  >
                    <option value="">Select Material</option>
                    {getMaterialOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label} ({option.code})
                      </option>
                    ))}
                  </select>
                  {formErrors.materialId && <span className="error">{formErrors.materialId}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Product Category *</label>
                  <select
                    value={formData.productCategoryId}
                    onChange={(e) => handleInputChange('productCategoryId', Number(e.target.value))}
                  >
                    <option value="">Select Category</option>
                    {getCategoryOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.productCategoryId && <span className="error">{formErrors.productCategoryId}</span>}
                </div>

                <div className="form-group">
                  <label>Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                    placeholder="Enter weight"
                  />
                  {formErrors.weight && <span className="error">{formErrors.weight}</span>}
                  {selectedProductId && (
                    <div className="weight-help">
                      <small className="help-text">
                        Remaining: {remainingWeight.toFixed(3)} kg (Product: {productWeight.toFixed(3)} kg)
                      </small>
                      {remainingWeight < (productWeight * 0.1) && remainingWeight > 0 && (
                        <small className="warning-text">
                          ⚠️ Low remaining weight capacity
                        </small>
                      )}
                      {totalWeight >= productWeight && (
                        <small className="error-text">
                          ❌ Total weight exceeds product weight
                        </small>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Composition Percentage (%) *</label>
                  <input
                    type="number"
                    step="0.01"
                    max="100"
                    value={formData.compositionPercentage}
                    onChange={(e) => handleInputChange('compositionPercentage', Number(e.target.value))}
                    placeholder="Enter percentage"
                  />
                  {formErrors.compositionPercentage && <span className="error">{formErrors.compositionPercentage}</span>}
                  {selectedProductId && (
                    <div className="percentage-help">
                      <small className="help-text">
                        Remaining: {remainingPercentage.toFixed(2)}%
                      </small>
                      {remainingPercentage < 20 && remainingPercentage > 0 && (
                        <small className="warning-text">
                          ⚠️ Low remaining percentage
                        </small>
                      )}
                      {totalPercentage >= 100 && (
                        <small className="error-text">
                          ❌ Total exceeds 100%
                        </small>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Enter notes (optional)"
                    rows={3}
                  />
                  {formErrors.notes && <span className="error">{formErrors.notes}</span>}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={(totalPercentage > 100 || totalWeight > productWeight) && !editingComposition}
                >
                  {editingComposition ? 'Update' : 'Create'} Composition
                </button>
              </div>
              {(totalPercentage > 100 || totalWeight > productWeight) && !editingComposition && (
                <div className="form-warning">
                  ⚠️ Cannot add new composition:
                  {totalPercentage > 100 && ' Total percentage exceeds 100%'}
                  {totalWeight > productWeight && ' Total weight exceeds product weight'}
                  {totalPercentage > 100 && totalWeight > productWeight && ' Both percentage and weight limits exceeded'}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Composition Summary by Product */}
      {compositions.length > 0 && (
        <div className="composition-summary-section">
          <h3>Composition Summary by Product</h3>
          <div className="summary-grid">
            {getProductCompositionSummary().map(({ product, totalPercentage, totalWeight, compositions: productComps }) => (
              <div key={product?.productId} className="summary-card">
                <div className="summary-header">
                  <h4>{product?.productName || 'Unknown Product'}</h4>
                  <span className="sku-code">{product?.skuProductCode}</span>
                </div>
                <div className="summary-metrics">
                  <div className="summary-percentage">
                    <span className={`total-percentage ${totalPercentage > 100 ? 'invalid' : totalPercentage === 100 ? 'complete' : 'partial'}`}>
                      {totalPercentage.toFixed(2)}%
                    </span>
                    <span className="status-text">
                      {totalPercentage > 100 ? 'Over Limit' : totalPercentage === 100 ? 'Complete' : `${(100 - totalPercentage).toFixed(2)}% Remaining`}
                    </span>
                  </div>
                  <div className="summary-weight">
                    <span className={`total-weight ${totalWeight > (product?.productWeight || 0) ? 'invalid' : 'valid'}`}>
                      {totalWeight.toFixed(3)} kg
                    </span>
                    <span className="weight-status-text">
                      of {(product?.productWeight || 0).toFixed(3)} kg
                    </span>
                  </div>
                </div>
                <div className="summary-materials">
                  {productComps.map(comp => (
                    <div key={comp.productCompositionId} className="material-item">
                      <span className="material-name">{comp.material?.materialName}</span>
                      <div className="material-metrics">
                        <span className="material-percentage">{comp.compositionPercentage.toFixed(2)}%</span>
                        <span className="material-weight">{comp.weight.toFixed(3)} kg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compositions Grid */}
      <div className="compositions-grid">
        <div className="grid-header">
          <h3>Product Compositions</h3>
          <div className="header-actions">
            <span className="count">Total: {compositions.length}</span>
            {selectedProductId && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => validateAllCompositions()}
                title="Validate all compositions for this product"
              >
                Validate All
              </button>
            )}
          </div>
        </div>

        {compositions.length === 0 ? (
          <div className="empty-state">
            <p>No compositions found.</p>
            <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
              Add First Composition
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="compositions-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Material</th>
                  <th>Material Code</th>
                  <th>Category</th>
                  <th>Weight (kg)</th>
                  <th>Percentage (%)</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {compositions.map((composition) => (
                  <tr key={composition.productCompositionId}>
                    <td>{composition.product?.productName || 'N/A'}</td>
                    <td>{composition.product?.skuProductCode || 'N/A'}</td>
                    <td>{composition.material?.materialName || 'N/A'}</td>
                    <td>{composition.material?.materialCode || 'N/A'}</td>
                    <td>{composition.productCategory?.productCategoryName || 'N/A'}</td>
                    <td>{composition.weight.toFixed(3)}</td>
                    <td>
                      <span className={`percentage ${composition.compositionPercentage > 100 ? 'invalid' : 'valid'}`}>
                        {composition.compositionPercentage.toFixed(2)}%
                      </span>
                    </td>
                    <td>{composition.notes || '-'}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleEdit(composition)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(composition.productCompositionId)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCompositionManagement
