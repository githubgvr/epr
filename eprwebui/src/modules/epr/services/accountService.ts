import { Account, CreateAccountDto, UpdateAccountDto } from '../types'

const API_BASE_URL = 'http://localhost:8080/api'

// API client for account operations
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

export const accountService = {
  // Get all accounts
  async getAll(): Promise<Account[]> {
    try {
      return await apiClient.get<Account[]>('/accounts')
    } catch (error) {
      console.error('Error fetching accounts:', error)
      throw error
    }
  },

  // Get account by ID
  async getById(id: number): Promise<Account | null> {
    try {
      return await apiClient.get<Account>(`/accounts/${id}`)
    } catch (error) {
      console.error('Error fetching account:', error)
      return null
    }
  },

  // Create new account
  async create(data: CreateAccountDto): Promise<Account> {
    try {
      const accountData = {
        ...data,
        createdBy: 0, // TODO: Get from auth context
        updatedBy: 0,
        isActive: true
      }
      return await apiClient.post<Account>('/accounts', accountData)
    } catch (error) {
      console.error('Error creating account:', error)
      throw error
    }
  },

  // Update account
  async update(data: UpdateAccountDto): Promise<Account | null> {
    try {
      const updateData = {
        ...data,
        updatedBy: 0 // TODO: Get from auth context
      }
      return await apiClient.put<Account>(`/accounts/${data.accountId}`, updateData)
    } catch (error) {
      console.error('Error updating account:', error)
      return null
    }
  },

  // Delete account
  async delete(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`/accounts/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting account:', error)
      return false
    }
  },

  // Search accounts (client-side filtering for now)
  async search(query: string): Promise<Account[]> {
    try {
      const allAccounts = await this.getAll()
      const lowercaseQuery = query.toLowerCase()
      return allAccounts.filter(account => 
        account.accountName.toLowerCase().includes(lowercaseQuery)
      )
    } catch (error) {
      console.error('Error searching accounts:', error)
      throw error
    }
  }
}
