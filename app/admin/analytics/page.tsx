"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Download,
} from "lucide-react"
import { motion } from "framer-motion"

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d") // 7d, 30d, 90d, 1y
  const [analytics, setAnalytics] = useState({
    users: {
      total: 15420,
      new: 234,
      active: 8920,
      growth: 12.5,
    },
    revenue: {
      total: 2847500,
      thisMonth: 485200,
      lastMonth: 432100,
      growth: 12.3,
    },
    investments: {
      total: 1250,
      active: 890,
      completed: 360,
      growth: 8.7,
    },
    transactions: {
      deposits: 1840,
      withdrawals: 620,
      pending: 45,
      growth: 15.2,
    },
  })

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    // Здесь будет загрузка данных из API
    setTimeout(() => setLoading(false), 1000)
  }

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className={`bg-gradient-to-br ${color} border-0 text-white`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 bg-white/20 rounded-xl`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${change >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {Math.abs(change)}%
            </div>
          </div>
          <div>
            <p className="text-white/80 text-sm mb-1">{title}</p>
            <p className="text-3xl font-bold">{value.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            📊 Аналитика
          </h1>
          <p className="text-slate-400 text-lg">
            Детальная статистика и аналитика платформы
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
            {[
              { label: "7 дней", value: "7d" },
              { label: "30 дней", value: "30d" },
              { label: "90 дней", value: "90d" },
              { label: "1 год", value: "1y" },
            ].map((range) => (
              <Button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                variant={timeRange === range.value ? "default" : "ghost"}
                size="sm"
                className={timeRange === range.value ? "bg-blue-600" : ""}
              >
                {range.label}
              </Button>
            ))}
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Всего пользователей"
          value={analytics.users.total}
          change={analytics.users.growth}
          icon={Users}
          color="from-blue-500 to-cyan-600"
        />
        <StatCard
          title="Общий доход"
          value={`$${(analytics.revenue.total / 1000).toFixed(1)}K`}
          change={analytics.revenue.growth}
          icon={DollarSign}
          color="from-green-500 to-emerald-600"
        />
        <StatCard
          title="Активные инвестиции"
          value={analytics.investments.active}
          change={analytics.investments.growth}
          icon={TrendingUp}
          color="from-purple-500 to-pink-600"
        />
        <StatCard
          title="Транзакции"
          value={analytics.transactions.deposits + analytics.transactions.withdrawals}
          change={analytics.transactions.growth}
          icon={Activity}
          color="from-orange-500 to-red-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-green-400" />
              Динамика дохода
            </CardTitle>
            <CardDescription className="text-slate-400">
              Доход за последние {timeRange === "7d" ? "7 дней" : timeRange === "30d" ? "30 дней" : timeRange === "90d" ? "90 дней" : "год"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>График будет здесь</p>
                <p className="text-sm">Интеграция с Recharts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Chart */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-400" />
              Рост пользователей
            </CardTitle>
            <CardDescription className="text-slate-400">
              Новые регистрации за период
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <LineChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>График будет здесь</p>
                <p className="text-sm">Интеграция с Recharts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Stats */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Статистика пользователей</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Новые пользователи</span>
              <span className="text-white font-bold">{analytics.users.new}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Активные пользователи</span>
              <span className="text-white font-bold">{analytics.users.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Всего пользователей</span>
              <span className="text-white font-bold">{analytics.users.total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Stats */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Статистика дохода</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Этот месяц</span>
              <span className="text-white font-bold">${analytics.revenue.thisMonth.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Прошлый месяц</span>
              <span className="text-white font-bold">${analytics.revenue.lastMonth.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Всего</span>
              <span className="text-white font-bold">${analytics.revenue.total.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Stats */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Статистика транзакций</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Депозиты</span>
              <span className="text-green-400 font-bold">{analytics.transactions.deposits}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Выводы</span>
              <span className="text-orange-400 font-bold">{analytics.transactions.withdrawals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">В ожидании</span>
              <span className="text-yellow-400 font-bold">{analytics.transactions.pending}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
