export interface MaterialType {
  materialTypeId: number
  materialTypeName: string
  description: string
  createdDate: string
  updatedDate: string
  isActive: boolean
}

export interface Material {
  materialId: number
  materialName: string
  materialCode: string
  description: string
  materialTypeId: number
  materialType?: MaterialType
  createdDate: string
  updatedDate: string
  isActive: boolean
}

export interface CreateMaterialRequest {
  materialName: string
  materialCode: string
  description: string
  materialTypeId: number
}

export interface UpdateMaterialRequest {
  materialName: string
  materialCode: string
  description: string
  materialTypeId: number
}

export interface MaterialSearchParams {
  query?: string
  materialTypeId?: number
  isActive?: boolean
}
