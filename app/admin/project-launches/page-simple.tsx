"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Calendar, Clock, Rocket, TrendingUp, Smartphone, Zap, Save, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminGuard } from "@/components/admin-guard"

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
  created_at: string
  updated_at: string
}

interface LaunchFormData {
  name: string
  title: string
  description: string
  launch_date: string
  countdown_end: string
  show_countdown: boolean
  icon_type: string
  color_scheme: string
  position: number
}

const iconOptions = [
  { value: 'rocket', label: '🚀 Ракета', icon: Rocket },
  { value: 'trending-up', label: '📈 Рост', icon: TrendingUp },
  { value: 'smartphone', label: '📱 Мобильное', icon: Smartphone },
  { value: 'zap', label: '⚡ Энергия', icon: Zap }
]

const colorOptions = [
  { value: 'blue', label: '🔵 Синий' },
  { value: 'green', label: '🟢 Зеленый' },
  { value: 'purple', label: '🟣 Фиолетовый' },
  { value: 'orange', label: '🟠 Оранжевый' }
]

export default function ProjectLaunchesAdmin() {
  const [launches, setLaunches] = useState<ProjectLaunch[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLaunch, setEditingLaunch] = useState<ProjectLaunch | null>(null)
  const [formData, setFormData] = useState<LaunchFormData>({
    name: '',
    title: '',
    description: '',
    launch_date: '',
    countdown_end: '',
    show_countdown: true,
    icon_type: 'rocket',
    color_scheme: 'blue',
    position: 1
  })

  const fetchLaunches = async () => {
    try {
      const response = await fetch("/api/admin/project-launches")
      if (response.ok) {
        const data = await response.json()
        setLaunches(data)
      }
    } catch (error) {
      console.error("Error fetching launches:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLaunches()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const method = editingLaunch ? 'PUT' : 'POST'
      const body = editingLaunch 
        ? { ...formData, id: editingLaunch.id }
        : formData

      const response = await fetch("/api/admin/project-launches", {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        await fetchLaunches()
        resetForm()
      }
    } catch (error) {
      console.error("Error saving launch:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот запуск?')) return

    try {
      const response = await fetch(`/api/admin/project-launches?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchLaunches()
      }
    } catch (error) {
      console.error("Error deleting launch:", error)
    }
  }

  const handleEdit = (launch: ProjectLaunch) => {
    setEditingLaunch(launch)
    setFormData({
      name: launch.name,
      title: launch.title,
      description: launch.description,
      launch_date: new Date(launch.launch_date).toISOString().slice(0, 16),
      countdown_end: launch.countdown_end ? new Date(launch.countdown_end).toISOString().slice(0, 16) : '',
      show_countdown: launch.show_countdown,
      icon_type: launch.icon_type,
      color_scheme: launch.color_scheme,
      position: launch.position
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      description: '',
      launch_date: '',
      countdown_end: '',
      show_countdown: true,
      icon_type: 'rocket',
      color_scheme: 'blue',
      position: 1
    })
    setEditingLaunch(null)
    setShowForm(false)
  }

  const toggleLaunchStatus = async (launch: ProjectLaunch) => {
    try {
      const response = await fetch("/api/admin/project-launches", {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...launch,
          is_launched: !launch.is_launched
        })
      })

      if (response.ok) {
        await fetchLaunches()
      }
    } catch (error) {
      console.error("Error toggling launch status:", error)
    }
  }

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-purple-950/20 text-white flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl animate-spin">
            <Rocket className="h-8 w-8 text-white" />
          </div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-purple-950/20 text-white">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Header */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Rocket className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                        Управление запусками проектов
                      </h1>
                      <p className="text-slate-300 mt-2 text-lg">
                        Создавайте захватывающие запуски с обратным отсчетом ⏰
                      </p>
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="flex items-center space-x-2 text-sm text-green-400">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span>Система активна</span>
                        </div>
                        <div className="text-slate-400 text-sm">
                          Всего запусков: {launches.length}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg border border-white/20 backdrop-blur-sm transition-all duration-300"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Добавить запуск
                  </Button>
                </div>
              </div>
            </div>

            {/* Form */}
            {showForm && (
              <div className="mb-8">
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          {editingLaunch ? <Edit className="h-6 w-6 text-white" /> : <Plus className="h-6 w-6 text-white" />}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">
                            {editingLaunch ? '✏️ Редактировать запуск' : '🚀 Новый запуск'}
                          </h3>
                          <p className="text-slate-300">
                            {editingLaunch ? 'Обновите информацию о запуске' : 'Создайте новый захватывающий запуск'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetForm}
                        className="text-white hover:bg-white/10 rounded-xl p-2"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold mb-3 text-slate-200">
                            🏷️ Системное имя
                          </label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="project-launch-name"
                            className="bg-slate-700/50 border-slate-500/50 text-white placeholder-slate-400 rounded-xl h-12"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-3 text-slate-200">
                            📝 Заголовок
                          </label>
                          <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Название запуска"
                            className="bg-slate-700/50 border-slate-500/50 text-white placeholder-slate-400 rounded-xl h-12"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-3 text-slate-200">
                          📄 Описание
                        </label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Описание запуска..."
                          className="bg-slate-700/50 border-slate-500/50 text-white placeholder-slate-400 rounded-xl"
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold mb-3 text-slate-200">
                            📅 Дата запуска
                          </label>
                          <Input
                            type="datetime-local"
                            value={formData.launch_date}
                            onChange={(e) => setFormData({ ...formData, launch_date: e.target.value })}
                            className="bg-slate-700/50 border-slate-500/50 text-white rounded-xl h-12"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-3 text-slate-200">
                            ⏰ Дата окончания отсчета
                          </label>
                          <Input
                            type="datetime-local"
                            value={formData.countdown_end}
                            onChange={(e) => setFormData({ ...formData, countdown_end: e.target.value })}
                            className="bg-slate-700/50 border-slate-500/50 text-white rounded-xl h-12"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg"
                        >
                          <Save className="h-5 w-5 mr-2" />
                          {editingLaunch ? '💾 Сохранить' : '🚀 Создать'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={resetForm}
                          className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white px-8 py-3 rounded-xl"
                        >
                          ❌ Отмена
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Launch List */}
            <div className="grid gap-6">
              {launches.map((launch, index) => (
                <div
                  key={launch.id}
                  className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300"
                >
                  <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                  
                  <div className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br shadow-lg ${
                          launch.color_scheme === 'blue' ? 'from-blue-500/20 to-cyan-500/20 border border-blue-500/30' :
                          launch.color_scheme === 'green' ? 'from-green-500/20 to-emerald-500/20 border border-green-500/30' :
                          launch.color_scheme === 'purple' ? 'from-purple-500/20 to-violet-500/20 border border-purple-500/30' :
                          'from-orange-500/20 to-red-500/20 border border-orange-500/30'
                        }`}>
                          <div className={`h-8 w-8 ${
                            launch.color_scheme === 'blue' ? 'text-blue-400' :
                            launch.color_scheme === 'green' ? 'text-green-400' :
                            launch.color_scheme === 'purple' ? 'text-purple-400' :
                            'text-orange-400'
                          }`}>
                            {iconOptions.find(opt => opt.value === launch.icon_type)?.icon && (
                              React.createElement(iconOptions.find(opt => opt.value === launch.icon_type)!.icon)
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <h3 className="text-2xl font-bold text-white">
                              {launch.title}
                            </h3>
                            <Badge 
                              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                launch.is_launched 
                                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                  : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              }`}
                            >
                              {launch.is_launched ? '🚀 Запущено' : '⏳ Ожидает'}
                            </Badge>
                          </div>
                          
                          <p className="text-slate-300 text-base mb-4 leading-relaxed">
                            {launch.description}
                          </p>
                          
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-2 text-slate-400">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">Запуск:</span>
                              <span className="text-white">
                                {new Date(launch.launch_date).toLocaleString('ru-RU')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleLaunchStatus(launch)}
                          className={`px-4 py-2 rounded-xl font-medium ${
                            launch.is_launched 
                              ? 'border-red-500/50 text-red-300 hover:bg-red-500/10' 
                              : 'border-green-500/50 text-green-300 hover:bg-green-500/10'
                          }`}
                        >
                          {launch.is_launched ? '🛑 Отменить' : '🚀 Запустить'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(launch)}
                          className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 px-4 py-2 rounded-xl"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Изменить
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(launch.id)}
                          className="border-red-500/50 text-red-300 hover:bg-red-500/10 px-4 py-2 rounded-xl"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {launches.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-2xl mx-auto shadow-2xl">
                  <div className="mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                      <Rocket className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-4">
                    🚀 Готовы к запуску?
                  </h3>
                  <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                    Пока нет запусков проектов. Создайте свой первый захватывающий запуск с обратным отсчетом!
                  </p>
                  
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg text-lg"
                  >
                    <Plus className="h-6 w-6 mr-3" />
                    🎯 Создать первый запуск
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}