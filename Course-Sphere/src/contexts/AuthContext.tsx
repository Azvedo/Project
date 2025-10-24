import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as authService from '../services/authService'

export type User = { id: string; name: string; email?: string }

type AuthContextType = {
  user: User | null
  token: string | null
  isInitializing: boolean
  loading: boolean
  error?: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (payload: { name: string, email: string, password: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'cs_token'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => {
    try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
  })
  const [isInitializing, setIsInitializing] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    let mounted = true
    async function init() {
      if (!token) {
        if (mounted) setIsInitializing(false)
        return
      }

      try {
        const data = await authService.getCurrentUser()
        if (mounted) setUser(data)
      } catch {
        // token invalid or request failed -> clear
        localStorage.removeItem(TOKEN_KEY)
        if (mounted) setToken(null)
      } finally {
        if (mounted) setIsInitializing(false)
      }
    }
    init()
    return () => { mounted = false }
  }, [token])

  useEffect(() => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token)
      else localStorage.removeItem(TOKEN_KEY)
    } catch (e) {
      console.warn('Could not persist auth token to localStorage', e)
    }
  }, [token])

  // sync across tabs
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === TOKEN_KEY) {
        setToken(e.newValue)
        if (!e.newValue) setUser(null)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.login(email, password)
      const tokenFromServer = typeof data === 'string' ? data : data.token
      setToken(tokenFromServer)
      // garantir axios header aqui, se necessário
      try {
        const me = await authService.getCurrentUser()
        setUser(me)
      } catch {
        setUser(null)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const signup = useCallback(async (payload: { name: string, email: string, password: string }) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.signup(payload)
      // API returns { token }
      const tokenFromServer = data.token ?? data
      setToken(tokenFromServer)
      try {
        const me = await authService.getCurrentUser()
        setUser(me)
      } catch {
        setUser(null)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message || 'Signup failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // ignore network errors on logout
    }
    setUser(null)
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isInitializing, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

// Intentionally do not export default to avoid fast-refresh issues
