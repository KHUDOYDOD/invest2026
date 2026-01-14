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
      const completedInvestments = (data.investments || []).filter(
        (inv: any) => inv.status === 'completed'
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
      <div className="text-center py-12">
        <div className="p-4 bg-gray-500/20 rounded-2xl inline-block mb-4">
          <CheckCircle className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">История пуста</h3>
        <p className="text-white/70">
          У вас пока нет завершенных инвестиций
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {investments.map((investment, index) => (
        <div
          key={investment.id}
          className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-white">{investment.plan_name}</h3>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Завершена
                </Badge>
              </div>
              <p className="text-gray-400 mt-1">
                {formatDate(investment.start_date)} - {formatDate(investment.end_date)}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-2xl font-bold text-white">
                ${Number(investment.amount || 0).toLocaleString()}
              </div>
              <p className="text-gray-400 text-sm">Сумма инвестиции</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Заработано</p>
              <p className="text-xl font-bold text-green-400">
                +${Number(investment.total_profit || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">ROI</p>
              <p className="text-xl font-bold text-blue-400">
                +{((Number(investment.total_profit || 0) / Number(investment.amount || 1)) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
