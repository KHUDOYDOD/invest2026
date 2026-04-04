"use client"

import { useState, useEffect } from "react"
import { Calendar, Rocket } from "lucide-react"

interface ProjectLaunch {
  id: string
  name: string
  title: string
  description: string
  launch_date: string
  is_launched: boolean
  is_active: boolean
  show_on_site: boolean
}

export function ProjectLaunchesSimple() {
  const [launches, setLaunches] = useState<ProjectLaunch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('🚀 ProjectLaunches: Component mounted')
    
    const fetchLaunches = async () => {
      try {
        console.log('🚀 ProjectLaunches: Fetching data...')
        const response = await fetch("/api/admin/project-launches")
        console.log('🚀 ProjectLaunches: Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('🚀 ProjectLaunches: Data received:', data)
          
          const launchedProjects = data.filter((launch: ProjectLaunch) => 
            launch.is_launched === true && launch.show_on_site && launch.is_active
          )
          console.log('🚀 ProjectLaunches: Launched projects:', launchedProjects.length)
          
          setLaunches(launchedProjects)
        } else {
          setError(`API error: ${response.status}`)
        }
      } catch (error) {
        console.error("🚀 ProjectLaunches: Error:", error)
        setError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchLaunches()
  }, [])

  console.log('🚀 ProjectLaunches: Render - loading:', loading, 'launches:', launches.length, 'error:', error)

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gray-100">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-gray-600">Загрузка информации о запуске...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-red-100">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-red-600">Ошибка загрузки: {error}</p>
        </div>
      </section>
    )
  }

  if (launches.length === 0) {
    return (
      <section className="py-16 px-4 bg-yellow-100">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-yellow-800">Нет запущенных проектов для отображения</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-6">
          {launches.map((launch) => (
            <div key={launch.id} className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Левая часть */}
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Rocket className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">
                        🎉 Проект запущен!
                      </h4>
                      <p className="text-sm text-gray-600">
                        Платформа работает в полном режиме
                      </p>
                    </div>
                  </div>
                  
                  {/* Карточки преимуществ */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">🚀</div>
                      <div className="text-sm font-bold text-gray-800 mb-1">Быстрый старт</div>
                      <div className="text-xs text-gray-600">Начните инвестировать за 5 минут</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">💰</div>
                      <div className="text-sm font-bold text-gray-800 mb-1">Высокий доход</div>
                      <div className="text-xs text-gray-600">До 12% ежедневно</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">🔒</div>
                      <div className="text-sm font-bold text-gray-800 mb-1">Безопасность</div>
                      <div className="text-xs text-gray-600">Защита ваших средств</div>
                    </div>
                  </div>
                </div>

                {/* Правая часть - Дата запуска */}
                <div className="flex-shrink-0">
                  <div className="bg-gray-50 rounded-2xl p-6 text-center min-w-[200px]">
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700 font-bold text-sm uppercase">Дата запуска</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {new Date(launch.launch_date).toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </div>
                    <div className="text-base text-gray-600 font-semibold">
                      {new Date(launch.launch_date).toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
