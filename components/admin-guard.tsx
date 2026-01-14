"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdminAccess = () => {
      const authToken = localStorage.getItem("authToken")
      const adminAuth = localStorage.getItem("adminAuth")
      const adminUserStr = localStorage.getItem("adminUser")
      
      if (!authToken || !adminAuth || adminAuth !== "true") {
        router.push("/admin/login")
        return
      }
      
      // Дополнительная проверка роли пользователя
      if (adminUserStr) {
        try {
          const adminUser = JSON.parse(adminUserStr)
          if (!adminUser.isAdmin || (adminUser.role !== "admin" && adminUser.role !== "super_admin")) {
            router.push("/admin/login")
            return
          }
        } catch (error) {
          console.error("Error parsing admin user:", error)
          router.push("/admin/login")
          return
        }
      }
      
      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAdminAccess()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/60">Проверка доступа...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}