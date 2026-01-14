'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  full_name: string
  balance: number
  total_invested: number
  total_earned: number
  created_at: string
  phone?: string
  country?: string
  city?: string
  role?: string
  referral_code?: string
  avatar_url?: string
  status?: string
  last_login?: string
}

interface UserContextType {
  user: User | null
  loading: boolean
  error: string | null
  refreshUser: () => Promise<void>
  updateBalance: (newBalance: number) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshUser = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('authToken')
      const userId = localStorage.getItem('userId')
      
      if (!token || !userId) {
        setUser(null)
        return
      }
      
      const response = await fetch(`/api/dashboard/all?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear()
          window.location.href = '/login'
          return
        }
        throw new Error('Failed to fetch user data')
      }
      
      const data = await response.json()
      setUser(data.user)
    } catch (err) {
      console.error('Error loading user:', err)
      setError(err instanceof Error ? err.message : 'Failed to load user')
    } finally {
      setLoading(false)
    }
  }

  const updateBalance = (newBalance: number) => {
    if (user) {
      setUser({ ...user, balance: newBalance })
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUser, updateBalance }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
