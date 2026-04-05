"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp, Shield, Users, DollarSign, ArrowRight, Play } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { ProjectLaunches } from "@/components/project-launches"

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Dynamic Investment Background */}
      <div className="absolute inset-0 z-0">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30"></div>
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Animated overlay elements */}
        <div className="absolute inset-0">
          {/* Floating charts and graphs - Enhanced */}
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-green-500/30 to-emerald-600/30 rounded-2xl backdrop-blur-sm border-2 border-green-400/50 animate-pulse shadow-2xl shadow-green-500/30 hover:scale-110 transition-transform">
            <div className="p-5 h-full flex flex-col justify-between">
              <TrendingUp className="h-8 w-8 text-green-400 animate-bounce" />
              <div className="text-right">
                <div className="text-green-400 text-2xl font-black">{realStats.profitabilityRate}%</div>
                <div className="text-green-300 text-sm font-bold">📈 ROI</div>
              </div>
            </div>
          </div>

          <div className="absolute top-40 right-20 w-36 h-36 bg-gradient-to-br from-blue-500/30 to-cyan-600/30 rounded-2xl backdrop-blur-sm border-2 border-blue-400/50 animate-pulse shadow-2xl shadow-blue-500/30 hover:scale-110 transition-transform" style={{ animationDelay: '0.5s' }}>
            <div className="p-4 h-full flex flex-col justify-between">
              <DollarSign className="h-8 w-8 text-blue-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
              <div className="text-right">
                <div className="text-blue-400 text-2xl font-black">{formatNumber(realStats.investmentsAmount)}</div>
                <div className="text-blue-300 text-sm font-bold">💰 Invested</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-32 left-20 w-44 h-32 bg-gradient-to-br from-purple-500/30 to-pink-600/30 rounded-2xl backdrop-blur-sm border-2 border-purple-400/50 animate-pulse shadow-2xl shadow-purple-500/30 hover:scale-110 transition-transform" style={{ animationDelay: '1s' }}>
            <div className="p-4 h-full flex items-center justify-between">
              <Users className="h-8 w-8 text-purple-400 animate-bounce" style={{ animationDelay: '1s' }} />
              <div className="text-right">
                <div className="text-purple-400 text-2xl font-black">{realStats.usersCount.toLocaleString()}</div>
                <div className="text-purple-300 text-sm font-bold">👥 Investors</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-500/30 to-orange-600/30 rounded-2xl backdrop-blur-sm border-2 border-yellow-400/50 animate-pulse shadow-2xl shadow-yellow-500/30 hover:scale-110 transition-transform" style={{ animationDelay: '1.5s' }}>
            <div className="p-5 h-full flex flex-col justify-between">
              <Shield className="h-8 w-8 text-yellow-400 animate-bounce" style={{ animationDelay: '1.5s' }} />
              <div className="text-right">
                <div className="text-yellow-400 text-2xl font-black">{formatNumber(realStats.payoutsAmount)}</div>
                <div className="text-yellow-300 text-sm font-bold">🛡️ Payouts</div>
              </div>
            </div>
          </div>

          {/* Particle effect */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl text-center relative z-10 px-4">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Project Launches Badge */}
          <ProjectLaunches />

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight animate-fade-in">
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              {t('hero.title').split(',')[0]}{" "}
            </span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
              {t('hero.title').split(',')[0].split(' ').slice(-2).join(' ')}
            </span>
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              ,<br />{t('hero.title').split(',')[1]?.trim().split(' ').slice(0, -2).join(' ')}{" "}
            </span>
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent animate-pulse" style={{ animationDelay: '0.5s' }}>
              {t('hero.title').split(',')[1]?.trim().split(' ').slice(-2).join(' ')}
            </span>
            <span className="text-4xl ml-2">💰</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200 max-w-3xl mx-auto leading-relaxed font-medium">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          {heroSettings.show_buttons && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={heroSettings.button1_link}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 group"
                >
                  {t('hero.cta_primary')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={heroSettings.button2_link}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-600 bg-slate-800/50 backdrop-blur-sm text-white hover:bg-slate-700 px-8 py-4 text-lg font-medium rounded-xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <Play className="mr-2 h-5 w-5" />
                  {t('hero.cta_secondary')}
                </Button>
              </Link>
            </div>
          )}

          {/* Stats Preview */}
          {heroSettings.show_stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm border-2 border-green-400/50 rounded-2xl p-8 text-center hover:scale-110 transition-transform duration-300 shadow-2xl shadow-green-500/30 group">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3 group-hover:scale-125 transition-transform">
                  {formatNumber(realStats.usersCount)}
                </div>
                <div className="text-slate-200 text-sm font-bold">👥 {t('hero.stats_users')}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-sm border-2 border-blue-400/50 rounded-2xl p-8 text-center hover:scale-110 transition-transform duration-300 shadow-2xl shadow-blue-500/30 group">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3 group-hover:scale-125 transition-transform">
                  {formatNumber(realStats.investmentsAmount)}
                </div>
                <div className="text-slate-200 text-sm font-bold">💰 {t('hero.stats_invested')}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm border-2 border-purple-400/50 rounded-2xl p-8 text-center hover:scale-110 transition-transform duration-300 shadow-2xl shadow-purple-500/30 group">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 group-hover:scale-125 transition-transform">
                  {realStats.profitabilityRate}%
                </div>
                <div className="text-slate-200 text-sm font-bold">📈 {t('hero.stats_return')}</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-sm border-2 border-yellow-400/50 rounded-2xl p-8 text-center hover:scale-110 transition-transform duration-300 shadow-2xl shadow-yellow-500/30 group">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-3 group-hover:scale-125 transition-transform">
                  {formatNumber(realStats.payoutsAmount)}
                </div>
                <div className="text-slate-200 text-sm font-bold">🛡️ {t('hero.stats_payouts')}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
