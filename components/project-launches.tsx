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

  // Если есть только запущенные проекты - показываем современный статус блок
  if (activeLaunches.length === 0 && launchedProjects.length > 0) {
    const launchedProject = launchedProjects[0]
    const launchDate = new Date(launchedProject.launch_date)
    const now = new Date()
    const daysRunning = Math.floor((now.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24))
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="inline-flex"
      >
        <div className="relative">
          {/* Анимированное свечение вокруг */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-3xl blur-2xl"
          />
          
          {/* Основной контейнер */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border-2 border-emerald-500/50 shadow-2xl backdrop-blur-xl">
            {/* Верхняя часть с иконкой и статусом */}
            <div className="flex items-center gap-4 mb-4">
              {/* Анимированная иконка ракеты */}
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl blur-lg opacity-60" />
                <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Rocket className="h-7 w-7 text-white" />
                </div>
              </motion.div>
              
              {/* Текст статуса */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50" />
                  </motion.div>
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    Активна
                  </span>
                </div>
                <h3 className="text-white text-xl font-bold leading-tight">
                  Платформа работает
                </h3>
              </div>
              
              {/* Иконка проверки */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
              >
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
              </motion.div>
            </div>
            
            {/* Разделитель */}
            <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent mb-4" />
            
            {/* Статистика */}
            <div className="grid grid-cols-3 gap-3">
              {/* Дни работы */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl p-3 border border-emerald-500/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-semibold">Дней</span>
                </div>
                <div className="text-white text-2xl font-bold">{daysRunning}</div>
              </motion.div>
              
              {/* Статус */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-3 border border-blue-500/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 text-xs font-semibold">Статус</span>
                </div>
                <div className="text-white text-lg font-bold">100%</div>
              </motion.div>
              
              {/* Онлайн */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-3 border border-purple-500/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-400 text-xs font-semibold">24/7</span>
                </div>
                <div className="text-white text-lg font-bold">Online</div>
              </motion.div>
            </div>
            
            {/* Дополнительная информация */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-xs"
            >
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <span>Стабильная работа с {launchDate.toLocaleDateString('ru-RU')}</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Если нет запусков вообще - не показываем ничего
  if (launches.length === 0) {
    return null
  }

  // Если есть активные запуски - показываем countdown в стиле как на скриншоте
  const firstLaunch = activeLaunches[0]
  const isCountdownActive = firstLaunch.show_countdown && firstLaunch.countdown_end
  const currentTimeLeft = isCountdownActive ? timeLeft[firstLaunch.id] : null

  if (!isCountdownActive || !currentTimeLeft) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
      className="inline-flex"
    >
      <div className="relative">
        {/* Анимированное свечение вокруг */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl"
        />
        
        {/* Основной контейнер */}
        <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-6 border-2 border-blue-500/30 shadow-2xl backdrop-blur-xl">
          {/* Верхняя часть с иконкой и статусом */}
          <div className="flex items-center gap-4 mb-5">
            {/* Анимированная иконка ракеты */}
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 3, -3, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl blur-lg opacity-60" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Rocket className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            
            {/* Текст статуса */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50" />
                </motion.div>
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  Активна
                </span>
              </div>
              <h3 className="text-white text-xl font-bold leading-tight">
                До старта проекта осталось
              </h3>
            </div>
            
            {/* Иконка проверки */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
            >
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500/50">
                <CheckCircle className="h-7 w-7 text-emerald-400" />
              </div>
            </motion.div>
          </div>
          
          {/* Разделитель */}
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mb-5" />
          
          {/* Таймер обратного отсчёта */}
          <div className={`grid gap-3 ${currentTimeLeft.days > 0 ? 'grid-cols-4' : 'grid-cols-3'}`}>
            {/* Дни - показываем только если больше 0 */}
            {currentTimeLeft.days > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl p-4 border border-emerald-500/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-semibold">Дней</span>
                </div>
                <div className="text-white text-3xl font-bold">{currentTimeLeft.days}</div>
              </motion.div>
            )}
            
            {/* Часы */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: currentTimeLeft.days > 0 ? 0.5 : 0.4 }}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 text-xs font-semibold">Часов</span>
              </div>
              <div className="text-white text-3xl font-bold">{String(currentTimeLeft.hours).padStart(2, '0')}</div>
            </motion.div>
            
            {/* Минуты */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: currentTimeLeft.days > 0 ? 0.6 : 0.5 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-purple-400" />
                <span className="text-purple-400 text-xs font-semibold">Минут</span>
              </div>
              <div className="text-white text-3xl font-bold">{String(currentTimeLeft.minutes).padStart(2, '0')}</div>
            </motion.div>
            
            {/* Секунды */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: currentTimeLeft.days > 0 ? 0.7 : 0.6 }}
              className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-xl p-4 border border-pink-500/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-pink-400" />
                <span className="text-pink-400 text-xs font-semibold">Секунд</span>
              </div>
              <div className="text-white text-3xl font-bold">{String(currentTimeLeft.seconds).padStart(2, '0')}</div>
            </motion.div>
          </div>
          
          {/* Дополнительная информация */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-5 flex items-center justify-center gap-2 text-slate-400 text-sm"
          >
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span>Запуск платформы скоро</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
