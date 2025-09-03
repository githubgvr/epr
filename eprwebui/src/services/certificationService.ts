import { 
  ProductCertification, 
  CreateCertificationRequest, 
  UpdateCertificationRequest,
  CertificationStats,
  CertificationSearchParams
} from '../types/product'

const API_BASE_URL = 'http://localhost:8080/api'

class CertificationService {
  private getAuthHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // TEMPORARY: Skip authorization header for testing
    // if (token) {
    //   headers['Authorization'] = `Bearer ${token}`
    // }
    
    return headers
  }

  private getMultipartHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {}
    
    // TEMPORARY: Skip authorization header for testing
    // if (token) {
    //   headers['Authorization'] = `Bearer ${token}`
    // }
    
    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }
    
    return response.text() as unknown as T
  }

  // Get all certifications for a product
  async getCertificationsByProductId(productId: number, token?: string): Promise<ProductCertification[]> {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/certifications`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    })

    return this.handleResponse<ProductCertification[]>(response)
  }

  // Get a specific certification
  async getCertificationById(productId: number, certificationId: number, token?: string): Promise<ProductCertification> {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/certifications/${certificationId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    })
    
    return this.handleResponse<ProductCertification>(response)
  }

  // Create a new certification
  async createCertification(productId: number, certification: CreateCertificationRequest, token?: string): Promise<ProductCertification> {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/certifications`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(certification),
    })
    
    return this.handleResponse<ProductCertification>(response)
  }

  // Update an existing certification
  async updateCertification(productId: number, certificationId: number, certification: UpdateCertificationRequest, token?: string): Promise<ProductCertification> {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/certifications/${certificationId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(certification),
    })
    
    return this.handleResponse<ProductCertification>(response)
  }

  // Delete a certification
  async deleteCertification(productId: number, certificationId: number, token?: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/certifications/${certificationId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
  }

  // Upload certification file
  async uploadCertificationFile(productId: number, certificationId: number, file: File, token?: string): Promise<ProductCertification> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_BASE_URL}/products/${productId}/certifications/${certificationId}/upload`, {
      method: 'POST',
      headers: this.getMultipartHeaders(token),
      body: formData,
    })
    
    return this.handleResponse<ProductCertification>(response)
  }

  // Download certification file
  async downloadCertificationFile(productId: number, certificationId: number, token?: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/certifications/${certificationId}/download`, {
      method: 'GET',
      headers: this.getMultipartHeaders(token),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    return response.blob()
  }

  // Verify a certification
  async verifyCertification(productId: number, certificationId: number, verifiedBy: string, token?: string): Promise<ProductCertification> {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/certifications/${certificationId}/verify`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ verifiedBy }),
    })
    
    return this.handleResponse<ProductCertification>(response)
  }

  // Reject a certification
  async rejectCertification(productId: number, certificationId: number, rejectedBy: string, reason?: string, token?: string): Promise<ProductCertification> {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/certifications/${certificationId}/reject`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ rejectedBy, reason }),
    })
    
    return this.handleResponse<ProductCertification>(response)
  }

  // Get certification statistics
  async getCertificationStats(productId: number, token?: string): Promise<CertificationStats> {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/certifications/stats`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    })
    
    return this.handleResponse<CertificationStats>(response)
  }

  // Get all certification types
  async getAllCertificationTypes(token?: string): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/products/1/certifications/types`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    })
    
    return this.handleResponse<string[]>(response)
  }

  // Get all issuing authorities
  async getAllIssuingAuthorities(token?: string): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/products/1/certifications/authorities`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    })
    
    return this.handleResponse<string[]>(response)
  }

  // Search certifications
  async searchCertifications(searchTerm: string, token?: string): Promise<ProductCertification[]> {
    const response = await fetch(`${API_BASE_URL}/products/1/certifications/search?q=${encodeURIComponent(searchTerm)}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    })
    
    return this.handleResponse<ProductCertification[]>(response)
  }

  // Validate certification data
  validateCertification(certification: CreateCertificationRequest | UpdateCertificationRequest): string[] {
    const errors: string[] = []
    
    if (!certification.certificationName?.trim()) {
      errors.push('Certification name is required')
    }
    
    if (!certification.certificationType?.trim()) {
      errors.push('Certification type is required')
    }
    
    if (certification.issueDate && certification.expiryDate) {
      const issueDate = new Date(certification.issueDate)
      const expiryDate = new Date(certification.expiryDate)
      
      if (expiryDate <= issueDate) {
        errors.push('Expiry date must be after issue date')
      }
    }
    
    if (certification.compliancePercentage !== undefined) {
      if (certification.compliancePercentage < 0 || certification.compliancePercentage > 100) {
        errors.push('Compliance percentage must be between 0 and 100')
      }
    }
    
    return errors
  }

  // Helper method to check if certification is expired
  isCertificationExpired(certification: ProductCertification): boolean {
    if (!certification.expiryDate) return false
    return new Date(certification.expiryDate) < new Date()
  }

  // Helper method to check if certification is expiring soon
  isCertificationExpiringSoon(certification: ProductCertification, daysThreshold: number = 30): boolean {
    if (!certification.expiryDate) return false
    const expiryDate = new Date(certification.expiryDate)
    const thresholdDate = new Date()
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold)
    return expiryDate <= thresholdDate && expiryDate > new Date()
  }

  // Helper method to get certification status color
  getCertificationStatusColor(certification: ProductCertification): string {
    if (this.isCertificationExpired(certification)) return '#dc3545' // red
    if (this.isCertificationExpiringSoon(certification)) return '#ffc107' // yellow
    if (certification.verificationStatus === 'VERIFIED') return '#28a745' // green
    if (certification.verificationStatus === 'REJECTED') return '#dc3545' // red
    return '#6c757d' // gray
  }

  // Helper method to get verification status display text
  getVerificationStatusText(status: string): string {
    switch (status) {
      case 'VERIFIED': return 'Verified'
      case 'PENDING': return 'Pending Verification'
      case 'REJECTED': return 'Rejected'
      case 'NOT_VERIFIED': return 'Not Verified'
      default: return status
    }
  }

  // Helper method to get status display text
  getStatusText(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'Active'
      case 'EXPIRED': return 'Expired'
      case 'REVOKED': return 'Revoked'
      case 'PENDING': return 'Pending'
      default: return status
    }
  }

  // Helper method to format file size
  formatFileSize(bytes?: number): string {
    if (!bytes) return 'N/A'
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  // Helper method to get allowed file types
  getAllowedFileTypes(): string[] {
    return ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
  }

  // Helper method to validate file
  validateFile(file: File): string[] {
    const errors: string[] = []
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = this.getAllowedFileTypes()
    
    if (file.size > maxSize) {
      errors.push('File size must be less than 10MB')
    }
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      errors.push('File type not allowed. Allowed types: PDF, JPG, JPEG, PNG, DOC, DOCX')
    }
    
    return errors
  }
}

export const certificationService = new CertificationService()
export default certificationService
