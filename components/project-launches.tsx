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

  // Если есть только запущенные проекты - показываем современное уведомление
  if (activeLaunches.length === 0 && launchedProjects.length > 0) {
    return (
      <section className="py-6 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl shadow-xl"
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
            </div>

            <div className="relative px-6 py-5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Animated icon */}
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="flex-shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Rocket className="h-7 w-7 text-white" />
                </motion.div>

                {/* Text content */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    🎉 Проект запущен!
                  </h3>
                  <p className="text-white/90 text-sm font-medium">
                    Платформа работает в полном режиме
                  </p>
                </div>
              </div>

              {/* Success badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="hidden sm:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
              >
                <CheckCircle className="h-5 w-5 text-white" />
                <span className="text-white font-semibold text-sm">Активно</span>
              </motion.div>
            </div>

            {/* Bottom accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-white/0 via-white/50 to-white/0"
            />
          </motion.div>
        </div>
      </section>
    )
  }

  // Если нет запусков вообще - не показываем ничего
  if (launches.length === 0) {
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
  )
}
