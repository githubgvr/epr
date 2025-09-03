import { ProductCategory } from '../types/product'

const API_BASE_URL = 'http://localhost:8080/api'

// API client for product category operations
const apiClient = {
  async get<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // TEMPORARY: Skip authorization header for testing
    // if (token) {
    //   headers['Authorization'] = `Bearer ${token}`
    // }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred'
      }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  async post<T>(endpoint: string, data: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // TEMPORARY: Skip authorization header for testing
    // if (token) {
    //   headers['Authorization'] = `Bearer ${token}`
    // }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred'
      }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  async put<T>(endpoint: string, data: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // TEMPORARY: Skip authorization header for testing
    // if (token) {
    //   headers['Authorization'] = `Bearer ${token}`
    // }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred'
      }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // TEMPORARY: Skip authorization header for testing
    // if (token) {
    //   headers['Authorization'] = `Bearer ${token}`
    // }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred'
      }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }
}

export interface CreateProductCategoryRequest {
  productCategoryName: string
  description?: string
}

export interface UpdateProductCategoryRequest extends CreateProductCategoryRequest {
  productCategoryId: number
}

const productCategoryService = {
  /**
   * Get all active product categories
   */
  async getAllProductCategories(token?: string): Promise<ProductCategory[]> {
    try {
      return await apiClient.get<ProductCategory[]>('/product-categories', token)
    } catch (error) {
      console.error('Get all product categories error:', error)
      throw error
    }
  },

  /**
   * Alias for getAllProductCategories for compatibility
   */
  async getAllCategories(token?: string): Promise<ProductCategory[]> {
    return this.getAllProductCategories(token)
  },

  /**
   * Get product category by ID
   */
  async getProductCategoryById(id: number, token?: string): Promise<ProductCategory> {
    try {
      return await apiClient.get<ProductCategory>(`/product-categories/${id}`, token)
    } catch (error) {
      console.error('Get product category by ID error:', error)
      throw error
    }
  },

  /**
   * Search product categories
   */
  async searchProductCategories(query: string, token?: string): Promise<ProductCategory[]> {
    try {
      const queryParams = new URLSearchParams({ query })
      return await apiClient.get<ProductCategory[]>(`/product-categories/search?${queryParams.toString()}`, token)
    } catch (error) {
      console.error('Search product categories error:', error)
      throw error
    }
  },

  /**
   * Create new product category
   */
  async createProductCategory(category: CreateProductCategoryRequest, token?: string): Promise<ProductCategory> {
    try {
      return await apiClient.post<ProductCategory>('/product-categories', category, token)
    } catch (error) {
      console.error('Create product category error:', error)
      throw error
    }
  },

  /**
   * Update existing product category
   */
  async updateProductCategory(id: number, category: UpdateProductCategoryRequest, token?: string): Promise<ProductCategory> {
    try {
      return await apiClient.put<ProductCategory>(`/product-categories/${id}`, category, token)
    } catch (error) {
      console.error('Update product category error:', error)
      throw error
    }
  },

  /**
   * Delete product category (soft delete)
   */
  async deleteProductCategory(id: number, token?: string): Promise<{ message: string }> {
    try {
      return await apiClient.delete<{ message: string }>(`/product-categories/${id}`, token)
    } catch (error) {
      console.error('Delete product category error:', error)
      throw error
    }
  },

  /**
   * Get product categories with product counts
   */
  async getProductCategoriesWithCounts(token?: string): Promise<Array<ProductCategory & { productCount: number }>> {
    try {
      return await apiClient.get<Array<ProductCategory & { productCount: number }>>('/product-categories/with-counts', token)
    } catch (error) {
      console.error('Get product categories with counts error:', error)
      throw error
    }
  },

  /**
   * Validate product category name availability
   */
  async validateCategoryName(name: string, excludeId?: number, token?: string): Promise<{ available: boolean }> {
    try {
      const queryParams = new URLSearchParams({ name })
      if (excludeId) {
        queryParams.append('excludeId', excludeId.toString())
      }
      return await apiClient.get<{ available: boolean }>(`/product-categories/validate-name?${queryParams.toString()}`, token)
    } catch (error) {
      console.error('Validate category name error:', error)
      throw error
    }
  }
}

// Export both named and default exports for compatibility
export { productCategoryService }
export default productCategoryService
