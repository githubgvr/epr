import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  AlertCircle, 
  RefreshCw,
  Filter,
  Eye
} from 'lucide-react'
import { Material, MaterialType, CreateMaterialRequest, UpdateMaterialRequest } from '../types/material'
import materialService from '../services/materialService'
import './Material.css'

const MaterialComponent: React.FC = () => {
  const { t } = useTranslation()
  
  // State management
  const [materials, setMaterials] = useState<Material[]>([])
  const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([])
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMaterialType, setSelectedMaterialType] = useState<number | null>(null)
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [viewingMaterial, setViewingMaterial] = useState<Material | null>(null)
  
  // Form state
  const [formData, setFormData] = useState<CreateMaterialRequest>({
    materialName: '',
    materialCode: '',
    description: '',
    materialTypeId: 0
  })

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Filter materials when search query or filter changes
  useEffect(() => {
    filterMaterials()
  }, [materials, searchQuery, selectedMaterialType])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [materialsData, materialTypesData] = await Promise.all([
        materialService.getAll(),
        materialService.getMaterialTypes()
      ])
      setMaterials(materialsData)
      setMaterialTypes(materialTypesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterMaterials = () => {
    let filtered = materials

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(material =>
        material.materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.materialCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by material type
    if (selectedMaterialType) {
      filtered = filtered.filter(material => material.materialTypeId === selectedMaterialType)
    }

    setFilteredMaterials(filtered)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      filterMaterials()
      return
    }

    try {
      setLoading(true)
      const searchResults = await materialService.search(searchQuery)
      setFilteredMaterials(searchResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      console.error('Error searching materials:', err)
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingMaterial(null)
    setFormData({
      materialName: '',
      materialCode: '',
      description: '',
      materialTypeId: materialTypes.length > 0 ? materialTypes[0].materialTypeId : 0
    })
    setShowModal(true)
  }

  const openEditModal = (material: Material) => {
    setEditingMaterial(material)
    setFormData({
      materialName: material.materialName,
      materialCode: material.materialCode,
      description: material.description,
      materialTypeId: material.materialTypeId
    })
    setShowModal(true)
  }

  const openViewModal = (material: Material) => {
    setViewingMaterial(material)
    setShowViewModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setShowViewModal(false)
    setEditingMaterial(null)
    setViewingMaterial(null)
    setFormData({
      materialName: '',
      materialCode: '',
      description: '',
      materialTypeId: 0
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      if (editingMaterial) {
        await materialService.update(editingMaterial.materialId, formData)
      } else {
        await materialService.create(formData)
      }
      
      await loadData()
      closeModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save material')
      console.error('Error saving material:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this material?')) {
      return
    }

    try {
      setLoading(true)
      await materialService.delete(id)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete material')
      console.error('Error deleting material:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getMaterialTypeName = (materialTypeId: number) => {
    const materialType = materialTypes.find(mt => mt.materialTypeId === materialTypeId)
    return materialType?.materialTypeName || 'Unknown'
  }

  if (loading && materials.length === 0) {
    return (
      <div className="material-management">
        <div className="loading-spinner">
          <RefreshCw className="spinning" size={32} />
          <p>Loading materials...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="material-management">
      {/* Header */}
      <div className="material-header">
        <div className="header-content">
          <div className="header-title">
            <Package className="header-icon" />
            <h1>Material</h1>
          </div>
          <p className="header-description">
            Manage materials for EPR compliance tracking
          </p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <Plus size={20} />
          Add Material
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
            placeholder="Search materials by name, code, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
        
        <div className="filters">
          <div className="filter-group">
            <Filter size={16} />
            <select
              value={selectedMaterialType || ''}
              onChange={(e) => setSelectedMaterialType(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">All Material Types</option>
              {materialTypes.map(type => (
                <option key={type.materialTypeId} value={type.materialTypeId}>
                  {type.materialTypeName}
                </option>
              ))}
            </select>
          </div>
          
          <button className="btn-secondary" onClick={loadData} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="materials-grid">
        {filteredMaterials.length === 0 ? (
          <div className="empty-state">
            <Package size={64} />
            <h2>No Materials Found</h2>
            <p>
              {searchQuery || selectedMaterialType
                ? 'No materials match your current filters. Try adjusting your search criteria.'
                : 'Get started by adding your first material for EPR compliance tracking.'
              }
            </p>
            <button className="btn-primary" onClick={openCreateModal}>
              <Plus size={20} />
              Add Your First Material
            </button>
          </div>
        ) : (
          filteredMaterials.map((material) => (
            <div key={material.materialId} className="material-card">
              <div className="material-header">
                <div className="material-icon">
                  <Package size={24} />
                </div>
                <div className="material-info">
                  <h3>{material.materialName}</h3>
                  <p className="material-code">{material.materialCode}</p>
                </div>
                <div className="status-badge active">
                  Active
                </div>
              </div>

              <div className="material-content">
                <p className="material-description">{material.description}</p>
                <div className="material-meta">
                  <div className="meta-item">
                    <span className="meta-label">Type:</span>
                    <span className="meta-value">{getMaterialTypeName(material.materialTypeId)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Created:</span>
                    <span className="meta-value">{formatDate(material.createdDate)}</span>
                  </div>
                </div>
              </div>

              <div className="material-actions">
                <button
                  className="btn-icon view"
                  onClick={() => openViewModal(material)}
                  title="View Details"
                >
                  <Eye size={14} />
                </button>
                <button
                  className="btn-icon edit"
                  onClick={() => openEditModal(material)}
                  title="Edit"
                >
                  <Edit size={14} />
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => handleDelete(material.materialId)}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingMaterial ? 'Edit Material' : 'Add New Material'}</h2>
              <button className="btn-icon" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="materialName">Material Name *</label>
                <input
                  id="materialName"
                  type="text"
                  value={formData.materialName}
                  onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
                  required
                  placeholder="Enter material name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="materialCode">Material Code *</label>
                <input
                  id="materialCode"
                  type="text"
                  value={formData.materialCode}
                  onChange={(e) => setFormData({ ...formData, materialCode: e.target.value })}
                  required
                  placeholder="Enter unique material code"
                />
              </div>

              <div className="form-group">
                <label htmlFor="materialTypeId">Material Type *</label>
                <select
                  id="materialTypeId"
                  value={formData.materialTypeId}
                  onChange={(e) => setFormData({ ...formData, materialTypeId: Number(e.target.value) })}
                  required
                >
                  <option value={0}>Select a material type</option>
                  {materialTypes.map(type => (
                    <option key={type.materialTypeId} value={type.materialTypeId}>
                      {type.materialTypeName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter material description"
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  <Save size={16} />
                  {editingMaterial ? 'Update Material' : 'Create Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingMaterial && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Material Details</h2>
              <button className="btn-icon" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <div className="detail-section">
                <h3>Basic Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Material Name</span>
                    <span className="detail-value">{viewingMaterial.materialName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Material Code</span>
                    <span className="detail-value">{viewingMaterial.materialCode}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Material Type</span>
                    <span className="detail-value">{getMaterialTypeName(viewingMaterial.materialTypeId)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className="detail-value">Active</span>
                  </div>
                </div>
              </div>

              {viewingMaterial.description && (
                <div className="detail-section">
                  <h3>Description</h3>
                  <p className="description-text">{viewingMaterial.description}</p>
                </div>
              )}

              <div className="detail-section">
                <h3>Audit Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Created Date</span>
                    <span className="detail-value">{formatDate(viewingMaterial.createdDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Modified</span>
                    <span className="detail-value">{formatDate(viewingMaterial.lastModifiedDate)}</span>
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
                  openEditModal(viewingMaterial)
                }}
              >
                <Edit size={16} />
                Edit Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaterialComponent
