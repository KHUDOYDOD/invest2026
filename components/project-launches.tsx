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

  // Если есть только запущенные проекты - ничего не показываем
  if (activeLaunches.length === 0 && launchedProjects.length > 0) {
    return null
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
