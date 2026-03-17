import { useState, useEffect } from 'react'
import { adminAPI } from '../services/api'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await adminAPI.verify()
      if (response.data.success) {
        setIsAuthenticated(true)
        setAdmin(response.data.admin)
      }
    } catch (error) {
      localStorage.removeItem('admin_token')
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await adminAPI.login(credentials)
      if (response?.data?.success) {
        localStorage.setItem('admin_token', response.data.token)
        setIsAuthenticated(true)
        setAdmin(response.data.admin)
        return { success: true }
      }

      return {
        success: false,
        error: response?.data?.error || 'Invalid server response',
      }
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.error || error?.message || 'Login failed',
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
    setAdmin(null)
  }

  return { isAuthenticated, admin, loading, login, logout, checkAuth }
}
