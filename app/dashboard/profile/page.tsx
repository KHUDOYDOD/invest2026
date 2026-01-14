"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit3,
  Save,
  X,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Sparkles,
  Crown,
} from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@/contexts/user-context"

export default function ProfilePage() {
  const { user, refreshUser } = useUser()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    country: "",
    city: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        phone: user.phone || "",
        country: user.country || "",
        city: user.city || "",
      })
    }
    // Загружаем аватар из localStorage
    const savedAvatar = localStorage.getItem('userAvatar')
    if (savedAvatar) {
      setUserAvatar(savedAvatar)
    }
  }, [user])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Проверка размера (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Файл слишком большой. Максимум 5MB")
        return
      }
      
      // Проверка типа
      if (!file.type.startsWith('image/')) {
        toast.error("Можно загружать только изображения")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setUserAvatar(base64)
        localStorage.setItem('userAvatar', base64)
        localStorage.setItem('userName', formData.full_name) // Обновляем имя для header
        toast.success("Фото профиля обновлено!")
        // Перезагружаем страницу чтобы header обновился
        window.location.reload()
      }
      reader.readAsDataURL(file)
    }
  }

  const removeAvatar = () => {
    setUserAvatar(null)
    localStorage.removeItem('userAvatar')
    toast.success("Фото профиля удалено")
    window.location.reload()
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const userId = localStorage.getItem("userId")
      
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...formData }),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      await refreshUser()
      setEditing(false)
      toast.success("Профиль успешно обновлен!")
    } catch (error) {
      toast.error("Ошибка при обновлении профиля")
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <DashboardHeader />

      <div className="flex relative z-10">
        <DashboardNav activeItem="settings" />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative group">
                    {userAvatar ? (
                      <img 
                        src={userAvatar} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover shadow-2xl border-4 border-white/20"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                        {getInitials(user.full_name)}
                      </div>
                    )}
                    {user.role === "admin" && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-2 z-10">
                        <Crown className="h-5 w-5 text-white" />
                      </div>
                    )}
                    {/* Кнопка загрузки фото */}
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <label htmlFor="avatar-upload" className="cursor-pointer flex flex-col items-center">
                        <Edit3 className="h-6 w-6 text-white mb-1" />
                        <span className="text-white text-xs">Изменить</span>
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                    {userAvatar && (
                      <button
                        onClick={removeAvatar}
                        className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-2 hover:bg-red-600 transition-colors z-10"
                        title="Удалить фото"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                      {user.full_name}
                    </h1>
                    <p className="text-blue-200 text-lg mt-1">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-blue-500/30 text-blue-200 border-blue-400/50">
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role === "admin" ? "Администратор" : "Пользователь"}
                      </Badge>
                      <Badge className="bg-green-500/30 text-green-200 border-green-400/50">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Активен
                      </Badge>
                    </div>
                  </div>
                </div>
                {!editing ? (
                  <Button
                    onClick={() => setEditing(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Редактировать
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Сохранение..." : "Сохранить"}
                    </Button>
                    <Button
                      onClick={() => {
                        setEditing(false)
                        // Восстанавливаем исходные данные
                        if (user) {
                          setFormData({
                            full_name: user.full_name || "",
                            phone: user.phone || "",
                            country: user.country || "",
                            city: user.city || "",
                          })
                        }
                      }}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Отмена
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl border-green-400/30 hover:scale-105 transition-transform">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Баланс</p>
                      <p className="text-3xl font-bold text-white">${user.balance.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-green-500/30 rounded-full">
                      <DollarSign className="h-8 w-8 text-green-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border-blue-400/30 hover:scale-105 transition-transform">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Инвестировано</p>
                      <p className="text-3xl font-bold text-white">${user.total_invested.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-blue-500/30 rounded-full">
                      <TrendingUp className="h-8 w-8 text-blue-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border-purple-400/30 hover:scale-105 transition-transform">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Заработано</p>
                      <p className="text-3xl font-bold text-white">${user.total_earned.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-purple-500/30 rounded-full">
                      <Award className="h-8 w-8 text-purple-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-xl border-orange-400/30 hover:scale-105 transition-transform">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Рефералы</p>
                      <p className="text-3xl font-bold text-white">0</p>
                    </div>
                    <div className="p-3 bg-orange-500/30 rounded-full">
                      <Users className="h-8 w-8 text-orange-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Mail className="h-6 w-6 text-blue-400" />
                      Личная информация
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-white/90 font-semibold">Полное имя</Label>
                        {editing ? (
                          <Input
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            placeholder="Введите ваше полное имя"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50"
                          />
                        ) : (
                          <p className="text-white text-lg bg-white/5 rounded-lg p-3">{user.full_name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 flex items-center gap-2 font-semibold">
                          <Mail className="h-4 w-4" />
                          Email
                        </Label>
                        <p className="text-white text-lg bg-white/5 rounded-lg p-3">{user.email}</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 flex items-center gap-2 font-semibold">
                          <Phone className="h-4 w-4" />
                          Телефон
                        </Label>
                        {editing ? (
                          <Input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+7 (999) 123-45-67"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50"
                          />
                        ) : (
                          <p className="text-white text-lg bg-white/5 rounded-lg p-3">{user.phone || "Не указан"}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 flex items-center gap-2 font-semibold">
                          <MapPin className="h-4 w-4" />
                          Страна
                        </Label>
                        {editing ? (
                          <Input
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            placeholder="Россия"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50"
                          />
                        ) : (
                          <p className="text-white text-lg bg-white/5 rounded-lg p-3">{user.country || "Не указана"}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 flex items-center gap-2 font-semibold">
                          <MapPin className="h-4 w-4" />
                          Город
                        </Label>
                        {editing ? (
                          <Input
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Москва"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50"
                          />
                        ) : (
                          <p className="text-white text-lg bg-white/5 rounded-lg p-3">{user.city || "Не указан"}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 flex items-center gap-2 font-semibold">
                          <Calendar className="h-4 w-4" />
                          Дата регистрации
                        </Label>
                        <p className="text-white text-lg bg-white/5 rounded-lg p-3">
                          {new Date(user.created_at).toLocaleDateString("ru-RU")}
                        </p>
                      </div>
                    </div>

                    {editing && (
                      <div className="flex gap-3 mt-6">
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? "Сохранение..." : "Сохранить изменения"}
                        </Button>
                        <Button
                          onClick={() => setEditing(false)}
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Отмена
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Account Activity */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Активность аккаунта</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Активных инвестиций</p>
                            <p className="text-white/60 text-sm">Текущие вложения</p>
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-white">0</p>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <Award className="h-5 w-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Завершенных инвестиций</p>
                            <p className="text-white/60 text-sm">Всего за время</p>
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-white">0</p>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Users className="h-5 w-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Приглашенных друзей</p>
                            <p className="text-white/60 text-sm">Реферальная программа</p>
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-white">0</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Quick Actions & Info */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-blue-400/30">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Быстрые действия</h3>
                    <div className="space-y-3">
                      <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Пополнить баланс
                      </Button>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Инвестировать
                      </Button>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                        <Users className="h-4 w-4 mr-2" />
                        Пригласить друга
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Status */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Статус аккаунта</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Уровень</span>
                        <Badge className="bg-blue-500/30 text-blue-200">Новичок</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Верификация</span>
                        <Badge className="bg-yellow-500/30 text-yellow-200">Не пройдена</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">2FA</span>
                        <Badge className="bg-red-500/30 text-red-200">Отключена</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Referral Code */}
                <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-xl border-orange-400/30">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">Реферальный код</h3>
                    <p className="text-white/70 text-sm mb-4">Ваш уникальный код для приглашений</p>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <p className="text-2xl font-mono font-bold text-white">{user.referral_code || "LOADING..."}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
