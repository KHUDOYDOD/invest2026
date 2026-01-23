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
  disable_registration: boolean
  disable_investments: boolean
  disable_deposits: boolean
  disable_withdrawals: boolean
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
  disable_registration: boolean
  disable_investments: boolean
  disable_deposits: boolean
  disable_withdrawals: boolean
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
  
  // Принудительное обновление кэша браузера
  useEffect(() => {
    // Добавляем уникальный параметр к URL для принудительного обновления
    const currentUrl = window.location.href
    if (!currentUrl.includes('cache_bust=')) {
      const separator = currentUrl.includes('?') ? '&' : '?'
      const newUrl = `${currentUrl}${separator}cache_bust=${Date.now()}`
      window.history.replaceState({}, '', newUrl)
    }
    
    // Принудительно обновляем стили
    const styleSheets = document.styleSheets
    for (let i = 0; i < styleSheets.length; i++) {
      const sheet = styleSheets[i]
      if (sheet.href) {
        const link = document.querySelector(`link[href="${sheet.href}"]`) as HTMLLinkElement
        if (link) {
          const newHref = sheet.href.includes('?') 
            ? `${sheet.href}&v=${Date.now()}` 
            : `${sheet.href}?v=${Date.now()}`
          link.href = newHref
        }
      }
    }
  }, [])
  const [formData, setFormData] = useState<LaunchFormData>({
    name: '',
    title: '',
    description: '',
    launch_date: '',
    countdown_end: '',
    show_countdown: true,
    icon_type: 'rocket',
    color_scheme: 'blue',
    position: 1,
    disable_registration: false,
    disable_investments: false,
    disable_deposits: false,
    disable_withdrawals: false
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
      position: launch.position,
      disable_registration: launch.disable_registration || false,
      disable_investments: launch.disable_investments || false,
      disable_deposits: launch.disable_deposits || false,
      disable_withdrawals: launch.disable_withdrawals || false
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
      position: 1,
      disable_registration: false,
      disable_investments: false,
      disable_deposits: false,
      disable_withdrawals: false
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
        <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce shadow-2xl">
              <Rocket className="h-10 w-10 text-white animate-pulse" />
            </div>
            <p className="text-white text-xl font-bold animate-pulse">🚀 Загрузка супер дизайна...</p>
          </div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 text-white p-6 relative overflow-hidden">
        {/* Красивые анимированные фоновые элементы */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-40 h-40 bg-pink-300/20 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-cyan-300/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-green-300/20 rounded-full blur-xl animate-bounce" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          {/* СУПЕР КРАСИВЫЙ ЗАГОЛОВОК */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-xl border-2 border-white/30 rounded-3xl p-8 shadow-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
                    <Rocket className="h-10 w-10 text-white animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent mb-3 animate-pulse">
                      🎨 СУПЕР УПРАВЛЕНИЕ ЗАПУСКАМИ! 🚀
                    </h1>
                    <p className="text-white text-xl font-semibold animate-bounce">
                      ✨ Создавайте НЕВЕРОЯТНЫЕ запуски с магическим дизайном! ✨
                    </p>
                    <div className="flex items-center space-x-6 mt-4">
                      <div className="flex items-center space-x-3 text-lg text-yellow-300 animate-pulse">
                        <div className="w-4 h-4 bg-yellow-300 rounded-full animate-bounce" />
                        <span className="font-bold">🔥 СИСТЕМА СУПЕР АКТИВНА!</span>
                      </div>
                      <div className="text-cyan-300 text-lg font-bold animate-bounce">
                        🎯 Запусков: {launches.length}
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-white text-black border-4 border-black hover:bg-gray-100 px-8 py-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 text-xl font-bold"
                >
                  <Plus className="h-6 w-6 mr-3 text-black" />
                  ✨ ДОБАВИТЬ СУПЕР ЗАПУСК! 🚀
                </Button>
              </div>
            </div>
          </div>

          {/* СУПЕР КРАСИВАЯ ФОРМА */}
          {showForm && (
            <div className="mb-8">
              <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border-2 border-white/30 rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-400/30 via-pink-500/30 to-purple-600/30 p-8 border-b-2 border-white/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center animate-bounce shadow-2xl">
                        {editingLaunch ? <Edit className="h-8 w-8 text-white animate-pulse" /> : <Plus className="h-8 w-8 text-white animate-spin" />}
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent animate-pulse">
                          {editingLaunch ? '🎨 РЕДАКТИРОВАТЬ СУПЕР ЗАПУСК!' : '🚀 НОВЫЙ МАГИЧЕСКИЙ ЗАПУСК!'}
                        </h3>
                        <p className="text-white text-lg font-semibold animate-bounce">
                          {editingLaunch ? '✨ Обновите информацию с магией!' : '🌟 Создайте НЕВЕРОЯТНЫЙ запуск!'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetForm}
                      className="text-white hover:bg-white/20 rounded-2xl p-3 transition-all duration-300 hover:scale-110"
                    >
                      <X className="h-6 w-6" />
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
                          className="bg-white/20 border-2 border-white/30 text-white placeholder-white/70 rounded-2xl h-14 focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 text-lg font-semibold"
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
                          className="bg-white/20 border-2 border-white/30 text-white placeholder-white/70 rounded-2xl h-14 focus:ring-4 focus:ring-pink-400 focus:border-pink-400 transition-all duration-300 text-lg font-semibold"
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
                        className="bg-white/20 border-2 border-white/30 text-white placeholder-white/70 rounded-2xl focus:ring-4 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 resize-none text-lg font-semibold"
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
                          className="bg-slate-700/50 border-slate-500/50 text-white rounded-xl h-12 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                          className="bg-slate-700/50 border-slate-500/50 text-white rounded-xl h-12 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold mb-3 text-slate-200">
                          🎨 Иконка
                        </label>
                        <Select
                          value={formData.icon_type}
                          onValueChange={(value) => setFormData({ ...formData, icon_type: value })}
                        >
                          <SelectTrigger className="bg-slate-700/50 border-slate-500/50 text-white rounded-xl h-12 focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            {iconOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-3 text-slate-200">
                          🌈 Цветовая схема
                        </label>
                        <Select
                          value={formData.color_scheme}
                          onValueChange={(value) => setFormData({ ...formData, color_scheme: value })}
                        >
                          <SelectTrigger className="bg-slate-700/50 border-slate-500/50 text-white rounded-xl h-12 focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            {colorOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-3 text-slate-200">
                          📍 Позиция
                        </label>
                        <Input
                          type="number"
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                          className="bg-slate-700/50 border-slate-500/50 text-white rounded-xl h-12 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                      <Switch
                        checked={formData.show_countdown}
                        onCheckedChange={(checked) => setFormData({ ...formData, show_countdown: checked })}
                        className="data-[state=checked]:bg-blue-500"
                      />
                      <label className="text-sm font-medium text-slate-200">
                        ⏱️ Показывать обратный отсчет
                      </label>
                    </div>

                    {/* Управление функциями сайта */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 rounded-xl p-6 border border-red-500/20">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                          🔒 Управление функциями сайта до запуска
                        </h4>
                        <p className="text-slate-300 text-sm mb-6">
                          Отключите функции сайта до запуска проекта. После запуска все функции автоматически включатся.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-3 p-4 bg-white/90 rounded-lg border-2 border-black shadow-lg">
                            <Switch
                              checked={formData.disable_registration}
                              onCheckedChange={(checked) => setFormData({ ...formData, disable_registration: checked })}
                              className="data-[state=checked]:bg-red-600 data-[state=unchecked]:bg-gray-300 border-2 border-black"
                            />
                            <label className="text-sm font-bold text-black">
                              🚫 Отключить регистрацию
                            </label>
                          </div>

                          <div className="flex items-center space-x-3 p-4 bg-white/90 rounded-lg border-2 border-black shadow-lg">
                            <Switch
                              checked={formData.disable_investments}
                              onCheckedChange={(checked) => setFormData({ ...formData, disable_investments: checked })}
                              className="data-[state=checked]:bg-red-600 data-[state=unchecked]:bg-gray-300 border-2 border-black"
                            />
                            <label className="text-sm font-bold text-black">
                              📈 Отключить инвестиции
                            </label>
                          </div>

                          <div className="flex items-center space-x-3 p-4 bg-white/90 rounded-lg border-2 border-black shadow-lg">
                            <Switch
                              checked={formData.disable_deposits}
                              onCheckedChange={(checked) => setFormData({ ...formData, disable_deposits: checked })}
                              className="data-[state=checked]:bg-red-600 data-[state=unchecked]:bg-gray-300 border-2 border-black"
                            />
                            <label className="text-sm font-bold text-black">
                              💰 Отключить пополнение
                            </label>
                          </div>

                          <div className="flex items-center space-x-3 p-4 bg-white/90 rounded-lg border-2 border-black shadow-lg">
                            <Switch
                              checked={formData.disable_withdrawals}
                              onCheckedChange={(checked) => setFormData({ ...formData, disable_withdrawals: checked })}
                              className="data-[state=checked]:bg-red-600 data-[state=unchecked]:bg-gray-300 border-2 border-black"
                            />
                            <label className="text-sm font-bold text-black">
                              💸 Отключить вывод средств
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-6 pt-6">
                      <Button 
                        type="submit" 
                        className="bg-white text-black border-4 border-black hover:bg-gray-100 font-bold px-10 py-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 text-xl"
                      >
                        <Save className="h-6 w-6 mr-3 text-black" />
                        {editingLaunch ? '💾 СОХРАНИТЬ МАГИЮ!' : '🚀 СОЗДАТЬ ЧУДО!'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={resetForm}
                        className="bg-white text-black border-4 border-black hover:bg-gray-100 px-10 py-4 rounded-2xl transition-all duration-300 hover:scale-105 font-bold text-xl"
                      >
                        ❌ ОТМЕНА
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Красивый список запусков */}
          <div className="space-y-6">
            {launches.map((launch, index) => (
              <div
                key={launch.id}
                className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group"
              >
                {/* Градиентная верхняя полоса */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                
                <div className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className={`p-4 rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 ${
                        launch.color_scheme === 'blue' ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30' :
                        launch.color_scheme === 'green' ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30' :
                        launch.color_scheme === 'purple' ? 'bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30' :
                        'bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30'
                      }`}>
                        <div className={`h-8 w-8 ${
                          launch.color_scheme === 'blue' ? 'text-blue-400' :
                          launch.color_scheme === 'green' ? 'text-green-400' :
                          launch.color_scheme === 'purple' ? 'text-purple-400' :
                          'text-orange-400'
                        }`}>
                          {iconOptions.find(opt => opt.value === launch.icon_type)?.icon && (
                            React.createElement(iconOptions.find(opt => opt.value === launch.icon_type)!.icon, { className: "h-8 w-8" })
                          )}
                        </div>
                        {launch.is_launched && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-slate-950 flex items-center justify-center">
                            <span className="text-xs">✅</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                            {launch.title}
                          </h3>
                          <Badge 
                            variant={launch.is_launched ? "default" : "secondary"}
                            className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              launch.is_launched 
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            }`}
                          >
                            {launch.is_launched ? '🚀 Запущено' : '⏳ Ожидает'}
                          </Badge>
                          <Badge 
                            variant={launch.show_on_site ? "default" : "outline"}
                            className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              launch.show_on_site 
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                                : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                            }`}
                          >
                            {launch.show_on_site ? '👁️ Показывается' : '🙈 Скрыто'}
                          </Badge>
                        </div>
                        
                        <p className="text-slate-300 text-base mb-4 leading-relaxed">
                          {launch.description}
                        </p>
                        
                        {/* Индикаторы отключенных функций */}
                        {!launch.is_launched && (launch.disable_registration || launch.disable_investments || launch.disable_deposits || launch.disable_withdrawals) && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {launch.disable_registration && (
                                <Badge className="bg-red-500/20 text-red-300 border border-red-500/30 text-xs">
                                  🚫 Регистрация отключена
                                </Badge>
                              )}
                              {launch.disable_investments && (
                                <Badge className="bg-red-500/20 text-red-300 border border-red-500/30 text-xs">
                                  📈 Инвестиции отключены
                                </Badge>
                              )}
                              {launch.disable_deposits && (
                                <Badge className="bg-red-500/20 text-red-300 border border-red-500/30 text-xs">
                                  💰 Пополнение отключено
                                </Badge>
                              )}
                              {launch.disable_withdrawals && (
                                <Badge className="bg-red-500/20 text-red-300 border border-red-500/30 text-xs">
                                  💸 Вывод отключен
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-2 text-slate-400">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">Запуск:</span>
                            <span className="text-white">
                              {new Date(launch.launch_date).toLocaleString('ru-RU')}
                            </span>
                          </div>
                          {launch.countdown_end && (
                            <div className="flex items-center space-x-2 text-slate-400">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">До:</span>
                              <span className="text-white">
                                {new Date(launch.countdown_end).toLocaleString('ru-RU')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleLaunchStatus(launch)}
                        className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 hover:scale-105 bg-white text-black border-2 border-black hover:bg-gray-100 ${
                          launch.is_launched 
                            ? 'shadow-red-500/50' 
                            : 'shadow-green-500/50'
                        }`}
                      >
                        {launch.is_launched ? '🛑 Отменить' : '🚀 Запустить'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(launch)}
                        className="bg-white text-black border-2 border-black hover:bg-gray-100 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 font-bold"
                      >
                        <Edit className="h-4 w-4 mr-2 text-black" />
                        ✏️ Изменить
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(launch.id)}
                        className="bg-white text-black border-2 border-black hover:bg-gray-100 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 font-bold"
                      >
                        <Trash2 className="h-4 w-4 mr-2 text-black" />
                        🗑️ Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Красивое пустое состояние */}
          {launches.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-3xl p-12 max-w-2xl mx-auto shadow-xl">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Rocket className="h-12 w-12 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
                  🚀 Готовы к запуску?
                </h3>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  Пока нет запусков проектов. Создайте свой первый захватывающий запуск с обратным отсчетом!
                </p>
                
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-white text-black border-4 border-black hover:bg-gray-100 font-bold px-8 py-4 rounded-xl shadow-lg text-lg transition-all duration-300 hover:scale-105"
                >
                  <Plus className="h-6 w-6 mr-3 text-black" />
                  🎯 Создать первый запуск
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  )
}