// Product-related types for EPR Vault Frontend

export interface ProductGroup {
  productGroupId: number
  productGroupName: string
  description?: string
  isActive: boolean
}

// Product Category interface (alias for ProductGroup for backward compatibility)
export interface ProductCategory {
  productCategoryId: number
  productCategoryName: string
  description?: string
  isActive: boolean
}

export interface Product {
  productId: number
  productName: string
  skuProductCode: string
  productGroupId: number
  productGroup?: ProductGroup
  productCategoryId?: number
  productCategory?: ProductCategory
  productDescription?: string
  productWeight: number
  productLifecycleDuration: number
  complianceTargetPercentage: number
  regulatoryCertificationsPath?: string
  registrationDate: string
  productManufacturingDate?: string
  productExpiryDate?: string
  lastModifiedDate?: string
  certifications?: ProductCertification[]
  isActive: boolean
}

export interface ProductCertification {
  certificationId: number
  productId: number
  certificationName: string
  certificationType: string
  issuingAuthority?: string
  certificateNumber?: string
  issueDate?: string
  expiryDate?: string
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'PENDING'
  description?: string
  filePath?: string
  fileName?: string
  fileType?: string
  fileSize?: number
  compliancePercentage?: number
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED' | 'NOT_VERIFIED'
  verificationDate?: string
  verifiedBy?: string
  notes?: string
  createdBy: number
  updatedBy: number
  createdDate: string
  updatedDate: string
  isActive: boolean
}

export interface CreateCertificationRequest {
  productId: number
  certificationName: string
  certificationType: string
  issuingAuthority?: string
  certificateNumber?: string
  issueDate?: string
  expiryDate?: string
  description?: string
  compliancePercentage?: number
  notes?: string
}

export interface UpdateCertificationRequest extends CreateCertificationRequest {
  certificationId: number
}

export interface CertificationStats {
  total: number
  verified: number
  expired: number
  expiringSoon: number
}

export interface CertificationSearchParams {
  query?: string
  certificationType?: string
  issuingAuthority?: string
  status?: string
  verificationStatus?: string
  issueStartDate?: string
  issueEndDate?: string
  expiryStartDate?: string
  expiryEndDate?: string
}

export interface CreateProductRequest {
  productName: string
  skuProductCode: string
  productCategoryId: number
  productDescription?: string
  productWeight: number
  productLifecycleDuration: number
  complianceTargetPercentage: number
  productManufacturingDate?: string
  productExpiryDate?: string
}

export interface UpdateProductRequest extends CreateProductRequest {
  productId: number
}

export interface ProductSearchParams {
  query?: string
  categoryId?: number
  minWeight?: number
  maxWeight?: number
  minLifecycleDuration?: number
  maxLifecycleDuration?: number
  minComplianceTarget?: number
  maxComplianceTarget?: number
  registrationStartDate?: string
  registrationEndDate?: string
  manufacturingStartDate?: string
  manufacturingEndDate?: string
  expiryStartDate?: string
  expiryEndDate?: string
  hasRegulatoryCertifications?: boolean
}

export interface ProductStatistics {
  totalProducts: number
  productsWithCertifications: number
  productsWithoutCertifications: number
}

export interface ProductValidationResponse {
  available: boolean
}

export interface FileUploadResponse {
  message: string
  filename: string
}

export interface ProductApiResponse<T> {
  data: T
  message?: string
  error?: string
}

// Filter and sort options
export interface ProductSortOption {
  field: keyof Product
  direction: 'asc' | 'desc'
  label: string
}

export interface ProductFilterOptions {
  categories: ProductCategory[]
  weightRanges: Array<{ min: number; max: number; label: string }>
  lifecycleDurationRanges: Array<{ min: number; max: number; label: string }>
  complianceTargetRanges: Array<{ min: number; max: number; label: string }>
}

// Form validation types
export interface ProductFormErrors {
  productName?: string
  skuProductCode?: string
  productCategoryId?: string
  productWeight?: string
  productLifecycleDuration?: string
  complianceTargetPercentage?: string
  productManufacturingDate?: string
  productExpiryDate?: string
  general?: string
}

// Table and pagination types
export interface ProductTableColumn {
  key: keyof Product | 'actions'
  label: string
  sortable: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface ProductPaginationParams {
  page: number
  size: number
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
}

export interface ProductPageResponse {
  content: Product[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
}

// Export/Import types
export interface ProductExportOptions {
  format: 'csv' | 'excel' | 'pdf'
  includeInactive?: boolean
  categoryIds?: number[]
  dateRange?: {
    startDate: string
    endDate: string
  }
}

export interface ProductImportResult {
  successCount: number
  errorCount: number
  errors: Array<{
    row: number
    field: string
    message: string
  }>
}

// Dashboard and analytics types
export interface ProductAnalytics {
  totalProducts: number
  activeProducts: number
  inactiveProducts: number
  averageWeight: number
  averageLifecycleDuration: number
  averageComplianceTarget: number
  categoryDistribution: Array<{
    categoryName: string
    count: number
    percentage: number
  }>
  recentProducts: Product[]
  expiringProducts: Product[]
  highComplianceProducts: Product[]
}

export interface ProductTrend {
  date: string
  count: number
  category?: string
}

export interface ProductComplianceReport {
  productId: number
  productName: string
  skuProductCode: string
  complianceTargetPercentage: number
  currentCompliancePercentage: number
  status: 'compliant' | 'non-compliant' | 'at-risk'
  lastUpdated: string
}

// Bulk operations
export interface BulkProductOperation {
  operation: 'activate' | 'deactivate' | 'delete' | 'update-category' | 'update-compliance-target'
  productIds: number[]
  parameters?: {
    categoryId?: number
    complianceTargetPercentage?: number
  }
}

export interface BulkOperationResult {
  successCount: number
  errorCount: number
  errors: Array<{
    productId: number
    message: string
  }>
}
