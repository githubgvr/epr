import { Industry } from '../types'

const API_BASE_URL = 'http://localhost:8080/api'

// API client for industry operations
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

  async delete(endpoint: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  }
}

export const industryService = {
  // Get all industries
  async getAll(): Promise<Industry[]> {
    try {
      return await apiClient.get<Industry[]>('/industry')
    } catch (error) {
      console.error('Error fetching industries:', error)
      throw error
    }
  },

  // Get industry by ID
  async getById(id: number): Promise<Industry | null> {
    try {
      return await apiClient.get<Industry>(`/industry/${id}`)
    } catch (error) {
      console.error('Error fetching industry:', error)
      return null
    }
  },

  // Create new industry
  async create(data: Omit<Industry, 'industryId' | 'createdBy' | 'updatedBy' | 'createdDate' | 'updatedDate' | 'isActive'>): Promise<Industry> {
    try {
      const industryData = {
        ...data,
        createdBy: 0, // TODO: Get from auth context
        updatedBy: 0,
        isActive: true
      }
      return await apiClient.post<Industry>('/industry', industryData)
    } catch (error) {
      console.error('Error creating industry:', error)
      throw error
    }
  },

  // Update industry
  async update(id: number, data: Partial<Industry>): Promise<Industry | null> {
    try {
      const updateData = {
        ...data,
        updatedBy: 0 // TODO: Get from auth context
      }
      return await apiClient.put<Industry>(`/industry/${id}`, updateData)
    } catch (error) {
      console.error('Error updating industry:', error)
      return null
    }
  },

  // Delete industry
  async delete(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`/industry/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting industry:', error)
      return false
    }
  }
}
