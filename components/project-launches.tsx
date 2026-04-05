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

  // Если есть только запущенные проекты - показываем яркий статус блок
  if (activeLaunches.length === 0 && launchedProjects.length > 0) {
    const launchedProject = launchedProjects[0]
    const launchDate = new Date(launchedProject.launch_date)
    const now = new Date()
    const daysRunning = Math.floor((now.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24))
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex"
      >
        <div className="relative bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl px-6 py-3 shadow-2xl shadow-emerald-500/40">
          {/* Пульсирующее свечение */}
          <motion.div
            animate={{ 
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl blur-xl"
          />
          
          {/* Контент */}
          <div className="relative flex items-center gap-3">
            {/* Иконка */}
            <div className="flex items-center justify-center">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Rocket className="h-6 w-6 text-white drop-shadow-lg" />
              </motion.div>
            </div>
            
            {/* Текст */}
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg drop-shadow-md">
                Платформа запущена и работает
              </span>
              <CheckCircle className="h-5 w-5 text-white drop-shadow-lg" />
            </div>
            
            {/* Статистика */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l-2 border-white/30">
              <TrendingUp className="h-4 w-4 text-white/90" />
              <span className="text-white/90 font-semibold text-sm">
                {daysRunning} {daysRunning === 1 ? 'день' : daysRunning < 5 ? 'дня' : 'дней'}
              </span>
            </div>
          </div>
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
