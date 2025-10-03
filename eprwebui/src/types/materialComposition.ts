// MaterialComposition-related types for EPR Vault Frontend

export interface MaterialComposition {
  materialCompositionId: number
  compositionName: string
  compositionCode: string
  description?: string
  materialId: number
  weightKg: number
  minPercentage: number
  maxPercentage: number
  sortOrder: number
  notes?: string
  isActive: boolean
  createdDate: string
  updatedDate?: string
}

export interface CreateMaterialCompositionRequest {
  compositionName: string
  compositionCode: string
  description?: string
  materialId: number
  weightKg: number
  minPercentage: number
  maxPercentage: number
  sortOrder?: number
  notes?: string
}

export interface UpdateMaterialCompositionRequest {
  compositionName?: string
  compositionCode?: string
  description?: string
  materialId?: number
  weightKg?: number
  minPercentage?: number
  maxPercentage?: number
  sortOrder?: number
  notes?: string
  isActive?: boolean
}

// Material interface for dropdown options
export interface Material {
  materialId: number
  materialCode: string
  materialName: string
  description?: string
  sortOrder: number
  isActive: boolean
}

// Form validation types
export interface MaterialCompositionFormErrors {
  compositionName?: string
  compositionCode?: string
  description?: string
  materialId?: string
  weightKg?: string
  minPercentage?: string
  maxPercentage?: string
  sortOrder?: string
  notes?: string
  general?: string
}

// Table and grid types
export interface MaterialCompositionTableColumn {
  key: keyof MaterialComposition | 'actions' | 'material' | 'percentageRange' | 'weightFormatted'
  label: string
  sortable: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface MaterialCompositionGridData {
  compositions: MaterialComposition[]
  totalCompositions: number
  activeCompositions: number
  inactiveCompositions: number
}

// Dropdown options
export interface MaterialOption {
  value: number
  label: string
  code: string
  description?: string
}

// Filter and search types
export interface MaterialCompositionFilters {
  materialId?: number
  isActive?: boolean
  minWeight?: number
  maxWeight?: number
  minPercentage?: number
  maxPercentage?: number
  searchTerm?: string
}

export interface MaterialCompositionSortOptions {
  field: keyof MaterialComposition | 'material'
  direction: 'asc' | 'desc'
}

// View modes
export type MaterialCompositionViewMode = 'table' | 'grid'

// Status types
export type MaterialCompositionStatus = 'active' | 'inactive' | 'all'

// Statistics types
export interface MaterialCompositionStats {
  totalCompositions: number
  activeCompositions: number
  inactiveCompositions: number
  compositionsByMaterial: { [materialId: number]: number }
  averageWeight: number
  weightRange: { min: number; max: number }
  percentageRange: { min: number; max: number }
}

// Bulk operations
export interface BulkMaterialCompositionOperation {
  operation: 'activate' | 'deactivate' | 'delete' | 'updateMaterial'
  compositionIds: number[]
  newMaterialId?: number
}

// Export/Import types
export interface MaterialCompositionExportData {
  compositions: MaterialComposition[]
  materials: Material[]
  exportDate: string
  totalRecords: number
}

export interface MaterialCompositionImportData {
  compositionName: string
  compositionCode: string
  description?: string
  materialCode: string
  weightKg: number
  minPercentage: number
  maxPercentage: number
  sortOrder?: number
  notes?: string
}

// Validation rules
export interface MaterialCompositionValidationRules {
  compositionName: {
    required: boolean
    maxLength: number
  }
  compositionCode: {
    required: boolean
    maxLength: number
    pattern?: RegExp
  }
  description: {
    maxLength: number
  }
  weightKg: {
    required: boolean
    min: number
    max: number
    decimalPlaces: number
  }
  minPercentage: {
    required: boolean
    min: number
    max: number
    decimalPlaces: number
  }
  maxPercentage: {
    required: boolean
    min: number
    max: number
    decimalPlaces: number
  }
  notes: {
    maxLength: number
  }
}

// Default validation rules
export const DEFAULT_VALIDATION_RULES: MaterialCompositionValidationRules = {
  compositionName: {
    required: true,
    maxLength: 100
  },
  compositionCode: {
    required: true,
    maxLength: 50,
    pattern: /^[A-Z0-9_-]+$/
  },
  description: {
    maxLength: 500
  },
  weightKg: {
    required: true,
    min: 0.001,
    max: 999999.999,
    decimalPlaces: 3
  },
  minPercentage: {
    required: true,
    min: 0,
    max: 100,
    decimalPlaces: 2
  },
  maxPercentage: {
    required: true,
    min: 0,
    max: 100,
    decimalPlaces: 2
  },
  notes: {
    maxLength: 500
  }
}

// Helper functions
export const formatWeight = (weight: number): string => {
  return `${weight.toFixed(3)} kg`
}

export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(2)}%`
}

export const formatPercentageRange = (min: number, max: number): string => {
  return `${formatPercentage(min)} - ${formatPercentage(max)}`
}

export const isValidPercentageRange = (min: number, max: number): boolean => {
  return min >= 0 && max <= 100 && min <= max
}

export const isValidWeight = (weight: number): boolean => {
  return weight > 0 && weight <= 999999.999
}
