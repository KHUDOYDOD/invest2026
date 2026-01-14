"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Bell,
  Search,
  Moon,
  Sun,
  MessageSquare,
  ChevronDown,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Zap,
  Home,
  Wallet,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTheme } from "next-themes"

export function DashboardHeader() {
  const router = useRouter()
  const { t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [notifications, setNotifications] = useState(2)
  const [messages, setMessages] = useState(3)
  const [isScrolled, setIsScrolled] = useState(false)
  const [userName, setUserName] = useState("Иван")
  const [userEmail, setUserEmail] = useState("ivan@example.com")
  const [userBalance, setUserBalance] = useState(0)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const savedUserName = localStorage.getItem("userName")
      const savedUserEmail = localStorage.getItem("userEmail")

      if (savedUserName) {
        setUserName(savedUserName)
      }

      if (savedUserEmail) {
        setUserEmail(savedUserEmail)
      }

      // Загружаем аватар из localStorage
      const savedAvatar = localStorage.getItem('userAvatar')
      if (savedAvatar) {
        setUserAvatar(savedAvatar)
      }

      // Загружаем баланс пользователя
      fetchUserBalance()
    } catch (error) {
      console.error("Error loading user data:", error)
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Обновляем баланс каждые 30 секунд
    const balanceInterval = setInterval(() => {
      fetchUserBalance()
    }, 30000)

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(timeInterval)
      clearInterval(balanceInterval)
    }
  }, [])

  const fetchUserBalance = async () => {
    try {
      // Получаем userId из localStorage
      const userId = localStorage.getItem('userId')
      if (!userId) {
        console.log('No userId found in localStorage')
        return
      }

      const response = await fetch(`/api/dashboard/all?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Dashboard data:', data)
        if (data.user && typeof data.user.balance === 'number') {
          setUserBalance(data.user.balance)
        }
      } else {
        console.error('Failed to fetch balance:', response.status)
      }
    } catch (error) {
      console.error("Error fetching balance:", error)
    }
  }

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(balance)
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (isSearchOpen) {
      setSearchQuery("")
      setSearchResults([])
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }

    // Поиск по разделам дашборда
    const searchableItems = [
      { title: t('dashboard.title'), description: "Главная страница личного кабинета", url: "/dashboard", icon: "🏠" },
      { title: t('dashboard.deposit'), description: "Пополнить баланс счета", url: "/dashboard/deposit", icon: "💰" },
      { title: t('dashboard.withdraw'), description: "Вывести средства со счета", url: "/dashboard/withdraw", icon: "💸" },
      { title: t('dashboard.investments'), description: "Мои активные инвестиции", url: "/dashboard/investments", icon: "📈" },
      { title: t('dashboard.transactions'), description: "История всех транзакций", url: "/dashboard/transactions", icon: "📊" },
      { title: t('dashboard.referrals'), description: "Реферальная программа", url: "/dashboard/referrals", icon: "👥" },
      { title: t('dashboard.settings'), description: "Настройки профиля", url: "/dashboard/settings", icon: "⚙️" },
      { title: t('dashboard.header.support'), description: "Служба поддержки", url: "/dashboard/support", icon: "💬" },
      { title: t('dashboard.header.my_profile'), description: "Мой профиль и данные", url: "/dashboard/profile", icon: "👤" },
    ]

    const lowerQuery = query.toLowerCase()
    const results = searchableItems.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.description.toLowerCase().includes(lowerQuery)
    )

    setSearchResults(results)
  }

  const navigateToSearchResult = (url: string) => {
    router.push(url)
    setIsSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
  }

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    localStorage.removeItem("isAuthenticated")
    window.location.href = "/login"
  }

  const navigateToProfile = () => {
    router.push("/dashboard/profile")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-30 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-slate-900/90 backdrop-blur-xl border-b border-white/20 shadow-2xl"
          : "bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-md border-b border-white/10"
      }`}
    >
      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="flex h-20 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <motion.div className="flex items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl p-3 rounded-xl shadow-lg">
              IP
            </div>
            <div className="hidden md:block">
              <span className="text-white font-bold text-xl">InvestPro</span>
              <p className="text-white/60 text-xs">{t('dashboard.header.control_panel')}</p>
            </div>
          </Link>
        </motion.div>

        {/* Center - Time and Status */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-white font-mono text-sm">{formatTime(currentTime)}</span>
          </div>

          <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-xl rounded-full px-4 py-2 border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-300 text-sm font-medium">{t('dashboard.header.online')}</span>
          </div>

          <a href="/dashboard" className="flex items-center space-x-2 bg-blue-500/20 backdrop-blur-xl rounded-full px-4 py-2 border border-blue-500/30 hover:bg-blue-500/30 transition-all cursor-pointer">
            <Home className="h-4 w-4 text-blue-300" />
            <span className="text-blue-300 text-sm font-medium">{t('dashboard.title')}</span>
          </a>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <AnimatePresence>
            {isSearchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "320px", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative hidden md:block"
              >
                <Input
                  type="search"
                  placeholder={t('dashboard.header.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 rounded-xl pr-10"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
                  onClick={toggleSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 w-full bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="max-h-96 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => navigateToSearchResult(result.url)}
                          className="p-4 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{result.icon}</span>
                            <div className="flex-1">
                              <h4 className="text-white font-medium text-sm">{result.title}</h4>
                              <p className="text-white/60 text-xs mt-1">{result.description}</p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-white/40 -rotate-90" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {searchQuery.length >= 2 && searchResults.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 w-full bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-4 z-50"
                  >
                    <p className="text-white/60 text-sm text-center">Ничего не найдено</p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSearch}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </AnimatePresence>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl hidden"
          >
            {mounted && (
              <motion.div animate={{ rotate: theme === "light" ? 180 : 0 }} transition={{ duration: 0.3 }}>
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </motion.div>
            )}
          </Button>

          {/* User Balance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-green-500/30"
          >
            <Wallet className="h-5 w-5 text-green-400" />
            <div className="flex flex-col">
              <span className="text-xs text-green-300/70">Баланс</span>
              <span className="text-sm font-bold text-green-300">{formatBalance(userBalance)}</span>
            </div>
          </motion.div>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Messages */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
              >
                <MessageSquare className="h-5 w-5" />
                {messages > 0 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1">
                    <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-blue-500 text-white text-xs border-2 border-slate-900">
                      {messages}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white rounded-xl"
            >
              <DropdownMenuLabel className="flex items-center justify-between p-4">
                <span className="font-semibold">{t('dashboard.header.messages')}</span>
                <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300 p-0 h-auto">
                  {t('dashboard.header.mark_all_read')}
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <div className="max-h-80 overflow-y-auto">
                <MessageItem
                  name="Служба поддержки"
                  message="Здравствуйте! Как мы можем вам помочь сегодня?"
                  time="10 мин назад"
                  isUnread
                />
                <MessageItem
                  name="Система"
                  message="Ваша инвестиция успешно активирована"
                  time="2 часа назад"
                  isUnread
                />
                <MessageItem
                  name="Менеджер"
                  message="Добрый день! Хотел бы обсудить с вами новые инвестиционные возможности."
                  time="Вчера"
                />
              </div>
              <DropdownMenuSeparator className="bg-white/10" />
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg"
                  onClick={() => router.push("/dashboard/messages")}
                >
                  {t('dashboard.header.all_messages')}
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1">
                    <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs border-2 border-slate-900 animate-pulse">
                      {notifications}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white rounded-xl"
            >
              <DropdownMenuLabel className="flex items-center justify-between p-4">
                <span className="font-semibold">{t('dashboard.header.notifications')}</span>
                <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300 p-0 h-auto">
                  {t('dashboard.header.mark_all_read')}
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <div className="max-h-80 overflow-y-auto">
                <NotificationItem
                  title="Новая инвестиция активирована"
                  description="Ваша инвестиция в план 'Стандарт' успешно активирована"
                  time="2 часа назад"
                  isUnread
                />
                <NotificationItem
                  title="Получен реферальный бонус"
                  description="Вы получили $50 за приглашенного пользователя"
                  time="1 день назад"
                  isUnread
                />
                <NotificationItem
                  title="Начисление прибыли"
                  description="На ваш счет зачислена прибыль в размере $125"
                  time="3 дня назад"
                />
              </div>
              <DropdownMenuSeparator className="bg-white/10" />
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg"
                  onClick={() => router.push("/dashboard/notifications")}
                >
                  {t('dashboard.header.all_notifications')}
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-10 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white pl-3 pr-2"
              >
                <Avatar className="h-8 w-8 mr-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push('/dashboard/profile')}>
                  <AvatarImage src={userAvatar || "/placeholder.svg?height=32&width=32"} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left mr-2">
                  <p className="text-sm font-medium truncate max-w-24">{userName}</p>
                  <p className="text-xs text-white/60">{t('dashboard.header.user_role')}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-white/70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white rounded-xl"
            >
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={userAvatar || "/placeholder.svg?height=48&width=48"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{userName}</p>
                    <p className="text-xs text-white/70 truncate">{userEmail}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                      <span className="text-xs text-green-300">{t('dashboard.header.active')}</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="hover:bg-white/10 focus:bg-white/10 cursor-pointer p-3 rounded-lg mx-2"
                onClick={navigateToProfile}
              >
                <User className="mr-3 h-4 w-4" />
                <span>{t('dashboard.header.my_profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-white/10 focus:bg-white/10 cursor-pointer p-3 rounded-lg mx-2"
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings className="mr-3 h-4 w-4" />
                <span>{t('dashboard.header.settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-white/10 focus:bg-white/10 cursor-pointer p-3 rounded-lg mx-2"
                onClick={() => router.push("/dashboard/support")}
              >
                <HelpCircle className="mr-3 h-4 w-4" />
                <span>{t('dashboard.header.support')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer p-3 rounded-lg mx-2 text-red-300 hover:text-red-200"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>{t('dashboard.header.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}

function NotificationItem({
  title,
  description,
  time,
  isUnread = false,
}: {
  title: string
  description: string
  time: string
  isUnread?: boolean
}) {
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
      className={`p-4 cursor-pointer transition-colors ${isUnread ? "border-l-2 border-blue-500 bg-blue-500/5" : ""}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm">{title}</h4>
        {isUnread && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
      </div>
      <p className="text-xs text-white/70 mb-2 line-clamp-2">{description}</p>
      <p className="text-xs text-white/50">{time}</p>
    </motion.div>
  )
}

function MessageItem({
  name,
  message,
  time,
  isUnread = false,
}: {
  name: string
  message: string
  time: string
  isUnread?: boolean
}) {
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
      className={`p-4 cursor-pointer transition-colors ${isUnread ? "border-l-2 border-blue-500 bg-blue-500/5" : ""}`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xs">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium text-sm">{name}</h4>
            {isUnread && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
          </div>
          <p className="text-xs text-white/70 mb-1 line-clamp-2">{message}</p>
          <p className="text-xs text-white/50">{time}</p>
        </div>
      </div>
    </motion.div>
  )
}

function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
