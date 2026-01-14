"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Award, 
  Save, 
  RefreshCw,
  Eye,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { toast } from "sonner"
import { AdminGuard } from "@/components/admin-guard"

interface StatisticsData {
  users_count: number
  users_change: number
  investments_amount: number
  investments_change: number
  payouts_amount: number
  payouts_change: number
  profitability_rate: number
  profitability_change: number
  updated_at?: string
}

export default function AdminStatisticsPage() {
  const [stats, setStats] = useState<StatisticsData>({
    users_count: 15420,
    users_change: 12.5,
    investments_amount: 2850000,
    investments_change: 8.3,
    payouts_amount: 1920000,
    payouts_change: 15.7,
    profitability_rate: 24.8,
    profitability_change: 3.2
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/statistics')
      
      if (response.ok) {
        const data = await response.json()
        setStats({
          users_count: data.users_count || 15420,
          users_change: data.users_change || 12.5,
          investments_amount: data.investments_amount || 2850000,
          investments_change: data.investments_change || 8.3,
          payouts_amount: data.payouts_amount || 1920000,
          payouts_change: data.payouts_change || 15.7,
          profitability_rate: data.profitability_rate || 24.8,
          profitability_change: data.profitability_change || 3.2,
          updated_at: data.updated_at
        })
      }
    } catch (error) {
      console.error('Error loading statistics:', error)
      toast.error('Ошибка загрузки статистики')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      const token = localStorage.getItem('authToken')
      const response = await fetch('/api/statistics', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(stats)
      })

      if (response.ok) {
        toast.success('Статистика успешно обновлена!')
        loadStatistics()
      } else {
        toast.error('Ошибка сохранения статистики')
      }
    } catch (error) {
      console.error('Error saving statistics:', error)
      toast.error('Ошибка сохранения статистики')
    } finally {
      setIsSaving(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}М`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}К`
    }
    return num.toLocaleString("ru-RU")
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change}%`
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowUp className="h-4 w-4 text-emerald-400" />
    ) : (
      <ArrowDown className="h-4 w-4 text-red-400" />
    )
  }

  const statsCards = [
    {
      title: "Активные инвесторы",
      value: formatNumber(stats.users_count),
      change: formatChange(stats.users_change),
      changeValue: stats.users_change,
      icon: Users,
      gradient: "from-violet-500 to-purple-600",
      field: "users"
    },
    {
      title: "Месячные инвестиции",
      value: formatNumber(stats.investments_amount),
      change: formatChange(stats.investments_change),
      changeValue: stats.investments_change,
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-600",
      field: "investments"
    },
    {
      title: "Выплачено прибыли",
      value: formatNumber(stats.payouts_amount),
      change: formatChange(stats.payouts_change),
      changeValue: stats.payouts_change,
      icon: TrendingUp,
      gradient: "from-orange-500 to-amber-600",
      field: "payouts"
    },
    {
      title: "Средняя доходность",
      value: `${stats.profitability_rate}%`,
      change: formatChange(stats.profitability_change),
      changeValue: stats.profitability_change,
      icon: Award,
      gradient: "from-pink-500 to-rose-600",
      field: "profitability"
    }
  ]

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="flex items-center justify-center min-h-screen">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span className="ml-2">Загрузка...</span>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Редактирование статистики</h1>
          <p className="text-gray-600">Управление цифрами на главной странице сайта</p>
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-4 mb-8">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Сохранить изменения
          </Button>
          
          <Button 
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Скрыть превью' : 'Показать превью'}
          </Button>

          <Button 
            onClick={loadStatistics}
            variant="outline"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить
          </Button>
        </div>

        {/* Превью */}
        {showPreview && (
          <Card className="mb-8 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 border-2 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-white">Превью на сайте</CardTitle>
              <CardDescription className="text-gray-400">Так будет выглядеть статистика на главной странице</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {statsCards.map((stat) => (
                  <div
                    key={stat.title}
                    className={`p-6 rounded-2xl border-2 bg-gradient-to-br ${stat.gradient} bg-opacity-20 backdrop-blur-xl`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.gradient} text-white mb-4`}>
                        <stat.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-4xl font-black text-white mb-2">
                        {stat.value}
                      </h3>
                      <p className="text-white text-sm font-bold mb-3">{stat.title}</p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-bold text-sm">
                        {getChangeIcon(stat.changeValue)}
                        {stat.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Форма редактирования */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Активные инвесторы */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-violet-500" />
                Активные инвесторы
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="users_count">Количество инвесторов</Label>
                <Input
                  id="users_count"
                  type="number"
                  value={stats.users_count}
                  onChange={(e) => setStats({...stats, users_count: parseInt(e.target.value) || 0})}
                  placeholder="15420"
                />
                <p className="text-sm text-gray-500 mt-1">Будет отображаться как: {formatNumber(stats.users_count)}</p>
              </div>
              <div>
                <Label htmlFor="users_change">Изменение (%)</Label>
                <Input
                  id="users_change"
                  type="number"
                  step="0.1"
                  value={stats.users_change}
                  onChange={(e) => setStats({...stats, users_change: parseFloat(e.target.value) || 0})}
                  placeholder="12.5"
                />
                <p className="text-sm text-gray-500 mt-1">Будет отображаться как: {formatChange(stats.users_change)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Месячные инвестиции */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                Месячные инвестиции
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="investments_amount">Сумма ($)</Label>
                <Input
                  id="investments_amount"
                  type="number"
                  value={stats.investments_amount}
                  onChange={(e) => setStats({...stats, investments_amount: parseInt(e.target.value) || 0})}
                  placeholder="2850000"
                />
                <p className="text-sm text-gray-500 mt-1">Будет отображаться как: {formatNumber(stats.investments_amount)}</p>
              </div>
              <div>
                <Label htmlFor="investments_change">Изменение (%)</Label>
                <Input
                  id="investments_change"
                  type="number"
                  step="0.1"
                  value={stats.investments_change}
                  onChange={(e) => setStats({...stats, investments_change: parseFloat(e.target.value) || 0})}
                  placeholder="8.3"
                />
                <p className="text-sm text-gray-500 mt-1">Будет отображаться как: {formatChange(stats.investments_change)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Выплачено прибыли */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                Выплачено прибыли
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="payouts_amount">Сумма ($)</Label>
                <Input
                  id="payouts_amount"
                  type="number"
                  value={stats.payouts_amount}
                  onChange={(e) => setStats({...stats, payouts_amount: parseInt(e.target.value) || 0})}
                  placeholder="1920000"
                />
                <p className="text-sm text-gray-500 mt-1">Будет отображаться как: {formatNumber(stats.payouts_amount)}</p>
              </div>
              <div>
                <Label htmlFor="payouts_change">Изменение (%)</Label>
                <Input
                  id="payouts_change"
                  type="number"
                  step="0.1"
                  value={stats.payouts_change}
                  onChange={(e) => setStats({...stats, payouts_change: parseFloat(e.target.value) || 0})}
                  placeholder="15.7"
                />
                <p className="text-sm text-gray-500 mt-1">Будет отображаться как: {formatChange(stats.payouts_change)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Средняя доходность */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-pink-500" />
                Средняя доходность
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="profitability_rate">Доходность (%)</Label>
                <Input
                  id="profitability_rate"
                  type="number"
                  step="0.1"
                  value={stats.profitability_rate}
                  onChange={(e) => setStats({...stats, profitability_rate: parseFloat(e.target.value) || 0})}
                  placeholder="24.8"
                />
                <p className="text-sm text-gray-500 mt-1">Будет отображаться как: {stats.profitability_rate}%</p>
              </div>
              <div>
                <Label htmlFor="profitability_change">Изменение (%)</Label>
                <Input
                  id="profitability_change"
                  type="number"
                  step="0.1"
                  value={stats.profitability_change}
                  onChange={(e) => setStats({...stats, profitability_change: parseFloat(e.target.value) || 0})}
                  placeholder="3.2"
                />
                <p className="text-sm text-gray-500 mt-1">Будет отображаться как: {formatChange(stats.profitability_change)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Информация */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Советы по заполнению</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Используйте реалистичные цифры для доверия пользователей</li>
                  <li>• Изменения в процентах могут быть положительными (+) или отрицательными (-)</li>
                  <li>• Суммы автоматически форматируются (например, 2850000 → $2.9M)</li>
                  <li>• Изменения сразу отображаются на главной странице после сохранения</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {stats.updated_at && (
          <p className="text-center text-gray-500 text-sm mt-6">
            Последнее обновление: {new Date(stats.updated_at).toLocaleString('ru-RU')}
          </p>
        )}
      </div>
    </AdminGuard>
  )
}
