"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/contexts/language-context"

export function Header() {
  const { t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("")
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Проверяем состояние авторизации
    const checkAuthState = () => {
      const authStatus = localStorage.getItem('isAuthenticated')
      const storedUserName = localStorage.getItem('userName')
      const storedUserRole = localStorage.getItem('userRole')

      if (authStatus === 'true' && storedUserName) {
        setIsAuthenticated(true)
        setUserName(storedUserName)
        setUserRole(storedUserRole || 'user')
      } else {
        setIsAuthenticated(false)
        setUserName("")
        setUserRole("")
      }
    }

    checkAuthState()

    // Слушаем изменения в localStorage
    const handleStorageChange = () => {
      checkAuthState()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Также проверяем при каждом фокусе на окно
    window.addEventListener('focus', checkAuthState)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', checkAuthState)
    }
  }, [])

  const handleLogout = async () => {
    try {
      // Вызываем API для выхода
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      // Очищаем localStorage
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userName')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userId')
      localStorage.removeItem('userRole')
      localStorage.removeItem('auth-token')
      localStorage.removeItem('authToken')
      localStorage.removeItem('adminAuth')
      localStorage.removeItem('adminUser')
      localStorage.removeItem('user')

      // Обновляем состояние
      setIsAuthenticated(false)
      setUserName("")
      setUserRole("")

      // Перенаправляем на главную
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      // В случае ошибки все равно очищаем данные
      localStorage.clear()
      setIsAuthenticated(false)
      setUserName("")
      setUserRole("")
      router.push('/')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">InvestPro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white/90 hover:text-white transition-colors text-sm">
              {t('header.home')}
            </Link>
            <Link href="/#plans" className="text-white/90 hover:text-white transition-colors text-sm">
              {t('header.plans')}
            </Link>
            <Link href="/#about" className="text-white/90 hover:text-white transition-colors text-sm">
              {t('header.about')}
            </Link>
            <Link href="/#contact" className="text-white/90 hover:text-white transition-colors text-sm">
              {t('header.contact')}
            </Link>
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700 px-4 py-2 text-sm flex items-center space-x-2"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span>{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-800 border-slate-600">
                  <DropdownMenuItem 
                    onClick={() => router.push('/dashboard')}
                    className="text-white hover:bg-slate-700 cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('header.dashboard')}</span>
                  </DropdownMenuItem>
                  {userRole === 'admin' && (
                    <DropdownMenuItem 
                      onClick={() => router.push('/admin/dashboard')}
                      className="text-white hover:bg-slate-700 cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t('admin.dashboard')}</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-slate-600" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-400 hover:bg-slate-700 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('header.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="border-green-600 bg-green-600 text-white hover:bg-green-700 px-4 py-2 text-sm font-semibold"
                  >
                    💼 {t('header.dashboard')}
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700 px-4 py-2 text-sm"
                  >
                    {t('header.login')}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 text-sm">
                    {t('header.register')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-white/80 hover:text-white transition-colors">
                {t('header.home')}
              </Link>
              <Link href="/#plans" className="text-white/80 hover:text-white transition-colors">
                {t('header.plans')}
              </Link>
              <Link href="/#about" className="text-white/80 hover:text-white transition-colors">
                {t('header.about')}
              </Link>
              <Link href="/#contact" className="text-white/80 hover:text-white transition-colors">
                {t('header.contact')}
              </Link>

              <div className="pt-4 border-t border-slate-800">
                <LanguageSwitcher />
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 px-2 py-2 border border-slate-600 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{userName}</p>
                        <p className="text-slate-400 text-xs">Авторизован</p>
                      </div>
                    </div>
                    <Link href="/dashboard" className="block">
                      <Button
                        variant="outline"
                        className="w-full border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Личный кабинет
                      </Button>
                    </Link>
                    {userRole === 'admin' && (
                      <Link href="/admin/dashboard" className="block">
                        <Button
                          variant="outline"
                          className="w-full border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Админ панель
                        </Button>
                      </Link>
                    )}
                    <Button 
                      onClick={() => {
                        setMobileMenuOpen(false)
                        handleLogout()
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Выйти
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block">
                      <Button
                        variant="outline"
                        className="w-full border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Войти
                      </Button>
                    </Link>
                    <Link href="/register" className="block">
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Регистрация
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
