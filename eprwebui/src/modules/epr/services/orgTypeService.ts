import { OrgType } from '../types'

const API_BASE_URL = 'http://localhost:8080/api'

// API client for org type operations
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

export const orgTypeService = {
  // Get all organization types
  async getAll(): Promise<OrgType[]> {
    try {
      return await apiClient.get<OrgType[]>('/orgtype')
    } catch (error) {
      console.error('Error fetching organization types:', error)
      throw error
    }
  },

  // Get organization type by ID
  async getById(id: number): Promise<OrgType | null> {
    try {
      return await apiClient.get<OrgType>(`/orgtype/${id}`)
    } catch (error) {
      console.error('Error fetching organization type:', error)
      return null
    }
  },

  // Create new organization type
  async create(data: Omit<OrgType, 'orgTypeId' | 'createdBy' | 'updatedBy' | 'createdDate' | 'updatedDate' | 'isActive'>): Promise<OrgType> {
    try {
      const orgTypeData = {
        ...data,
        createdBy: 0, // TODO: Get from auth context
        updatedBy: 0,
        isActive: true
      }
      return await apiClient.post<OrgType>('/orgtype', orgTypeData)
    } catch (error) {
      console.error('Error creating organization type:', error)
      throw error
    }
  },

  // Update organization type
  async update(id: number, data: Partial<OrgType>): Promise<OrgType | null> {
    try {
      const updateData = {
        ...data,
        updatedBy: 0 // TODO: Get from auth context
      }
      return await apiClient.put<OrgType>(`/orgtype/${id}`, updateData)
    } catch (error) {
      console.error('Error updating organization type:', error)
      return null
    }
  },

  // Delete organization type
  async delete(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`/orgtype/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting organization type:', error)
      return false
    }
  }
}

// Export both named and default exports for compatibility
export default orgTypeService
