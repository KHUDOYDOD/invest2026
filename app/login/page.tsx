"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle, LogIn, Shield } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Очищаем сообщения при изменении полей
    if (error) setError(null)
    if (success) setSuccess(null)
  }

  const validateForm = () => {
    return formData.email.trim() && formData.password
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      console.log('🔐 Attempting login with:', formData.email)

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        }),
      })

      const data = await response.json()
      console.log('📥 Login response:', data)

      if (!response.ok || !data.success) {
        // Устанавливаем ошибку для конкретного поля если указано
        if (data.field) {
          const element = document.getElementById(data.field)
          if (element) {
            element.focus()
            element.classList.add('border-red-400')
            setTimeout(() => {
              element.classList.remove('border-red-400')
            }, 3000)
          }
        }
        throw new Error(data.error || 'Ошибка входа')
      }

      // Успешный вход
      setSuccess('✅ Вход выполнен успешно! Сейчас перенаправляем в личный кабинет...')
      toast.success('✅ Добро пожаловать! Перенаправление в личный кабинет...', {
        duration: 3000,
        style: {
          background: '#10b981',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 'bold',
        },
      })

      // Сохраняем данные пользователя
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('userEmail', data.user.email)
        localStorage.setItem('userName', data.user.fullName)
        localStorage.setItem('userId', data.user.id)
        localStorage.setItem('userRole', data.user.role || 'user')
        localStorage.setItem('isAuthenticated', 'true')

        if (data.token) {
          localStorage.setItem('auth-token', data.token)
          localStorage.setItem('authToken', data.token)
        }

        // Устанавливаем данные для админа если нужно
        if (data.user.isAdmin || data.user.role === 'admin') {
          localStorage.setItem('adminAuth', 'true')
          localStorage.setItem('adminUser', JSON.stringify(data.user))
        }
      }

      // Перенаправляем через 1.5 секунды
      setTimeout(() => {
        // Используем redirect из ответа сервера, который основан на роли пользователя
        const redirectPath = data.redirect || '/dashboard'
        router.push(redirectPath)
        router.refresh() // Обновляем страницу для применения изменений
      }, 1500)

    } catch (err: any) {
      console.error('❌ Login error:', err)
      const errorMessage = err.message || 'Произошла ошибка при входе. Проверьте данные и попробуйте еще раз.'
      setError(errorMessage)
      toast.error(`❌ ${errorMessage}`, {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#fff',
          fontSize: '16px',
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-[500px] h-[500px] bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Animated particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-40 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 left-40 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 right-20 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <Header />

      <main className="flex-grow flex items-center justify-center py-12 px-4 relative z-10">
        <Card className="w-full max-w-lg relative z-10 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-blue-500/30 shadow-2xl shadow-blue-500/20 rounded-3xl">
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-emerald-600/10 rounded-3xl animate-pulse pointer-events-none"></div>
        
        <CardHeader className="space-y-6 text-center pb-8 pt-8 relative z-10">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 animate-pulse relative group">
            <Shield className="w-12 h-12 text-white relative z-10" />
            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <CardTitle className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              🔐 Добро пожаловать!
            </CardTitle>
            <CardDescription className="text-white/90 text-xl font-bold">
              Войдите в свой личный кабинет
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 px-8 relative z-20">
          {error && (
            <Alert variant="destructive" className="border-red-400/50 bg-red-500/20 backdrop-blur-sm relative z-20">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <AlertDescription className="text-red-300 font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-400/50 bg-green-500/20 backdrop-blur-sm relative z-20">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <AlertDescription className="text-green-300 font-medium">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 relative z-20">
            <div className="space-y-3 relative z-20">
              <Label htmlFor="email" className="text-white font-medium text-base">
                Email или логин
              </Label>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="example@domain.com или ваш логин"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 relative z-20"
                autoComplete="email"
                style={{ pointerEvents: 'auto' }}
              />
            </div>

            <div className="space-y-3 relative z-20">
              <Label htmlFor="password" className="text-white font-medium text-base">
                Пароль
              </Label>
              <div className="relative z-20">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите ваш пароль"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="h-12 text-base pr-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 relative z-20"
                  autoComplete="current-password"
                  style={{ pointerEvents: 'auto' }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-white/50 hover:text-white transition-colors z-30"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  style={{ pointerEvents: 'auto' }}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:from-blue-700 hover:via-cyan-700 hover:to-emerald-700 text-white border-2 border-white/20 rounded-xl shadow-2xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 transform hover:scale-105 transition-all duration-300 relative overflow-hidden group" 
              disabled={isLoading || !formData.email.trim() || !formData.password}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              <span className="relative z-10 flex items-center justify-center">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Выполняется вход...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-3 h-6 w-6" />
                    🚀 Войти в аккаунт
                  </>
                )}
              </span>
            </Button>
          </form>

          <div className="text-center pt-4">
            <Link 
              href="/register" 
              className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-all duration-200 text-sm"
            >
              Забыли пароль? Восстановить доступ
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-6 pt-6 pb-8 px-8">
          <div className="text-center">
            <span className="text-white/70 text-sm">Нет аккаунта? </span>
            <Link 
              href="/register" 
              className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors duration-200 text-sm"
            >
              Создать бесплатный аккаунт
            </Link>
          </div>
        </CardFooter>
      </Card>
      </main>

      <Footer />
    </div>
  )
}