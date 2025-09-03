import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductSearchParams,
  ProductStatistics,
  ProductValidationResponse,
  FileUploadResponse,
  ProductCategory,
  ProductPaginationParams,
  ProductPageResponse,
  BulkProductOperation,
  BulkOperationResult,
  ProductAnalytics
} from '../types/product'

const API_BASE_URL = 'http://localhost:8080/api'

// Enhanced API client with all HTTP methods
const apiClient = {
  async request<T>(
    endpoint: string,
    options: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE'
      data?: any
      token?: string
      isFormData?: boolean
    }
  ): Promise<T> {
    const headers: Record<string, string> = {}

    if (!options.isFormData) {
      headers['Content-Type'] = 'application/json'
    }

    // TEMPORARY: Skip authorization header for testing
    // if (options.token) {
    //   headers['Authorization'] = `Bearer ${options.token}`
    // }

    const config: RequestInit = {
      method: options.method,
      headers,
    }

    if (options.data) {
      if (options.isFormData) {
        config.body = options.data
      } else {
        config.body = JSON.stringify(options.data)
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred'
      }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', token })
  },

  async post<T>(endpoint: string, data: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', data, token })
  },

  async put<T>(endpoint: string, data: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', data, token })
  },

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', token })
  },

  async uploadFile<T>(endpoint: string, file: File, token?: string): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    return this.request<T>(endpoint, { method: 'POST', data: formData, token, isFormData: true })
  }
}

export const productService = {
  /**
   * Get all active products
   */
  async getAllProducts(token?: string): Promise<Product[]> {
    try {
      return await apiClient.get<Product[]>('/products', token)
    } catch (error) {
      console.error('Get all products error:', error)
      throw error
    }
  },

  /**
   * Get product by ID
   */
  async getProductById(id: number, token?: string): Promise<Product> {
    try {
      return await apiClient.get<Product>(`/products/${id}`, token)
    } catch (error) {
      console.error('Get product by ID error:', error)
      throw error
    }
  },

  /**
   * Get product by SKU/Product Code
   */
  async getProductBySkuCode(skuCode: string, token?: string): Promise<Product> {
    try {
      return await apiClient.get<Product>(`/products/sku/${encodeURIComponent(skuCode)}`, token)
    } catch (error) {
      console.error('Get product by SKU error:', error)
      throw error
    }
  },

  /**
   * Search products with filters
   */
  async searchProducts(params: ProductSearchParams, token?: string): Promise<Product[]> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.query) queryParams.append('query', params.query)
      
      const endpoint = `/products/search${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      return await apiClient.get<Product[]>(endpoint, token)
    } catch (error) {
      console.error('Search products error:', error)
      throw error
    }
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId: number, token?: string): Promise<Product[]> {
    try {
      return await apiClient.get<Product[]>(`/products/category/${categoryId}`, token)
    } catch (error) {
      console.error('Get products by category error:', error)
      throw error
    }
  },

  /**
   * Create new product
   */
  async createProduct(product: CreateProductRequest, token?: string): Promise<Product> {
    try {
      return await apiClient.post<Product>('/products', product, token)
    } catch (error) {
      console.error('Create product error:', error)
      throw error
    }
  },

  /**
   * Update existing product
   */
  async updateProduct(id: number, product: UpdateProductRequest, token?: string): Promise<Product> {
    try {
      return await apiClient.put<Product>(`/products/${id}`, product, token)
    } catch (error) {
      console.error('Update product error:', error)
      throw error
    }
  },

  /**
   * Delete product (soft delete)
   */
  async deleteProduct(id: number, token?: string): Promise<{ message: string }> {
    try {
      return await apiClient.delete<{ message: string }>(`/products/${id}`, token)
    } catch (error) {
      console.error('Delete product error:', error)
      throw error
    }
  },

  /**
   * Upload regulatory certification file
   */
  async uploadCertificationFile(productId: number, file: File, token?: string): Promise<FileUploadResponse> {
    try {
      return await apiClient.uploadFile<FileUploadResponse>(`/products/${productId}/certification`, file, token)
    } catch (error) {
      console.error('Upload certification file error:', error)
      throw error
    }
  },

  /**
   * Get products by registration date range
   */
  async getProductsByRegistrationDate(startDate: string, endDate: string, token?: string): Promise<Product[]> {
    try {
      const queryParams = new URLSearchParams({
        startDate,
        endDate
      })
      return await apiClient.get<Product[]>(`/products/registration-date?${queryParams.toString()}`, token)
    } catch (error) {
      console.error('Get products by registration date error:', error)
      throw error
    }
  },

  /**
   * Get products expiring soon
   */
  async getProductsExpiringSoon(days: number = 30, token?: string): Promise<Product[]> {
    try {
      return await apiClient.get<Product[]>(`/products/expiring-soon?days=${days}`, token)
    } catch (error) {
      console.error('Get expiring products error:', error)
      throw error
    }
  },

  /**
   * Get recently registered products
   */
  async getRecentlyRegisteredProducts(days: number = 7, token?: string): Promise<Product[]> {
    try {
      return await apiClient.get<Product[]>(`/products/recent?days=${days}`, token)
    } catch (error) {
      console.error('Get recent products error:', error)
      throw error
    }
  },

  /**
   * Get products with high compliance targets
   */
  async getHighComplianceProducts(threshold: number = 80, token?: string): Promise<Product[]> {
    try {
      return await apiClient.get<Product[]>(`/products/high-compliance?threshold=${threshold}`, token)
    } catch (error) {
      console.error('Get high compliance products error:', error)
      throw error
    }
  },

  /**
   * Get product statistics
   */
  async getProductStatistics(token?: string): Promise<ProductStatistics> {
    try {
      return await apiClient.get<ProductStatistics>('/products/statistics', token)
    } catch (error) {
      console.error('Get product statistics error:', error)
      throw error
    }
  },

  /**
   * Validate SKU/Product Code availability
   */
  async validateSkuCode(skuCode: string, excludeId?: number, token?: string): Promise<ProductValidationResponse> {
    try {
      const queryParams = new URLSearchParams({ skuProductCode: skuCode })
      if (excludeId) {
        queryParams.append('excludeId', excludeId.toString())
      }
      return await apiClient.get<ProductValidationResponse>(`/products/validate-sku?${queryParams.toString()}`, token)
    } catch (error) {
      console.error('Validate SKU code error:', error)
      throw error
    }
  },

  /**
   * Get products by weight range
   */
  async getProductsByWeightRange(minWeight: number, maxWeight: number, token?: string): Promise<Product[]> {
    try {
      const queryParams = new URLSearchParams({
        minWeight: minWeight.toString(),
        maxWeight: maxWeight.toString()
      })
      return await apiClient.get<Product[]>(`/products/weight-range?${queryParams.toString()}`, token)
    } catch (error) {
      console.error('Get products by weight range error:', error)
      throw error
    }
  },

  /**
   * Get products by lifecycle duration range
   */
  async getProductsByLifecycleRange(minDuration: number, maxDuration: number, token?: string): Promise<Product[]> {
    try {
      const queryParams = new URLSearchParams({
        minDuration: minDuration.toString(),
        maxDuration: maxDuration.toString()
      })
      return await apiClient.get<Product[]>(`/products/lifecycle-range?${queryParams.toString()}`, token)
    } catch (error) {
      console.error('Get products by lifecycle range error:', error)
      throw error
    }
  }
}

// Export both named and default exports for compatibility
export default productService
