import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Edit, Trash2, Search, Save, X } from 'lucide-react'
import { organizationService } from '../services/organizationService'
import { orgTypeService } from '../services/orgTypeService'
import { Organization, CreateOrganizationDto, UpdateOrganizationDto, OrgType } from '../types'

const OrganizationComponent: React.FC = () => {
  console.log('OrganizationComponent: Component loaded')
  const { t } = useTranslation()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [orgTypes, setOrgTypes] = useState<OrgType[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingOrgTypes, setLoadingOrgTypes] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null)
  const [formData, setFormData] = useState<CreateOrganizationDto>({
    orgName: '',
    orgTypeId: 1
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    console.log('OrganizationComponent: useEffect triggered')
    fetchOrganizations()
    fetchOrgTypes()
  }, [])

  const fetchOrganizations = async () => {
    try {
      console.log('OrganizationComponent: Fetching organizations...')
      setLoading(true)
      const data = await organizationService.getAll()
      console.log('OrganizationComponent: Organizations fetched:', data)
      setOrganizations(data)
    } catch (error) {
      console.error('Error fetching organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrgTypes = async () => {
    try {
      console.log('OrganizationComponent: Fetching org types...')
      setLoadingOrgTypes(true)
      const data = await orgTypeService.getAll()
      console.log('OrganizationComponent: Org types fetched:', data)
      setOrgTypes(data)
    } catch (error) {
      console.error('Error fetching organization types:', error)
    } finally {
      setLoadingOrgTypes(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchOrganizations()
      return
    }

    try {
      setLoading(true)
      const results = await organizationService.search(searchQuery)
      setOrganizations(results)
    } catch (error) {
      console.error('Error searching organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingOrg(null)
    setFormData({
      orgName: '',
      orgTypeId: orgTypes.length > 0 ? orgTypes[0].orgTypeId : 0
    })
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (org: Organization) => {
    setEditingOrg(org)
    setFormData({
      orgName: org.orgName,
      orgTypeId: org.orgTypeId
    })
    setFormErrors({})
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingOrg(null)
    setFormData({
      orgName: '',
      orgTypeId: orgTypes.length > 0 ? orgTypes[0].orgTypeId : 0
    })
    setFormErrors({})
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.orgName.trim()) {
      errors.orgName = 'Organization name is required'
    }
    if (!formData.orgTypeId || formData.orgTypeId === 0) {
      errors.orgTypeId = 'Organization type is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setSubmitting(true)

      if (editingOrg) {
        const updateData: UpdateOrganizationDto = {
          orgId: editingOrg.orgId,
          ...formData
        }
        await organizationService.update(updateData)
      } else {
        await organizationService.create(formData)
      }

      await fetchOrganizations()
      closeModal()
    } catch (error) {
      console.error('Error saving organization:', error)
      alert('Error saving organization. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this organization?')) {
      return
    }

    try {
      await organizationService.delete(id)
      await fetchOrganizations()
    } catch (error) {
      console.error('Error deleting organization:', error)
      alert('Error deleting organization. Please try again.')
    }
  }

  const handleInputChange = (field: keyof CreateOrganizationDto, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getOrgTypeName = (orgTypeId: number): string => {
    const orgType = orgTypes.find(type => type.orgTypeId === orgTypeId)
    return orgType ? orgType.orgTypeName : `Type ${orgTypeId}`
  }

  return (
    <div className="organization">
      <div className="page-header">
        <h1>Organization Management</h1>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} />
          Add Organization
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{t('common.loading')}</p>
          </div>
        ) : organizations.length === 0 ? (
          <div className="empty-state">
            <p>{t('common.no_data')}</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Organization ID</th>
                <th>Organization Name</th>
                <th>Organization Type</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.orgId}>
                  <td>{org.orgId}</td>
                  <td>
                    <div className="org-info">
                      <strong>{org.orgName}</strong>
                    </div>
                  </td>
                  <td>{getOrgTypeName(org.orgTypeId)}</td>
                  <td>
                    <span className={`status-badge ${org.isActive ? 'active' : 'inactive'}`}>
                      {org.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(org.createdDate).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon edit"
                        onClick={() => openEditModal(org)}
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(org.orgId)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingOrg ? 'Edit Organization' : 'Add Organization'}</h2>
              <button className="btn-icon" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Organization Name *</label>
                  <input
                    type="text"
                    className={`form-input ${formErrors.orgName ? 'error' : ''}`}
                    value={formData.orgName}
                    onChange={(e) => handleInputChange('orgName', e.target.value)}
                    placeholder="Enter organization name"
                  />
                  {formErrors.orgName && (
                    <span className="error-text">{formErrors.orgName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Organization Type *</label>
                  <select
                    className={`form-input ${formErrors.orgTypeId ? 'error' : ''}`}
                    value={formData.orgTypeId}
                    onChange={(e) => handleInputChange('orgTypeId', parseInt(e.target.value))}
                    disabled={loadingOrgTypes}
                  >
                    {loadingOrgTypes ? (
                      <option value="">Loading...</option>
                    ) : (
                      <>
                        <option value="">Select Organization Type</option>
                        {orgTypes.map((orgType) => (
                          <option key={orgType.orgTypeId} value={orgType.orgTypeId}>
                            {orgType.orgTypeName}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  {formErrors.orgTypeId && (
                    <span className="error-text">{formErrors.orgTypeId}</span>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <Save size={16} />
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
    </div>
  )
}

export default OrganizationComponent
