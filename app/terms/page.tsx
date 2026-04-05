"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Scale, UserCheck, Clock, BookOpen, FileCheck2, Gavel } from "lucide-react"

export default function TermsPage() {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch('/api/admin/pages?slug=terms')
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

  const highlights = [
    {
      icon: CheckCircle,
      title: "Прозрачность",
      description: "Все условия четко прописаны",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Scale,
      title: "Справедливость",
      description: "Равные права для всех",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: UserCheck,
      title: "Защита прав",
      description: "Ваши интересы под защитой",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Clock,
      title: "Актуальность",
      description: "Регулярное обновление",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: BookOpen,
      title: "Понятность",
      description: "Простой и ясный язык",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Gavel,
      title: "Законность",
      description: "Соответствие законодательству",
      color: "from-pink-500 to-rose-500"
    }
  ]

  const keyPoints = [
    "Регистрация и использование платформы",
    "Права и обязанности пользователей",
    "Правила проведения инвестиций",
    "Политика возврата средств",
    "Ответственность сторон",
    "Разрешение споров"
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-blue-900/20 to-purple-900/20" />
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent" />
      
      {/* Floating orbs */}
      <div className="absolute top-40 right-20 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      
      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Link href="/">
          <Button 
            variant="outline" 
            className="border-white/20 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:scale-105 hover:border-white/40 transition-all duration-300 shadow-lg shadow-green-500/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            На главную
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-3xl mb-8 backdrop-blur-xl border border-white/10 shadow-2xl shadow-green-500/20">
            <FileText className="w-12 h-12 text-green-400" />
          </div>
          
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 leading-none">
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Условия
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              использования
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto">
            Важная информация о правилах работы платформы
            <br />
            <span className="text-green-400 font-semibold">Прочитайте внимательно перед использованием</span>
          </p>
        </div>

        {/* Key Points */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Основные разделы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 hover:scale-105 hover:border-green-500/50 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <span className="text-white font-medium">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {highlights.map((item, index) => (
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

        {/* Important Notice */}
        <div className="relative group mb-20">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
          <div className="relative bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 backdrop-blur-2xl rounded-3xl p-10">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Важное уведомление</h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Используя нашу платформу, вы автоматически соглашаетесь с данными условиями. 
                  Пожалуйста, внимательно ознакомьтесь с документом перед началом работы. 
                  Если у вас есть вопросы, свяжитесь с нашей службой поддержки.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block relative">
              <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <p className="text-white mt-6 text-lg">Загрузка...</p>
          </div>
        ) : content ? (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
            <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 prose prose-invert prose-lg max-w-none hover:border-green-500/30 transition-all">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl blur opacity-25" />
            <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 text-center">
              <FileCheck2 className="w-16 h-16 text-green-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Настройте условия использования</h3>
              <p className="text-slate-400 mb-8 text-lg">Добавьте детальные правила через админ-панель</p>
              <Link href="/admin">
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-2xl shadow-lg shadow-green-500/50 hover:shadow-green-500/70 hover:scale-105 transition-all">
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
