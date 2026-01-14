"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RequestsDetailedPage() {
  const router = useRouter()

  useEffect(() => {
    // Перенаправляем на рабочую страницу заявок
    router.push("/admin/requests")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Перенаправление на страницу заявок...</p>
      </div>
    </div>
  )
}
