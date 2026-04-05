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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-teal-500/20 backdrop-blur-md border border-emerald-400/40 rounded-full shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"
        />
        <Rocket className="h-3.5 w-3.5 text-emerald-400 drop-shadow-lg" />
        <span className="text-emerald-100 text-xs font-semibold tracking-wide">
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
    <section className="py-4 px-4 bg-gradient-to-br from-slate-900/50 via-purple-900/30 to-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-3">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1"
          >
            🚀 Запуск проектов
          </motion.h2>
          <p className="text-xs text-slate-400">Следите за запуском новых инвестиционных возможностей</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {activeLaunches.map((launch, index) => {
            const isCountdownActive = launch.show_countdown && launch.countdown_end
            const currentTimeLeft = isCountdownActive ? timeLeft[launch.id] : null

            return (
              <motion.div 
                key={launch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
              >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                      <Rocket className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white mb-0.5 truncate group-hover:text-blue-300 transition-colors">
                        {launch.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {launch.description}
                      </p>

                      {/* Современный обратный отсчет */}
                      {isCountdownActive && currentTimeLeft && (
                        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-lg p-2 border border-slate-700/50 mt-2 backdrop-blur-sm">
                          <div className="flex items-center gap-1 mb-1.5">
                            <Clock className="h-3 w-3 text-blue-400" />
                            <span className="text-blue-300 font-semibold text-xs">До старта проекта осталось</span>
                          </div>

                          <div className="grid grid-cols-4 gap-1.5">
                            {currentTimeLeft.days > 0 && (
                              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 rounded-md p-1.5 text-center shadow-lg shadow-blue-500/30">
                                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                                <div className="relative text-lg font-bold text-white leading-none drop-shadow-lg">
                                  {currentTimeLeft.days}
                                </div>
                                <div className="relative text-[9px] text-blue-200 uppercase font-medium mt-0.5">дней</div>
                              </div>
                            )}
                            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-green-700 rounded-md p-1.5 text-center shadow-lg shadow-emerald-500/30">
                              <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                              <div className="relative text-lg font-bold text-white leading-none drop-shadow-lg">
                                {String(currentTimeLeft.hours).padStart(2, '0')}
                              </div>
                              <div className="relative text-[9px] text-emerald-200 uppercase font-medium mt-0.5">часов</div>
                            </div>
                            <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-700 rounded-md p-1.5 text-center shadow-lg shadow-purple-500/30">
                              <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                              <div className="relative text-lg font-bold text-white leading-none drop-shadow-lg">
                                {String(currentTimeLeft.minutes).padStart(2, '0')}
                              </div>
                              <div className="relative text-[9px] text-purple-200 uppercase font-medium mt-0.5">минут</div>
                            </div>
                            <div className="relative overflow-hidden bg-gradient-to-br from-pink-600 to-rose-700 rounded-md p-1.5 text-center shadow-lg shadow-pink-500/30">
                              <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                              <div className="relative text-lg font-bold text-white leading-none drop-shadow-lg">
                                {String(currentTimeLeft.seconds).padStart(2, '0')}
                              </div>
                              <div className="relative text-[9px] text-pink-200 uppercase font-medium mt-0.5">секунд</div>
                            </div>
                          </div>
                        </div>
                      )}
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
