"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, Filter, Download, Users, Globe, Clock, Star, DollarSign, TrendingUp, UserCheck, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface User {
  id: string
  name: string
  email: string
  joinedDate: string
  country: string
  country_name?: string
  balance?: number
  total_invested?: number
  total_profit?: number
  referrals_count?: number
  last_activity?: string
  status?: string
}

const countryFlags: Record<string, string> = {
  'RU': '🇷🇺', 'US': '🇺🇸', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸', 'CA': '🇨🇦',
  'AU': '🇦🇺', 'JP': '🇯🇵', 'KR': '🇰🇷', 'CN': '🇨🇳', 'IN': '🇮🇳', 'BR': '🇧🇷', 'MX': '🇲🇽', 'UA': '🇺🇦',
  'PL': '🇵🇱', 'NL': '🇳🇱', 'SE': '🇸🇪', 'NO': '🇳🇴', 'TR': '🇹🇷', 'AR': '🇦🇷', 'CL': '🇨🇱', 'CO': '🇨🇴',
  'VE': '🇻🇪', 'PT': '🇵🇹', 'GR': '🇬🇷', 'FI': '🇫🇮', 'DK': '🇩🇰', 'AT': '🇦🇹'
}

const countryNames: Record<string, string> = {
  'RU': 'Россия', 'US': 'США', 'GB': 'Великобритания', 'DE': 'Германия', 'FR': 'Франция',
  'IT': 'Италия', 'ES': 'Испания', 'CA': 'Канада', 'AU': 'Австралия', 'JP': 'Япония',
  'KR': 'Южная Корея', 'CN': 'Китай', 'IN': 'Индия', 'BR': 'Бразилия', 'MX': 'Мексика',
  'UA': 'Украина', 'PL': 'Польша', 'NL': 'Нидерланды', 'SE': 'Швеция', 'NO': 'Норвегия',
  'TR': 'Турция', 'AR': 'Аргентина', 'CL': 'Чили', 'CO': 'Колумбия', 'VE': 'Венесуэла',
  'PT': 'Португалия', 'GR': 'Греция', 'FI': 'Финляндия', 'DK': 'Дания', 'AT': 'Австрия'
}

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCountry, setFilterCountry] = useState("all")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/all-users')
        if (response.ok) {
          const data = await response.json()
          if (data.success && Array.isArray(data.data)) {
            setUsers(data.data)
          }
        }
      } catch (err) {
        console.error("Ошибка загрузки:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Не указано'
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Неверная дата'
    
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'Неизвестно'
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Неверная дата'
    
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

  const generateNickname = (name: string, email: string) => {
    if (name && name !== 'Anonymous User') {
      const nameParts = name.split(' ')
      if (nameParts.length > 1) {
        return nameParts[0] + nameParts[1].charAt(0)
      }
      return nameParts[0]
    }
    const emailPart = email.split('@')[0]
    return emailPart.charAt(0).toUpperCase() + emailPart.slice(1, 8)
  }

  const filteredUsers = users.filter((user) => {
    const nickname = generateNickname(user.name, user.email)
    const matchesSearch = nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterCountry === "all" || user.country === filterCountry
    return matchesSearch && matchesFilter
  })

  const uniqueCountries = Array.from(new Set(users.map(u => u.country).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-emerald-500 border-r-transparent border-b-teal-500 border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-xl">Загрузка участников...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 py-12 pt-24">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Назад
                  </Button>
                </Link>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent">
                    Все участники
                  </h1>
                  <p className="text-slate-400 mt-2">Полный список зарегистрированных пользователей</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Экспорт
              </Button>
            </div>
          </motion.div>

          {/* Статистика */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Всего участников</p>
                  <p className="text-2xl font-bold text-white">{filteredUsers.length}</p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <Users className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-300 text-sm">💰 Общий баланс</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    ${users.reduce((sum, u) => sum + (u.balance || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <DollarSign className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm">💎 Инвестировано</p>
                  <p className="text-2xl font-bold text-blue-400">
                    ${users.reduce((sum, u) => sum + (u.total_invested || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Стран</p>
                  <p className="text-2xl font-bold text-purple-400">{uniqueCountries.length}</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Globe className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Новых сегодня</p>
                  <p className="text-2xl font-bold text-teal-400">
                    {filteredUsers.filter(u => {
                      if (!u.joinedDate) return false
                      const today = new Date()
                      const userDate = new Date(u.joinedDate)
                      if (isNaN(userDate.getTime())) return false
                      return userDate.toDateString() === today.toDateString()
                    }).length}
                  </p>
                </div>
                <div className="p-3 bg-teal-500/20 rounded-xl">
                  <Clock className="h-6 w-6 text-teal-400" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Фильтры */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex flex-col lg:flex-row gap-4 justify-between items-center"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Поиск по имени пользователя..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-emerald-500/50"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterCountry === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCountry("all")}
                className={`${
                  filterCountry === "all"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                    : "bg-white/10 border-white/20 text-slate-300 hover:bg-white/20"
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Все страны
              </Button>
              {uniqueCountries.slice(0, 4).map((country) => (
                <Button
                  key={country}
                  variant={filterCountry === country ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterCountry(country || "all")}
                  className={`${
                    filterCountry === country
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                      : "bg-white/10 border-white/20 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  {country && countryFlags[country]} {country && countryNames[country]}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Сетка участников */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {filteredUsers.map((user, index) => {
              const nickname = generateNickname(user.name, user.email)
              const countryFlag = user.country ? countryFlags[user.country] || '🌍' : '🌍'
              const countryName = user.country ? countryNames[user.country] || 'Неизвестно' : 'Неизвестно'
              const isVip = (user.total_invested || 0) > 10000
              const isActive = user.last_activity && 
                               new Date(user.last_activity).getTime() > 0 && 
                               new Date(user.last_activity) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border ${isVip ? 'border-yellow-500/30' : 'border-white/20'} rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group hover:scale-105 hover:shadow-2xl relative overflow-hidden`}
                >
                  {/* VIP Badge */}
                  {isVip && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        VIP
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${isVip ? 'from-yellow-500 to-orange-600' : 'from-emerald-500 to-teal-600'} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                      {nickname.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          {nickname}
                        </h3>
                        {isActive && (
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" title="Активен"></div>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Локация */}
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl" title={countryName}>
                        {countryFlag}
                      </span>
                      <span className="text-slate-300 font-medium">{countryName}</span>
                    </div>

                    {/* Финансовая информация */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-slate-400 text-xs">Баланс</p>
                        <p className="text-emerald-400 font-bold">
                          ${(user.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-slate-400 text-xs">Инвестировано</p>
                        <p className="text-blue-400 font-bold">
                          ${(user.total_invested || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-slate-400 text-xs">Прибыль</p>
                        <p className="text-purple-400 font-bold">
                          ${(user.total_profit || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-slate-400 text-xs">Рефералы</p>
                        <p className="text-yellow-400 font-bold">
                          {user.referrals_count || 0}
                        </p>
                      </div>
                    </div>

                    {/* Статус и время */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4 text-emerald-400" />
                        <span className="text-emerald-400 text-sm font-medium">
                          {isActive ? 'АКТИВЕН' : 'НЕАКТИВЕН'}
                        </span>
                      </div>
                      <span className="text-slate-500 text-xs">
                        {user.joinedDate ? formatTimeAgo(user.joinedDate) : 'Неизвестно'}
                      </span>
                    </div>

                    <div className="pt-2">
                      <p className="text-slate-400 text-xs">
                        Зарегистрирован: {user.joinedDate ? formatDate(user.joinedDate) : 'Не указано'}
                      </p>
                      {user.last_activity && (
                        <p className="text-slate-500 text-xs mt-1">
                          Последняя активность: {formatTimeAgo(user.last_activity)}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {filteredUsers.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">👥</div>
              <p className="text-slate-400 text-xl">Участники не найдены</p>
              <p className="text-slate-500 mt-2">Попробуйте изменить параметры поиска</p>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}