const API_BASE_URL = 'http://localhost:8080/api'

// Types for authentication
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  tokenType: string
  user: {
    userId: number
    userName: string
    firstName: string
    middleName?: string
    lastName: string
    email: string
    mobile?: string
    nationality?: number
    isActive: boolean
  }
}

export interface ApiError {
  error: string
  message: string
}

// API client for authentication operations
const apiClient = {
  async post<T>(endpoint: string, data: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

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

  async get<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

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
  }
}

export const authService = {
  /**
   * Login user with username and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  /**
   * Validate JWT token and get user info
   */
  async validateToken(token: string): Promise<{ valid: boolean; user: LoginResponse['user'] }> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({})
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred'
        }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error('Token validation error:', error)
      throw error
    }
  },

  /**
   * Get current user information
   */
  async getCurrentUser(token: string): Promise<LoginResponse['user']> {
    try {
      const response = await apiClient.get<LoginResponse['user']>('/auth/me', token)
      return response
    } catch (error) {
      console.error('Get current user error:', error)
      throw error
    }
  },

  /**
   * Logout user (client-side token removal)
   */
  async logout(token?: string): Promise<{ message: string }> {
    try {
      // Call backend logout endpoint for logging purposes
      if (token) {
        const response = await apiClient.post<{ message: string }>('/auth/logout', {}, token)
        return response
      }
      return { message: 'Logout successful' }
    } catch (error) {
      console.error('Logout error:', error)
      // Even if backend call fails, we can still logout client-side
      return { message: 'Logout successful' }
    }
  }
}

// Export both named and default exports for compatibility
export default authService
