"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Lock, Eye, Database, UserX, FileCheck, CheckCircle2, Fingerprint, Key } from "lucide-react"

export default function PrivacyPage() {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch('/api/admin/pages?slug=privacy')
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
  }, [])

  const protections = [
    {
      icon: Shield,
      title: "Защита данных",
      description: "256-битное шифрование SSL/TLS",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Lock,
      title: "Конфиденциальность",
      description: "Данные не передаются третьим лицам",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Eye,
      title: "Прозрачность",
      description: "Полный контроль над вашими данными",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Database,
      title: "Безопасное хранение",
      description: "Защищенные серверы с резервным копированием",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: UserX,
      title: "Право на удаление",
      description: "Удалите данные в любой момент",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: FileCheck,
      title: "Соответствие GDPR",
      description: "Международные стандарты безопасности",
      color: "from-indigo-500 to-purple-500"
    }
  ]

  const features = [
    { icon: Fingerprint, text: "Биометрическая защита" },
    { icon: Key, text: "Двухфакторная аутентификация" },
    { icon: Shield, text: "Защита от DDoS атак" },
    { icon: CheckCircle2, text: "Регулярный аудит безопасности" }
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      {/* Floating orbs */}
      <div className="absolute top-40 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Grid */}
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
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl mb-8 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-500/20">
            <Shield className="w-12 h-12 text-purple-400" />
          </div>
          
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 leading-none">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Политика
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              конфиденциальности
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto">
            Ваша безопасность и конфиденциальность —{" "}
            <span className="text-purple-400 font-semibold">наш главный приоритет</span>
          </p>
        </div>

        {/* Security Features */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 hover:scale-105 hover:border-purple-500/50 transition-all duration-300"
            >
              <feature.icon className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Protection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {protections.map((item, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-500 overflow-hidden cursor-pointer"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <div className={`relative bg-gradient-to-br ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                <item.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.description}</p>
              
              <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-1000" />
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="relative group mb-20">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
          <div className="relative bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 backdrop-blur-2xl rounded-3xl p-10 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Shield className="w-12 h-12 text-purple-400" />
              <h3 className="text-3xl font-black text-white">Сертифицированная защита</h3>
            </div>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
              Мы используем передовые технологии шифрования и следуем лучшим практикам 
              безопасности для защиты ваших персональных данных. Наша платформа регулярно 
              проходит независимый аудит безопасности.
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block relative">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <p className="text-white mt-6 text-lg">Загрузка...</p>
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
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25" />
            <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 text-center">
              <Shield className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Настройте политику конфиденциальности</h3>
              <p className="text-slate-400 mb-8 text-lg">Добавьте детальную информацию через админ-панель</p>
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
      `}</style>
    </div>
  )
}
