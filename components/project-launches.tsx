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

  // Получение цветовой схемы
  const getColorScheme = (colorScheme: string) => {
    switch (colorScheme) {
      case 'purple':
        return {
          bg: 'from-purple-900/50 to-violet-900/50',
          border: 'border-purple-500/30',
          iconBg: 'bg-purple-500/20',
          iconColor: 'text-purple-400',
          badgeBg: 'bg-purple-500/20',
          badgeColor: 'text-purple-400',
          badgeBorder: 'border-purple-500/30'
        }
      case 'green':
        return {
          bg: 'from-green-900/50 to-emerald-900/50',
          border: 'border-green-500/30',
          iconBg: 'bg-green-500/20',
          iconColor: 'text-green-400',
          badgeBg: 'bg-green-500/20',
          badgeColor: 'text-green-400',
          badgeBorder: 'border-green-500/30'
        }
      case 'blue':
        return {
          bg: 'from-blue-900/50 to-cyan-900/50',
          border: 'border-blue-500/30',
          iconBg: 'bg-blue-500/20',
          iconColor: 'text-blue-400',
          badgeBg: 'bg-blue-500/20',
          badgeColor: 'text-blue-400',
          badgeBorder: 'border-blue-500/30'
        }
      default:
        return {
          bg: 'from-slate-900/50 to-gray-900/50',
          border: 'border-slate-500/30',
          iconBg: 'bg-slate-500/20',
          iconColor: 'text-slate-400',
          badgeBg: 'bg-slate-500/20',
          badgeColor: 'text-slate-400',
          badgeBorder: 'border-slate-500/30'
        }
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-4 bg-white/20 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  // Если нет запусков - показываем базовое сообщение
  if (launches.length === 0) {
    return (
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium">
              🚀 Платформа InvestPro готова к работе! Присоединяйтесь к нашим инвесторам
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="pt-20 pb-8 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Запуски проектов</h2>
          <p className="text-slate-400">Следите за нашими новыми проектами и обновлениями</p>
        </div>
        
        <div className="grid gap-4 md:gap-6">
          {launches.map((launch, index) => {
            const colors = getColorScheme(launch.color_scheme)
            const isCountdownActive = !launch.is_launched && launch.show_countdown && launch.countdown_end
            const currentTimeLeft = timeLeft[launch.id]
            
            return (
              <motion.div
                key={launch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`bg-gradient-to-r ${colors.bg} ${colors.border} backdrop-blur-sm border`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${colors.iconBg} ${colors.iconColor}`}>
                          {getIcon(launch.icon_type)}
                        </div>

                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-white">{launch.title}</h3>
                            <Badge
                              variant="default"
                              className={`${colors.badgeBg} ${colors.badgeColor} ${colors.badgeBorder}`}
                            >
                              {launch.is_launched ? 'Запущено' : 'Скоро'}
                            </Badge>
                          </div>
                          <p className="text-slate-300 text-sm mb-3">{launch.description}</p>
                          
                          {/* Обратный отсчет */}
                          {isCountdownActive && currentTimeLeft && (
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-2 text-slate-400">
                                <Clock className="h-4 w-4" />
                                <span>Осталось:</span>
                              </div>
                              <div className="flex space-x-3">
                                {currentTimeLeft.days > 0 && (
                                  <div className="text-center">
                                    <div className={`text-lg font-bold ${colors.iconColor}`}>
                                      {currentTimeLeft.days}
                                    </div>
                                    <div className="text-xs text-slate-500">дней</div>
                                  </div>
                                )}
                                <div className="text-center">
                                  <div className={`text-lg font-bold ${colors.iconColor}`}>
                                    {String(currentTimeLeft.hours).padStart(2, '0')}
                                  </div>
                                  <div className="text-xs text-slate-500">часов</div>
                                </div>
                                <div className="text-center">
                                  <div className={`text-lg font-bold ${colors.iconColor}`}>
                                    {String(currentTimeLeft.minutes).padStart(2, '0')}
                                  </div>
                                  <div className="text-xs text-slate-500">минут</div>
                                </div>
                                <div className="text-center">
                                  <div className={`text-lg font-bold ${colors.iconColor}`}>
                                    {String(currentTimeLeft.seconds).padStart(2, '0')}
                                  </div>
                                  <div className="text-xs text-slate-500">секунд</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-2 text-slate-400 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(launch.launch_date).toLocaleDateString("ru-RU", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
