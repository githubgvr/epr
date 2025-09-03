import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Edit, Trash2, Search, Save, X, Package, Tag, Award, RefreshCw, Upload, Download, Eye, CheckCircle, XCircle, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import ProductCategoryManagement from './ProductCategoryManagement'
import CertificationManagement from './CertificationManagement'
import { Product, CreateProductRequest, UpdateProductRequest, ProductCategory, ProductGroup } from '../../../types/product'
import { ProductCertification } from '../../../types/certification'
import { productService } from '../../../services/productService'
import { productCategoryService } from '../../../services/productCategoryService'
import { productGroupService } from '../../../services/productGroupService'
import { certificationService } from '../../../services/certificationService'
import { useAuth } from '../../../hooks/useAuth'
import './ProductManagement.css'



const ProductManagement: React.FC = () => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get token from localStorage
  const getToken = () => localStorage.getItem('authToken')

  // Load products from API
  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = getToken()
      const productsData = await productService.getAllProducts(token || undefined)
      setProducts(productsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load categories from API
  const loadCategories = async () => {
    try {
      const token = getToken()
      const categoriesData = await productCategoryService.getAllProductCategories(token || undefined)
      setCategories(categoriesData)
    } catch (err) {
      console.error('Error loading categories:', err)
    }
  }

  // Load product groups from API
  const loadProductGroups = async () => {
    try {
      const token = getToken()
      const productGroupsData = await productGroupService.getAllProductGroups(token || undefined)
      setProductGroups(productGroupsData)
    } catch (err) {
      console.error('Error loading product groups:', err)
    }
  }

  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts()
      loadCategories()
      loadProductGroups()
    }
  }, [isAuthenticated])



  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showCertifications, setShowCertifications] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)

  // New state for inline certifications grid
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null)
  const [productCertifications, setProductCertifications] = useState<{ [key: number]: ProductCertification[] }>({})
  const [certificationsLoading, setCertificationsLoading] = useState<{ [key: number]: boolean }>({})
  const [showCertificationForm, setShowCertificationForm] = useState(false)
  const [editingCertification, setEditingCertification] = useState<ProductCertification | null>(null)
  const [certificationFormData, setCertificationFormData] = useState({
    certificationName: '',
    certificationType: '',
    issuingAuthority: '',
    certificateNumber: '',
    issueDate: '',
    expiryDate: '',
    description: '',
    compliancePercentage: 0
  })

  const [formData, setFormData] = useState({
    productName: '',
    productGroupId: 0,
    productCategoryId: 0,
    skuProductCode: '',
    productDescription: '',
    productWeight: 0,
    productLifecycleDuration: 1,
    complianceTargetPercentage: 0,
    productManufacturingDate: '',
    productExpiryDate: ''
  })

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormData({
      productName: '',
      productGroupId: 0,
      productCategoryId: 0,
      skuProductCode: '',
      productDescription: '',
      productWeight: 0,
      productLifecycleDuration: 1,
      complianceTargetPercentage: 0,
      productManufacturingDate: '',
      productExpiryDate: ''
    })
    setShowModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      productName: product.productName,
      productGroupId: product.productGroupId,
      productCategoryId: product.productCategoryId || 0,
      skuProductCode: product.skuProductCode,
      productDescription: product.productDescription || '',
      productWeight: product.productWeight,
      productLifecycleDuration: product.productLifecycleDuration,
      complianceTargetPercentage: product.complianceTargetPercentage,
      productManufacturingDate: product.productManufacturingDate || '',
      productExpiryDate: product.productExpiryDate || ''
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
  }

  const openCertificationManagement = (productId: number) => {
    setSelectedProductId(productId)
    setShowCertifications(true)
  }

  const closeCertificationManagement = () => {
    setShowCertifications(false)
    setSelectedProductId(null)
  }

  // Certification grid functions
  const toggleCertificationsGrid = async (productId: number) => {
    if (expandedProductId === productId) {
      setExpandedProductId(null)
    } else {
      setExpandedProductId(productId)
      await loadProductCertifications(productId)
    }
  }

  const loadProductCertifications = async (productId: number) => {
    try {
      setCertificationsLoading(prev => ({ ...prev, [productId]: true }))
      const token = getToken()
      const certifications = await certificationService.getCertificationsByProductId(productId, token || undefined)
      setProductCertifications(prev => ({ ...prev, [productId]: certifications }))
    } catch (err) {
      console.error('Error loading certifications:', err)
      setError('Failed to load certifications')
    } finally {
      setCertificationsLoading(prev => ({ ...prev, [productId]: false }))
    }
  }

  const refreshCertifications = async (productId: number) => {
    await loadProductCertifications(productId)
  }

  const openCertificationForm = (productId: number, certification?: ProductCertification) => {
    setSelectedProductId(productId)
    setEditingCertification(certification || null)

    if (certification) {
      setCertificationFormData({
        certificationName: certification.certificationName,
        certificationType: certification.certificationType,
        issuingAuthority: certification.issuingAuthority || '',
        certificateNumber: certification.certificateNumber || '',
        issueDate: certification.issueDate || '',
        expiryDate: certification.expiryDate || '',
        description: certification.description || '',
        compliancePercentage: certification.compliancePercentage || 0
      })
    } else {
      setCertificationFormData({
        certificationName: '',
        certificationType: '',
        issuingAuthority: '',
        certificateNumber: '',
        issueDate: '',
        expiryDate: '',
        description: '',
        compliancePercentage: 0
      })
    }

    setShowCertificationForm(true)
  }

  const closeCertificationForm = () => {
    setShowCertificationForm(false)
    setEditingCertification(null)
    setSelectedProductId(null)
  }

  const handleCertificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProductId) return

    try {
      setLoading(true)
      const token = getToken()

      if (editingCertification) {
        const updateRequest = {
          certificationId: editingCertification.certificationId,
          productId: selectedProductId,
          ...certificationFormData
        }
        await certificationService.updateCertification(
          selectedProductId,
          editingCertification.certificationId,
          updateRequest,
          token || undefined
        )
      } else {
        const createRequest = {
          productId: selectedProductId,
          ...certificationFormData
        }
        await certificationService.createCertification(
          selectedProductId,
          createRequest,
          token || undefined
        )
      }

      await refreshCertifications(selectedProductId)
      closeCertificationForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save certification')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCertification = async (productId: number, certificationId: number) => {
    if (!confirm('Are you sure you want to delete this certification?')) return

    try {
      setLoading(true)
      const token = getToken()
      await certificationService.deleteCertification(productId, certificationId, token || undefined)
      await refreshCertifications(productId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete certification')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (productId: number, certificationId: number, file: File) => {
    try {
      setLoading(true)
      const token = getToken()
      await certificationService.uploadCertificationFile(productId, certificationId, file, token || undefined)
      await refreshCertifications(productId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setLoading(false)
    }
  }

  const handleFileDownload = async (productId: number, certificationId: number) => {
    try {
      const token = getToken()
      await certificationService.downloadCertificationFile(productId, certificationId, token || undefined)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download file')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return <CheckCircle size={16} className="status-icon active" />
      case 'expired': return <XCircle size={16} className="status-icon expired" />
      case 'pending': return <Clock size={16} className="status-icon pending" />
      case 'revoked': return <XCircle size={16} className="status-icon revoked" />
      default: return <AlertTriangle size={16} className="status-icon unknown" />
    }
  }

  const getVerificationIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'verified': return <CheckCircle size={16} className="verification-icon verified" />
      case 'rejected': return <XCircle size={16} className="verification-icon rejected" />
      case 'pending': return <Clock size={16} className="verification-icon pending" />
      default: return <Eye size={16} className="verification-icon not-verified" />
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)
      const token = getToken()

      if (editingProduct) {
        // Update existing product
        const updateRequest: UpdateProductRequest = {
          productId: editingProduct.productId,
          ...formData
        }
        await productService.updateProduct(editingProduct.productId, updateRequest, token || undefined)
      } else {
        // Create new product
        const createRequest: CreateProductRequest = formData
        await productService.createProduct(createRequest, token || undefined)
      }

      // Reload products after successful operation
      await loadProducts()
      closeModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product')
      console.error('Error saving product:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true)
        const token = getToken()
        await productService.deleteProduct(id, token || undefined)
        await loadProducts() // Reload products after deletion
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete product')
        console.error('Error deleting product:', err)
      } finally {
        setLoading(false)
      }
    }
  }



  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.productCategory?.productCategoryName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.skuProductCode.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="product-management">
      <div className="page-header">
        <h1>Product Management</h1>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={16} />
          Products
        </button>
        <button
          className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <Tag size={16} />
          Product Categories
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'products' && (
        <>
          {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <Search size={16} className="search-icon" />
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="loading-state">
          <p>Loading products...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>Error: {error}</p>
          <button onClick={loadProducts} className="btn btn-secondary">
            Retry
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.productId} className="product-card">
            <div className="product-header">
              <div className="product-icon">
                <Package size={24} />
              </div>
              <div className="product-info">
                <h3>{product.productName}</h3>
                <p className="product-sku">{product.skuProductCode}</p>
              </div>
              <div className={`status-badge ${product.complianceTargetPercentage >= 80 ? 'compliant' : product.complianceTargetPercentage >= 50 ? 'pending' : 'non-compliant'}`}>
                {product.complianceTargetPercentage >= 80 ? 'High Compliance' : product.complianceTargetPercentage >= 50 ? 'Medium Compliance' : 'Low Compliance'}
              </div>
            </div>

            <div className="product-details">
              <div className="detail-row">
                <span className="label">Product Group:</span>
                <span>{product.productGroup?.productGroupName || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Category:</span>
                <span>{product.productCategory?.productCategoryName || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Weight:</span>
                <span>{product.productWeight} kg</span>
              </div>
              <div className="detail-row">
                <span className="label">Lifecycle:</span>
                <span>{product.productLifecycleDuration} years</span>
              </div>
              <div className="detail-row">
                <span className="label">Compliance Target:</span>
                <span className="compliance-target">{product.complianceTargetPercentage}%</span>
              </div>
              <div className="detail-row">
                <span className="label">Registration:</span>
                <span>{new Date(product.registrationDate).toLocaleDateString()}</span>
              </div>
              {product.productDescription && (
                <div className="detail-row">
                  <span className="label">Description:</span>
                  <span>{product.productDescription}</span>
                </div>
              )}
            </div>

            <div className="product-actions">
              <button
                className={`btn-icon certifications ${expandedProductId === product.productId ? 'active' : ''}`}
                onClick={() => toggleCertificationsGrid(product.productId)}
                title="View Certifications"
              >
                {expandedProductId === product.productId ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <Award size={14} />
              </button>
              <button
                className="btn-icon edit"
                onClick={() => openEditModal(product)}
                title="Edit"
              >
                <Edit size={14} />
              </button>
              <button
                className="btn-icon delete"
                onClick={() => handleDelete(product.productId)}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Certifications Grid */}
            {expandedProductId === product.productId && (
              <div className="certifications-section">
                <div className="certifications-header">
                  <h4>Product Certifications</h4>
                  <div className="certifications-actions">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => refreshCertifications(product.productId)}
                      title="Refresh"
                      disabled={certificationsLoading[product.productId]}
                    >
                      <RefreshCw size={14} className={certificationsLoading[product.productId] ? 'spinning' : ''} />
                      Refresh
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => openCertificationForm(product.productId)}
                      title="Add Certification"
                    >
                      <Plus size={14} />
                      Add Certification
                    </button>
                  </div>
                </div>

                {certificationsLoading[product.productId] ? (
                  <div className="certifications-loading">
                    <p>Loading certifications...</p>
                  </div>
                ) : (
                  <div className="certifications-grid">
                    {productCertifications[product.productId]?.length > 0 ? (
                      productCertifications[product.productId].map((certification) => (
                        <div key={certification.certificationId} className="certification-card">
                          <div className="certification-header">
                            <div className="certification-info">
                              <h5>{certification.certificationName}</h5>
                              <p className="certification-type">{certification.certificationType}</p>
                            </div>
                            <div className="certification-status">
                              {getStatusIcon(certification.status)}
                              {getVerificationIcon(certification.verificationStatus)}
                            </div>
                          </div>

                          <div className="certification-details">
                            <div className="detail-row">
                              <span className="label">Authority:</span>
                              <span>{certification.issuingAuthority || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Certificate #:</span>
                              <span>{certification.certificateNumber || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Issue Date:</span>
                              <span>{certification.issueDate ? new Date(certification.issueDate).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Expiry Date:</span>
                              <span>{certification.expiryDate ? new Date(certification.expiryDate).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            {certification.compliancePercentage && (
                              <div className="detail-row">
                                <span className="label">Compliance:</span>
                                <span className="compliance-percentage">{certification.compliancePercentage}%</span>
                              </div>
                            )}
                          </div>

                          <div className="certification-actions">
                            {certification.fileName && (
                              <button
                                className="btn-icon download"
                                onClick={() => handleFileDownload(product.productId, certification.certificationId)}
                                title="Download File"
                              >
                                <Download size={12} />
                              </button>
                            )}
                            <label className="btn-icon upload" title="Upload File">
                              <Upload size={12} />
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    handleFileUpload(product.productId, certification.certificationId, file)
                                  }
                                }}
                                style={{ display: 'none' }}
                              />
                            </label>
                            <button
                              className="btn-icon edit"
                              onClick={() => openCertificationForm(product.productId, certification)}
                              title="Edit"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              className="btn-icon delete"
                              onClick={() => handleDeleteCertification(product.productId, certification.certificationId)}
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-certifications">
                        <p>No certifications found for this product.</p>
                        <button
                          className="btn btn-primary"
                          onClick={() => openCertificationForm(product.productId)}
                        >
                          <Plus size={14} />
                          Add First Certification
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button className="btn-icon" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.productName}
                    onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">SKU/Product Code *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.skuProductCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, skuProductCode: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Product Group *</label>
                  <select
                    className="form-input"
                    value={formData.productGroupId}
                    onChange={(e) => setFormData(prev => ({ ...prev, productGroupId: parseInt(e.target.value) }))}
                    required
                  >
                    <option value={0}>Select Product Group</option>
                    {productGroups.map(group => (
                      <option key={group.productGroupId} value={group.productGroupId}>
                        {group.productGroupName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={formData.productCategoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, productCategoryId: parseInt(e.target.value) }))}
                  >
                    <option value={0}>Select Category (Optional)</option>
                    {categories.map(category => (
                      <option key={category.productCategoryId} value={category.productCategoryId}>
                        {category.productCategoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="form-input"
                    value={formData.productWeight}
                    onChange={(e) => setFormData(prev => ({ ...prev, productWeight: parseFloat(e.target.value) || 0 }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lifecycle Duration (years) *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="form-input"
                    value={formData.productLifecycleDuration}
                    onChange={(e) => setFormData(prev => ({ ...prev, productLifecycleDuration: parseInt(e.target.value) || 1 }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Compliance Target (%) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    className="form-input"
                    value={formData.complianceTargetPercentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, complianceTargetPercentage: parseFloat(e.target.value) || 0 }))}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    value={formData.productDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, productDescription: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Manufacturing Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.productManufacturingDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, productManufacturingDate: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.productExpiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, productExpiryDate: e.target.value }))}
                  />
                </div>


              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certification Form Modal */}
      {showCertificationForm && (
        <div className="modal-overlay" onClick={closeCertificationForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCertification ? 'Edit Certification' : 'Add Certification'}</h2>
              <button className="btn-icon" onClick={closeCertificationForm}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCertificationSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Certification Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={certificationFormData.certificationName}
                    onChange={(e) => setCertificationFormData(prev => ({ ...prev, certificationName: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Certification Type *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={certificationFormData.certificationType}
                    onChange={(e) => setCertificationFormData(prev => ({ ...prev, certificationType: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Issuing Authority</label>
                  <input
                    type="text"
                    className="form-input"
                    value={certificationFormData.issuingAuthority}
                    onChange={(e) => setCertificationFormData(prev => ({ ...prev, issuingAuthority: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Certificate Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={certificationFormData.certificateNumber}
                    onChange={(e) => setCertificationFormData(prev => ({ ...prev, certificateNumber: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Issue Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={certificationFormData.issueDate}
                    onChange={(e) => setCertificationFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={certificationFormData.expiryDate}
                    onChange={(e) => setCertificationFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Compliance Percentage</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    className="form-input"
                    value={certificationFormData.compliancePercentage}
                    onChange={(e) => setCertificationFormData(prev => ({ ...prev, compliancePercentage: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    value={certificationFormData.description}
                    onChange={(e) => setCertificationFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeCertificationForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        </>
      )}

      {/* Product Categories Tab */}
      {activeTab === 'categories' && (
        <ProductCategoryManagement />
      )}

      {/* Certification Management Modal */}
      {showCertifications && selectedProductId && (
        <CertificationManagement
          productId={selectedProductId}
          onClose={closeCertificationManagement}
        />
      )}





    </div>
  )
}

export default ProductManagement
