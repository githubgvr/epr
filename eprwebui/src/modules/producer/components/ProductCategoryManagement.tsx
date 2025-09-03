import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Tag, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  AlertCircle, 
  RefreshCw,
  Filter,
  Eye,
  BarChart3
} from 'lucide-react'
import { ProductCategory, CreateProductCategoryRequest, UpdateProductCategoryRequest } from '../types/productCategory'
import productCategoryService from '../services/productCategoryService'
import './ProductCategoryManagement.css'

const ProductCategoryManagement: React.FC = () => {
  const { t } = useTranslation()
  
  // State management
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([])
  const [filteredCategories, setFilteredCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCount, setActiveCount] = useState(0)
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null)
  const [viewingCategory, setViewingCategory] = useState<ProductCategory | null>(null)
  
  // Form state
  const [formData, setFormData] = useState<CreateProductCategoryRequest>({
    productCategoryName: '',
    description: ''
  })

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Filter categories when search query changes
  useEffect(() => {
    filterCategories()
  }, [productCategories, searchQuery])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [categoriesData, countData] = await Promise.all([
        productCategoryService.getAll(),
        productCategoryService.getActiveCount()
      ])
      setProductCategories(categoriesData)
      setActiveCount(countData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterCategories = () => {
    let filtered = productCategories

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(category =>
        category.productCategoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredCategories(filtered)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      filterCategories()
      return
    }

    try {
      setLoading(true)
      const searchResults = await productCategoryService.search(searchQuery)
      setFilteredCategories(searchResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      console.error('Error searching categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingCategory(null)
    setFormData({
      productCategoryName: '',
      description: ''
    })
    setShowModal(true)
  }

  const openEditModal = (category: ProductCategory) => {
    setEditingCategory(category)
    setFormData({
      productCategoryName: category.productCategoryName,
      description: category.description
    })
    setShowModal(true)
  }

  const openViewModal = (category: ProductCategory) => {
    setViewingCategory(category)
    setShowViewModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setShowViewModal(false)
    setEditingCategory(null)
    setViewingCategory(null)
    setFormData({
      productCategoryName: '',
      description: ''
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      if (editingCategory) {
        await productCategoryService.update(editingCategory.productCategoryId, formData)
      } else {
        await productCategoryService.create(formData)
      }
      
      await loadData()
      closeModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product category')
      console.error('Error saving category:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product category?')) {
      return
    }

    try {
      setLoading(true)
      await productCategoryService.delete(id)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product category')
      console.error('Error deleting category:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading && productCategories.length === 0) {
    return (
      <div className="product-category-management">
        <div className="loading-spinner">
          <RefreshCw className="spinning" size={32} />
          <p>Loading product categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="product-category-management">
      {/* Header */}
      <div className="category-header">
        <div className="header-content">
          <div className="header-title">
            <Tag className="header-icon" />
            <h1>Product Category Management</h1>
          </div>
          <p className="header-description">
            Manage product categories for EPR compliance tracking
          </p>
          <div className="header-stats">
            <div className="stat-item">
              <BarChart3 size={16} />
              <span>{activeCount} Active Categories</span>
            </div>
          </div>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search categories by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
        
        <div className="filters">
          <button className="btn-secondary" onClick={loadData} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid">
        {filteredCategories.map((category) => (
          <div key={category.productCategoryId} className="category-card">
            <div className="category-header">
              <div className="category-icon">
                <Tag size={24} />
              </div>
              <div className="category-info">
                <h3>{category.productCategoryName}</h3>
                <p className="category-id">ID: {category.productCategoryId}</p>
              </div>
              <div className="status-badge active">
                Active
              </div>
            </div>

            <div className="category-content">
              <p className="category-description">{category.description}</p>
              <div className="category-meta">
                <div className="meta-item">
                  <span className="meta-label">Created:</span>
                  <span className="meta-value">{formatDate(category.createdDate)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Updated:</span>
                  <span className="meta-value">{formatDate(category.updatedDate)}</span>
                </div>
              </div>
            </div>

            <div className="category-actions">
              <button
                className="btn-icon view"
                onClick={() => openViewModal(category)}
                title="View Details"
              >
                <Eye size={14} />
              </button>
              <button
                className="btn-icon edit"
                onClick={() => openEditModal(category)}
                title="Edit"
              >
                <Edit size={14} />
              </button>
              <button
                className="btn-icon delete"
                onClick={() => handleDelete(category.productCategoryId)}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && !loading && (
        <div className="empty-state">
          <Tag size={64} />
          <h2>No Product Categories Found</h2>
          <p>
            {searchQuery
              ? 'No categories match your search criteria. Try adjusting your search.'
              : 'Get started by adding your first product category.'
            }
          </p>
          {!searchQuery && (
            <button className="btn-primary" onClick={openCreateModal}>
              <Plus size={20} />
              Add Your First Category
            </button>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Edit Product Category' : 'Add Product Category'}</h2>
              <button className="btn-icon" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="productCategoryName">Category Name *</label>
                <input
                  type="text"
                  id="productCategoryName"
                  value={formData.productCategoryName}
                  onChange={(e) => setFormData({ ...formData, productCategoryName: e.target.value })}
                  required
                  placeholder="Enter category name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description"
                  rows={4}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  <Save size={16} />
                  {editingCategory ? 'Update' : 'Create'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingCategory && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Product Category Details</h2>
              <button className="btn-icon" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <div className="detail-section">
                <h3>Basic Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">ID:</span>
                    <span className="detail-value">{viewingCategory.productCategoryId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{viewingCategory.productCategoryName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${viewingCategory.isActive ? 'active' : 'inactive'}`}>
                      {viewingCategory.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Description</h3>
                <p className="description-text">
                  {viewingCategory.description || 'No description provided'}
                </p>
              </div>

              <div className="detail-section">
                <h3>Audit Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">{formatDate(viewingCategory.createdDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Updated:</span>
                    <span className="detail-value">{formatDate(viewingCategory.updatedDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={closeModal}>
                Close
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  closeModal()
                  openEditModal(viewingCategory)
                }}
              >
                <Edit size={16} />
                Edit Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductCategoryManagement
