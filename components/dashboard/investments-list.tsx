"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, AlertCircle, Plus, Clock, TrendingUp, Calendar, DollarSign, Target, Zap } from "lucide-react"
import Link from "next/link"

interface Investment {
  id: string
  amount: number
  daily_profit: number
  total_profit: number
  start_date: string
  end_date: string
  status: string
  plan_name: string
  days_left: number
  progress: number
  daily_return_rate?: number
  duration_days?: number
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

export function InvestmentsList() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timers, setTimers] = useState<{ [key: string]: TimeLeft }>({})
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Функция для расчета оставшегося времени
  const calculateTimeLeft = (endDate: string): TimeLeft => {
    const end = new Date(endDate).getTime()
    const now = new Date().getTime()
    const difference = end - now

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference
    }
  }

  // Обновление таймеров каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers: { [key: string]: TimeLeft } = {}
      investments.forEach(inv => {
        newTimers[inv.id] = calculateTimeLeft(inv.end_date)
      })
      setTimers(newTimers)
    }, 1000)

    return () => clearInterval(interval)
  }, [investments])

  const loadInvestments = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem("authToken")
      const userId = localStorage.getItem("userId")
      
      if (!token || !userId) {
        throw new Error("Токен не найден")
      }
      
      const response = await fetch(`/api/dashboard/all?userId=${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear()
          window.location.href = "/login"
          return
        }
        throw new Error('Ошибка загрузки данных')
      }
      
      const data = await response.json()
      setInvestments(data.investments || [])
    } catch (error) {
      console.error("Error loading investments:", error)
      setError(error instanceof Error ? error.message : "Ошибка загрузки инвестиций")
      setInvestments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInvestments()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Активна</Badge>
      case "completed":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Завершена</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Ожидание</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-t-blue-600 border-r-transparent border-b-blue-600 border-l-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Загрузка инвестиций...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full py-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="p-3 rounded-full bg-red-500/20">
            <AlertCircle className="h-6 w-6 text-red-400" />
          </div>
          <p className="text-red-400">{error}</p>
          <Button
            onClick={loadInvestments}
            variant="outline"
            className="border-gray-800 text-gray-400 hover:bg-gray-800/50"
          >
            Попробовать снова
          </Button>
        </div>
      </div>
    )
  }

  if (investments.length === 0) {
    return (
      <div className="w-full py-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-gray-400">У вас пока нет активных инвестиций.</p>
          <Link href="/dashboard/investments">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Начать инвестировать
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Modal with details */}
      {showDetails && selectedInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-gradient-to-br from-gray-900 via-blue-900/50 to-purple-900/50 backdrop-blur-xl border-2 border-white/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            {/* Close button */}
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 p-2 bg-red-500/20 hover:bg-red-500/30 rounded-full border border-red-400/30 transition-all z-10"
            >
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-full px-6 py-3 border-2 border-blue-400/30 shadow-lg mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-400 animate-pulse" />
                  <span className="text-white font-bold text-lg">Детали инвестиции</span>
                </div>
                <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                  {selectedInvestment.plan_name}
                </h2>
                {getStatusBadge(selectedInvestment.status)}
              </div>

              {/* Main info grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-blue-500/30 rounded-xl">
                      <DollarSign className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Сумма инвестиции</p>
                      <p className="text-3xl font-black text-white">${selectedInvestment.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Дневная ставка:</span>
                      <span className="text-white font-bold">{selectedInvestment.daily_return_rate || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Срок:</span>
                      <span className="text-white font-bold">{selectedInvestment.duration_days || 30} дней</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-green-500/30 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Заработано</p>
                      <p className="text-3xl font-black text-white">${selectedInvestment.total_profit.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Дневная прибыль:</span>
                      <span className="text-green-400 font-bold">${selectedInvestment.daily_profit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ROI:</span>
                      <span className="text-green-400 font-bold">+{((selectedInvestment.total_profit / selectedInvestment.amount) * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 mb-8">
                <h3 className="text-white font-bold text-xl mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                  Временная шкала
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Дата начала</p>
                      <p className="text-white font-bold">{formatDate(selectedInvestment.start_date)}</p>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{ width: `${selectedInvestment.progress}%` }}
                        />
                      </div>
                      <p className="text-center text-white text-sm mt-1">{Math.round(selectedInvestment.progress)}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Дата окончания</p>
                      <p className="text-white font-bold">{formatDate(selectedInvestment.end_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-orange-400">
                    <Clock className="h-5 w-5" />
                    <span className="font-bold">Осталось: {selectedInvestment.days_left} дней</span>
                  </div>
                </div>
              </div>

              {/* Countdown timer */}
              {timers[selectedInvestment.id] && timers[selectedInvestment.id].total > 0 && (
                <div className="bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 backdrop-blur-xl border border-orange-400/30 rounded-2xl p-6 mb-8">
                  <h3 className="text-white font-bold text-xl mb-4 flex items-center justify-center">
                    <Clock className="h-5 w-5 mr-2 text-orange-400 animate-pulse" />
                    Обратный отсчет
                  </h3>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'Дней', value: timers[selectedInvestment.id].days, icon: '📅' },
                      { label: 'Часов', value: timers[selectedInvestment.id].hours, icon: '⏰' },
                      { label: 'Минут', value: timers[selectedInvestment.id].minutes, icon: '⏱️' },
                      { label: 'Секунд', value: timers[selectedInvestment.id].seconds, icon: '⚡' }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                        <div className="text-3xl mb-1">{item.icon}</div>
                        <div className="text-4xl font-black text-white mb-1 tabular-nums">
                          {String(item.value).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-gray-300 font-medium">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-gray-400 text-sm mb-2">Ожидаемая прибыль</p>
                  <p className="text-2xl font-black text-purple-400">
                    ${(selectedInvestment.amount * ((selectedInvestment.daily_return_rate || 0) / 100) * (selectedInvestment.duration_days || 30)).toFixed(2)}
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-gray-400 text-sm mb-2">Прошло дней</p>
                  <p className="text-2xl font-black text-blue-400">
                    {(selectedInvestment.duration_days || 30) - selectedInvestment.days_left}
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-gray-400 text-sm mb-2">Статус</p>
                  <p className="text-2xl font-black text-green-400">
                    {selectedInvestment.status === 'active' ? 'Активна' : selectedInvestment.status}
                  </p>
                </div>
              </div>

              {/* Close button */}
              <Button
                onClick={() => setShowDetails(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg py-6 rounded-xl shadow-2xl"
              >
                Закрыть
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {investments.map((investment, index) => {
        const timer = timers[investment.id] || { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
        const dailyReturnRate = investment.daily_return_rate || 0
        const totalReturn = investment.amount > 0 ? (investment.total_profit / investment.amount) * 100 : 0
        const expectedProfit = investment.amount * (dailyReturnRate / 100) * (investment.duration_days || 30)
        
        return (
          <div
            key={investment.id}
            className="relative bg-gradient-to-br from-gray-900/90 via-blue-900/20 to-purple-900/20 backdrop-blur-xl border-2 border-white/10 rounded-3xl p-6 animate-slide-up overflow-hidden group hover:border-white/20 transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Animated Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white">{investment.plan_name}</h3>
                    {getStatusBadge(investment.status)}
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <p className="text-sm">Начало: {formatDate(investment.start_date)}</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    ${Number(investment.amount || 0).toLocaleString()}
                  </div>
                  <p className="text-gray-400 text-sm font-medium">Сумма инвестиции</p>
                </div>
              </div>

              {/* Countdown Timer */}
              {timer.total > 0 && (
                <div className="mb-6 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 backdrop-blur-xl border border-orange-400/30 rounded-2xl p-6">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Clock className="h-5 w-5 text-orange-400 animate-pulse" />
                    <h4 className="text-white font-bold text-lg">⏰ Обратный отсчет до завершения</h4>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'Дней', value: timer.days, icon: '📅' },
                      { label: 'Часов', value: timer.hours, icon: '⏰' },
                      { label: 'Минут', value: timer.minutes, icon: '⏱️' },
                      { label: 'Секунд', value: timer.seconds, icon: '⚡' }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                        <div className="text-3xl mb-1">{item.icon}</div>
                        <div className="text-3xl font-black text-white mb-1 tabular-nums">
                          {String(item.value).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-gray-300 font-medium">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <p className="text-gray-300 text-xs font-medium">Дневная прибыль</p>
                  </div>
                  <p className="text-2xl font-black text-green-400">${Number(investment.daily_profit || 0).toFixed(2)}</p>
                  <p className="text-xs text-green-300 mt-1">+{dailyReturnRate}% в день</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    <p className="text-gray-300 text-xs font-medium">Заработано</p>
                  </div>
                  <p className="text-2xl font-black text-blue-400">${Number(investment.total_profit || 0).toFixed(2)}</p>
                  <p className="text-xs text-blue-300 mt-1">+{totalReturn.toFixed(1)}% ROI</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-4 w-4 text-purple-400" />
                    <p className="text-gray-300 text-xs font-medium">Ожидается</p>
                  </div>
                  <p className="text-2xl font-black text-purple-400">${expectedProfit.toFixed(2)}</p>
                  <p className="text-xs text-purple-300 mt-1">К концу срока</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-sm rounded-xl p-4 border border-orange-400/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4 text-orange-400" />
                    <p className="text-gray-300 text-xs font-medium">Осталось дней</p>
                  </div>
                  <p className="text-2xl font-black text-orange-400">{investment.days_left}</p>
                  <p className="text-xs text-orange-300 mt-1">из {investment.duration_days || 30}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-white font-bold flex items-center">
                    <span className="mr-2">📊</span>
                    Прогресс инвестиции
                  </p>
                  <p className="text-white font-bold text-lg">{Math.round(investment.progress)}%</p>
                </div>
                <div className="relative h-4 bg-gray-800/50 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${investment.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">Завершение: <span className="text-white font-bold">{formatDate(investment.end_date)}</span></span>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    setSelectedInvestment(investment)
                    setShowDetails(true)
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  Подробнее
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )
      })}
      </div>
    </>
  )
}
