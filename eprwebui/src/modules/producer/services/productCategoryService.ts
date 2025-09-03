import { ProductGroup, CreateProductGroupRequest, UpdateProductGroupRequest } from '../types/productCategory'

const API_BASE_URL = 'http://localhost:8080/api'

// API client for product category operations
const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  },
}

export const productGroupService = {
  // Get all product groups
  async getAll(): Promise<ProductGroup[]> {
    return apiClient.get<ProductGroup[]>('/product-groups')
  },

  // Get product group by ID
  async getById(id: number): Promise<ProductGroup> {
    return apiClient.get<ProductGroup>(`/product-groups/${id}`)
  },

  // Search product groups
  async search(name: string): Promise<ProductGroup[]> {
    return apiClient.get<ProductGroup[]>(`/product-groups/search?name=${encodeURIComponent(name)}`)
  },

  // Create new product group
  async create(productGroup: CreateProductGroupRequest): Promise<ProductGroup> {
    return apiClient.post<ProductGroup>('/product-groups', productGroup)
  },

  // Update product group
  async update(id: number, productGroup: UpdateProductGroupRequest): Promise<ProductGroup> {
    return apiClient.put<ProductGroup>(`/product-groups/${id}`, productGroup)
  },

  // Delete product group
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/product-groups/${id}`)
  },

  // Check if product group name exists
  async checkExists(name: string): Promise<boolean> {
    return apiClient.get<boolean>(`/product-groups/exists/${encodeURIComponent(name)}`)
  },
}

export default productGroupService
