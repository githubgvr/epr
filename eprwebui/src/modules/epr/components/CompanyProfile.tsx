import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { companyProfileService } from '../services/companyProfileService'
import { industryService } from '../services/industryService'
import { organizationService } from '../services/organizationService'
import { CompanyProfile, CreateCompanyProfileDto, UpdateCompanyProfileDto, Industry, Organization } from '../types'

const CompanyProfileComponent: React.FC = () => {
  const [profiles, setProfiles] = useState<CompanyProfile[]>([])
  const [industries, setIndustries] = useState<Industry[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProfile, setEditingProfile] = useState<CompanyProfile | null>(null)
  const [formData, setFormData] = useState<CreateCompanyProfileDto>({
    companyName: '',
    companyRegisteredName: '',
    registeredId: '',
    industryId: 1,
    companyProfileDetails: '',
    orgId: 1
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchProfiles()
    fetchIndustries()
    fetchOrganizations()
  }, [])

  const fetchProfiles = async () => {
    try {
      setLoading(true)
      const data = await companyProfileService.getAll()
      setProfiles(data)
    } catch (error) {
      console.error('Error fetching company profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchIndustries = async () => {
    try {
      const data = await industryService.getAll()
      setIndustries(data)
    } catch (error) {
      console.error('Error fetching industries:', error)
    }
  }

  const fetchOrganizations = async () => {
    try {
      const data = await organizationService.getAll()
      setOrganizations(data)
    } catch (error) {
      console.error('Error fetching organizations:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getIndustryName = (industryId: number) => {
    const industry = industries.find(i => i.industryId === industryId)
    return industry ? industry.industryName : `Industry ${industryId}`
  }

  const getOrganizationName = (orgId: number) => {
    const org = organizations.find(o => o.orgId === orgId)
    return org ? org.orgName : `Organization ${orgId}`
  }

  const handleAdd = () => {
    setEditingProfile(null)
    setFormData({
      companyName: '',
      companyRegisteredName: '',
      registeredId: '',
      industryId: industries.length > 0 ? industries[0].industryId : 1,
      companyProfileDetails: '',
      orgId: organizations.length > 0 ? organizations[0].orgId : 1
    })
    setFormErrors({})
    setShowModal(true)
  }

  const handleEdit = (profile: CompanyProfile) => {
    setEditingProfile(profile)
    setFormData({
      companyName: profile.companyName,
      companyRegisteredName: profile.companyRegisteredName,
      registeredId: profile.registeredId,
      industryId: profile.industryId,
      companyProfileDetails: profile.companyProfileDetails,
      orgId: profile.orgId
    })
    setFormErrors({})
    setShowModal(true)
  }

  const handleView = (profile: CompanyProfile) => {
    // For now, just show an alert with profile details
    alert(`Company Profile Details:\n\nName: ${profile.companyName}\nRegistered Name: ${profile.companyRegisteredName}\nRegistration ID: ${profile.registeredId}\nIndustry: ${getIndustryName(profile.industryId)}\nOrganization: ${getOrganizationName(profile.orgId)}\nDetails: ${profile.companyProfileDetails}\nStatus: ${profile.isActive ? 'Active' : 'Inactive'}`)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this company profile?')) {
      try {
        const success = await companyProfileService.delete(id)
        if (success) {
          await fetchProfiles()
        } else {
          alert('Failed to delete company profile')
        }
      } catch (error) {
        console.error('Error deleting company profile:', error)
        alert('Error deleting company profile')
      }
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required'
    }

    if (!formData.companyRegisteredName.trim()) {
      errors.companyRegisteredName = 'Registered name is required'
    }

    if (!formData.registeredId.trim()) {
      errors.registeredId = 'Registration ID is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setSubmitting(true)

      if (editingProfile) {
        const updateData: UpdateCompanyProfileDto = {
          companyprofileId: editingProfile.companyprofileId,
          ...formData
        }
        await companyProfileService.update(updateData)
      } else {
        await companyProfileService.create(formData)
      }

      setShowModal(false)
      await fetchProfiles()
    } catch (error) {
      console.error('Error saving company profile:', error)
      alert('Error saving company profile')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof CreateCompanyProfileDto, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <div className="company-profile">
      <div className="page-header">
        <h1>Company Profile</h1>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={16} />
          Add Company Profile
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="empty-state">
            <p>No company profiles found</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Registered Name</th>
                <th>Registration ID</th>
                <th>Industry</th>
                <th>Organization</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.companyprofileId}>
                  <td><strong>{profile.companyName}</strong></td>
                  <td>{profile.companyRegisteredName}</td>
                  <td>{profile.registeredId}</td>
                  <td>{getIndustryName(profile.industryId)}</td>
                  <td>{getOrganizationName(profile.orgId)}</td>
                  <td>
                    <span className={`status-badge ${profile.isActive ? 'active' : 'inactive'}`}>
                      {profile.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{formatDate(profile.createdDate)}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ marginRight: '0.5rem' }}
                      onClick={() => handleView(profile)}
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ marginRight: '0.5rem' }}
                      onClick={() => handleEdit(profile)}
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(profile.companyprofileId)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingProfile ? 'Edit Company Profile' : 'Add Company Profile'}</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
                disabled={submitting}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label htmlFor="companyName">Company Name *</label>
                <input
                  type="text"
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className={formErrors.companyName ? 'error' : ''}
                  disabled={submitting}
                />
                {formErrors.companyName && (
                  <span className="error-message">{formErrors.companyName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="companyRegisteredName">Registered Name *</label>
                <input
                  type="text"
                  id="companyRegisteredName"
                  value={formData.companyRegisteredName}
                  onChange={(e) => handleInputChange('companyRegisteredName', e.target.value)}
                  className={formErrors.companyRegisteredName ? 'error' : ''}
                  disabled={submitting}
                />
                {formErrors.companyRegisteredName && (
                  <span className="error-message">{formErrors.companyRegisteredName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="registeredId">Registration ID *</label>
                <input
                  type="text"
                  id="registeredId"
                  value={formData.registeredId}
                  onChange={(e) => handleInputChange('registeredId', e.target.value)}
                  className={formErrors.registeredId ? 'error' : ''}
                  disabled={submitting}
                />
                {formErrors.registeredId && (
                  <span className="error-message">{formErrors.registeredId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="industryId">Industry</label>
                <select
                  id="industryId"
                  value={formData.industryId}
                  onChange={(e) => handleInputChange('industryId', parseInt(e.target.value))}
                  disabled={submitting}
                >
                  {industries.map((industry) => (
                    <option key={industry.industryId} value={industry.industryId}>
                      {industry.industryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="orgId">Organization</label>
                <select
                  id="orgId"
                  value={formData.orgId}
                  onChange={(e) => handleInputChange('orgId', parseInt(e.target.value))}
                  disabled={submitting}
                >
                  {organizations.map((org) => (
                    <option key={org.orgId} value={org.orgId}>
                      {org.orgName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="companyProfileDetails">Details</label>
                <textarea
                  id="companyProfileDetails"
                  value={formData.companyProfileDetails}
                  onChange={(e) => handleInputChange('companyProfileDetails', e.target.value)}
                  rows={4}
                  disabled={submitting}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : (editingProfile ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyProfileComponent
