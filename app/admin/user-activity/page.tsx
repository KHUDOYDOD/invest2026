"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Activity,
  Search,
  Filter,
  Download,
  Eye,
  LogIn,
  LogOut,
  DollarSign,
  TrendingUp,
  Settings,
  Mail,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
} from "lucide-react"
import { motion } from "framer-motion"

interface UserActivity {
  id: number
  userId: number
  userName: string
  userEmail: string
  userAvatar?: string
  action: string
  actionType: "login" | "logout" | "deposit" | "withdrawal" | "investment" | "profile" | "security" | "other"
  description: string
  ipAddress: string
  device: string
  location: string
  timestamp: string
  status: "success" | "failed" | "pending"
}

const mockActivities: UserActivity[] = [
  {
    id: 1,
    userId: 1,
    userName: "Иван Петров",
    userEmail: "ivan@example.com",
    action: "Вход в систему",
    actionType: "login",
    description: "Успешный вход через веб-интерфейс",
    ipAddress: "192.168.1.1",
    device: "Chrome 120 / Windows 11",
    location: "Москва, Россия",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    status: "success",
  },
  {
    id: 2,
    userId: 2,
    userName: "Мария Сидорова",
    userEmail: "maria@example.com",
    action: "Пополнение счета",
    actionType: "deposit",
    description: "Депозит на сумму $500",
    ipAddress: "192.168.1.2",
    device: "Safari 17 / iOS 17",
    location: "Санкт-Петербург, Россия",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    status: "success",
  },
  {
    id: 3,
    userId: 3,
    userName: "Алексей Иванов",
    userEmail: "alex@example.com",
    action: "Создание инвестиции",
    actionType: "investment",
    description: "Инвестиция в план Premium на $2000",
    ipAddress: "192.168.1.3",
    device: "Firefox 121 / macOS 14",
    location: "Казань, Россия",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    status: "success",
  },
  {
    id: 4,
    userId: 4,
    userName: "Елена Смирнова",
    userEmail: "elena@example.com",
    action: "Попытка входа",
    actionType: "login",
    description: "Неудачная попытка входа - неверный пароль",
    ipAddress: "192.168.1.4",
    device: "Chrome 120 / Android 14",
    location: "Новосибирск, Россия",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    status: "failed",
  },
  {
    id: 5,
    userId: 5,
    userName: "Дмитрий Козлов",
    userEmail: "dmitry@example.com",
    action: "Вывод средств",
    actionType: "withdrawal",
    description: "Запрос на вывод $1200",
    ipAddress: "192.168.1.5",
    device: "Edge 120 / Windows 11",
    location: "Екатеринбург, Россия",
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    status: "pending",
  },
  {
    id: 6,
    userId: 1,
    userName: "Иван Петров",
    userEmail: "ivan@example.com",
    action: "Изменение профиля",
    actionType: "profile",
    description: "Обновление контактной информации",
    ipAddress: "192.168.1.1",
    device: "Chrome 120 / Windows 11",
    location: "Москва, Россия",
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
    status: "success",
  },
]

export default function UserActivityPage() {
  const [activities, setActivities] = useState<UserActivity[]>(mockActivities)
  const [filteredActivities, setFilteredActivities] = useState<UserActivity[]>(mockActivities)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    let filtered = activities

    // Фильтр по поиску
    if (searchQuery) {
      filtered = filtered.filter(
        (activity) =>
          activity.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.action.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Фильтр по типу
    if (filterType !== "all") {
      filtered = filtered.filter((activity) => activity.actionType === filterType)
    }

    // Фильтр по статусу
    if (filterStatus !== "all") {
      filtered = filtered.filter((activity) => activity.status === filterStatus)
    }

    setFilteredActivities(filtered)
  }, [searchQuery, filterType, filterStatus, activities])

  const getActionIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="h-4 w-4" />
      case "logout":
        return <LogOut className="h-4 w-4" />
      case "deposit":
        return <DollarSign className="h-4 w-4" />
      case "withdrawal":
        return <TrendingUp className="h-4 w-4" />
      case "investment":
        return <TrendingUp className="h-4 w-4" />
      case "profile":
        return <Settings className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActionColor = (type: string) => {
    switch (type) {
      case "login":
        return "from-green-500 to-emerald-600"
      case "logout":
        return "from-gray-500 to-slate-600"
      case "deposit":
        return "from-blue-500 to-cyan-600"
      case "withdrawal":
        return "from-orange-500 to-red-600"
      case "investment":
        return "from-purple-500 to-pink-600"
      case "profile":
        return "from-indigo-500 to-blue-600"
      case "security":
        return "from-red-500 to-pink-600"
      default:
        return "from-gray-500 to-slate-600"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Успешно
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            Ошибка
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            В ожидании
          </Badge>
        )
      default:
        return null
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return "только что"
    if (minutes < 60) return `${minutes} мин назад`
    if (hours < 24) return `${hours} ч назад`
    return `${days} дн назад`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">
            📊 Активность пользователей
          </h1>
          <p className="text-slate-400 text-lg">Мониторинг действий пользователей в реальном времени</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
          <Download className="h-4 w-4 mr-2" />
          Экспорт
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Поиск по имени, email или действию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            >
              <option value="all">Все типы</option>
              <option value="login">Вход</option>
              <option value="logout">Выход</option>
              <option value="deposit">Депозиты</option>
              <option value="withdrawal">Выводы</option>
              <option value="investment">Инвестиции</option>
              <option value="profile">Профиль</option>
              <option value="security">Безопасность</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            >
              <option value="all">Все статусы</option>
              <option value="success">Успешно</option>
              <option value="failed">Ошибка</option>
              <option value="pending">В ожидании</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <div className="space-y-3">
        {filteredActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 bg-gradient-to-r ${getActionColor(activity.actionType)} rounded-xl flex-shrink-0`}>
                    {getActionIcon(activity.actionType)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={activity.userAvatar} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                            {activity.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-white font-medium">{activity.userName}</h3>
                          <p className="text-sm text-slate-400">{activity.userEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(activity.status)}
                        <span className="text-sm text-slate-400">{formatTime(activity.timestamp)}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-white font-medium mb-1">{activity.action}</p>
                      <p className="text-slate-400 text-sm">{activity.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {activity.location}
                      </div>
                      <div className="flex items-center gap-1">
                        {activity.device.includes("iOS") || activity.device.includes("Android") ? (
                          <Smartphone className="h-3 w-3" />
                        ) : (
                          <Monitor className="h-3 w-3" />
                        )}
                        {activity.device}
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {activity.ipAddress}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-12 text-center">
            <Activity className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-bold text-white mb-2">Нет активности</h3>
            <p className="text-slate-400">Попробуйте изменить фильтры поиска</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
