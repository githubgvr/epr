// ProductComposition-related types for EPR Vault Frontend

export interface Material {
  materialId: number
  materialName: string
  materialCode: string
  description?: string
  materialTypeId: number
  materialType?: MaterialType
  isActive: boolean
  createdBy?: number
  createdDate: string
  updatedBy?: number
  updatedDate?: string
}

export interface MaterialType {
  materialTypeId: number
  materialTypeName: string
  description?: string
  isActive: boolean
  createdDate: string
  updatedDate?: string
}

export interface ProductComposition {
  productCompositionId: number
  productId: number
  materialId: number
  productCategoryId: number
  weight: number
  compositionPercentage: number
  notes?: string
  product?: {
    productId: number
    productName: string
    skuProductCode: string
  }
  material?: Material
  productCategory?: {
    productCategoryId: number
    productCategoryName: string
  }
  isActive: boolean
  createdBy?: number
  createdDate: string
  updatedBy?: number
  updatedDate?: string
}

export interface CreateProductCompositionRequest {
  productId: number
  materialId: number
  productCategoryId: number
  weight: number
  compositionPercentage: number
  notes?: string
}

export interface UpdateProductCompositionRequest extends CreateProductCompositionRequest {
  productCompositionId: number
}

export interface ProductCompositionSearchParams {
  productId?: number
  materialId?: number
  productCategoryId?: number
  minWeight?: number
  maxWeight?: number
  minCompositionPercentage?: number
  maxCompositionPercentage?: number
}

export interface ProductCompositionStatistics {
  totalCompositions: number
  totalProducts: number
  totalMaterials: number
  averageCompositionPercentage: number
}

export interface ProductCompositionValidationResponse {
  isValid: boolean
  totalPercentage: number
  remainingPercentage: number
  message?: string
}

export interface ProductCompositionApiResponse<T> {
  data: T
  message?: string
  error?: string
}

// Form validation types
export interface ProductCompositionFormErrors {
  productId?: string
  materialId?: string
  productCategoryId?: string
  weight?: string
  compositionPercentage?: string
  notes?: string
  general?: string
}

// Table and grid types
export interface ProductCompositionTableColumn {
  key: keyof ProductComposition | 'actions'
  label: string
  sortable: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface ProductCompositionGridData {
  compositions: ProductComposition[]
  totalPercentage: number
  remainingPercentage: number
  isValid: boolean
}

// Dropdown options
export interface ProductOption {
  value: number
  label: string
  skuCode: string
}

export interface MaterialOption {
  value: number
  label: string
  code: string
  type?: string
}

export interface ProductCategoryOption {
  value: number
  label: string
}

// Bulk operations
export interface BulkCompositionOperation {
  operation: 'delete' | 'update-category' | 'update-weight'
  compositionIds: number[]
  parameters?: {
    productCategoryId?: number
    weight?: number
  }
}

export interface BulkOperationResult {
  successCount: number
  errorCount: number
  errors: Array<{
    compositionId: number
    message: string
  }>
}

// Analytics and reporting
export interface CompositionAnalytics {
  totalCompositions: number
  productCount: number
  materialCount: number
  averageWeight: number
  averageCompositionPercentage: number
  materialDistribution: Array<{
    materialName: string
    count: number
    percentage: number
  }>
  productDistribution: Array<{
    productName: string
    count: number
    totalPercentage: number
  }>
}

export interface CompositionReport {
  productId: number
  productName: string
  skuProductCode: string
  compositions: Array<{
    materialName: string
    weight: number
    compositionPercentage: number
  }>
  totalWeight: number
  totalPercentage: number
  isComplete: boolean
}

// Export/Import types
export interface CompositionExportOptions {
  format: 'csv' | 'excel' | 'pdf'
  includeInactive?: boolean
  productIds?: number[]
  materialIds?: number[]
}

export interface CompositionImportResult {
  successCount: number
  errorCount: number
  errors: Array<{
    row: number
    field: string
    message: string
  }>
}
