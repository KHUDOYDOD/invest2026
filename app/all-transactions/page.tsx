"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, Filter, Download, TrendingUp, DollarSign, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface Transaction {
  id: string
  type: string
  amount: number
  status: string
  time: string
  user_name: string
  user_id: string
  plan_name?: string
}

const typeColors: Record<string, string> = {
  'deposit': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'withdrawal': 'bg-red-500/20 text-red-400 border-red-500/30',
  'profit': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'investment': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'bonus': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
}

const typeNames: Record<string, string> = {
  'deposit': 'Пополнение',
  'withdrawal': 'Вывод',
  'profit': 'Прибыль',
  'investment': 'Инвестиция',
  'bonus': 'Бонус'
}

const typeIcons: Record<string, string> = {
  'deposit': '💰',
  'withdrawal': '📤',
  'profit': '📈',
  'investment': '💎',
  'bonus': '🎁'
}

// Функция для получения знака и цвета суммы
const getAmountDisplay = (type: string, amount: number) => {
  switch (type) {
    case 'deposit':
    case 'profit':
    case 'bonus':
      return {
        sign: '+',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30'
      }
    case 'withdrawal':
      return {
        sign: '-',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30'
      }
    case 'investment':
      return {
        sign: '',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30'
      }
    default:
      return {
        sign: '',
        color: 'text-white',
        bgColor: 'bg-slate-500/10',
        borderColor: 'border-slate-500/30'
      }
  }
}

