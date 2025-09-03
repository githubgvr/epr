import { CompanyProfile, CreateCompanyProfileDto, UpdateCompanyProfileDto } from '../types'

const API_BASE_URL = 'http://localhost:8080/api'

// API client for company profile operations
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

export const companyProfileService = {
  // Get all company profiles
  async getAll(): Promise<CompanyProfile[]> {
    try {
      return await apiClient.get<CompanyProfile[]>('/companyprofile')
    } catch (error) {
      console.error('Error fetching company profiles:', error)
      throw error
    }
  },

  // Get company profile by ID
  async getById(id: number): Promise<CompanyProfile | null> {
    try {
      return await apiClient.get<CompanyProfile>(`/companyprofile/${id}`)
    } catch (error) {
      console.error('Error fetching company profile:', error)
      return null
    }
  },

  // Create new company profile
  async create(data: CreateCompanyProfileDto): Promise<CompanyProfile> {
    try {
      const profileData = {
        ...data,
        createdBy: 0, // TODO: Get from auth context
        updatedBy: 0,
        isActive: true
      }
      return await apiClient.post<CompanyProfile>('/companyprofile', profileData)
    } catch (error) {
      console.error('Error creating company profile:', error)
      throw error
    }
  },

  // Update company profile
  async update(data: UpdateCompanyProfileDto): Promise<CompanyProfile | null> {
    try {
      const updateData = {
        ...data,
        updatedBy: 0 // TODO: Get from auth context
      }
      return await apiClient.put<CompanyProfile>(`/companyprofile/${data.companyprofileId}`, updateData)
    } catch (error) {
      console.error('Error updating company profile:', error)
      return null
    }
  },

  // Delete company profile
  async delete(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`/companyprofile/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting company profile:', error)
      return false
    }
  },

  // Search company profiles (client-side filtering for now)
  async search(query: string): Promise<CompanyProfile[]> {
    try {
      const allProfiles = await this.getAll()
      const lowercaseQuery = query.toLowerCase()
      return allProfiles.filter(profile =>
        profile.companyName.toLowerCase().includes(lowercaseQuery) ||
        profile.companyRegisteredName.toLowerCase().includes(lowercaseQuery) ||
        profile.registeredId.toLowerCase().includes(lowercaseQuery)
      )
    } catch (error) {
      console.error('Error searching company profiles:', error)
      throw error
    }
  }
}
