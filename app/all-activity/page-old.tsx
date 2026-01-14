"use client"

import { useState, useEffect } from "react"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, Zap, Clock, Search, Filter, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface Activity {
  id: string
  type: string
  amount?: number
  user_name: string
  time: string
  plan_name?: string
}

export default function AllActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)

        const response = await fetch('/api/user-activity')
        if (response.ok) {
          const data = await response.json()
          if (data.success && Array.isArray(data.data)) {
            const formattedActivities = data.data.map((activity: any) => ({
              id: activity.id,
              type: activity.type,
              amount: activity.amount,
              user_name: activity.user_name,
              time: formatTimeAgo(new Date(activity.time)),
              plan_name: activity.plan_name,
            }))
            setActivities(formattedActivities)
          } else {
            setActivities([])
          }
        } else {
          console.warn("Failed to fetch user activity, showing empty list")
          setActivities([])
        }
      } catch (err) {
        console.error("Ошибка загрузки активности:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "только что"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? "минуту" : minutes < 5 ? "минуты" : "минут"} назад`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? "час" : hours < 5 ? "часа" : "часов"} назад`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"} назад`
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowUpRight className="h-5 w-5" />
      case "withdrawal":
        return <ArrowDownRight className="h-5 w-5" />
      case "investment":
        return <TrendingUp className="h-5 w-5" />
      case "referral":
        return <Users className="h-5 w-5" />
      case "profit":
        return <Zap className="h-5 w-5" />
      default:
        return <TrendingUp className="h-5 w-5" />
    }
  }

  const getActivityConfig = (type: string) => {
    switch (type) {
      case "deposit":
        return {
          gradient: "from-emerald-500 to-teal-600",
          bgGradient: "from-emerald-500/20 to-teal-600/20",
          borderColor: "border-emerald-500/30",
          textColor: "text-emerald-400",
          shadowColor: "shadow-emerald-500/25",
          icon: "💰",
          name: "Пополнение",
          sign: "+",
          description: "Пополнение баланса"
        }
      case "withdrawal":
        return {
          gradient: "from-red-500 to-pink-600",
          bgGradient: "from-red-500/20 to-pink-600/20",
          borderColor: "border-red-500/30",
          textColor: "text-red-400",
          shadowColor: "shadow-red-500/25",
          icon: "📤",
          name: "Вывод",
          sign: "-",
          description: "Вывод средств"
        }
      case "investment":
        return {
          gradient: "from-blue-500 to-indigo-600",
          bgGradient: "from-blue-500/20 to-indigo-600/20",
          borderColor: "border-blue-500/30",
          textColor: "text-blue-400",
          shadowColor: "shadow-blue-500/25",
          icon: "💎",
          name: "Инвестиция",
          sign: "",
          description: "Создание инвестиции"
        }
      case "referral":
        return {
          gradient: "from-yellow-500 to-orange-600",
          bgGradient: "from-yellow-500/20 to-orange-600/20",
          borderColor: "border-yellow-500/30",
          textColor: "text-yellow-400",
          shadowColor: "shadow-yellow-500/25",
          icon: "👥",
          name: "Реферал",
          sign: "+",
          description: "Реферальный доход"
        }
      case "profit":
        return {
          gradient: "from-purple-500 to-violet-600",
          bgGradient: "from-purple-500/20 to-violet-600/20",
          borderColor: "border-purple-500/30",
          textColor: "text-purple-400",
          shadowColor: "shadow-purple-500/25",
          icon: "📈",
          name: "Прибыль",
          sign: "+",
          description: "Прибыль от инвестиций"
        }
      default:
        return {
          gradient: "from-gray-500 to-slate-600",
          bgGradient: "from-gray-500/20 to-slate-600/20",
          borderColor: "border-gray-500/30",
          textColor: "text-gray-400",
          shadowColor: "shadow-gray-500/25",
          icon: "⚡",
          name: "Операция",
          sign: "",
          description: "Операция"
        }
    }
  }

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "deposit":
        return `пополнил счет на $${activity.amount?.toLocaleString()}`
      case "withdrawal":
        return `вывел $${activity.amount?.toLocaleString()}`
      case "investment":
        return `инвестировал $${activity.amount?.toLocaleString()} в ${activity.plan_name || "план"}`
      case "referral":
        return `получил $${activity.amount?.toLocaleString()} с рефералов`
      case "profit":
        return `получил $${activity.amount?.toLocaleString()} прибыли`
      default:
        return `совершил операцию на $${activity.amount?.toLocaleString()}`
    }
  }

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || activity.type === filterType
    return matchesSearch && matchesFilter
  })

  const uniqueTypes = Array.from(new Set(activities.map(a => a.type)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
        {/* Header */}
        <Header />

        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10 pt-32 pb-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-cyan-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full mx-auto mb-4 animate-spin"></div>
            <p className="text-slate-300 text-lg">Загрузка активности...</p>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      {/* Header */}
      <Header />

      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-emerald-600/5 to-teal-600/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl relative z-10 pt-20 pb-20 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden mb-12"
        >
          <div className="absolute top-0 left-0 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-6">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Вернуться на главную
            </Link>
            
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl rounded-full px-6 py-3 border-2 border-cyan-400/30 shadow-lg mb-6"
              >
                <Zap className="h-6 w-6 text-cyan-400" />
                <span className="text-white font-bold text-lg">Полная история активности</span>
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
                ⚡ Вся активность
              </h1>
              
              <p className="text-blue-100 max-w-2xl mx-auto text-xl font-medium">
                Полная история всех операций пользователей на платформе
              </p>
            </div>
          </div>
        </motion.div>

        {/* Фильтры */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 flex flex-col sm:flex-row gap-4 justify-between items-center"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Поиск по имени пользователя..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-cyan-500/50"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
              className={`${
                filterType === "all"
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Все ({activities.length})
            </Button>
            {uniqueTypes.map((type) => {
              const count = activities.filter(a => a.type === type).length
              const typeNames: Record<string, string> = {
                deposit: "Пополнения",
                withdrawal: "Выводы", 
                investment: "Инвестиции",
                profit: "Прибыль",
                referral: "Рефералы"
              }
              
              return (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(type)}
                  className={`${
                    filterType === type
                      ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {typeNames[type] || type} ({count})
                </Button>
              )
            })}
          </div>
        </motion.div>

        {/* Статистика */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{filteredActivities.length}</div>
            <div className="text-slate-300 text-sm">Всего операций</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">
              {activities.filter(a => a.type === 'deposit').length}
            </div>
            <div className="text-slate-300 text-sm">Пополнений</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {activities.filter(a => a.type === 'investment').length}
            </div>
            <div className="text-slate-300 text-sm">Инвестиций</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {activities.filter(a => a.type === 'withdrawal').length}
            </div>
            <div className="text-slate-300 text-sm">Выводов</div>
          </div>
        </motion.div>

        {/* Список активности */}
        {filteredActivities.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">⚡</div>
              <h3 className="text-2xl font-bold text-white mb-4">Активность не найдена</h3>
              <p className="text-slate-400 text-lg">
                Попробуйте изменить фильтры или поисковый запрос
              </p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {filteredActivities.map((activity, index) => {
            const config = getActivityConfig(activity.type)

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 rounded-2xl border ${config.borderColor} bg-gradient-to-br ${config.bgGradient} backdrop-blur-xl shadow-xl ${config.shadowColor} hover:shadow-2xl transition-all duration-500 relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex items-start relative z-10">
                  <div
                    className={`p-3 rounded-2xl bg-gradient-to-r ${config.gradient} text-white shadow-lg mr-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>

                  <div className="flex-1">
                    <p className="text-white text-lg leading-relaxed">
                      <span className="font-semibold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                        {activity.user_name}
                      </span>{" "}
                      {getActivityText(activity)}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <p className="text-slate-400 text-sm font-medium">{activity.time}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}