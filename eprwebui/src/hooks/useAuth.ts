import { useState, useEffect } from 'react'
import { authService, LoginRequest } from '../services/authService'

interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role?: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: true, // Temporarily bypass auth for development
    user: {
      id: '1',
      username: 'developer',
      email: 'dev@example.com',
      firstName: 'Developer',
      lastName: 'User',
      role: 'admin'
    },
    loading: false
  })

  useEffect(() => {
    // Temporarily disabled for development - authentication is bypassed above
    // const initializeAuth = async () => {
    //   // Check if user is already logged in (from localStorage)
    //   const token = localStorage.getItem('authToken')
    //   const userData = localStorage.getItem('userData')

    //   if (token && userData) {
    //     try {
    //       // Validate token with backend
    //       const validationResult = await authService.validateToken(token)
    //       if (validationResult.valid) {
    //         const user = JSON.parse(userData)
    //         setAuthState({
    //           isAuthenticated: true,
    //           user,
    //           loading: false
    //         })
    //       } else {
    //         // Token is invalid, clear storage
    //         localStorage.removeItem('authToken')
    //         localStorage.removeItem('userData')
    //         setAuthState({
    //           isAuthenticated: false,
    //           user: null,
    //           loading: false
    //         })
    //       }
    //     } catch (error) {
    //       console.error('Token validation failed:', error)
    //       // Token validation failed, clear storage
    //       localStorage.removeItem('authToken')
    //       localStorage.removeItem('userData')
    //       setAuthState({
    //         isAuthenticated: false,
    //         user: null,
    //         loading: false
    //       })
    //     }
    //   } else {
    //     setAuthState({
    //       isAuthenticated: false,
    //       user: null,
    //       loading: false
    //     })
    //   }
    // }

    // initializeAuth()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const credentials: LoginRequest = { username, password }
      const response = await authService.login(credentials)

      // Map backend user data to frontend user interface
      const user: User = {
        id: response.user.userId.toString(),
        username: response.user.userName,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: 'user' // Default role, can be enhanced later
      }

      localStorage.setItem('authToken', response.token)
      localStorage.setItem('userData', JSON.stringify(user))

      setAuthState({
        isAuthenticated: true,
        user,
        loading: false
      })

      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (token) {
        await authService.logout(token)
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Continue with logout even if backend call fails
    } finally {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false
      })
    }
  }

  return {
    ...authState,
    login,
    logout
  }
}
