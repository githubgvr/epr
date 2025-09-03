import { Organization, CreateOrganizationDto, UpdateOrganizationDto, OrgType } from '../types'

const API_BASE_URL = 'http://localhost:8080/api'

// API client for organization operations
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

export const organizationService = {
  // Get all organizations
  async getAll(): Promise<Organization[]> {
    try {
      return await apiClient.get<Organization[]>('/organizations')
    } catch (error) {
      console.error('Error fetching organizations:', error)
      throw error
    }
  },

  // Get organization by ID
  async getById(id: number): Promise<Organization | null> {
    try {
      return await apiClient.get<Organization>(`/organizations/${id}`)
    } catch (error) {
      console.error('Error fetching organization:', error)
      return null
    }
  },

  // Create new organization
  async create(data: CreateOrganizationDto): Promise<Organization> {
    try {
      const organizationData = {
        ...data,
        createdBy: 0, // TODO: Get from auth context
        updatedBy: 0,
        isActive: true
      }
      return await apiClient.post<Organization>('/organizations', organizationData)
    } catch (error) {
      console.error('Error creating organization:', error)
      throw error
    }
  },

  // Update organization
  async update(data: UpdateOrganizationDto): Promise<Organization | null> {
    try {
      const updateData = {
        ...data,
        updatedBy: 0 // TODO: Get from auth context
      }
      return await apiClient.put<Organization>(`/organizations/${data.orgId}`, updateData)
    } catch (error) {
      console.error('Error updating organization:', error)
      return null
    }
  },

  // Delete organization
  async delete(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`/organizations/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting organization:', error)
      return false
    }
  },

  // Search organizations (client-side filtering for now)
  async search(query: string): Promise<Organization[]> {
    try {
      const allOrganizations = await this.getAll()
      const lowercaseQuery = query.toLowerCase()
      return allOrganizations.filter(org =>
        org.orgName.toLowerCase().includes(lowercaseQuery)
      )
    } catch (error) {
      console.error('Error searching organizations:', error)
      throw error
    }
  }
}
