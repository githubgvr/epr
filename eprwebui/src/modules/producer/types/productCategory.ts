export interface ProductGroup {
  productGroupId: number
  productGroupName: string
  description: string
  isActive: boolean
}

export interface CreateProductGroupRequest {
  productGroupName: string
  description: string
}

export interface UpdateProductGroupRequest {
  productGroupName: string
  description: string
}

export interface ProductGroupSearchParams {
  query?: string
  isActive?: boolean
}
