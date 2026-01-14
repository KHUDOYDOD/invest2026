"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { DepositForm } from "@/components/dashboard/deposit-form"
import { TransactionsList } from "@/components/dashboard/transactions-list"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  TrendingUp,
  User,
  Shield,
  Clock,
  Wallet,
  BarChart3,
  Globe,
  CheckCircle,
  MapPin,
  CreditCard,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"
import { useVoiceNotifications } from "@/hooks/use-voice-notifications"
import Link from "next/link"
import { InvestmentDialog } from "@/components/dashboard/investment-dialog"
import { useRouter } from "next/navigation";

function DashboardContent() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [userData, setUserData] = useState<any>(null)
  const [investments, setInvestments] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDepositForm, setShowDepositForm] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showInvestmentDialog, setShowInvestmentDialog] = useState(false)
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({})
  const { playInvestmentNotification, playDepositNotification, playErrorNotification } = useVoiceNotifications()
  const [investmentPlans, setInvestmentPlans] = useState<any[]>([]);
  const router = useRouter();

  // Функция для получения названия страны
  const getCountryName = (countryCode: string) => {
    const countries: Record<string, string> = {
      'RU': 'Россия',
      'US': 'США', 
      'GB': 'Великобритания',
      'DE': 'Германия',
      'FR': 'Франция',
      'IT': 'Италия',
      'ES': 'Испания',
      'CA': 'Канада',
      'AU': 'Австралия',
      'JP': 'Япония',
      'KR': 'Южная Корея',
      'CN': 'Китай',
      'IN': 'Индия',
      'BR': 'Бразилия',
      'MX': 'Мексика',
      'UA': 'Украина',
      'BY': 'Беларусь',
      'KZ': 'Казахстан',
      'UZ': 'Узбекистан',
      'PL': 'Польша',
      'TR': 'Турция'
    };
    return countries[countryCode] || countryCode;
  };

  useEffect(() => {
    console.log("Dashboard: Component mounted")

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      updateInvestmentTimers()
    }, 1000)

    // Автоматическое обновление данных каждые 2 минуты
    const dataRefreshTimer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchDashboardData()
      }
    }, 120000)

    fetchDashboardData()

    return () => {
      clearInterval(timer)
      clearInterval(dataRefreshTimer)
      console.log("Dashboard: Component unmounted")
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("authToken")
      const userId = localStorage.getItem("userId")

      if (!token || !userId) {
        throw new Error("Пользователь не авторизован")
      }

      // Проверяем кэш (увеличиваем время кэша до 60 секунд)
      const cacheKey = `dashboard_${userId}`
      const cachedData = localStorage.getItem(cacheKey)
      const cacheTime = localStorage.getItem(`${cacheKey}_time`)

      // Если кэш свежий (менее 60 секунд), используем его
      if (cachedData && cacheTime && Date.now() - parseInt(cacheTime) < 60000) {
        const data = JSON.parse(cachedData)
        
        // Маппим данные из кэша
        const mappedUser = {
          ...data.user,
          name: data.user.full_name || data.user.email,
          totalInvested: data.user.total_invested || 0,
          totalProfit: data.user.total_earned || 0,
          referralCount: 0,
          isAdmin: data.user.role === 'admin' || data.user.role === 'super_admin'
        }
        
        setUserData(mappedUser)
        setInvestments(data.investments || [])
        setTransactions(data.transactions || [])
        setLoading(false)
        return
      }

      console.log("Dashboard: Fetching fresh data...")

      // Используем оптимизированный endpoint, который загружает все данные одним запросом
      const response = await fetch(`/api/dashboard/all?userId=${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          console.log("❌ Токен недействителен, перенаправляем на логин")
          localStorage.clear()
          window.location.href = "/login"
          return
        }

        if (response.status === 500) {
          const errorData = await response.json().catch(() => ({}))
          console.error("❌ Ошибка сервера:", errorData)
          throw new Error(errorData.error || `Ошибка сервера ${response.status}`)
        }

        throw new Error(`Ошибка ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Кэшируем данные на 60 секунд
      localStorage.setItem(cacheKey, JSON.stringify(data))
      localStorage.setItem(`${cacheKey}_time`, Date.now().toString())

      // Маппим данные из API в нужный формат
      const mappedUser = {
        ...data.user,
        name: data.user.full_name || data.user.email,
        totalInvested: data.user.total_invested || 0,
        totalProfit: data.user.total_earned || 0,
        referralCount: 0, // TODO: добавить подсчет рефералов
        isAdmin: data.user.role === 'admin' || data.user.role === 'super_admin'
      }

      setUserData(mappedUser)
      setInvestments(data.investments || [])
      setTransactions(data.transactions || [])

      console.log("Dashboard: All data loaded successfully")

    } catch (err) {
      console.error("Dashboard: Error fetching data:", err)
      setError(err instanceof Error ? err.message : "Ошибка загрузки данных")
    } finally {
      setLoading(false)
    }
  }

  const updateInvestmentTimers = () => {
    const newTimeLeft: { [key: string]: string } = {}

    investments.forEach((investment) => {
      const endDate = new Date(investment.end_date)
      const now = new Date()
      const diff = endDate.getTime() - now.getTime()

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        newTimeLeft[investment.id] = `${days}д ${hours}ч ${minutes}м ${seconds}с`
      } else {
        newTimeLeft[investment.id] = "Завершено"
      }
    })

    setTimeLeft(newTimeLeft)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const handleDeposit = async (amount: number, method: string, paymentDetails: any) => {
    try {
      console.log("💰 Handling deposit:", { amount, method })

      // Очищаем кэш для обновления данных
      const userId = localStorage.getItem("userId")
      if (userId) {
        localStorage.removeItem(`dashboard_${userId}`)
        localStorage.removeItem(`dashboard_${userId}_time`)
      }

      // Обновляем данные после создания заявки
      setTimeout(() => {
        fetchDashboardData()
        setShowDepositForm(false)
      }, 500)
    } catch (error) {
      console.error("❌ Error handling deposit:", error)
      toast.error("Ошибка обработки пополнения")
    }
  }

  const quickActions = [
    {
      title: "Пополнить баланс",
      subtitle: "Отправить запрос на пополнение",
      icon: <ArrowDownToLine className="h-6 w-6" />,
      color: "from-green-500 to-emerald-600",
      action: () => {
        setShowDepositForm(true)
      },
      limit: "Мин. $50",
    },
    {
      title: "Вывод средств",
      subtitle: "Запросить вывод прибыли",
      icon: <ArrowUpFromLine className="h-6 w-6" />,
      color: "from-red-500 to-pink-600",
      action: () => {
        window.location.href = "/dashboard/withdraw"
      },
      limit: "24/7 доступно",
    },
    {
      title: "Пригласить друзей",
      subtitle: "Получайте бонусы за рефералов",
      icon: <Users className="h-6 w-6" />,
      color: "from-purple-500 to-violet-600",
      action: () => {
        window.location.href = "/dashboard/referrals"
      },
      limit: "до 10%",
    },
    {
      title: "Новая инвестиция",
      subtitle: "Выберите план инвестирования",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "from-orange-500 to-amber-600",
      action: () => {
        window.location.href = "/dashboard/investments"
      },
      limit: "От $100",
    },
    {
      title: "Мой профиль",
      subtitle: "Управление личными данными",
      icon: <User className="h-6 w-6" />,
      color: "from-blue-500 to-cyan-600",
      action: () => {
        window.location.href = "/dashboard/profile"
      },
      limit: "Персонализация",
    },
    ...(userData?.isAdmin
      ? [
          {
            title: "Администратор",
            subtitle: "Панель управления сайтом",
            icon: <Shield className="h-6 w-6" />,
            color: "from-red-600 to-rose-700",
            action: () => {
              window.location.href = "/admin/dashboard"
            },
            limit: "Только админ",
          },
        ]
      : []),
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="relative">
            <RefreshCw className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
            <div className="absolute inset-0 h-16 w-16 rounded-full border-t-2 border-blue-500 animate-ping opacity-20"></div>
          </div>
          <p className="text-white text-lg mt-4 font-light">Загрузка данных из базы...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ошибка загрузки</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <div className="space-y-3">
            <Button onClick={fetchDashboardData} className="bg-blue-600 hover:bg-blue-700 w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Попробовать снова
            </Button>
            <Button
              onClick={() => {
                localStorage.clear()
                window.location.href = "/login"
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 w-full"
            >
              Войти заново
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-white text-lg">Данные пользователя не найдены</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <DashboardHeader />

      <div className="flex relative z-10">
        <DashboardNav activeItem="dashboard" />

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              {/* Animated Background Card */}
              <div className="relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden">
                {/* Animated Orbs */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                
                <div className="relative z-10 text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-xl rounded-full px-8 py-4 border-4 border-black shadow-2xl hover:bg-white hover:scale-105 transition-all duration-300"
                  >
                    <motion.span 
                      animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="text-3xl"
                    >
                      👋
                    </motion.span>
                    <span className="text-black font-bold text-lg">Добро пожаловать, {userData.name}!</span>
                    <motion.span 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-3xl"
                    >
                      💼
                    </motion.span>
                  </motion.div>

                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4"
                  >
                    Личный кабинет
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-blue-100 max-w-2xl mx-auto text-xl font-medium"
                  >
                    Управляйте своими инвестициями и следите за доходностью в реальном времени
                  </motion.p>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 inline-flex"
                  >
                    <Clock className="h-6 w-6 text-cyan-400 animate-pulse" />
                    <span className="font-mono text-2xl font-bold text-white">{formatTime(currentTime)}</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-white/95 backdrop-blur-xl border-4 border-green-500 shadow-2xl relative overflow-hidden group hover:shadow-green-500/50 transition-all duration-300">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-green-600 text-sm font-bold">💰 Реальный баланс</p>
                        <p className="text-gray-600 text-xs">Доступные средства</p>
                      </div>
                      <motion.div 
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="p-4 bg-green-100 rounded-2xl shadow-lg"
                      >
                        <Wallet className="h-8 w-8 text-green-600" />
                      </motion.div>
                    </div>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.3 }}
                      className="text-4xl font-black text-green-600 mb-3"
                    >
                      ${Number(userData.balance || 0).toLocaleString()}.00
                    </motion.div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600 text-sm font-medium">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                        <span>Доступно</span>
                      </div>
                      <div className="bg-green-100 px-3 py-1 rounded-full">
                        <span className="text-green-600 text-xs font-bold">100%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-white/95 backdrop-blur-xl border-4 border-blue-500 shadow-2xl relative overflow-hidden group hover:shadow-blue-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-blue-600 text-sm font-bold">📈 Инвестировано</p>
                        <p className="text-gray-600 text-xs">Работающий капитал</p>
                      </div>
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="p-4 bg-blue-100 rounded-2xl shadow-lg"
                      >
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                      </motion.div>
                    </div>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.4 }}
                      className="text-4xl font-black text-blue-600 mb-3"
                    >
                      ${Number(userData.totalInvested || 0).toLocaleString()}.00
                    </motion.div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600 text-sm font-medium">
                        <BarChart3 className="h-4 w-4 mr-1 text-blue-600" />
                        <span>Активно</span>
                      </div>
                      <div className="bg-blue-100 px-3 py-1 rounded-full">
                        <span className="text-blue-600 text-xs font-bold">+{investments.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-white/95 backdrop-blur-xl border-4 border-purple-500 shadow-2xl relative overflow-hidden group hover:shadow-purple-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-purple-600 text-sm font-bold">💎 Прибыль</p>
                        <p className="text-gray-600 text-xs">Общая прибыль</p>
                      </div>
                      <motion.div 
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="p-4 bg-purple-100 rounded-2xl shadow-lg"
                      >
                        <BarChart3 className="h-8 w-8 text-purple-600" />
                      </motion.div>
                    </div>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.5 }}
                      className="text-4xl font-black text-purple-600 mb-3"
                    >
                      ${Number(userData.totalProfit || 0).toLocaleString()}.00
                    </motion.div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600 text-sm font-medium">
                        <TrendingUp className="h-4 w-4 mr-1 text-purple-600" />
                        <span>Заработано</span>
                      </div>
                      <div className="bg-purple-100 px-3 py-1 rounded-full">
                        <span className="text-purple-600 text-xs font-bold">↑ ROI</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-white/95 backdrop-blur-xl border-4 border-orange-500 shadow-2xl relative overflow-hidden group hover:shadow-orange-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-orange-600 text-sm font-bold">👥 Друзья</p>
                        <p className="text-gray-600 text-xs">Приглашенные друзья</p>
                      </div>
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="p-4 bg-orange-100 rounded-2xl shadow-lg"
                      >
                        <Users className="h-8 w-8 text-orange-600" />
                      </motion.div>
                    </div>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.6 }}
                      className="text-4xl font-black text-orange-600 mb-3"
                    >
                      {userData.referralCount || 0}
                    </motion.div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600 text-sm font-medium">
                        <Users className="h-4 w-4 mr-1 text-orange-600" />
                        <span>Рефералов</span>
                      </div>
                      <div className="bg-orange-100 px-3 py-1 rounded-full">
                        <span className="text-orange-600 text-xs font-bold">10%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-xl rounded-full px-6 py-3 border-4 border-black shadow-2xl mb-4 hover:bg-white hover:scale-105 transition-all duration-300"
                >
                  <span className="text-2xl">⚡</span>
                  <h2 className="text-xl font-bold text-black">Быстрые действия</h2>
                </motion.div>
                <p className="text-blue-200 text-base">Управляйте своим портфелем одним кликом</p>
              </div>
              
              <div className="flex justify-center">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl">
                {quickActions.map((action, index) => {
                  // Определяем цвет обводки для каждой кнопки
                  const borderColors = [
                    'border-green-500 hover:shadow-green-500/50',
                    'border-red-500 hover:shadow-red-500/50',
                    'border-purple-500 hover:shadow-purple-500/50',
                    'border-orange-500 hover:shadow-orange-500/50',
                    'border-blue-500 hover:shadow-blue-500/50',
                    'border-rose-600 hover:shadow-rose-600/50'
                  ]
                  const iconColors = [
                    'text-green-600 bg-green-100',
                    'text-red-600 bg-red-100',
                    'text-purple-600 bg-purple-100',
                    'text-orange-600 bg-orange-100',
                    'text-blue-600 bg-blue-100',
                    'text-rose-600 bg-rose-100'
                  ]
                  const textColors = [
                    'text-green-600',
                    'text-red-600',
                    'text-purple-600',
                    'text-orange-600',
                    'text-blue-600',
                    'text-rose-600'
                  ]
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.1, y: -10 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={action.action}
                      className={`relative bg-white/95 backdrop-blur-xl p-6 rounded-3xl text-center cursor-pointer shadow-2xl transition-all duration-500 border-4 ${borderColors[index]} overflow-hidden group`}
                    >
                      {/* Animated Background */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-gray-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                      
                      {/* Icon */}
                      <motion.div 
                        animate={{ 
                          y: [0, -5, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          delay: index * 0.2
                        }}
                        className="mb-4 flex justify-center relative z-10"
                      >
                        <div className={`p-4 ${iconColors[index]} rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                          {action.icon}
                        </div>
                      </motion.div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <h3 className={`${textColors[index]} font-bold text-base mb-2 group-hover:scale-110 transition-transform`}>
                          {action.title}
                        </h3>
                        <p className="text-gray-600 text-xs mb-3 leading-relaxed font-medium">
                          {action.subtitle}
                        </p>
                        <div className={`${iconColors[index]} rounded-full px-4 py-2 border-2 ${borderColors[index].split(' ')[0]}`}>
                          <p className={`${textColors[index]} font-bold text-xs`}>{action.limit}</p>
                        </div>
                      </div>
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 border-2 border-black/0 group-hover:border-black/20 rounded-3xl transition-all duration-500"></div>
                    </motion.div>
                  )
                })}
              </div>
              </div>
            </motion.div>

            {/* Quick Deposit Form */}
            {showDepositForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Запрос на пополнение</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDepositForm(false)}
                    className="text-white hover:bg-white/10"
                  >
                    ✕
                  </Button>
                </div>
                <DepositForm onDeposit={handleDeposit} />
              </motion.div>
            )}

            {/* Active Investments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden"
            >
              {/* Animated Background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="p-4 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl shadow-lg border border-white/20"
                    >
                      <BarChart3 className="h-8 w-8 text-blue-300" />
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-black text-white mb-1">📊 Активные инвестиции</h2>
                      <p className="text-blue-200 text-sm">Ваш портфель работает на вас</p>
                    </div>
                  </div>
                  <Link href="/dashboard/investments">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="border-2 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm font-bold"
                      >
                        Все инвестиции →
                      </Button>
                    </motion.div>
                  </Link>
                </div>

              {investments.length > 0 ? (
                <div className="space-y-6">
                  {investments.map((investment, idx) => (
                    <motion.div 
                      key={investment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + idx * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group"
                    >
                      {/* Animated Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl">
                              <TrendingUp className="h-6 w-6 text-blue-300" />
                            </div>
                            <h3 className="text-white font-bold text-xl">
                              {investment.investment_plans?.name || "План инвестирования"}
                            </h3>
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Badge className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-300 border-2 border-green-400/50 px-4 py-2 text-sm font-bold">
                              ✓ Активно
                            </Badge>
                          </motion.div>
                        </div>

                        {/* Countdown Timer - Large Display */}
                        <div className="bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 backdrop-blur-xl border-2 border-orange-400/30 rounded-2xl p-6 mb-6">
                          <div className="flex items-center justify-center space-x-2 mb-4">
                            <Clock className="h-5 w-5 text-orange-400 animate-pulse" />
                            <h4 className="text-white font-bold text-lg">⏰ Обратный отсчет до завершения</h4>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            {(() => {
                              const endDate = new Date(investment.end_date)
                              const now = new Date()
                              const diff = endDate.getTime() - now.getTime()
                              
                              if (diff > 0) {
                                const days = Math.floor(diff / (1000 * 60 * 60 * 24))
                                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                                const seconds = Math.floor((diff % (1000 * 60)) / 1000)
                                
                                return [
                                  { label: 'Дней', value: days, icon: '📅' },
                                  { label: 'Часов', value: hours, icon: '⏰' },
                                  { label: 'Минут', value: minutes, icon: '⏱️' },
                                  { label: 'Секунд', value: seconds, icon: '⚡' }
                                ].map((item, idx) => (
                                  <motion.div 
                                    key={idx}
                                    animate={{ scale: item.label === 'Секунд' ? [1, 1.05, 1] : 1 }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
                                  >
                                    <div className="text-3xl mb-1">{item.icon}</div>
                                    <div className="text-3xl font-black text-white mb-1 tabular-nums">
                                      {String(item.value).padStart(2, '0')}
                                    </div>
                                    <div className="text-xs text-gray-300 font-medium">{item.label}</div>
                                  </motion.div>
                                ))
                              } else {
                                return <div className="col-span-4 text-center text-white font-bold text-xl">✅ Завершено</div>
                              }
                            })()}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30">
                            <p className="text-blue-200 text-xs mb-2 font-medium flex items-center">
                              <span className="mr-1">💰</span> Инвестировано
                            </p>
                            <p className="text-white font-black text-xl">${Number(investment.amount).toLocaleString()}</p>
                            <p className="text-blue-300 text-xs mt-1">Основная сумма</p>
                          </div>
                          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
                            <p className="text-green-200 text-xs mb-2 font-medium flex items-center">
                              <span className="mr-1">📈</span> Ежедневно
                            </p>
                            <p className="text-green-300 font-black text-xl">${Number(investment.daily_profit).toFixed(2)}</p>
                            <p className="text-green-300 text-xs mt-1">
                              +{((Number(investment.daily_profit) / Number(investment.amount)) * 100).toFixed(2)}% в день
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
                            <p className="text-purple-200 text-xs mb-2 font-medium flex items-center">
                              <span className="mr-1">💎</span> Заработано
                            </p>
                            <p className="text-purple-300 font-black text-xl">
                              ${(() => {
                                // Рассчитываем сколько дней прошло с начала инвестиции
                                const startDate = new Date(investment.start_date)
                                const now = new Date()
                                const endDate = new Date(investment.end_date)
                                
                                // Если инвестиция еще не началась
                                if (now < startDate) return '0.00'
                                
                                // Количество прошедших дней
                                const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                                
                                // Общая длительность
                                const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                                
                                // Заработано = дневная прибыль × прошедшие дни (но не больше общего срока)
                                const earnedProfit = Number(investment.daily_profit) * Math.min(daysPassed, totalDays)
                                
                                return earnedProfit.toFixed(2)
                              })()}
                            </p>
                            <p className="text-purple-300 text-xs mt-1">
                              +{(() => {
                                const startDate = new Date(investment.start_date)
                                const now = new Date()
                                const endDate = new Date(investment.end_date)
                                
                                if (now < startDate) return '0.0'
                                
                                const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                                const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                                const earnedProfit = Number(investment.daily_profit) * Math.min(daysPassed, totalDays)
                                const roi = (earnedProfit / Number(investment.amount)) * 100
                                
                                return roi.toFixed(1)
                              })()}% ROI
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30">
                            <p className="text-yellow-200 text-xs mb-2 font-medium flex items-center">
                              <span className="mr-1">🎯</span> Ожидается
                            </p>
                            <p className="text-yellow-300 font-black text-xl">
                              ${(() => {
                                // Рассчитываем общую длительность инвестиции в днях
                                const startDate = new Date(investment.start_date)
                                const endDate = new Date(investment.end_date)
                                const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                                
                                // Ожидаемая прибыль = дневная прибыль × общее количество дней
                                const expectedProfit = Number(investment.daily_profit) * totalDays
                                return expectedProfit.toFixed(2)
                              })()}
                            </p>
                            <p className="text-yellow-300 text-xs mt-1">К концу срока</p>
                          </div>
                          <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl p-4 border border-red-500/30">
                            <p className="text-red-200 text-xs mb-2 font-medium flex items-center">
                              <span className="mr-1">⚡</span> Осталось
                            </p>
                            <p className="text-red-300 font-black text-xl">
                              {(() => {
                                const daysLeft = Math.ceil((new Date(investment.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                return daysLeft > 0 ? daysLeft : 0
                              })()}
                            </p>
                            <p className="text-red-300 text-xs mt-1">
                              из {Math.ceil((new Date(investment.end_date).getTime() - new Date(investment.start_date).getTime()) / (1000 * 60 * 60 * 24))} дней
                            </p>
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-white/60 text-xs mb-1">📅 Дата начала</p>
                              <p className="text-white font-semibold">
                                {new Date(investment.start_date).toLocaleDateString("ru-RU")}
                              </p>
                            </div>
                            <div>
                              <p className="text-white/60 text-xs mb-1">🏁 Дата окончания</p>
                              <p className="text-white font-semibold">
                                {new Date(investment.end_date).toLocaleDateString("ru-RU")}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-white/10">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-white/80 font-medium">📊 Прогресс инвестиции</span>
                            <span className="text-white font-bold text-lg">
                              {Math.round(
                                ((new Date().getTime() - new Date(investment.start_date).getTime()) /
                                  (new Date(investment.end_date).getTime() - new Date(investment.start_date).getTime())) *
                                  100,
                              )}%
                            </span>
                          </div>
                          <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ 
                                width: `${Math.round(
                                  ((new Date().getTime() - new Date(investment.start_date).getTime()) /
                                    (new Date(investment.end_date).getTime() - new Date(investment.start_date).getTime())) *
                                    100,
                                )}%`
                              }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative"
                            >
                              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-12 border-2 border-white/20 text-center"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-6"
                  >
                    📊
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">Начните инвестировать сегодня!</h3>
                  <p className="text-white/70 mb-6 text-lg">У вас пока нет активных инвестиций</p>
                  <Link href="/dashboard/investments">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-2xl">
                        🚀 Начать инвестировать
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              )}
              </div>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="relative bg-gradient-to-br from-green-600/20 via-emerald-600/20 to-teal-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden"
            >
              {/* Animated Background */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="p-4 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-2xl shadow-lg border border-white/20"
                    >
                      <CreditCard className="h-8 w-8 text-green-300" />
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-black text-white mb-1">💳 Последние транзакции</h2>
                      <p className="text-green-200 text-sm">
                        {transactions.length > 5 
                          ? `Показано 5 из ${transactions.length} операций` 
                          : `История ваших операций (${transactions.length})`
                        }
                      </p>
                    </div>
                  </div>
                  <Link href="/dashboard/transactions">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="border-2 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm font-bold"
                      >
                        Все транзакции →
                      </Button>
                    </motion.div>
                  </Link>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <TransactionsList limit={5} />
                </div>
              </div>
            </motion.div>

            {/* Status Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <motion.div whileHover={{ scale: 1.05, rotate: 1 }} transition={{ type: "spring" }}>
                <Card className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 text-white shadow-2xl border-2 border-yellow-400/50 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <CardContent className="p-8 text-center relative z-10">
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="flex items-center justify-center mb-4"
                    >
                      <div className="p-4 bg-white/20 rounded-2xl">
                        <User className="h-10 w-10" />
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-black mb-3">👤 Статус аккаунта</h3>
                    <motion.p 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-3xl font-black mb-2"
                    >
                      {userData.status === 'active' ? 'Активный' : 
                       userData.status === 'pending' ? 'На проверке' :
                       userData.status === 'suspended' ? 'Заблокирован' : 'Активный'}
                    </motion.p>
                    <div className="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                      <p className="text-sm font-bold">
                        {userData.email_verified ? '✓ Верифицированный пользователь' : '⏳ Требуется верификация'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, rotate: -1 }} transition={{ type: "spring" }}>
                <Card className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl border-2 border-blue-400/50 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <CardContent className="p-8 text-center relative z-10">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex items-center justify-center mb-4"
                    >
                      <div className="p-4 bg-white/20 rounded-2xl">
                        <Shield className="h-10 w-10" />
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-black mb-3">🛡️ Безопасность</h3>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      {userData.email_verified ? (
                        <>
                          <CheckCircle className="h-6 w-6 text-green-400" />
                          <p className="text-3xl font-black">Защищен</p>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-6 w-6 text-yellow-400" />
                          <p className="text-3xl font-black">Частично</p>
                        </>
                      )}
                    </div>
                    <div className="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                      <p className="text-sm font-bold">
                        {userData.email_verified ? '✓ Аккаунт верифицирован' : '⚠️ Завершите верификацию'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, rotate: 1 }} transition={{ type: "spring" }}>
                <Card className="bg-gradient-to-br from-red-500 via-pink-500 to-rose-600 text-white shadow-2xl border-2 border-red-400/50 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-400/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <CardContent className="p-8 text-center relative z-10">
                    <motion.div 
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="flex items-center justify-center mb-4"
                    >
                      <div className="p-4 bg-white/20 rounded-2xl">
                        <Globe className="h-10 w-10" />
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-black mb-3">🌍 Локация</h3>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <MapPin className="h-6 w-6" />
                      <p className="text-3xl font-black">
                        {userData.country ? getCountryName(userData.country) : 'Не указана'}
                      </p>
                    </div>
                    <div className="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                      <p className="text-sm font-bold flex items-center justify-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        {userData.city ? `${userData.city}, ${getCountryName(userData.country)}` : 'Подключено к БД'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  console.log("Dashboard: Page component rendering")
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}