import { 
  ProductComposition, 
  CreateProductCompositionRequest, 
  UpdateProductCompositionRequest,
  ProductCompositionValidationResponse,
  Material
} from '../types/productComposition'

const API_BASE_URL = 'http://localhost:8080/api'

interface RequestOptions {
  token?: string
}

class ProductCompositionService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit & RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers as Record<string, string>
    }

    // TEMPORARY: Skip authorization header for testing
    // if (token) {
    //   headers['Authorization'] = `Bearer ${token}`
    // }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || `HTTP error! status: ${response.status}`)
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    } else {
      return response.text() as unknown as T
    }
  }

  // ProductComposition CRUD operations
  async getAllCompositions(token?: string): Promise<ProductComposition[]> {
    return this.makeRequest<ProductComposition[]>('/product-compositions', { token })
  }

  async getCompositionById(id: number, token?: string): Promise<ProductComposition> {
    return this.makeRequest<ProductComposition>(`/product-compositions/${id}`, { token })
  }

  async getCompositionsByProductId(productId: number, token?: string): Promise<ProductComposition[]> {
    return this.makeRequest<ProductComposition[]>(`/product-compositions/product/${productId}`, { token })
  }

  async getCompositionsByMaterialId(materialId: number, token?: string): Promise<ProductComposition[]> {
    return this.makeRequest<ProductComposition[]>(`/product-compositions/material/${materialId}`, { token })
  }

  async createComposition(composition: CreateProductCompositionRequest, token?: string): Promise<ProductComposition> {
    return this.makeRequest<ProductComposition>('/product-compositions', {
      method: 'POST',
      body: JSON.stringify(composition),
      token
    })
  }

  async updateComposition(id: number, composition: UpdateProductCompositionRequest, token?: string): Promise<ProductComposition> {
    return this.makeRequest<ProductComposition>(`/product-compositions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(composition),
      token
    })
  }

  async deleteComposition(id: number, token?: string): Promise<string> {
    return this.makeRequest<string>(`/product-compositions/${id}`, {
      method: 'DELETE',
      token
    })
  }

  // Validation and percentage calculations
  async getTotalCompositionPercentage(productId: number, token?: string): Promise<number> {
    return this.makeRequest<number>(`/product-compositions/product/${productId}/total-percentage`, { token })
  }

  async getRemainingCompositionPercentage(productId: number, token?: string): Promise<number> {
    return this.makeRequest<number>(`/product-compositions/product/${productId}/remaining-percentage`, { token })
  }

  async validateComposition(productId: number, token?: string): Promise<boolean> {
    return this.makeRequest<boolean>(`/product-compositions/product/${productId}/validate`, { token })
  }

  // Material operations
  async getAllMaterials(token?: string): Promise<Material[]> {
    return this.makeRequest<Material[]>('/materials', { token })
  }

  async getMaterialById(id: number, token?: string): Promise<Material> {
    return this.makeRequest<Material>(`/materials/${id}`, { token })
  }

  async getMaterialsByType(materialTypeId: number, token?: string): Promise<Material[]> {
    return this.makeRequest<Material[]>(`/materials/type/${materialTypeId}`, { token })
  }

  async searchMaterials(name: string, token?: string): Promise<Material[]> {
    return this.makeRequest<Material[]>(`/materials/search?name=${encodeURIComponent(name)}`, { token })
  }

  // Weight validation methods
  async getTotalMaterialWeight(productId: number, token?: string): Promise<number> {
    return this.makeRequest<number>(`/product-compositions/product/${productId}/total-weight`, { token })
  }

  async getRemainingWeight(productId: number, token?: string): Promise<number> {
    return this.makeRequest<number>(`/product-compositions/product/${productId}/remaining-weight`, { token })
  }

  async validateWeight(productId: number, token?: string): Promise<boolean> {
    return this.makeRequest<boolean>(`/product-compositions/product/${productId}/weight-valid`, { token })
  }

  // Utility methods for validation
  async getCompositionValidation(productId: number, token?: string): Promise<ProductCompositionValidationResponse> {
    try {
      const [totalPercentage, remainingPercentage, isValid] = await Promise.all([
        this.getTotalCompositionPercentage(productId, token),
        this.getRemainingCompositionPercentage(productId, token),
        this.validateComposition(productId, token)
      ])

      return {
        isValid,
        totalPercentage,
        remainingPercentage,
        message: isValid ? 'Composition is valid' : 'Total composition exceeds 100%'
      }
    } catch (error) {
      throw new Error(`Failed to validate composition: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Combined validation for both percentage and weight
  async getFullValidation(productId: number, token?: string): Promise<{
    percentageValidation: ProductCompositionValidationResponse
    weightValidation: {
      isValid: boolean
      totalWeight: number
      remainingWeight: number
      message: string
    }
  }> {
    try {
      const [percentageValidation, totalWeight, remainingWeight, isWeightValid] = await Promise.all([
        this.getCompositionValidation(productId, token),
        this.getTotalMaterialWeight(productId, token),
        this.getRemainingWeight(productId, token),
        this.validateWeight(productId, token)
      ])

      return {
        percentageValidation,
        weightValidation: {
          isValid: isWeightValid,
          totalWeight,
          remainingWeight,
          message: isWeightValid ? 'Weight is valid' : 'Total material weight exceeds product weight'
        }
      }
    } catch (error) {
      throw new Error(`Failed to validate composition: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Batch operations
  async createMultipleCompositions(compositions: CreateProductCompositionRequest[], token?: string): Promise<ProductComposition[]> {
    const results: ProductComposition[] = []
    
    for (const composition of compositions) {
      try {
        const result = await this.createComposition(composition, token)
        results.push(result)
      } catch (error) {
        console.error('Failed to create composition:', error)
        throw error
      }
    }
    
    return results
  }

  async deleteMultipleCompositions(ids: number[], token?: string): Promise<void> {
    for (const id of ids) {
      try {
        await this.deleteComposition(id, token)
      } catch (error) {
        console.error(`Failed to delete composition ${id}:`, error)
        throw error
      }
    }
  }
}

export const productCompositionService = new ProductCompositionService()
export default productCompositionService
