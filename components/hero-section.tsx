"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp, Shield, Users, DollarSign, ArrowRight, Play } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function HeroSection() {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [heroSettings, setHeroSettings] = useState({
    enabled: true,
    title: "Инвестируйте с умом, получайте стабильный доход",
    subtitle: "Профессиональная инвестиционная платформа с ежедневными выплатами, высокой доходностью и гарантированной безопасностью",
    badge_text: "Платформа работает с 2025 года",
    button1_text: "Начать инвестировать",
    button1_link: "/register",
    button2_text: "Войти в систему",
    button2_link: "/login",
    show_buttons: true,
    background_animation: true,
    show_stats: true,
    stats_users: "15K+",
    stats_users_label: "Активных инвесторов",
    stats_invested: "$2.8M",
    stats_invested_label: "Общие инвестиции",
    stats_return: "24.8%",
    stats_return_label: "Средняя доходность",
    stats_reliability: "99.9%",
    stats_reliability_label: "Надежность",
  })
  
  const [realStats, setRealStats] = useState({
    usersCount: 15420,
    investmentsAmount: 2850000,
    payoutsAmount: 1920000,
    profitabilityRate: 24.8,
  })

  useEffect(() => {
    setMounted(true)
    
    // Load hero settings from admin panel
    const loadHeroSettings = async () => {
      try {
        const response = await fetch("/api/admin/hero-settings")
        if (response.ok) {
          const data = await response.json()
          setHeroSettings(data)
        }
      } catch (error) {
        console.error("Error loading hero settings:", error)
      }
    }

    // Load real statistics from database
    const loadStatistics = async () => {
      try {
        const response = await fetch('/api/statistics')
        if (response.ok) {
          const data = await response.json()
          setRealStats({
            usersCount: data.users_count || 15420,
            investmentsAmount: parseInt(data.investments_amount) || 2850000,
            payoutsAmount: parseInt(data.payouts_amount) || 1920000,
            profitabilityRate: parseFloat(data.profitability_rate) || 24.8,
          })
        }
      } catch (error) {
        console.error("Error loading statistics:", error)
      }
    }

    loadHeroSettings()
    loadStatistics()
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K+`
    }
    return num.toLocaleString("ru-RU")
  }

  if (!mounted) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-slate-700 rounded-lg mb-6 mx-auto max-w-4xl"></div>
            <div className="h-6 bg-slate-700 rounded-lg mb-8 mx-auto max-w-3xl"></div>
            <div className="h-12 bg-slate-700 rounded-lg mx-auto max-w-xs"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!heroSettings.enabled) {
    return null
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Simple clean background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="container mx-auto max-w-6xl text-center relative z-10 px-4">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Simple badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300 font-medium">Платформа работает с 2025 года</span>
          </div>

          {/* Main Heading - Clean and readable */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white max-w-4xl mx-auto">
            Инвестируйте с умом,<br />
            <span className="text-blue-400">получайте стабильный доход</span>
          </h1>

          {/* Subtitle - Clear and simple */}
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Профессиональная инвестиционная платформа с ежедневными выплатами и гарантированной безопасностью
          </p>

          {/* CTA Buttons - Simple and clear */}
          {heroSettings.show_buttons && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base font-semibold rounded-lg transition-colors"
                >
                  Начать инвестировать
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-600 bg-transparent text-white hover:bg-slate-800 px-8 py-6 text-base font-semibold rounded-lg transition-colors"
                >
                  Войти в систему
                </Button>
              </Link>
            </div>
          )}

          {/* Stats Preview - Clean cards */}
          {heroSettings.show_stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {formatNumber(realStats.usersCount)}
                </div>
                <div className="text-slate-400 text-sm">Активных инвесторов</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  ${formatNumber(realStats.investmentsAmount)}
                </div>
                <div className="text-slate-400 text-sm">Общие инвестиции</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                  {realStats.profitabilityRate}%
                </div>
                <div className="text-slate-400 text-sm">Средняя доходность</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  ${formatNumber(realStats.payoutsAmount)}
                </div>
                <div className="text-slate-400 text-sm">Выплачено</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
