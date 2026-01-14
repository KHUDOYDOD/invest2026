"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calculator, TrendingUp, DollarSign, BarChart3, PieChart, Target, Zap, Rocket, RefreshCw, ArrowRight, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

// Получаем планы из API или используем стандартные
const investmentPlans = [
  { 
    id: "basic", 
    name: "Базовый", 
    dailyReturn: 1.2, 
    term: 30, 
    minDeposit: 100, 
    maxDeposit: 999,
    color: "from-emerald-500 to-teal-600",
    icon: "🌱",
    description: "Идеально для начинающих инвесторов"
  },
  { 
    id: "standard", 
    name: "Стандарт", 
    dailyReturn: 1.5, 
    term: 45, 
    minDeposit: 1000, 
    maxDeposit: 4999,
    color: "from-blue-500 to-cyan-600",
    icon: "⚡",
    description: "Оптимальный баланс риска и доходности"
  },
  {
    id: "premium",
    name: "Премиум",
    dailyReturn: 2.0,
    term: 60,
    minDeposit: 5000,
    maxDeposit: 19999,
    color: "from-purple-500 to-pink-600",
    icon: "💎",
    description: "Для опытных инвесторов"
  },
  { 
    id: "vip", 
    name: "VIP", 
    dailyReturn: 2.5, 
    term: 90, 
    minDeposit: 20000, 
    maxDeposit: 100000,
    color: "from-yellow-500 to-orange-600",
    icon: "👑",
    description: "Максимальная доходность для VIP клиентов"
  },
]

export function ProfitCalculator() {
  const { t } = useLanguage()
  const [amount, setAmount] = useState(1000)
  const [selectedPlan, setSelectedPlan] = useState("standard")
  const [results, setResults] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [plans, setPlans] = useState(investmentPlans)
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
  const [animatedValues, setAnimatedValues] = useState({
    dailyProfit: 0,
    totalProfit: 0,
    totalReturn: 0,
  })

  useEffect(() => {
    setIsVisible(true)
    // Попытаемся загрузить планы из API
    loadPlansFromAPI()
  }, [])

  const loadPlansFromAPI = async () => {
    try {
      const response = await fetch('/api/investment-plans')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.plans && data.plans.length > 0) {
          // Преобразуем API данные в формат компонента
          const apiPlans = data.plans.map((plan: any, index: number) => ({
            id: plan.id.toString(),
            name: plan.name,
            dailyReturn: plan.daily_percent,
            term: plan.duration,
            minDeposit: plan.min_amount,
            maxDeposit: plan.max_amount,
            color: investmentPlans[index % investmentPlans.length]?.color || "from-blue-500 to-cyan-600",
            icon: investmentPlans[index % investmentPlans.length]?.icon || "💎",
            description: plan.description
          }))
          setPlans(apiPlans)
          console.log('✅ Loaded investment plans from API:', apiPlans)
        }
      }
    } catch (error) {
      console.log('Using fallback investment plans:', error)
      // Используем стандартные планы при ошибке
    } finally {
      setIsLoadingPlans(false)
    }
  }

  const validateAmount = (value: number) => {
    const plan = plans.find((p) => p.id === selectedPlan)
    if (!plan) return false
    return value >= plan.minDeposit && value <= plan.maxDeposit
  }

  const calculateProfit = async () => {
    const plan = plans.find((p) => p.id === selectedPlan)
    if (!plan || !amount || !validateAmount(amount)) return

    setIsCalculating(true)

    // Имитируем загрузку для лучшего UX
    await new Promise(resolve => setTimeout(resolve, 500))

    const investmentAmount = amount
    const dailyProfit = (investmentAmount * plan.dailyReturn) / 100
    const totalProfit = dailyProfit * plan.term
    const totalReturn = investmentAmount + totalProfit

    const calculatedResults = {
      dailyProfit,
      totalProfit,
      totalReturn,
      plan: plan.name,
      term: plan.term,
      planColor: plan.color,
      roi: ((totalProfit / investmentAmount) * 100).toFixed(1),
      weeklyProfit: dailyProfit * 7,
      monthlyProfit: dailyProfit * 30,
      yearlyROI: ((dailyProfit * 365) / investmentAmount * 100).toFixed(1)
    }

    setResults(calculatedResults)
    setIsCalculating(false)

    // Animate numbers
    animateNumbers(calculatedResults)
  }

  const animateNumbers = (target: any) => {
    const duration = 1500
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = Math.min(currentStep / steps, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      setAnimatedValues({
        dailyProfit: target.dailyProfit * easeOutQuart,
        totalProfit: target.totalProfit * easeOutQuart,
        totalReturn: target.totalReturn * easeOutQuart,
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedValues(target)
      }
    }, stepDuration)
  }

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0
    setAmount(numValue)
    setResults(null) // Сбрасываем результаты при изменении суммы
  }

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId)
    setResults(null) // Сбрасываем результаты при изменении плана
  }

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)
  const isAmountValid = validateAmount(amount)

  return (
    <div className={`max-w-7xl mx-auto ${isVisible ? "animate-scale-in" : "opacity-0"}`}>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calculator Input */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-2 border-purple-500/30 overflow-hidden h-full relative group hover:shadow-purple-500/20 transition-all duration-500">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <CardHeader className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 animate-pulse"></div>
              <CardTitle className="flex items-center text-xl relative z-10">
                <div className="p-2 bg-white/20 rounded-lg mr-3 backdrop-blur-sm">
                  <Calculator className="h-6 w-6" />
                </div>
                {t('calculator.title')}
              </CardTitle>
              <CardDescription className="text-purple-100 relative z-10">
                {t('calculator.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 relative z-10">
              {/* Amount Input */}
              <div className="space-y-4 p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
                <Label className="text-white font-bold text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                  {t('calculator.amount')}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="Введите сумму"
                    className={`pl-8 bg-slate-800/50 border-2 text-white text-lg font-bold placeholder:text-slate-500 transition-all duration-300 ${
                      isAmountValid 
                        ? 'border-emerald-500/50 focus:border-emerald-400' 
                        : 'border-red-500/50 focus:border-red-400'
                    }`}
                    min={selectedPlanData?.minDeposit}
                    max={selectedPlanData?.maxDeposit}
                  />
                </div>
                {selectedPlanData && (
                  <div className={`text-sm font-medium transition-colors duration-300 ${
                    isAmountValid ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {isAmountValid 
                      ? `✅ Сумма подходит для плана "${selectedPlanData.name}"` 
                      : `❌ Для плана "${selectedPlanData.name}" нужно: $${selectedPlanData.minDeposit.toLocaleString()} - $${selectedPlanData.maxDeposit.toLocaleString()}`
                    }
                  </div>
                )}
              </div>

              {/* Quick Amount Buttons */}
              <div className="space-y-3">
                <Label className="text-white font-bold text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Быстрый выбор
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedPlanData && [
                    selectedPlanData.minDeposit,
                    Math.floor((selectedPlanData.minDeposit + selectedPlanData.maxDeposit) / 4),
                    Math.floor((selectedPlanData.minDeposit + selectedPlanData.maxDeposit) / 2),
                    selectedPlanData.maxDeposit
                  ].map((quickAmount) => (
                    <motion.button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`py-3 px-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                        amount === quickAmount
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                      }`}
                    >
                      ${quickAmount.toLocaleString('en-US')}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Plan Selection */}
              <div className="space-y-3">
                <Label className="text-white font-bold text-lg flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-cyan-400" />
                  {t('calculator.plan')}
                  {isLoadingPlans && (
                    <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                  )}
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {plans.map((plan) => (
                    <motion.button
                      key={plan.id}
                      onClick={() => handlePlanChange(plan.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${
                        selectedPlan === plan.id
                          ? `border-transparent bg-gradient-to-r ${plan.color} shadow-lg`
                          : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                      )}
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{plan.icon}</span>
                            <div>
                              <div className={`font-bold text-lg ${selectedPlan === plan.id ? 'text-white' : 'text-slate-200'}`}>
                                {plan.name}
                              </div>
                              <div className={`text-sm ${selectedPlan === plan.id ? 'text-white/90' : 'text-slate-400'}`}>
                                {plan.description}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${selectedPlan === plan.id ? 'text-white' : 'text-emerald-400'}`}>
                              {plan.dailyReturn}%
                            </div>
                            <div className={`text-xs ${selectedPlan === plan.id ? 'text-white/80' : 'text-slate-500'}`}>
                              в день
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <div className={`${selectedPlan === plan.id ? 'text-white/90' : 'text-slate-400'}`}>
                            Срок: {plan.term} дней
                          </div>
                          <div className={`font-medium ${selectedPlan === plan.id ? 'text-white' : 'text-slate-300'}`}>
                            ${plan.minDeposit.toLocaleString()} - ${plan.maxDeposit.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Calculate Button */}
              <div className="pt-4">
                <motion.button
                  onClick={calculateProfit}
                  disabled={!isAmountValid || isCalculating}
                  whileHover={{ scale: isAmountValid ? 1.05 : 1 }}
                  whileTap={{ scale: isAmountValid ? 0.95 : 1 }}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                    isAmountValid && !isCalculating
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      <Calculator className="h-5 w-5" />
                      {t('calculator.calculate')}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Display */}
        <div className="lg:col-span-2">
          <AnimatePresence>
            {results ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Main Results Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6 text-center">
                      <DollarSign className="h-10 w-10 mx-auto mb-3 opacity-80" />
                      <p className="text-emerald-100 text-sm mb-1">{t('calculator.daily')}</p>
                      <p className="text-3xl font-bold">${animatedValues.dailyProfit.toFixed(2)}</p>
                      <p className="text-emerald-200 text-xs mt-1">{t('plans.days').toLowerCase()}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-80" />
                      <p className="text-blue-100 text-sm mb-1">{t('plans.total_profit')}</p>
                      <p className="text-3xl font-bold">${animatedValues.totalProfit.toFixed(2)}</p>
                      <p className="text-blue-200 text-xs mt-1">{t('calculator.total').toLowerCase()} {results.term} {t('plans.days')}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6 text-center">
                      <Target className="h-10 w-10 mx-auto mb-3 opacity-80" />
                      <p className="text-purple-100 text-sm mb-1">Итого к получению</p>
                      <p className="text-3xl font-bold">${animatedValues.totalReturn.toFixed(2)}</p>
                      <p className="text-purple-200 text-xs mt-1">включая вклад</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Metrics */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                    <CardContent className="p-4 text-center">
                      <p className="text-slate-300 text-sm mb-1">Недельная прибыль</p>
                      <p className="text-xl font-bold text-yellow-400">${results.weeklyProfit.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                    <CardContent className="p-4 text-center">
                      <p className="text-slate-300 text-sm mb-1">Месячная прибыль</p>
                      <p className="text-xl font-bold text-orange-400">${results.monthlyProfit.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                    <CardContent className="p-4 text-center">
                      <p className="text-slate-300 text-sm mb-1">ROI</p>
                      <p className="text-xl font-bold text-green-400">{results.roi}%</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                    <CardContent className="p-4 text-center">
                      <p className="text-slate-300 text-sm mb-1">Годовая доходность</p>
                      <p className="text-xl font-bold text-cyan-400">{results.yearlyROI}%</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Analysis */}
                <Card className="bg-white shadow-xl border-0">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                    <CardTitle className="flex items-center text-slate-800">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Детальный анализ инвестиции
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Investment Details */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          Параметры инвестиции
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-600">План:</span>
                            <span className="font-bold text-slate-800">{results.plan}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-600">Сумма инвестиции:</span>
                            <span className="font-bold text-slate-800">${amount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-600">Срок инвестиции:</span>
                            <span className="font-bold text-slate-800">{results.term} дней</span>
                          </div>
                          <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-600">Дневная доходность:</span>
                            <span className="font-bold text-emerald-600">{selectedPlanData?.dailyReturn}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Profitability Analysis */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Анализ доходности
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <span className="text-slate-600">ROI:</span>
                            <span className="font-bold text-emerald-600">{results.roi}%</span>
                          </div>
                          <div className="flex justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <span className="text-slate-600">Месячная прибыль:</span>
                            <span className="font-bold text-blue-600">${results.monthlyProfit.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <span className="text-slate-600">Годовая доходность:</span>
                            <span className="font-bold text-purple-600">{results.yearlyROI}%</span>
                          </div>
                          <div className="flex justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <span className="text-slate-600">Эффективность:</span>
                            <span className={`font-bold ${
                              parseFloat(results.roi) > 100 ? 'text-green-600' : 
                              parseFloat(results.roi) > 50 ? 'text-yellow-600' : 'text-orange-600'
                            }`}>
                              {parseFloat(results.roi) > 100 ? "Очень высокая" : 
                               parseFloat(results.roi) > 50 ? "Высокая" : "Средняя"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <div className="flex justify-between text-sm text-slate-600 mb-2">
                        <span>Прогресс доходности</span>
                        <span>{results.roi}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(parseFloat(results.roi), 100)}%` }}
                          transition={{ duration: 2, delay: 0.5 }}
                          className={`h-4 rounded-full bg-gradient-to-r ${selectedPlanData?.color} shadow-sm`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                    >
                      <Rocket className="h-5 w-5" />
                      Начать инвестировать
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setResults(null)}
                    className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-medium transition-all duration-300 flex items-center gap-3"
                  >
                    <RefreshCw className="h-5 w-5" />
                    Новый расчет
                  </Button>
                </div>
              </motion.div>
            ) : (
              <Card className="bg-white shadow-xl border-0 h-full">
                <CardContent className="flex flex-col items-center justify-center h-full py-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <PieChart className="h-20 w-20 text-slate-300 mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Калькулятор готов к работе</h3>
                  <p className="text-slate-600 text-center max-w-md mb-6">
                    Введите сумму инвестиции, выберите подходящий план и нажмите кнопку "Рассчитать прибыль" для получения детального анализа
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calculator className="h-4 w-4" />
                    <span>Точные расчеты • Реальные данные • Мгновенный результат</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
