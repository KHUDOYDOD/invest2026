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
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Управление запусками проектов</h1>
              <p className="text-slate-400 mt-2">Создавайте и управляйте запусками с обратным отсчетом</p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить запуск
            </Button>
          </div>

          {/* Форма создания/редактирования */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {editingLaunch ? 'Редактировать запуск' : 'Новый запуск'}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetForm}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Системное имя</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="project-launch-name"
                          className="bg-slate-700 border-slate-600"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Заголовок</label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Название запуска"
                          className="bg-slate-700 border-slate-600"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Описание</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Описание запуска..."
                        className="bg-slate-700 border-slate-600"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Дата запуска</label>
                        <Input
                          type="datetime-local"
                          value={formData.launch_date}
                          onChange={(e) => setFormData({ ...formData, launch_date: e.target.value })}
                          className="bg-slate-700 border-slate-600"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Дата окончания отсчета</label>
                        <Input
                          type="datetime-local"
                          value={formData.countdown_end}
                          onChange={(e) => setFormData({ ...formData, countdown_end: e.target.value })}
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Иконка</label>
                        <Select
                          value={formData.icon_type}
                          onValueChange={(value) => setFormData({ ...formData, icon_type: value })}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Цветовая схема</label>
                        <Select
                          value={formData.color_scheme}
                          onValueChange={(value) => setFormData({ ...formData, color_scheme: value })}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {colorOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Позиция</label>
                        <Input
                          type="number"
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                          className="bg-slate-700 border-slate-600"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.show_countdown}
                        onCheckedChange={(checked) => setFormData({ ...formData, show_countdown: checked })}
                      />
                      <label className="text-sm">Показывать обратный отсчет</label>
                    </div>

                    <div className="flex space-x-4">
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        <Save className="h-4 w-4 mr-2" />
                        {editingLaunch ? 'Сохранить' : 'Создать'}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Отмена
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Список запусков */}
          <div className="grid gap-4">
            {launches.map((launch, index) => (
              <motion.div
                key={launch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                          {iconOptions.find(opt => opt.value === launch.icon_type)?.icon && (
                            <div className="h-6 w-6">
                              {React.createElement(iconOptions.find(opt => opt.value === launch.icon_type)!.icon)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold">{launch.title}</h3>
                            <Badge variant={launch.is_launched ? "default" : "secondary"}>
                              {launch.is_launched ? 'Запущено' : 'Ожидает'}
                            </Badge>
                            <Badge variant={launch.show_on_site ? "default" : "outline"}>
                              {launch.show_on_site ? 'Показывается' : 'Скрыто'}
                            </Badge>
                          </div>
                          <p className="text-slate-300 text-sm mb-2">{launch.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-slate-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(launch.launch_date).toLocaleString('ru-RU')}
                              </span>
                            </div>
                            {launch.countdown_end && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  До: {new Date(launch.countdown_end).toLocaleString('ru-RU')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleLaunchStatus(launch)}
                        >
                          {launch.is_launched ? 'Отменить запуск' : 'Запустить'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(launch)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(launch.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {launches.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <Rocket className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Пока нет запусков проектов</p>
              </div>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Создать первый запуск
              </Button>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  )
}