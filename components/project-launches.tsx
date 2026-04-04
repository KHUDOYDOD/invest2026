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

  // Принудительное обновление кэша браузера (убрано для совместимости)
  useEffect(() => {
    // Код обновления кэша убран для лучшей совместимости с браузерами
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
      <div className="w-full py-8 text-center bg-transparent">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-full text-slate-400">
          <Rocket className="h-4 w-4 animate-pulse text-blue-500" />
          <span className="text-sm">Загрузка запусков...</span>
        </div>
      </div>
    )
  }

  // Проверяем есть ли активные (не запущенные) проекты
  const activeLaunches = launches.filter(launch => !launch.is_launched)
  const launchedProjects = launches.filter(launch => launch.is_launched)

  // Если есть только запущенные проекты или нет запусков - не показываем ничего
  if (activeLaunches.length === 0) {
    return null
  }

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Запуск проектов</h2>
          <p className="text-gray-600">Следите за запуском новых инвестиционных возможностей</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeLaunches.map((launch) => {
            const isCountdownActive = launch.show_countdown && launch.countdown_end
            const currentTimeLeft = isCountdownActive ? timeLeft[launch.id] : null

            return (
              <div key={launch.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Rocket className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                        {launch.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {launch.description}
                      </p>

                      {/* Чистый обратный отсчет */}
                      {isCountdownActive && currentTimeLeft && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <Clock className="h-4 w-4 text-gray-600" />
                            <span className="text-gray-700 font-semibold text-sm">Обратный отсчет</span>
                          </div>

                          <div className="grid grid-cols-4 gap-2">
                            {currentTimeLeft.days > 0 && (
                              <div className="bg-blue-500 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-white">
                                  {currentTimeLeft.days}
                                </div>
                                <div className="text-xs text-blue-100 uppercase font-medium">дней</div>
                              </div>
                            )}
                            <div className="bg-green-500 rounded-lg p-3 text-center">
                              <div className="text-2xl font-bold text-white">
                                {String(currentTimeLeft.hours).padStart(2, '0')}
                              </div>
                              <div className="text-xs text-green-100 uppercase font-medium">часов</div>
                            </div>
                            <div className="bg-purple-500 rounded-lg p-3 text-center">
                              <div className="text-2xl font-bold text-white">
                                {String(currentTimeLeft.minutes).padStart(2, '0')}
                              </div>
                              <div className="text-xs text-purple-100 uppercase font-medium">минут</div>
                            </div>
                            <div className="bg-pink-500 rounded-lg p-3 text-center">
                              <div className="text-2xl font-bold text-white">
                                {String(currentTimeLeft.seconds).padStart(2, '0')}
                              </div>
                              <div className="text-xs text-pink-100 uppercase font-medium">секунд</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
                <motion.div 
                  className="relative"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Icon glow */}
                  <div className="absolute inset-0 bg-emerald-400/30 blur-xl rounded-full"></div>
                  <div className="relative w-12 h-12 flex items-center justify-center bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl shadow-lg shadow-emerald-500/30">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-emerald-400/50"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                
                <div className="flex flex-col">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">
                      Проект запущен!
                    </span>
                    {/* Verified badge */}
                    <div className="flex items-center space-x-1 px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full">
                      <CheckCircle className="h-3 w-3 text-emerald-400" />
                      <span className="text-xs font-medium text-emerald-300">Активно</span>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                    Платформа работает в штатном режиме
                  </span>
                </div>
                
                {/* Live indicator */}
                <div className="flex items-center space-x-2 pl-4 border-l border-slate-700/50">
                  <motion.div
                    className="w-2 h-2 bg-emerald-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-xs font-medium text-emerald-400/80 uppercase tracking-wider">Live</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Если нет запусков вообще - просто не показываем секцию или показываем очень аккуратно
  if (launches.length === 0) {
    return null; // Или можно оставить пустую область
  }

  return (
    <section className="pt-24 pb-12 px-4 bg-transparent relative z-20">
      <div className="container mx-auto max-w-6xl">
        {/* Чистый минималистичный заголовок */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 mb-3 px-4 py-2 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-full">
            <Rocket className="h-4 w-4 text-blue-500" />
            <span className="text-slate-200 font-semibold text-sm">Предстоящие запуски</span>
          </div>
        </div>
        
        {/* Чистые карточки запусков */}
        <div className="space-y-4">
          {activeLaunches.map((launch, index) => {
            const isCountdownActive = !launch.is_launched && launch.show_countdown && launch.countdown_end
            const currentTimeLeft = timeLeft[launch.id]
            
            return (
              <motion.div
                key={launch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 overflow-hidden hover:border-blue-500/50 transition-all duration-300">
                  <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                  
                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0 lg:space-x-8">
                      <div className="flex items-start space-x-6 flex-1">
                        <div className={`p-4 rounded-xl shadow-inner ${
                          launch.color_scheme === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                          launch.color_scheme === 'green' ? 'bg-emerald-500/20 text-emerald-400' :
                          launch.color_scheme === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {getIcon(launch.icon_type)}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                              {launch.title}
                            </h3>
                            <span className="px-4 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                              Скоро запуск
                            </span>
                          </div>
                          
                          <p className="text-slate-300 text-lg mb-6 leading-relaxed max-w-2xl">
                            {launch.description}
                          </p>
                          
                          {/* Чистый обратный отсчет */}
                          {isCountdownActive && currentTimeLeft && (
                            <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm">
                              <div className="flex items-center space-x-3 mb-4 text-slate-400">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-bold uppercase tracking-widest">До старта осталось</span>
                              </div>
                              
                              <div className="grid grid-cols-4 gap-4">
                                {currentTimeLeft.days > 0 && (
                                  <div className="flex flex-col items-center">
                                    <div className="text-3xl font-black text-white mb-1">
                                      {currentTimeLeft.days}
                                    </div>
                                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">дней</div>
                                  </div>
                                )}
                                <div className="flex flex-col items-center">
                                  <div className="text-3xl font-black text-blue-400 mb-1">
                                    {String(currentTimeLeft.hours).padStart(2, '0')}
                                  </div>
                                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">часов</div>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="text-3xl font-black text-purple-400 mb-1">
                                    {String(currentTimeLeft.minutes).padStart(2, '0')}
                                  </div>
                                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">минут</div>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="text-3xl font-black text-pink-400 mb-1">
                                    {String(currentTimeLeft.seconds).padStart(2, '0')}
                                  </div>
                                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">секунд</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Чистая дата */}
                      <div className="flex-shrink-0">
                        <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50 text-center min-w-[180px] backdrop-blur-sm group-hover:border-blue-500/30 transition-colors">
                          <div className="flex items-center justify-center space-x-2 mb-3 text-slate-400">
                            <Calendar className="h-4 w-4" />
                            <span className="font-bold text-[10px] uppercase tracking-widest">Старт</span>
                          </div>
                          <div className="text-2xl font-black text-white mb-1">
                            {new Date(launch.launch_date).toLocaleDateString("ru-RU", {
                              day: "2-digit",
                              month: "short"
                            })}
                          </div>
                          <div className="text-blue-400 font-bold">
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
