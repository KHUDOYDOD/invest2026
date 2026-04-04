"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Rocket } from "lucide-react"

interface ProjectLaunch {
  id: string
  is_launched: boolean
  is_active: boolean
  show_on_site: boolean
}

export function LaunchedBadge() {
  const [isLaunched, setIsLaunched] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLaunchStatus = async () => {
      try {
        const response = await fetch("/api/admin/project-launches")
        if (response.ok) {
          const data = await response.json()
          const launchedProject = data.find((launch: ProjectLaunch) => 
            launch.show_on_site && launch.is_active && launch.is_launched
          )
          setIsLaunched(!!launchedProject)
        }
      } catch (error) {
        console.error("Error fetching launch status:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLaunchStatus()
    
    // Проверяем каждые 5 секунд
    const interval = setInterval(fetchLaunchStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !isLaunched) {
    return (
      <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium">
        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
        Платформа работает с 2025 года
      </div>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500/30 to-emerald-600/30 backdrop-blur-sm border-2 border-green-400/50 rounded-full shadow-lg shadow-green-500/30"
    >
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mr-3"
      >
        <Rocket className="h-5 w-5 text-green-400" />
      </motion.div>
      <div className="flex items-center space-x-2">
        <span className="text-white font-bold text-sm">🎉 Проект запущен!</span>
        <span className="text-green-300 text-xs">Платформа работает</span>
      </div>
    </motion.div>
  )
}
