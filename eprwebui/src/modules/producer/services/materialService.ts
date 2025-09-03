import { Material, MaterialType, CreateMaterialRequest, UpdateMaterialRequest } from '../types/material'

const API_BASE_URL = 'http://localhost:8080/api'

// API client for material operations
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

export const materialService = {
  // Get all materials
  async getAll(): Promise<Material[]> {
    return apiClient.get<Material[]>('/materials')
  },

  // Get material by ID
  async getById(id: number): Promise<Material> {
    return apiClient.get<Material>(`/materials/${id}`)
  },

  // Search materials
  async search(query: string): Promise<Material[]> {
    return apiClient.get<Material[]>(`/materials/search?query=${encodeURIComponent(query)}`)
  },

  // Create new material
  async create(material: CreateMaterialRequest): Promise<Material> {
    return apiClient.post<Material>('/materials', material)
  },

  // Update material
  async update(id: number, material: UpdateMaterialRequest): Promise<Material> {
    return apiClient.put<Material>(`/materials/${id}`, material)
  },

  // Delete material
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/materials/${id}`)
  },

  // Get all material types
  async getMaterialTypes(): Promise<MaterialType[]> {
    return apiClient.get<MaterialType[]>('/material-types')
  },
}

export default materialService
