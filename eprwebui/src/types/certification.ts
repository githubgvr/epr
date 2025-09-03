// Certification-related types for EPR Vault Frontend

export interface ProductCertification {
  certificationId: number
  productId: number
  certificationName: string
  certificationType: string
  issuingAuthority?: string
  issueDate?: string
  expiryDate?: string
  certificationNumber?: string
  certificationFilePath?: string
  isActive: boolean
}

export interface CreateCertificationRequest {
  productId: number
  certificationName: string
  certificationType: string
  issuingAuthority?: string
  issueDate?: string
  expiryDate?: string
  certificationNumber?: string
  certificationFilePath?: string
}

export interface UpdateCertificationRequest {
  certificationName: string
  certificationType: string
  issuingAuthority?: string
  issueDate?: string
  expiryDate?: string
  certificationNumber?: string
  certificationFilePath?: string
}

export interface CertificationSearchParams {
  query?: string
  certificationType?: string
  issuingAuthority?: string
  isActive?: boolean
}
