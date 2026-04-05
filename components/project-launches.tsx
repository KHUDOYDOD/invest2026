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

  // Если есть только запущенные проекты - показываем красивый статус блок
  if (activeLaunches.length === 0 && launchedProjects.length > 0) {
    const launchedProject = launchedProjects[0]
    const launchDate = new Date(launchedProject.launch_date)
    const now = new Date()
    const daysRunning = Math.floor((now.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24))
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="inline-flex"
      >
        <div className="relative group">
          {/* Основной блок */}
          <div className="relative bg-gradient-to-br from-emerald-900/40 via-green-900/30 to-teal-900/40 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4 shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-500">
            {/* Анимированный фон */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-green-500/10 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Пульсирующие круги на фоне */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl"
            />
            <motion.div
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-500/20 rounded-full blur-2xl"
            />
            
            <div className="relative flex items-center gap-4">
              {/* Иконка с анимацией */}
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/50 group-hover:shadow-emerald-500/70 transition-shadow duration-300">
                  <Rocket className="h-7 w-7 text-white" />
                </div>
                {/* Пульсирующая точка */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [1, 0, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/80"
                />
              </motion.div>
              
              {/* Текст и статистика */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-100 font-bold text-base tracking-wide">
                    Проект запущен
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-emerald-400/70" />
                    <span className="text-emerald-200/80">
                      {launchDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <div className="w-px h-3 bg-emerald-500/30" />
                  
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400/70" />
                    <span className="text-emerald-200/80">
                      {daysRunning} {daysRunning === 1 ? 'день' : daysRunning < 5 ? 'дня' : 'дней'} работы
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Декоративные элементы */}
          <motion.div
            animate={{ 
              x: [0, 2, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full blur-sm"
          />
          <motion.div
            animate={{ 
              x: [0, -2, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-400 rounded-full blur-sm"
          />
        </div>
      </motion.div>
    )
  }

  // Если нет запусков вообще - не показываем ничего
  if (launches.length === 0) {
    return null
  }

  // Если есть активные запуски - показываем только countdown
  const firstLaunch = activeLaunches[0]
  const isCountdownActive = firstLaunch.show_countdown && firstLaunch.countdown_end
  const currentTimeLeft = isCountdownActive ? timeLeft[firstLaunch.id] : null

  if (!isCountdownActive || !currentTimeLeft) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="inline-flex"
    >
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 rounded-xl p-5 border border-slate-700/50 backdrop-blur-md shadow-2xl shadow-purple-500/20">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40 hover:scale-110 transition-transform duration-300">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <span className="text-blue-300 font-bold text-base">До старта проекта осталось</span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {currentTimeLeft.days > 0 && (
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-center shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
              <div className="relative text-3xl font-bold text-white leading-none drop-shadow-lg mb-2">
                {currentTimeLeft.days}
              </div>
              <div className="relative text-xs text-blue-200 uppercase font-semibold tracking-wide">дней</div>
            </div>
          )}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl p-4 text-center shadow-lg shadow-emerald-500/30 hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
            <div className="relative text-3xl font-bold text-white leading-none drop-shadow-lg mb-2">
              {String(currentTimeLeft.hours).padStart(2, '0')}
            </div>
            <div className="relative text-xs text-emerald-200 uppercase font-semibold tracking-wide">часов</div>
          </div>
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 text-center shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
            <div className="relative text-3xl font-bold text-white leading-none drop-shadow-lg mb-2">
              {String(currentTimeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="relative text-xs text-purple-200 uppercase font-semibold tracking-wide">минут</div>
          </div>
          <div className="relative overflow-hidden bg-gradient-to-br from-pink-600 to-rose-700 rounded-xl p-4 text-center shadow-lg shadow-pink-500/30 hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
            <div className="relative text-3xl font-bold text-white leading-none drop-shadow-lg mb-2">
              {String(currentTimeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="relative text-xs text-pink-200 uppercase font-semibold tracking-wide">секунд</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
