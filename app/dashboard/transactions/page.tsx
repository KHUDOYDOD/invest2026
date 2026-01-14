"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { TransactionsList } from "@/components/dashboard/transactions-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { motion } from "framer-motion"


function TransactionsContent() {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalProfit: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactionStats()
  }, [])

  const fetchTransactionStats = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const userId = localStorage.getItem("userId")

      if (!token || !userId) {
        return
      }

      const response = await fetch(`/api/transactions/stats?userId=${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats({
          totalTransactions: data.totalTransactions || 0,
          totalDeposits: parseFloat(data.totalDeposits) || 0,
          totalWithdrawals: parseFloat(data.totalWithdrawals) || 0,
          totalProfit: parseFloat(data.totalProfit) || 0
        })
      }
    } catch (error) {
      console.error("Error fetching transaction stats:", error)
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float delay-2000"></div>

        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
      </div>

      <DashboardHeader />

      <div className="flex relative z-10">
        <DashboardNav activeItem="transactions" />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden"
            >
              {/* Animated Orbs */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
              
              <div className="relative z-10 text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-xl rounded-full px-8 py-4 border-4 border-black shadow-2xl mb-4 hover:bg-white hover:scale-105 transition-all duration-300"
                >
                  <Receipt className="h-6 w-6 text-green-600 animate-pulse" />
                  <span className="text-black font-bold text-lg">История операций</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                  💳 Транзакции
                </h1>
                
                <p className="text-blue-100 max-w-2xl mx-auto text-xl font-medium">
                  Отслеживайте все ваши операции и их статусы в реальном времени
                </p>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring" }}>
                <Card className="bg-white/95 backdrop-blur-xl border-4 border-blue-500 shadow-2xl relative overflow-hidden group hover:shadow-blue-500/50 transition-all duration-300">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-blue-600 text-sm font-bold mb-1">📊 Всего</p>
                        <p className="text-gray-600 text-xs">Транзакций</p>
                      </div>
                      <motion.div 
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="p-4 bg-blue-100 rounded-2xl"
                      >
                        <Receipt className="h-8 w-8 text-blue-600" />
                      </motion.div>
                    </div>
                    <p className="text-4xl font-black text-blue-600">{loading ? "..." : stats.totalTransactions}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring" }}>
                <Card className="bg-white/95 backdrop-blur-xl border-4 border-green-500 shadow-2xl relative overflow-hidden group hover:shadow-green-500/50 transition-all duration-300">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-green-600 text-sm font-bold mb-1">💰 Пополнений</p>
                        <p className="text-gray-600 text-xs">Депозиты</p>
                      </div>
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="p-4 bg-green-100 rounded-2xl"
                      >
                        <ArrowDownRight className="h-8 w-8 text-green-600" />
                      </motion.div>
                    </div>
                    <p className="text-4xl font-black text-green-600">{loading ? "..." : `$${stats.totalDeposits.toFixed(2)}`}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring" }}>
                <Card className="bg-white/95 backdrop-blur-xl border-4 border-red-500 shadow-2xl relative overflow-hidden group hover:shadow-red-500/50 transition-all duration-300">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-red-600 text-sm font-bold mb-1">💸 Выводов</p>
                        <p className="text-gray-600 text-xs">Снятия</p>
                      </div>
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="p-4 bg-red-100 rounded-2xl"
                      >
                        <ArrowUpRight className="h-8 w-8 text-red-600" />
                      </motion.div>
                    </div>
                    <p className="text-4xl font-black text-red-600">{loading ? "..." : `$${stats.totalWithdrawals.toFixed(2)}`}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring" }}>
                <Card className="bg-white/95 backdrop-blur-xl border-4 border-purple-500 shadow-2xl relative overflow-hidden group hover:shadow-purple-500/50 transition-all duration-300">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-purple-600 text-sm font-bold mb-1">💎 Прибыль</p>
                        <p className="text-gray-600 text-xs">Заработано</p>
                      </div>
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="p-4 bg-purple-100 rounded-2xl"
                      >
                        <TrendingUp className="h-8 w-8 text-purple-600" />
                      </motion.div>
                    </div>
                    <p className="text-4xl font-black text-purple-600">{loading ? "..." : `$${stats.totalProfit.toFixed(2)}`}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Transactions List */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }}
              className="relative bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden"
            >
              {/* Animated Background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-8">
                  <motion.div 
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="p-4 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-2xl shadow-lg border border-white/20"
                  >
                    <Receipt className="h-8 w-8 text-green-300" />
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-black text-white mb-1">📋 Все транзакции</h2>
                    <p className="text-blue-200 text-sm">Полная история ваших операций</p>
                  </div>
                </div>

                {/* Transactions List */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <TransactionsList />
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <AuthGuard>
      <TransactionsContent />
    </AuthGuard>
  )
}
