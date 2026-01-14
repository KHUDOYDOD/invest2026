// Утилиты для работы с токеном авторизации

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken')
}

export function getUserId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('userId')
}

export function setAuthToken(token: string, userId: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem('authToken', token)
  localStorage.setItem('userId', userId)
}

export function clearAuth() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('authToken')
  localStorage.removeItem('userId')
}

export function isTokenValid(): boolean {
  const token = getAuthToken()
  if (!token) return false
  
  // Проверяем длину токена (JWT токен должен быть длинным)
  if (token.length < 50) {
    console.error('❌ Token is too short (corrupted):', token.length)
    return false
  }
  
  // Проверяем формат JWT (должен содержать 2 точки)
  const parts = token.split('.')
  if (parts.length !== 3) {
    console.error('❌ Token format is invalid')
    return false
  }
  
  return true
}

export function validateAndFixAuth(): boolean {
  if (!isTokenValid()) {
    console.warn('⚠️ Invalid token detected, clearing auth...')
    clearAuth()
    return false
  }
  return true
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error('No auth token')
  }
  
  if (!isTokenValid()) {
    clearAuth()
    window.location.href = '/login'
    throw new Error('Invalid token')
  }
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  })
  
  // Если получили 401, токен недействителен
  if (response.status === 401) {
    console.error('❌ 401 Unauthorized - clearing auth and redirecting to login')
    clearAuth()
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }
  
  return response
}
