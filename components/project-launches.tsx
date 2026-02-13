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
      <section className="py-12 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Rocket className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
            <p className="text-gray-700 text-lg font-semibold">Загрузка запусков...</p>
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
      <section className="py-8 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 text-center">
            <div className="flex items-center justify-center space-x-4 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900">
                  Проекты успешно запущены!
                </h3>
                <p className="text-gray-600">
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
      <section className="py-12 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Rocket className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Платформа InvestPro готова!
            </h3>
            <p className="text-gray-600 text-lg">
              Присоединяйтесь к нашим инвесторам и начните зарабатывать уже сегодня
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto max-w-6xl">
        {/* Чистый минималистичный заголовок */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 mb-3 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <Rocket className="h-4 w-4 text-blue-600" />
            <span className="text-gray-700 font-semibold text-sm">Запуски проектов</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Следите за нашими проектами!
          </h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Будьте в курсе запусков и обновлений платформы
          </p>
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
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                  
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-3 rounded-lg shadow-sm ${
                          launch.color_scheme === 'blue' ? 'bg-blue-100 text-blue-600' :
                          launch.color_scheme === 'green' ? 'bg-green-100 text-green-600' :
                          launch.color_scheme === 'purple' ? 'bg-purple-100 text-purple-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          {getIcon(launch.icon_type)}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                              {launch.title}
                            </h3>
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                              Скоро запуск
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-base mb-4">
                            {launch.description}
                          </p>
                          
                          {/* Чистый обратный отсчет */}
                          {isCountdownActive && currentTimeLeft && (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
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

                      {/* Чистая дата */}
                      <div className="flex-shrink-0">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center min-w-[160px]">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <span className="text-gray-700 font-semibold text-xs uppercase">Дата запуска</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900 mb-1">
                            {new Date(launch.launch_date).toLocaleDateString("ru-RU", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            })}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
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
