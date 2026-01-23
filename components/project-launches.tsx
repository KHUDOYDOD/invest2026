"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, CheckCircle, Clock, Rocket, TrendingUp, Smartphone, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProjectLaunch {
  id: string
  name: string
  title: string
  description: string
  launch_date: string
  countdown_end?: string
  is_launched: boolean
  is_active: boolean
  show_on_site: boolean
  show_countdown: boolean
  position: number
  icon_type: string
  background_type: string
  color_scheme: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function ProjectLaunches() {
  const [launches, setLaunches] = useState<ProjectLaunch[]>([])
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: TimeLeft }>({})

  // Принудительное обновление кэша браузера
  useEffect(() => {
    // Добавляем уникальный параметр к URL для принудительного обновления
    const currentUrl = window.location.href
    if (!currentUrl.includes('cache_bust=')) {
      const separator = currentUrl.includes('?') ? '&' : '?'
      const newUrl = `${currentUrl}${separator}cache_bust=${Date.now()}`
      window.history.replaceState({}, '', newUrl)
    }
    
    // Принудительно обновляем стили
    const styleSheets = document.styleSheets
    for (let i = 0; i < styleSheets.length; i++) {
      const sheet = styleSheets[i]
      if (sheet.href) {
        const link = document.querySelector(`link[href="${sheet.href}"]`) as HTMLLinkElement
        if (link) {
          const newHref = sheet.href.includes('?') 
            ? `${sheet.href}&v=${Date.now()}` 
            : `${sheet.href}?v=${Date.now()}`
          link.href = newHref
        }
      }
    }
  }, [])

  // Функция для расчета оставшегося времени
  const calculateTimeLeft = (targetDate: string): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date()
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  // Получение иконки по типу
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'rocket': return <Rocket className="h-6 w-6" />
      case 'trending-up': return <TrendingUp className="h-6 w-6" />
      case 'smartphone': return <Smartphone className="h-6 w-6" />
      case 'zap': return <Zap className="h-6 w-6" />
      default: return <CheckCircle className="h-6 w-6" />
    }
  }

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const response = await fetch("/api/admin/project-launches")
        if (response.ok) {
          const data = await response.json()
          setLaunches(data.filter((launch: ProjectLaunch) => launch.show_on_site && launch.is_active))
        }
      } catch (error) {
        console.error("Error fetching launches:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLaunches()
  }, [])

  // Обновление таймеров каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: { [key: string]: TimeLeft } = {}
      
      launches.forEach(launch => {
        if (!launch.is_launched && launch.show_countdown && launch.countdown_end) {
          newTimeLeft[launch.id] = calculateTimeLeft(launch.countdown_end)
        }
      })
      
      setTimeLeft(newTimeLeft)
    }, 1000)

    return () => clearInterval(timer)
  }, [launches])

  // Показываем загрузку
  if (loading) {
    return (
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-600 via-gray-600 to-zinc-700">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full animate-pulse" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-2xl rotate-12 animate-pulse" />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
              <Rocket className="h-10 w-10 text-white" />
            </div>
            <p className="text-white text-2xl font-bold">Загрузка запусков...</p>
          </div>
        </div>
      </section>
    )
  }

  // Проверяем есть ли активные (не запущенные) проекты
  const activeLaunches = launches.filter(launch => !launch.is_launched)
  const launchedProjects = launches.filter(launch => launch.is_launched)

  // Если есть только запущенные проекты - показываем стильное уведомление
  if (activeLaunches.length === 0 && launchedProjects.length > 0) {
    return (
      <section className="py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-2xl rotate-12 animate-pulse" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-pink-400/30 to-rose-500/30 rounded-full animate-bounce" style={{animationDuration: '2s'}} />
        </div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
            <div className="flex items-center justify-center space-x-6 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent mb-2">
                  Проекты успешно запущены!
                </h3>
                <p className="text-white/90 text-lg">
                  Платформа InvestPro работает в полном режиме
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Если нет запусков вообще - показываем красивое приглашение
  if (launches.length === 0) {
    return (
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-3xl rotate-45 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full animate-bounce" style={{animationDuration: '3s'}} />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Rocket className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-4xl font-bold bg-gradient-to-r from-white via-pink-200 to-cyan-200 bg-clip-text text-transparent mb-6">
              Платформа InvestPro готова!
            </h3>
            <p className="text-white/90 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              Присоединяйтесь к нашим инвесторам и начните зарабатывать уже сегодня
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4 relative overflow-hidden">
      {/* Улучшенный современный градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-700">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        {/* Улучшенные анимированные геометрические элементы */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-400/30 to-rose-500/30 rounded-3xl rotate-45 animate-pulse hover:animate-bounce transition-all duration-300" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full animate-bounce hover:animate-pulse transition-all duration-300" style={{animationDuration: '3s'}} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        {/* Дополнительные декоративные элементы */}
        <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl rotate-12 animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full animate-bounce" style={{animationDelay: '2s', animationDuration: '4s'}} />
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl">
        {/* Очень компактный заголовок */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-500 rounded-md flex items-center justify-center shadow-sm transform hover:scale-110 transition-transform duration-300 hover:rotate-12">
              <Rocket className="h-3 w-3 text-white" />
            </div>
            <span className="text-white font-semibold text-sm tracking-wide">🚀 Запуски проектов</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-pink-200 to-cyan-200 bg-clip-text text-transparent mb-2 leading-tight">
            Следите за нашими проектами! 🌟
          </h2>
          <p className="text-white/90 text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Будьте в курсе запусков и обновлений платформы
          </p>
        </div>
        
        {/* Компактные карточки запусков */}
        <div className="space-y-4">
          {activeLaunches.map((launch, index) => {
            const isCountdownActive = !launch.is_launched && launch.show_countdown && launch.countdown_end
            const currentTimeLeft = timeLeft[launch.id]
            
            return (
              <motion.div
                key={launch.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:bg-white/15 transition-all duration-500 hover:scale-[1.01] hover:border-white/30 group-hover:shadow-purple-500/20">
                  {/* Компактная градиентная полоса */}
                  <div className="h-0.5 bg-gradient-to-r from-orange-400 via-pink-500 via-purple-500 to-cyan-500 animate-pulse" />
                  
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-3 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 hover:shadow-xl ${
                          launch.color_scheme === 'blue' ? 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-500/25 hover:shadow-blue-500/40' :
                          launch.color_scheme === 'green' ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/25 hover:shadow-green-500/40' :
                          launch.color_scheme === 'purple' ? 'bg-gradient-to-br from-purple-500 to-violet-600 shadow-purple-500/25 hover:shadow-purple-500/40' :
                          'bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/25 hover:shadow-orange-500/40'
                        }`}>
                          <div className="h-5 w-5 text-white">
                            {getIcon(launch.icon_type)}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                              {launch.title}
                            </h3>
                            <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 animate-pulse">
                              ⏳ Скоро запуск!
                            </span>
                          </div>
                          
                          <p className="text-white/90 text-base mb-4 leading-relaxed font-medium">
                            {launch.description}
                          </p>
                          
                          {/* Компактный обратный отсчет */}
                          {isCountdownActive && currentTimeLeft && (
                            <div className="bg-black/20 backdrop-blur-lg rounded-xl p-4 border border-white/10 shadow-inner hover:bg-black/25 transition-all duration-300">
                              <div className="flex items-center space-x-2 mb-3">
                                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md animate-pulse">
                                  <Clock className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-white font-bold text-sm">Обратный отсчет</span>
                              </div>
                              
                              <div className="grid grid-cols-4 gap-3">
                                {currentTimeLeft.days > 0 && (
                                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg p-3 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 transform hover:-translate-y-1">
                                    <div className="text-lg font-bold text-white mb-1 animate-pulse">
                                      {currentTimeLeft.days}
                                    </div>
                                    <div className="text-xs text-blue-100 uppercase font-bold tracking-wide">дней</div>
                                  </div>
                                )}
                                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-3 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 transform hover:-translate-y-1">
                                  <div className="text-lg font-bold text-white mb-1 animate-pulse">
                                    {String(currentTimeLeft.hours).padStart(2, '0')}
                                  </div>
                                  <div className="text-xs text-green-100 uppercase font-bold tracking-wide">часов</div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg p-3 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 transform hover:-translate-y-1">
                                  <div className="text-lg font-bold text-white mb-1 animate-pulse">
                                    {String(currentTimeLeft.minutes).padStart(2, '0')}
                                  </div>
                                  <div className="text-xs text-purple-100 uppercase font-bold tracking-wide">минут</div>
                                </div>
                                <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg p-3 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 transform hover:-translate-y-1">
                                  <div className="text-lg font-bold text-white mb-1 animate-pulse">
                                    {String(currentTimeLeft.seconds).padStart(2, '0')}
                                  </div>
                                  <div className="text-xs text-pink-100 uppercase font-bold tracking-wide">секунд</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Компактная дата */}
                      <div className="flex-shrink-0">
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center min-w-[160px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/15">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <Calendar className="h-4 w-4 text-orange-300 animate-pulse" />
                            <span className="text-white font-bold text-xs uppercase tracking-wide">Дата запуска</span>
                          </div>
                          <div className="text-lg font-bold bg-gradient-to-r from-orange-300 to-pink-300 bg-clip-text text-transparent mb-1">
                            {new Date(launch.launch_date).toLocaleDateString("ru-RU", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            })}
                          </div>
                          <div className="text-sm text-orange-200 font-semibold">
                            {new Date(launch.launch_date).toLocaleTimeString("ru-RU", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
