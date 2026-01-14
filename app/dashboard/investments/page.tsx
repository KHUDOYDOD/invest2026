"use client"

import { cn } from "@/lib/utils"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { InvestmentPlansSelector } from "@/components/dashboard/investment-plans-selector"
import { InvestmentsList } from "@/components/dashboard/investments-list"
import { InvestmentsHistory } from "@/components/dashboard/investments-history"
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  PieChart,
  Target,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Shield,
  Zap,
  Star,
} from "lucide-react"
import { useState, useEffect } from "react"

interface InvestmentStats {
  totalInvested: number
  totalProfit: number
  activeInvestments: number
  monthlyReturn: number
  portfolioValue: number
  availableBalance: number
}

function InvestmentsContent() {
  const [stats, setStats] = useState<InvestmentStats>({
    totalInvested: 0,
    totalProfit: 0,
    activeInvestments: 0,
    monthlyReturn: 0,
    portfolioValue: 0,
    availableBalance: 0,
  })

  // Загрузка реальных данных
  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const userId = localStorage.getItem("userId")
        
        if (!token || !userId) return
        
        const response = await fetch(`/api/dashboard/all?userId=${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          const user = data.user
          const investments = data.investments || []
          
          const totalInvested = investments.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0)
          const totalProfit = investments.reduce((sum: number, inv: any) => sum + (inv.total_profit || 0), 0)
          
          setStats({
            totalInvested: totalInvested,
            totalProfit: totalProfit,
            activeInvestments: investments.filter((inv: any) => inv.status === 'active').length,
            monthlyReturn: totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0,
            portfolioValue: totalInvested + totalProfit,
            availableBalance: user?.balance || 0,
          })
        }
      } catch (error) {
        console.error("Error loading investment stats:", error)
      }
    }
    
    loadStats()
  }, [])

  const [selectedTab, setSelectedTab] = useState<"plans" | "active" | "history">("plans")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <DashboardHeader />

      <div className="flex relative z-10">
        <DashboardNav activeItem="investments" />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden">
              {/* Animated Orbs */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
              
              <div className="relative z-10 text-center space-y-4">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-full px-6 py-3 border-2 border-emerald-400/30 shadow-lg mb-4">
                  <TrendingUp className="h-6 w-6 text-emerald-400 animate-pulse" />
                  <span className="text-white font-bold text-lg">Инвестиционный портфель</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                  📈 Инвестиции
                </h1>
                
                <p className="text-blue-100 max-w-2xl mx-auto text-xl font-medium">
                  Управляйте своим инвестиционным портфелем и отслеживайте доходность в реальном времени
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative bg-gradient-to-br from-blue-600/20 via-cyan-600/20 to-indigo-600/20 backdrop-blur-2xl rounded-3xl p-6 border-2 border-white/20 shadow-2xl overflow-hidden group hover:scale-105 transition-all duration-300">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-4 bg-blue-500/30 rounded-2xl">
                      <Wallet className="h-8 w-8 text-blue-300" />
                    </div>
                    <Badge className="bg-blue-500/30 text-blue-200 border-blue-400/50 px-3 py-1 font-bold">💼 Портфель</Badge>
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm mb-2 font-medium">Общая стоимость</p>
                    <p className="text-4xl font-black text-white mb-2">${stats.portfolioValue.toLocaleString()}</p>
                    <div className="flex items-center">
                      <ArrowUpRight className="h-5 w-5 text-green-400 mr-1" />
                      <span className="text-green-400 text-base font-bold">+15.2%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-emerald-600/20 via-green-600/20 to-teal-600/20 backdrop-blur-2xl rounded-3xl p-6 border-2 border-white/20 shadow-2xl overflow-hidden group hover:scale-105 transition-all duration-300">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-4 bg-emerald-500/30 rounded-2xl">
                      <TrendingUp className="h-8 w-8 text-emerald-300" />
                    </div>
                    <Badge className="bg-emerald-500/30 text-emerald-200 border-emerald-400/50 px-3 py-1 font-bold">💎 Прибыль</Badge>
                  </div>
                  <div>
                    <p className="text-emerald-200 text-sm mb-2 font-medium">Общая прибыль</p>
                    <p className="text-4xl font-black text-white mb-2">${stats.totalProfit.toLocaleString()}</p>
                    <div className="flex items-center">
                      <ArrowUpRight className="h-5 w-5 text-emerald-400 mr-1" />
                      <span className="text-emerald-400 text-base font-bold">+{stats.monthlyReturn.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-purple-600/20 via-violet-600/20 to-fuchsia-600/20 backdrop-blur-2xl rounded-3xl p-6 border-2 border-white/20 shadow-2xl overflow-hidden group hover:scale-105 transition-all duration-300">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-4 bg-purple-500/30 rounded-2xl">
                      <BarChart3 className="h-8 w-8 text-purple-300" />
                    </div>
                    <Badge className="bg-purple-500/30 text-purple-200 border-purple-400/50 px-3 py-1 font-bold">📊 Активные</Badge>
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm mb-2 font-medium">Активных планов</p>
                    <p className="text-4xl font-black text-white mb-2">{stats.activeInvestments}</p>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-purple-400 mr-1" />
                      <span className="text-purple-400 text-base font-bold">В работе</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-orange-600/20 via-amber-600/20 to-yellow-600/20 backdrop-blur-2xl rounded-3xl p-6 border-2 border-white/20 shadow-2xl overflow-hidden group hover:scale-105 transition-all duration-300">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-4 bg-orange-500/30 rounded-2xl">
                      <DollarSign className="h-8 w-8 text-orange-300" />
                    </div>
                    <Badge className="bg-orange-500/30 text-orange-200 border-orange-400/50 px-3 py-1 font-bold">💰 Баланс</Badge>
                  </div>
                  <div>
                    <p className="text-orange-200 text-sm mb-2 font-medium">Доступно</p>
                    <p className="text-4xl font-black text-white mb-2">${stats.availableBalance.toLocaleString()}</p>
                    <div className="flex items-center">
                      <Zap className="h-5 w-5 text-orange-400 mr-1" />
                      <span className="text-orange-400 text-base font-bold">Готов</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-xl">
                <div className="flex space-x-2">
                  {[
                    { id: "plans", label: "Выбрать план", icon: Target },
                    { id: "active", label: "Активные", icon: TrendingUp },
                    { id: "history", label: "История", icon: BarChart3 },
                  ].map((tab) => {
                    const Icon = tab.icon
                    return (
                      <Button
                        key={tab.id}
                        variant="ghost"
                        onClick={() => setSelectedTab(tab.id as any)}
                        className={cn(
                          "px-6 py-3 rounded-xl transition-all duration-300 font-medium",
                          selectedTab === tab.id
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                            : "text-white/70 hover:text-white hover:bg-white/10",
                        )}
                      >
                        <Icon className="h-5 w-5 mr-2" />
                        {tab.label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div key={selectedTab}>
              {selectedTab === "plans" && (
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5" />
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white relative">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <Target className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Инвестиционные планы</CardTitle>
                        <CardDescription className="text-white/90">
                          Выберите подходящий план для инвестирования
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <InvestmentPlansSelector />
                  </CardContent>
                </Card>
              )}

              {selectedTab === "active" && (
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white relative">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Активные инвестиции</CardTitle>
                        <CardDescription className="text-white/90">
                          Ваши текущие инвестиционные планы и их доходность
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <InvestmentsList />
                  </CardContent>
                </Card>
              )}

              {selectedTab === "history" && (
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-slate-500/5" />
                  <CardHeader className="bg-gradient-to-r from-gray-500 to-slate-600 text-white relative">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <BarChart3 className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">История инвестиций</CardTitle>
                        <CardDescription className="text-white/90">
                          Завершенные инвестиции и их результаты
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <InvestmentsHistory />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl border border-emerald-500/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-emerald-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <ArrowDownRight className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Пополнить баланс</h3>
                      <p className="text-white/70 text-sm">Добавить средства для инвестирования</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <PieChart className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Аналитика</h3>
                      <p className="text-white/70 text-sm">Подробная статистика доходности</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-orange-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Shield className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Страхование</h3>
                      <p className="text-white/70 text-sm">Защита ваших инвестиций</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function InvestmentsPage() {
  return (
    <AuthGuard>
      <InvestmentsContent />
    </AuthGuard>
  )
}
