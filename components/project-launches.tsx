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

  // Если есть только запущенные проекты - показываем супер современное уведомление
  if (activeLaunches.length === 0 && launchedProjects.length > 0) {
    return (
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="relative overflow-hidden rounded-3xl shadow-2xl"
          >
            {/* Animated gradient background */}
            <motion.div
              animate={{
                background: [
                  "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
                  "linear-gradient(135deg, #059669 0%, #047857 50%, #10b981 100%)",
                  "linear-gradient(135deg, #047857 0%, #10b981 50%, #059669 100%)",
                  "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            />

            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/30 rounded-full"
                  initial={{
                    x: Math.random() * 100 + "%",
                    y: "100%",
                    scale: Math.random() * 0.5 + 0.5,
                  }}
                  animate={{
                    y: "-20%",
                    x: `${parseFloat(Math.random() * 100 + "%") + (Math.random() - 0.5) * 20}%`,
                  }}
                  transition={{
                    duration: Math.random() * 3 + 4,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "linear",
                  }}
                />
              ))}
            </div>

            {/* Glowing orbs */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-20 -left-20 w-60 h-60 bg-emerald-300/30 rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.5, 0.3, 0.5],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-20 -right-20 w-80 h-80 bg-green-300/30 rounded-full blur-3xl"
              />
            </div>

            <div className="relative px-8 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  {/* Super animated rocket icon */}
                  <div className="relative">
                    <motion.div
                      animate={{ 
                        rotate: [0, -15, 15, -10, 10, 0],
                        y: [0, -8, 0, -5, 0],
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut"
                      }}
                      className="relative z-10"
                    >
                      <div className="w-20 h-20 bg-white/25 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                        <Rocket className="h-10 w-10 text-white drop-shadow-lg" />
                      </div>
                    </motion.div>
                    
                    {/* Pulsing rings */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 0, 0.6]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-2xl border-4 border-white/50"
                    />
                    <motion.div
                      animate={{ 
                        scale: [1, 1.8, 1],
                        opacity: [0.4, 0, 0.4]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="absolute inset-0 rounded-2xl border-4 border-white/30"
                    />
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-white/40 blur-2xl rounded-full scale-150" />
                  </div>

                  {/* Text content with animations */}
                  <div className="text-center md:text-left">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-3 mb-2"
                    >
                      <h3 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">
                        🎉 Проект запущен!
                      </h3>
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="h-8 w-8 text-yellow-300 drop-shadow-lg" />
                      </motion.div>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-white/95 text-lg font-semibold drop-shadow"
                    >
                      Платформа работает в полном режиме
                    </motion.p>
                  </div>
                </div>

                {/* Success badges */}
                <div className="flex flex-col gap-3">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring", bounce: 0.6 }}
                    className="flex items-center gap-3 bg-white/25 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 shadow-xl"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <CheckCircle className="h-7 w-7 text-white drop-shadow-lg" />
                    </motion.div>
                    <span className="text-white font-bold text-lg drop-shadow">Активно</span>
                  </motion.div>
                  
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
                    className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-3 h-3 bg-green-300 rounded-full shadow-lg"
                    />
                    <span className="text-white/90 font-semibold text-sm uppercase tracking-wider drop-shadow">
                      Online
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Bottom animated line */}
            <div className="relative h-2 overflow-hidden">
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              />
            </div>
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