export default function AllTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/all-transactions')
        if (response.ok) {
          const data = await response.json()
          if (data.success && Array.isArray(data.data)) {
            setTransactions(data.data)
          }
        }
      } catch (err) {
        console.error("Ошибка загрузки:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "только что"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} мин назад`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ч назад`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} д назад`
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toString().includes(searchTerm)
    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const uniqueTypes = Array.from(new Set(transactions.map(t => t.type)))
  
  // Разделяем транзакции на доходы и расходы
  const incomeTransactions = filteredTransactions.filter(t => ['deposit', 'profit', 'bonus'].includes(t.type))
  const expenseTransactions = filteredTransactions.filter(t => ['withdrawal'].includes(t.type))
  const investmentTransactions = filteredTransactions.filter(t => t.type === 'investment')
  
  const totalIncome = incomeTransactions.reduce((sum, t) => {
    const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : (t.amount || 0)
    return sum + (isNaN(amount) ? 0 : amount)
  }, 0)
  
  const totalExpense = expenseTransactions.reduce((sum, t) => {
    const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : (t.amount || 0)
    return sum + (isNaN(amount) ? 0 : amount)
  }, 0)
  
  const totalInvestment = investmentTransactions.reduce((sum, t) => {
    const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : (t.amount || 0)
    return sum + (isNaN(amount) ? 0 : amount)
  }, 0)
  
  const totalAmount = filteredTransactions.reduce((sum, t) => {
    const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : (t.amount || 0)
    return sum + (isNaN(amount) ? 0 : amount)
  }, 0)
  
  const todayTransactions = filteredTransactions.filter(t => {
    const today = new Date()
    const transactionDate = new Date(t.time)
    return transactionDate.toDateString() === today.toDateString()
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-xl">Загрузка транзакций...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden pt-24">
        {/* Анимированный фон */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-600/10 to-purple-600/10 rounded-full blur-3xl animate-spin-slow"></div>
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl px-4 py-8">
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
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                    Все транзакции
                  </h1>
                  <p className="text-slate-400 mt-2">Полная история операций платформы</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
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
                  <p className="text-slate-400 text-sm">Всего операций</p>
                  <p className="text-2xl font-bold text-white">{filteredTransactions.length}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-300 text-sm">💰 Доходы</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    +${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-emerald-300 mt-1">{incomeTransactions.length} операций</p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <DollarSign className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-300 text-sm">📤 Расходы</p>
                  <p className="text-2xl font-bold text-red-400">
                    -${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-red-300 mt-1">{expenseTransactions.length} операций</p>
                </div>
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <DollarSign className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">💎 Инвестиции</p>
                  <p className="text-2xl font-bold text-purple-400">
                    ${totalInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-purple-300 mt-1">{investmentTransactions.length} операций</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Сегодня</p>
                  <p className="text-2xl font-bold text-cyan-400">{todayTransactions.length}</p>
                  <p className="text-xs text-slate-400 mt-1">операций</p>
                </div>
                <div className="p-3 bg-cyan-500/20 rounded-xl">
                  <Clock className="h-6 w-6 text-cyan-400" />
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
                placeholder="Поиск по пользователю или ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-500/50"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
                className={`${
                  filterType === "all"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-white/10 border-white/20 text-slate-300 hover:bg-white/20"
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Все типы
              </Button>
              {uniqueTypes.slice(0, 4).map((type) => {
                const count = filteredTransactions.filter(t => t.type === type).length
                return (
                  <Button
                    key={type}
                    variant={filterType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType(type)}
                    className={`${
                      filterType === type
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "bg-white/10 border-white/20 text-slate-300 hover:bg-white/20"
                    }`}
                  >
                    {typeIcons[type]} {typeNames[type]} ({count})
                  </Button>
                )
              })}
            </div>
          </motion.div>

          {/* Список транзакций */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 mb-8"
          >
            {filteredTransactions.map((transaction, index) => {
              const amountDisplay = getAmountDisplay(transaction.type, transaction.amount)
              const amount = typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : (transaction.amount || 0)
              
              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group hover:scale-[1.02] hover:shadow-2xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Иконка типа транзакции */}
                      <div className={`w-16 h-16 ${amountDisplay.bgColor} ${amountDisplay.borderColor} border-2 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg`}>
                        {typeIcons[transaction.type]}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {transaction.user_name}
                          </h3>
                          <Badge 
                            className={`${typeColors[transaction.type]} border font-medium px-3 py-1`}
                          >
                            {typeNames[transaction.type]}
                          </Badge>
                          {transaction.status === 'completed' && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 border font-medium px-2 py-1">
                              ✅ Завершено
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <span className="text-slate-500">ID:</span>
                            <span className="font-mono text-slate-300">{transaction.id.slice(0, 8)}...</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(transaction.time)}
                          </span>
                          {transaction.plan_name && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-400 font-medium">📊 {transaction.plan_name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Сумма с знаком */}
                    <div className="text-right">
                      <div className={`text-3xl font-bold mb-1 flex items-center justify-end gap-1 ${amountDisplay.color}`}>
                        <span className="text-2xl">{amountDisplay.sign}</span>
                        <span>${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      
                      <div className="text-xs text-slate-500 mt-1 text-right">
                        {formatDate(transaction.time)}
                      </div>
                      
                      {/* Дополнительная информация */}
                      <div className="mt-2 text-right">
                        {transaction.type === 'deposit' && (
                          <div className="text-xs text-emerald-400 font-medium">
                            💳 Пополнение счета
                          </div>
                        )}
                        {transaction.type === 'withdrawal' && (
                          <div className="text-xs text-red-400 font-medium">
                            📤 Вывод средств
                          </div>
                        )}
                        {transaction.type === 'profit' && (
                          <div className="text-xs text-blue-400 font-medium">
                            📈 Прибыль от инвестиций
                          </div>
                        )}
                        {transaction.type === 'investment' && (
                          <div className="text-xs text-purple-400 font-medium">
                            💎 Инвестирование
                          </div>
                        )}
                        {transaction.type === 'bonus' && (
                          <div className="text-xs text-yellow-400 font-medium">
                            🎁 Бонус
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {filteredTransactions.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">💳</div>
              <p className="text-slate-400 text-xl">Транзакции не найдены</p>
              <p className="text-slate-500 mt-2">Попробуйте изменить параметры поиска</p>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}