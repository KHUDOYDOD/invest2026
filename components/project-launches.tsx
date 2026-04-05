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

  // Не показываем ничего при загрузке
  if (loading) {
    return null
  }

  // Проверяем есть ли активные (не запущенные) проекты
  const activeLaunches = launches.filter(launch => !launch.is_launched)
  const launchedProjects = launches.filter(launch => launch.is_launched)

  // Если есть только запущенные проекты - показываем компактный бейдж
  if (activeLaunches.length === 0 && launchedProjects.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-full"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1 h-1 bg-green-400 rounded-full mr-1.5"
        />
        <Rocket className="h-3 w-3 text-green-400 mr-1" />
        <span className="text-green-300 text-[11px] font-medium leading-tight">
          Платформа работает с 2025 года
        </span>
      </motion.div>
    )
  }

  // Если нет запусков вообще - не показываем ничего
  if (launches.length === 0) {
    return null
  }

  // Если есть активные запуски - показываем полную версию
  return (
    <section className="py-4 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-3">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Запуск проектов</h2>
          <p className="text-xs text-gray-600">Следите за запуском новых инвестиционных возможностей</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {activeLaunches.map((launch) => {
            const isCountdownActive = launch.show_countdown && launch.countdown_end
            const currentTimeLeft = isCountdownActive ? timeLeft[launch.id] : null

            return (
              <div key={launch.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-3">
                  <div className="flex items-start space-x-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Rocket className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 mb-0.5 truncate">
                        {launch.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {launch.description}
                      </p>

                      {/* Чистый обратный отсчет */}
                      {isCountdownActive && currentTimeLeft && (
                        <div className="bg-gray-50 rounded-md p-2 border border-gray-200 mt-2">
                          <div className="flex items-center space-x-1 mb-1.5">
                            <Clock className="h-3 w-3 text-gray-600" />
                            <span className="text-gray-700 font-semibold text-xs">Обратный отсчет</span>
                          </div>

                          <div className="grid grid-cols-4 gap-1.5">
                            {currentTimeLeft.days > 0 && (
                              <div className="bg-blue-500 rounded-md p-1.5 text-center">
                                <div className="text-lg font-bold text-white leading-none">
                                  {currentTimeLeft.days}
                                </div>
                                <div className="text-[9px] text-blue-100 uppercase font-medium mt-0.5">дней</div>
                              </div>
                            )}
                            <div className="bg-green-500 rounded-md p-1.5 text-center">
                              <div className="text-lg font-bold text-white leading-none">
                                {String(currentTimeLeft.hours).padStart(2, '0')}
                              </div>
                              <div className="text-[9px] text-green-100 uppercase font-medium mt-0.5">часов</div>
                            </div>
                            <div className="bg-purple-500 rounded-md p-1.5 text-center">
                              <div className="text-lg font-bold text-white leading-none">
                                {String(currentTimeLeft.minutes).padStart(2, '0')}
                              </div>
                              <div className="text-[9px] text-purple-100 uppercase font-medium mt-0.5">минут</div>
                            </div>
                            <div className="bg-pink-500 rounded-md p-1.5 text-center">
                              <div className="text-lg font-bold text-white leading-none">
                                {String(currentTimeLeft.seconds).padStart(2, '0')}
                              </div>
                              <div className="text-[9px] text-pink-100 uppercase font-medium mt-0.5">секунд</div>
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
