import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Download, 
  Check, 
  X, 
  AlertTriangle, 
  FileText,
  Calendar,
  Shield,
  Award
} from 'lucide-react'
import { 
  ProductCertification, 
  CreateCertificationRequest, 
  UpdateCertificationRequest,
  CertificationStats
} from '../../../types/product'
import { certificationService } from '../../../services/certificationService'
import './CertificationManagement.css'

interface CertificationManagementProps {
  productId: number
  onClose: () => void
}

const CertificationManagement: React.FC<CertificationManagementProps> = ({ productId, onClose }) => {
  const [certifications, setCertifications] = useState<ProductCertification[]>([])
  const [stats, setStats] = useState<CertificationStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingCertification, setEditingCertification] = useState<ProductCertification | null>(null)
  const [uploadingFile, setUploadingFile] = useState<number | null>(null)

  const [formData, setFormData] = useState<CreateCertificationRequest>({
    productId,
    certificationName: '',
    certificationType: '',
    issuingAuthority: '',
    certificateNumber: '',
    issueDate: '',
    expiryDate: '',
    description: '',
    compliancePercentage: 0,
    notes: ''
  })

  // Get token from localStorage
  const getToken = () => localStorage.getItem('authToken')

  // Load certifications
  const loadCertifications = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = getToken()
      const [certificationsData, statsData] = await Promise.all([
        certificationService.getCertificationsByProductId(productId, token || undefined),
        certificationService.getCertificationStats(productId, token || undefined)
      ])
      setCertifications(certificationsData)
      setStats(statsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load certifications')
      console.error('Error loading certifications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCertifications()
  }, [productId])

  // Open create modal
  const openCreateModal = () => {
    setEditingCertification(null)
    setFormData({
      productId,
      certificationName: '',
      certificationType: '',
      issuingAuthority: '',
      certificateNumber: '',
      issueDate: '',
      expiryDate: '',
      description: '',
      compliancePercentage: 0,
      notes: ''
    })
    setShowModal(true)
  }

  // Open edit modal
  const openEditModal = (certification: ProductCertification) => {
    setEditingCertification(certification)
    setFormData({
      productId: certification.productId,
      certificationName: certification.certificationName,
      certificationType: certification.certificationType,
      issuingAuthority: certification.issuingAuthority || '',
      certificateNumber: certification.certificateNumber || '',
      issueDate: certification.issueDate || '',
      expiryDate: certification.expiryDate || '',
      description: certification.description || '',
      compliancePercentage: certification.compliancePercentage || 0,
      notes: certification.notes || ''
    })
    setShowModal(true)
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false)
    setEditingCertification(null)
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      const token = getToken()

      // Validate form
      const validationErrors = certificationService.validateCertification(formData)
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '))
        return
      }

      if (editingCertification) {
        // Update existing certification
        const updateRequest: UpdateCertificationRequest = {
          ...formData,
          certificationId: editingCertification.certificationId
        }
        await certificationService.updateCertification(
          productId, 
          editingCertification.certificationId, 
          updateRequest, 
          token || undefined
        )
      } else {
        // Create new certification
        await certificationService.createCertification(productId, formData, token || undefined)
      }
      
      await loadCertifications()
      closeModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save certification')
      console.error('Error saving certification:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async (certificationId: number) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) {
      return
    }

    try {
      setLoading(true)
      const token = getToken()
      await certificationService.deleteCertification(productId, certificationId, token || undefined)
      await loadCertifications()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete certification')
      console.error('Error deleting certification:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle file upload
  const handleFileUpload = async (certificationId: number, file: File) => {
    try {
      setUploadingFile(certificationId)
      setError(null)
      
      // Validate file
      const fileErrors = certificationService.validateFile(file)
      if (fileErrors.length > 0) {
        setError(fileErrors.join(', '))
        return
      }

      const token = getToken()
      await certificationService.uploadCertificationFile(productId, certificationId, file, token || undefined)
      await loadCertifications()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file')
      console.error('Error uploading file:', err)
    } finally {
      setUploadingFile(null)
    }
  }

  // Handle file download
  const handleFileDownload = async (certification: ProductCertification) => {
    try {
      const token = getToken()
      const blob = await certificationService.downloadCertificationFile(
        productId, 
        certification.certificationId, 
        token || undefined
      )
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = certification.fileName || `certification-${certification.certificationId}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download file')
      console.error('Error downloading file:', err)
    }
  }

  // Handle verification
  const handleVerify = async (certificationId: number) => {
    try {
      setLoading(true)
      const token = getToken()
      await certificationService.verifyCertification(productId, certificationId, 'System Admin', token || undefined)
      await loadCertifications()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify certification')
      console.error('Error verifying certification:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="certification-management">
      <div className="certification-header">
        <div className="header-content">
          <h2>Product Certifications</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        {stats && (
          <div className="certification-stats">
            <div className="stat-item">
              <Award className="stat-icon" />
              <div className="stat-content">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
            <div className="stat-item">
              <Shield className="stat-icon verified" />
              <div className="stat-content">
                <span className="stat-value">{stats.verified}</span>
                <span className="stat-label">Verified</span>
              </div>
            </div>
            <div className="stat-item">
              <AlertTriangle className="stat-icon expired" />
              <div className="stat-content">
                <span className="stat-value">{stats.expired}</span>
                <span className="stat-label">Expired</span>
              </div>
            </div>
            <div className="stat-item">
              <Calendar className="stat-icon expiring" />
              <div className="stat-content">
                <span className="stat-value">{stats.expiringSoon}</span>
                <span className="stat-label">Expiring Soon</span>
              </div>
            </div>
          </div>
        )}

        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} />
          Add Certification
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="loading-state">
          <p>Loading certifications...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>Error: {error}</p>
          <button onClick={loadCertifications} className="btn btn-secondary">
            Retry
          </button>
        </div>
      )}

      {/* Certifications List */}
      <div className="certifications-list">
        {certifications.map((certification) => (
          <div key={certification.certificationId} className="certification-card">
            <div className="certification-header-card">
              <div className="certification-info">
                <h3>{certification.certificationName}</h3>
                <p className="certification-type">{certification.certificationType}</p>
              </div>
              <div className="certification-badges">
                <span className={`status-badge ${certification.status.toLowerCase()}`}>
                  {certificationService.getStatusText(certification.status)}
                </span>
                <span className={`verification-badge ${certification.verificationStatus.toLowerCase()}`}>
                  {certificationService.getVerificationStatusText(certification.verificationStatus)}
                </span>
              </div>
            </div>
            
            <div className="certification-details">
              {certification.issuingAuthority && (
                <div className="detail-row">
                  <span className="label">Issuing Authority:</span>
                  <span>{certification.issuingAuthority}</span>
                </div>
              )}
              {certification.certificateNumber && (
                <div className="detail-row">
                  <span className="label">Certificate Number:</span>
                  <span>{certification.certificateNumber}</span>
                </div>
              )}
              {certification.issueDate && (
                <div className="detail-row">
                  <span className="label">Issue Date:</span>
                  <span>{new Date(certification.issueDate).toLocaleDateString()}</span>
                </div>
              )}
              {certification.expiryDate && (
                <div className="detail-row">
                  <span className="label">Expiry Date:</span>
                  <span className={certificationService.isCertificationExpired(certification) ? 'expired' : 
                                  certificationService.isCertificationExpiringSoon(certification) ? 'expiring-soon' : ''}>
                    {new Date(certification.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {certification.compliancePercentage !== undefined && (
                <div className="detail-row">
                  <span className="label">Compliance:</span>
                  <span className="compliance-percentage">{certification.compliancePercentage}%</span>
                </div>
              )}
            </div>

            <div className="certification-actions">
              <button
                className="btn-icon edit"
                onClick={() => openEditModal(certification)}
                title="Edit"
              >
                <Edit size={14} />
              </button>
              
              {certification.fileName ? (
                <button
                  className="btn-icon download"
                  onClick={() => handleFileDownload(certification)}
                  title="Download File"
                >
                  <Download size={14} />
                </button>
              ) : (
                <label className="btn-icon upload" title="Upload File">
                  <Upload size={14} />
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleFileUpload(certification.certificationId, file)
                      }
                    }}
                    disabled={uploadingFile === certification.certificationId}
                  />
                </label>
              )}

              {certification.verificationStatus !== 'VERIFIED' && (
                <button
                  className="btn-icon verify"
                  onClick={() => handleVerify(certification.certificationId)}
                  title="Verify"
                >
                  <Check size={14} />
                </button>
              )}

              <button
                className="btn-icon delete"
                onClick={() => handleDelete(certification.certificationId)}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {certification.fileName && (
              <div className="file-info">
                <FileText size={16} />
                <span>{certification.fileName}</span>
                <span className="file-size">
                  ({certificationService.formatFileSize(certification.fileSize)})
                </span>
              </div>
            )}
          </div>
        ))}

        {certifications.length === 0 && !loading && (
          <div className="empty-state">
            <Award size={48} />
            <h3>No Certifications</h3>
            <p>Add your first certification to get started.</p>
            <button className="btn btn-primary" onClick={openCreateModal}>
              <Plus size={16} />
              Add Certification
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCertification ? 'Edit Certification' : 'Add Certification'}</h2>
              <button className="btn-icon" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Certification Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.certificationName}
                    onChange={(e) => setFormData(prev => ({ ...prev, certificationName: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Certification Type *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.certificationType}
                    onChange={(e) => setFormData(prev => ({ ...prev, certificationType: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Issuing Authority</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.issuingAuthority}
                    onChange={(e) => setFormData(prev => ({ ...prev, issuingAuthority: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Certificate Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.certificateNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, certificateNumber: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Issue Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.issueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Compliance Percentage</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    className="form-input"
                    value={formData.compliancePercentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, compliancePercentage: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-input"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : editingCertification ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CertificationManagement
