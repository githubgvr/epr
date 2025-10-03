import { MaterialComposition, CreateMaterialCompositionRequest } from '../types/materialComposition'

const API_BASE_URL = 'http://localhost:8080/api'

interface RequestOptions {
  token?: string
}

class MaterialCompositionService {
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

    // Handle empty responses (like DELETE operations)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T
    }

    return response.json()
  }

  // Get all material compositions
  async getAllCompositions(token?: string): Promise<MaterialComposition[]> {
    return this.makeRequest<MaterialComposition[]>('/material-compositions', { token })
  }

  // Get material composition by ID
  async getCompositionById(id: number, token?: string): Promise<MaterialComposition> {
    return this.makeRequest<MaterialComposition>(`/material-compositions/${id}`, { token })
  }

  // Get compositions by material ID
  async getCompositionsByMaterialId(materialId: number, token?: string): Promise<MaterialComposition[]> {
    return this.makeRequest<MaterialComposition[]>(`/material-compositions/material/${materialId}`, { token })
  }

  // Search material compositions
  async searchCompositions(query: string, token?: string): Promise<MaterialComposition[]> {
    return this.makeRequest<MaterialComposition[]>(`/material-compositions/search?query=${encodeURIComponent(query)}`, { token })
  }

  // Get compositions by active status
  async getCompositionsByActiveStatus(isActive: boolean, token?: string): Promise<MaterialComposition[]> {
    return this.makeRequest<MaterialComposition[]>(`/material-compositions/active/${isActive}`, { token })
  }

  // Create a new material composition
  async createComposition(composition: CreateMaterialCompositionRequest, token?: string): Promise<MaterialComposition> {
    return this.makeRequest<MaterialComposition>('/material-compositions', {
      method: 'POST',
      body: JSON.stringify(composition),
      token
    })
  }

  // Update an existing material composition
  async updateComposition(id: number, composition: Partial<MaterialComposition>, token?: string): Promise<MaterialComposition> {
    return this.makeRequest<MaterialComposition>(`/material-compositions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(composition),
      token
    })
  }

  // Delete a material composition
  async deleteComposition(id: number, token?: string): Promise<void> {
    return this.makeRequest<void>(`/material-compositions/${id}`, {
      method: 'DELETE',
      token
    })
  }

  // Get count of active compositions
  async getActiveCompositionsCount(token?: string): Promise<number> {
    return this.makeRequest<number>('/material-compositions/count', { token })
  }

  // Get count of compositions by material
  async getCompositionsCountByMaterial(materialId: number, token?: string): Promise<number> {
    return this.makeRequest<number>(`/material-compositions/count/material/${materialId}`, { token })
  }

  // Find compositions by weight range
  async findCompositionsByWeightRange(minWeight: number, maxWeight: number, token?: string): Promise<MaterialComposition[]> {
    return this.makeRequest<MaterialComposition[]>(`/material-compositions/weight-range?minWeight=${minWeight}&maxWeight=${maxWeight}`, { token })
  }

  // Find compositions by percentage overlap
  async findCompositionsByPercentageOverlap(minPercentage: number, maxPercentage: number, token?: string): Promise<MaterialComposition[]> {
    return this.makeRequest<MaterialComposition[]>(`/material-compositions/percentage-overlap?minPercentage=${minPercentage}&maxPercentage=${maxPercentage}`, { token })
  }

  // Validation helpers
  validateComposition(composition: CreateMaterialCompositionRequest | Partial<MaterialComposition>): string[] {
    const errors: string[] = []

    if (!composition.compositionName?.trim()) {
      errors.push('Composition name is required')
    }

    if (!composition.compositionCode?.trim()) {
      errors.push('Composition code is required')
    }

    if (!composition.materialId) {
      errors.push('Material selection is required')
    }

    if (!composition.weightKg || composition.weightKg <= 0) {
      errors.push('Weight must be greater than 0')
    }

    if (composition.minPercentage === undefined || composition.minPercentage === null) {
      errors.push('Minimum percentage is required')
    } else if (composition.minPercentage < 0 || composition.minPercentage > 100) {
      errors.push('Minimum percentage must be between 0 and 100')
    }

    if (composition.maxPercentage === undefined || composition.maxPercentage === null) {
      errors.push('Maximum percentage is required')
    } else if (composition.maxPercentage < 0 || composition.maxPercentage > 100) {
      errors.push('Maximum percentage must be between 0 and 100')
    }

    if (composition.minPercentage !== undefined && composition.maxPercentage !== undefined) {
      if (composition.minPercentage > composition.maxPercentage) {
        errors.push('Minimum percentage cannot be greater than maximum percentage')
      }
    }

    return errors
  }

  // Format helpers
  formatWeight(weight: number): string {
    return `${weight.toFixed(3)} kg`
  }

  formatPercentageRange(minPercentage: number, maxPercentage: number): string {
    return `${minPercentage.toFixed(2)}% - ${maxPercentage.toFixed(2)}%`
  }

  formatPercentage(percentage: number): string {
    return `${percentage.toFixed(2)}%`
  }
}

export default new MaterialCompositionService()
