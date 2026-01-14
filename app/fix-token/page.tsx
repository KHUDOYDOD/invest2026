"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function FixTokenPage() {
  const router = useRouter()

  useEffect(() => {
    // Очищаем localStorage
    localStorage.clear()
    
    // Показываем сообщение
    alert("✅ Токен очищен! Сейчас перенаправлю на страницу входа...")
    
    // Перенаправляем на вход через 1 секунду
    setTimeout(() => {
      router.push("/login")
    }, 1000)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Исправление токена...</h1>
          <p className="text-blue-200">Очищаем старый токен и перенаправляем на вход</p>
        </div>
        
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-left">
          <p className="text-white text-sm mb-2">✅ Шаг 1: Очистка localStorage</p>
          <p className="text-white text-sm mb-2">✅ Шаг 2: Перенаправление на вход</p>
          <p className="text-blue-200 text-sm">⏳ Шаг 3: Войдите заново...</p>
        </div>
        
        <div className="mt-6 text-sm text-blue-200">
          <p>После входа используйте:</p>
          <p className="font-mono bg-black/30 p-2 rounded mt-2">
            Email: admin@admin.admin<br />
            Пароль: admin123
          </p>
        </div>
      </div>
    </div>
  )
}
