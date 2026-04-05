"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Target, Users, TrendingUp, Shield, Award, Zap, Sparkles, Rocket, Globe } from "lucide-react"

export default function AboutPage() {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch('/api/admin/pages?slug=about')
        if (response.ok) {
          const data = await response.json()
          setContent(data.data?.content || "")
        }
      } catch (error) {
        console.error('Error loading page:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPage()

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const stats = [
    { value: "10K+", label: "Активных пользователей", icon: Users },
    { value: "₽2.5M+", label: "Выплачено инвесторам", icon: TrendingUp },
    { value: "99.9%", label: "Время работы", icon: Shield },
    { value: "24/7", label: "Поддержка", icon: Sparkles }
  ]

  const features = [
    {
      icon: Target,
      title: "Наша миссия",
      description: "Делаем инвестиции доступными для каждого",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Rocket,
      title: "Инновации",
      description: "Передовые технологии инвестирования",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Безопасность",
      description: "Защита данных на высшем уровне",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Award,
      title: "Надежность",
      description: "Лицензированная платформа",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Globe,
      title: "Глобальность",
      description: "Работаем по всему миру",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Zap,
      title: "Скорость",
      description: "Мгновенные транзакции",
      gradient: "from-yellow-500 to-orange-500"
    }
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Dynamic gradient background */}
      <div 
        className="absolute inset-0 opacity-30 transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.3), transparent 50%)`
        }}
      />
      
      {/* Animated mesh gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Link href="/">
          <Button 
            variant="outline" 
            className="border-white/20 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:scale-105 hover:border-white/40 transition-all duration-300 shadow-lg shadow-purple-500/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            На главную
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full px-6 py-2 mb-8 backdrop-blur-xl">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">О нашей платформе</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 leading-none">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Будущее
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              инвестиций
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Мы создаем революционную платформу для умных инвестиций
            <br />
            <span className="text-purple-400">с прозрачностью и безопасностью</span>
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 hover:scale-105 hover:border-purple-500/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />
              <stat.icon className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-black text-white mb-2 group-hover:text-purple-400 transition-colors">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-500 overflow-hidden cursor-pointer"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Icon */}
              <div className={`relative bg-gradient-to-br ${feature.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-purple-400 transition-all">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              
              {/* Shine effect */}
              <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-1000" />
            </div>
          ))}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block relative">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <p className="text-white mt-6 text-lg">Загрузка контента...</p>
          </div>
        ) : content ? (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
            <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 prose prose-invert prose-lg max-w-none hover:border-purple-500/30 transition-all">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25" />
            <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 text-center">
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Настройте контент страницы</h3>
              <p className="text-slate-400 mb-8 text-lg">Добавьте уникальную информацию о вашей компании через админ-панель</p>
              <Link href="/admin">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-2xl shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 transition-all">
                  Перейти в админ-панель
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
