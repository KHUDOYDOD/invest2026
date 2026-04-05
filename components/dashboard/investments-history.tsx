"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

interface Investment {
  id: string
  amount: number
  daily_profit: number
  total_profit: number
  start_date: string
  end_date: string
  status: string
  plan_name: string
}

export function InvestmentsHistory() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
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
        throw new Error('Ошибка загрузки данных')
      }
      
      const data = await response.json()
  // Фильтруем только завершенные инвестиции
  const completedInvestments = (data.investments || []).filter(
    (inv: any) => inv.status.toLowerCase() === 'completed'
  )
      setInvestments(completedInvestments)
    } catch (error) {
      console.error("Error loading history:", error)
      setError(error instanceof Error ? error.message : "Ошибка загрузки истории")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-white/40" />
        <span className="ml-3 text-white/60">Загрузка истории...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={loadHistory} variant="outline" className="border-white/20 text-white">
          Попробовать снова
        </Button>
      </div>
    )
  }

  if (investments.length === 0) {
    return (
      <div className="w-full py-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="p-4 bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-full mb-2 border-2 border-gray-400/30">
            <CheckCircle className="h-16 w-16 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">📦 Архив пуст</h3>
          <p className="text-gray-400 max-w-md">
            Здесь будут отображаться ваши завершенные инвестиции. Когда срок активной инвестиции истечет, она автоматически переместится в архив.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30">
          <p className="text-blue-200 text-sm mb-2 font-medium">Всего завершено</p>
          <p className="text-4xl font-black text-white">{investments.length}</p>
          <p className="text-blue-300 text-sm mt-1">инвестиций</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
          <p className="text-green-200 text-sm mb-2 font-medium">Общая прибыль</p>
          <p className="text-4xl font-black text-white">
            ${investments.reduce((sum, inv) => sum + Number(inv.total_profit || 0), 0).toLocaleString()}
          </p>
          <p className="text-green-300 text-sm mt-1">заработано</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
          <p className="text-purple-200 text-sm mb-2 font-medium">Средний ROI</p>
          <p className="text-4xl font-black text-white">
            {(investments.reduce((sum, inv) => {
              const roi = (Number(inv.total_profit || 0) / Number(inv.amount || 1)) * 100
              return sum + roi
            }, 0) / investments.length).toFixed(1)}%
          </p>
          <p className="text-purple-300 text-sm mt-1">доходность</p>
        </div>
      </div>

      {/* Completed Investments List */}
      {investments.map((investment, index) => {
        const roi = ((Number(investment.total_profit || 0) / Number(investment.amount || 1)) * 100).toFixed(1)
        const totalReturn = Number(investment.amount || 0) + Number(investment.total_profit || 0)
        
        return (
          <div
            key={investment.id}
            className="relative bg-gradient-to-br from-gray-900/90 via-slate-900/20 to-gray-900/20 backdrop-blur-xl border-2 border-white/10 rounded-3xl p-6 animate-slide-up overflow-hidden group hover:border-white/20 transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Animated Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-blue-500/30 to-green-500/30 rounded-xl border border-blue-400/30">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-black text-white">{investment.plan_name}</h3>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1">
                      ✅ Завершена
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm">
                    📅 {formatDate(investment.start_date)} → {formatDate(investment.end_date)}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    ${Number(investment.amount || 0).toLocaleString()}
                  </div>
                  <p className="text-gray-400 text-sm font-medium">Инвестировано</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-5 border border-green-400/30">
                  <p className="text-green-200 text-sm mb-2 font-medium flex items-center">
                    <span className="mr-2">💰</span>
                    Заработано
                  </p>
                  <p className="text-3xl font-black text-green-400">
                    +${Number(investment.total_profit || 0).toLocaleString()}
                  </p>
                  <p className="text-green-300 text-xs mt-1">чистая прибыль</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-5 border border-blue-400/30">
                  <p className="text-blue-200 text-sm mb-2 font-medium flex items-center">
                    <span className="mr-2">📈</span>
                    ROI
                  </p>
                  <p className="text-3xl font-black text-blue-400">
                    +{roi}%
                  </p>
                  <p className="text-blue-300 text-xs mt-1">доходность</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-5 border border-purple-400/30">
                  <p className="text-purple-200 text-sm mb-2 font-medium flex items-center">
                    <span className="mr-2">💎</span>
                    Итого получено
                  </p>
                  <p className="text-3xl font-black text-purple-400">
                    ${totalReturn.toLocaleString()}
                  </p>
                  <p className="text-purple-300 text-xs mt-1">с прибылью</p>
                </div>
              </div>

              {/* Success Badge */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-xl p-4 border border-green-400/20">
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-bold">Инвестиция успешно завершена</span>
                  <span className="text-2xl">🎉</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
