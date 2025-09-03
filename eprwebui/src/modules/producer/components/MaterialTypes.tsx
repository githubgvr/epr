import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'
import './MaterialTypes.css'

interface MaterialType {
  materialTypeId: number
  materialTypeName: string
  description: string
  createdDate: string
  updatedDate: string
  isActive: boolean
}

const MaterialTypes: React.FC = () => {
  const { t } = useTranslation()
  const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedMaterialType, setSelectedMaterialType] = useState<MaterialType | null>(null)
  const [formData, setFormData] = useState({
    materialTypeName: '',
    description: ''
  })

  // Fetch material types
  const fetchMaterialTypes = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/material-types')
      if (!response.ok) {
        throw new Error('Failed to fetch material types')
      }
      const data = await response.json()
      setMaterialTypes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching material types:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    fetchMaterialTypes()
  }

  useEffect(() => {
    fetchMaterialTypes()
  }, [])

  // Filter material types based on search term
  const filteredMaterialTypes = materialTypes.filter(mt =>
    mt.materialTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mt.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle form submission for add/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = showEditModal && selectedMaterialType 
        ? `/api/material-types/${selectedMaterialType.materialTypeId}`
        : '/api/material-types'
      
      const method = showEditModal ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to save material type')
      }

      // Force refresh the data
      await fetchMaterialTypes()
      handleCloseModal()

      // Show success message
      console.log('Material type saved successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this material type?')) {
      return
    }

    try {
      const response = await fetch(`/api/material-types/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete material type')
      }

      // Force refresh the data
      await fetchMaterialTypes()

      // Show success message
      console.log('Material type deleted successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  // Handle modal operations
  const handleAddNew = () => {
    setFormData({ materialTypeName: '', description: '' })
    setSelectedMaterialType(null)
    setShowAddModal(true)
  }

  const handleEdit = (materialType: MaterialType) => {
    setFormData({
      materialTypeName: materialType.materialTypeName,
      description: materialType.description
    })
    setSelectedMaterialType(materialType)
    setShowEditModal(true)
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setSelectedMaterialType(null)
    setFormData({ materialTypeName: '', description: '' })
  }

  if (loading) {
    return (
      <div className="material-types-loading">
        <div className="loading-spinner"></div>
        <p>Loading material types...</p>
      </div>
    )
  }

  return (
    <div className="material-types">
      <div className="material-types-header">
        <div className="header-content">
          <div className="header-title">
            <Package className="header-icon" />
            <h1>{t('Material Types')}</h1>
          </div>
          <p className="header-description">
            Manage material types for EPR compliance tracking
          </p>
        </div>
        <button className="btn-primary" onClick={handleAddNew}>
          <Plus size={20} />
          Add Material Type
        </button>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="material-types-controls">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search material types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="btn-secondary refresh-btn"
          onClick={handleRefresh}
          disabled={loading}
          title="Refresh data"
        >
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
          Refresh
        </button>
      </div>

      <div className="material-types-table-container">
        <table className="material-types-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Material Type Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Updated Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterialTypes.map((materialType) => (
              <tr key={materialType.materialTypeId}>
                <td>{materialType.materialTypeId}</td>
                <td className="material-name">
                  <strong>{materialType.materialTypeName}</strong>
                </td>
                <td className="description">
                  {materialType.description || 'No description'}
                </td>
                <td>
                  <span className="status active">
                    <CheckCircle size={14} />
                    Active
                  </span>
                </td>
                <td>{new Date(materialType.createdDate).toLocaleDateString()}</td>
                <td>{new Date(materialType.updatedDate).toLocaleDateString()}</td>
                <td className="actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleEdit(materialType)}
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => handleDelete(materialType.materialTypeId)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredMaterialTypes.length === 0 && !loading && (
        <div className="empty-state">
          <Package size={48} />
          <h3>No material types found</h3>
          <p>
            {searchTerm 
              ? 'No material types match your search criteria.'
              : 'Get started by adding your first material type.'
            }
          </p>
          {!searchTerm && (
            <button className="btn-primary" onClick={handleAddNew}>
              <Plus size={20} />
              Add Material Type
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{showEditModal ? 'Edit Material Type' : 'Add New Material Type'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="materialTypeName">Material Type Name *</label>
                  <input
                    type="text"
                    id="materialTypeName"
                    value={formData.materialTypeName}
                    onChange={(e) => setFormData({...formData, materialTypeName: e.target.value})}
                    required
                    maxLength={100}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    maxLength={500}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {showEditModal ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaterialTypes
