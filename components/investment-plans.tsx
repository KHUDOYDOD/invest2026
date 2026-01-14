"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, TrendingUp, Shield, Clock, Star, Zap, Crown, Diamond, Sparkles, ArrowRight, DollarSign } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const investmentPlans = [
  {
    id: 1,
    name: "Базовый",
    minAmount: 100,
    maxAmount: 999,
    dailyProfit: 1.2,
    totalProfit: 36,
    duration: 30,
    popular: false,
    features: ["Минимальный риск", "Ежедневные выплаты", "Поддержка 24/7", "Мгновенный старт", "Реинвестирование"],
    description: "Идеальный план для начинающих инвесторов. Низкий порог входа и стабильная доходность.",
    color: "from-cyan-400 to-blue-600",
    darkColor: "from-cyan-500/20 to-blue-600/20",
    icon: TrendingUp,
    borderGlow: "border-cyan-500/30 shadow-cyan-500/20",
  },
  {
    id: 2,
    name: "Стандарт",
    minAmount: 1000,
    maxAmount: 4999,
    dailyProfit: 1.5,
    totalProfit: 67.5,
    duration: 45,
    popular: true,
    features: [
      "Повышенная доходность",
      "Приоритетная поддержка",
      "Бонус за пополнение 5%",
      "Персональный менеджер",
      "Аналитические отчеты",
      "Страхование депозита",
    ],
    description: "Оптимальное соотношение риска и доходности. Самый популярный выбор наших клиентов.",
    color: "from-emerald-400 to-green-600",
    darkColor: "from-emerald-500/20 to-green-600/20",
    icon: Shield,
    borderGlow: "border-emerald-500/30 shadow-emerald-500/20",
  },
  {
    id: 3,
    name: "Премиум",
    minAmount: 5000,
    maxAmount: 19999,
    dailyProfit: 2.0,
    totalProfit: 120,
    duration: 60,
    popular: false,
    features: [
      "Максимальная доходность",
      "VIP поддержка",
      "Бонус за пополнение 10%",
      "Индивидуальная стратегия",
      "Еженедельные консультации",
      "Полное страхование",
      "Досрочный вывод без комиссии",
    ],
    description: "Для опытных инвесторов, готовых к высокой доходности. Премиальное обслуживание.",
    color: "from-purple-400 to-pink-600",
    darkColor: "from-purple-500/20 to-pink-600/20",
    icon: Crown,
    borderGlow: "border-purple-500/30 shadow-purple-500/20",
  },
  {
    id: 4,
    name: "VIP",
    minAmount: 20000,
    maxAmount: 100000,
    dailyProfit: 2.5,
    totalProfit: 225,
    duration: 90,
    popular: false,
    features: [
      "Эксклюзивная доходность",
      "Персональный трейдер",
      "Бонус за пополнение 15%",
      "Приватные инвестиции",
      "Ежедневные консультации",
      "Максимальное страхование",
      "Гибкие условия вывода",
      "Доступ к закрытым проектам",
    ],
    description: "Элитный план для крупных инвесторов. Эксклюзивные возможности и максимальная прибыль.",
    color: "from-yellow-400 to-orange-600",
    darkColor: "from-yellow-500/20 to-orange-600/20",
    icon: Diamond,
    borderGlow: "border-yellow-500/30 shadow-yellow-500/20",
  },
]

export function InvestmentPlans() {
  const { t } = useLanguage()
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const calculateReturn = (plan: any, amount: number = plan.minAmount) => {
    const dailyReturn = (amount * plan.dailyProfit) / 100
    const totalReturn = dailyReturn * plan.duration
    return {
      daily: dailyReturn,
      total: totalReturn,
      percentage: ((totalReturn / amount) * 100).toFixed(1)
    }
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-emerald-600/20 via-cyan-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-r from-pink-600/10 to-yellow-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Animated particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-40 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 left-40 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 right-20 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div 
          className={`text-center mb-20 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-8 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 mr-3 text-blue-400" />
            <span className="text-blue-300 font-medium">{t('plans.title')}</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
            {t('plans.subtitle')} 🚀
          </h2>

          <p className="text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            Простые и понятные инвестиционные планы с ежедневной прибылью
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm px-8 py-4 rounded-2xl border-2 border-green-400/50 shadow-lg shadow-green-500/20 hover:scale-110 transition-transform duration-300">
              <Shield className="h-6 w-6 mr-3 text-green-400 animate-pulse" />
              <span className="text-green-300 font-bold text-base">🛡️ Гарантированная безопасность</span>
            </div>
            <div className="flex items-center bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm px-8 py-4 rounded-2xl border-2 border-blue-400/50 shadow-lg shadow-blue-500/20 hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-6 w-6 mr-3 text-blue-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <span className="text-blue-300 font-bold text-base">📈 Стабильная доходность</span>
            </div>
            <div className="flex items-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm px-8 py-4 rounded-2xl border-2 border-purple-400/50 shadow-lg shadow-purple-500/20 hover:scale-110 transition-transform duration-300">
              <Clock className="h-6 w-6 mr-3 text-purple-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
              <span className="text-purple-300 font-bold text-base">⏰ Ежедневные выплаты</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {investmentPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <Card
                className={`relative overflow-hidden border-2 transition-all duration-500 hover:scale-110 hover:-rotate-1 cursor-pointer group bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl h-full ${
                  selectedPlan === plan.id
                    ? `${plan.borderGlow} shadow-2xl scale-105 rotate-0`
                    : `border-gray-700 hover:${plan.borderGlow} hover:shadow-2xl`
                } ${hoveredPlan === plan.id ? 'z-10' : ''}`}
                onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.darkColor} opacity-50 group-hover:opacity-100 transition-all duration-700 animate-pulse`} />
                
                {/* Glowing orb effect */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${plan.color} rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-all duration-700`}></div>

                {/* Popular Badge */}
                  {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
                    <Badge className="bg-gradient-to-r from-emerald-400 to-green-500 text-white px-8 py-3 text-base font-black shadow-2xl shadow-green-500/50 border-2 border-white/30">
                      <Star className="h-5 w-5 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
                      ⭐ {t('plans.popular').toUpperCase()} ⭐
                    </Badge>
                  </div>
                )}

                {/* Elite Badge */}
                {plan.name === "VIP Элитный" && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
                    <Badge className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 text-black px-8 py-3 text-base font-black shadow-2xl shadow-yellow-500/50 border-2 border-white/50 animate-pulse">
                      <Crown className="h-5 w-5 mr-2 animate-pulse" />
                      👑 VIP ELITE 👑
                    </Badge>
                  </div>
                )}

                {/* Glowing Border Animation */}
                <div className={`absolute inset-0 bg-gradient-to-r ${plan.color} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700`} />

                <CardHeader className="relative pb-6 pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-5 rounded-2xl bg-gradient-to-br ${plan.color} text-white shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 relative`}>
                      <plan.icon className="h-10 w-10 relative z-10" />
                      <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
                    </div>
                    <div className="text-right">
                      <div className={`text-5xl font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                        {plan.dailyProfit}%
                      </div>
                      <div className="text-sm text-gray-400 font-bold">в день 💰</div>
                    </div>
                  </div>

                  <CardTitle className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {plan.name}
                  </CardTitle>

                  <CardDescription className="text-gray-400 text-base leading-relaxed">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative space-y-6">
                  {/* Profit Display - Упрощенный */}
                  <div className="bg-gradient-to-r from-black/40 to-gray-900/40 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
                    <div className="text-center mb-4">
                      <div className="text-4xl font-black text-white mb-2 flex items-center justify-center gap-2">
                        <DollarSign className="h-8 w-8 text-green-400" />
                        {plan.dailyProfit}% в день
                      </div>
                      <div className="text-sm text-gray-400">Ежедневная прибыль</div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400 mb-1">
                          {t('plans.min_deposit')} ${plan.minAmount.toLocaleString('en-US')}
                        </div>
                        <div className="text-2xl font-black text-white mb-2">
                          {t('plans.daily_profit')} ${((plan.minAmount * plan.dailyProfit) / 100).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-300">
                          {t('plans.duration')} {plan.duration} {t('plans.days')} = ${(((plan.minAmount * plan.dailyProfit) / 100) * plan.duration).toFixed(2)} {t('plans.total_profit').toLowerCase()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-white font-bold">💰 Сумма</div>
                        <div className="text-green-400 text-sm">${plan.minAmount.toLocaleString('en-US')} - ${plan.maxAmount.toLocaleString('en-US')}</div>
                      </div>
                      <div>
                        <div className="text-white font-bold">⏰ Срок</div>
                        <div className="text-blue-400 text-sm">{plan.duration} дней</div>
                      </div>
                    </div>
                  </div>

                  {/* Features - Упрощенные */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white text-sm flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                      Преимущества:
                    </h4>
                    <div className="space-y-2">
                      {plan.features
                        .slice(0, 3)
                        .map((feature, index) => (
                          <div 
                            key={index} 
                            className="flex items-center text-sm text-gray-300 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg p-2"
                          >
                            <CheckCircle className="h-4 w-4 mr-3 text-green-400 flex-shrink-0" />
                            <span className="font-medium">{feature}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Action Button - Упрощенная */}
                  <div className="space-y-3">
                    <Button
                      className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-black py-6 text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl relative overflow-hidden group border-2 border-white/20`}
                      size="lg"
                    >
                      <div className="absolute inset-0 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      <span className="relative flex items-center justify-center gap-3">
                        <Sparkles className="h-6 w-6 animate-pulse" />
                        {t('plans.choose')}
                        <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                      </span>
                    </Button>
                  </div>

                  <div className="text-center">
                    <Badge variant="outline" className="text-xs border-green-500/30 text-green-400 bg-green-500/10">
                      <Shield className="h-3 w-3 mr-1" />
                      Гарантия возврата средств
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom Info Section - Упрощенная */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-gray-700/50">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">
              Почему выбирают нас? 🏆
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl border border-green-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-12 w-12 mx-auto text-green-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">🛡️ Безопасность</h4>
                <p className="text-gray-300 leading-relaxed">
                  Ваши средства защищены и застрахованы
                </p>
              </div>

              <div className="text-center group">
                <div className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl border border-blue-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-12 w-12 mx-auto text-blue-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">📈 Ежедневная прибыль</h4>
                <p className="text-gray-300 leading-relaxed">
                  Получайте доход каждый день
                </p>
              </div>

              <div className="text-center group">
                <div className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl border border-purple-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-12 w-12 mx-auto text-purple-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">⚡ Быстрый старт</h4>
                <p className="text-gray-300 leading-relaxed">
                  Начните зарабатывать уже завтра
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}