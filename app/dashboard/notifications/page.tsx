"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bell, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Gift, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Settings as SettingsIcon
} from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface Notification {
  id: number
  type: string
  title: string
  message: string
  icon: string
  color: string
  is_read: boolean
  action_url: string | null
  metadata: any
  created_at: string
  read_at: string | null
}

interface NotificationStats {
  total: string
  unread: string
  read: string
}

function NotificationsContent() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState<NotificationStats>({ total: "0", unread: "0", read: "0" })
  const [loading, setLoading] = useState(true)
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    deposit_notifications: true,
    withdrawal_notifications: true,
    referral_notifications: true,
    system_notifications: true,
    marketing_notifications: false,
  })

  useEffect(() => {
    fetchNotifications()
    fetchPreferences()
  }, [])

  const fetchNotifications = async (type: string = "all") => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        toast.error("Пользователь не авторизован")
        return
      }

      const response = await fetch(`/api/notifications?type=${type}`, {
        headers: {
          "x-user-id": userId,
        },
      })

      const data = await response.json()

      if (data.success) {
        setNotifications(data.notifications)
        setStats(data.stats)
      } else {
        toast.error(data.error || "Ошибка при загрузке уведомлений")
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast.error("Ошибка при загрузке уведомлений")
    } finally {
      setLoading(false)
    }
  }

  const fetchPreferences = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const response = await fetch("/api/notifications/preferences", {
        headers: {
          "x-user-id": userId,
        },
      })

      const data = await response.json()

      if (data.success) {
        setPreferences(data.preferences)
      }
    } catch (error) {
      console.error("Error fetching preferences:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          markAllAsRead: true,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Все уведомления отмечены как прочитанные")
        fetchNotifications()
      } else {
        toast.error(data.error || "Ошибка при обновлении")
      }
    } catch (error) {
      console.error("Error marking all as read:", error)
      toast.error("Ошибка при обновлении уведомлений")
    }
  }

  const deleteAllNotifications = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const response = await fetch("/api/notifications?all=true", {
        method: "DELETE",
        headers: {
          "x-user-id": userId,
        },
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Все уведомления удалены")
        fetchNotifications()
      } else {
        toast.error(data.error || "Ошибка при удалении")
      }
    } catch (error) {
      console.error("Error deleting all notifications:", error)
      toast.error("Ошибка при удалении уведомлений")
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          notificationId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        fetchNotifications()
      }
    } catch (error) {
      console.error("Error marking as read:", error)
    }
  }

  const deleteNotification = async (notificationId: number) => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": userId,
        },
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Уведомление удалено")
        fetchNotifications()
      } else {
        toast.error(data.error || "Ошибка при удалении")
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast.error("Ошибка при удалении уведомления")
    }
  }

  const savePreferences = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const response = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(preferences),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Настройки сохранены")
      } else {
        toast.error(data.error || "Ошибка при сохранении")
      }
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast.error("Ошибка при сохранении настроек")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes} минут назад`
    if (hours < 24) return `${hours} часов назад`
    if (days < 7) return `${days} дней назад`
    return date.toLocaleDateString("ru-RU")
  }

  const getIconComponent = (iconName: string) => {
    const icons: any = {
      DollarSign,
      TrendingUp,
      Users,
      Gift,
      AlertCircle,
      CheckCircle2,
      Bell,
    }
    return icons[iconName] || Bell
  }

  const unreadCount = parseInt(stats.unread)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <DashboardHeader />

      <div className="flex relative z-10">
        <DashboardNav activeItem="notifications" />

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden">
              {/* Animated Orbs */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
              
              <div className="relative z-10 text-center space-y-4">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-full px-6 py-3 border-2 border-blue-400/30 shadow-lg mb-4">
                  <Bell className="h-6 w-6 text-blue-400 animate-pulse" />
                  <span className="text-white font-bold text-lg">Центр уведомлений</span>
                  {unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white">{unreadCount} новых</Badge>
                  )}
                </div>

                <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                  🔔 Уведомления
                </h1>
                
                <p className="text-blue-100 max-w-2xl mx-auto text-xl font-medium">
                  Будьте в курсе всех важных событий и обновлений
                </p>

                <div className="flex items-center justify-center space-x-4 pt-4">
                  <Button 
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Отметить все прочитанными
                  </Button>
                  <Button 
                    onClick={deleteAllNotifications}
                    disabled={notifications.length === 0}
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Очистить все
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-xl p-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 text-white rounded-lg">
                  Все
                </TabsTrigger>
                <TabsTrigger value="unread" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 text-white rounded-lg">
                  Непрочитанные
                </TabsTrigger>
                <TabsTrigger value="transactions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 text-white rounded-lg">
                  Транзакции
                </TabsTrigger>
                <TabsTrigger value="system" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 text-white rounded-lg">
                  Системные
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 text-white rounded-lg">
                  Настройки
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="text-white text-xl">Загрузка уведомлений...</div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-2xl rounded-3xl p-12 border-2 border-white/20 shadow-xl text-center">
                    <div className="text-6xl mb-4">🔔</div>
                    <h3 className="text-white font-bold text-2xl mb-2">Нет уведомлений</h3>
                    <p className="text-white/70 text-lg">У вас пока нет уведомлений</p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const Icon = getIconComponent(notification.icon)
                    return (
                      <div 
                        key={notification.id}
                        className="relative bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-2xl p-6 border-2 border-white/20 shadow-xl hover:scale-[1.02] transition-all cursor-pointer overflow-hidden group"
                      >
                        {/* Animated Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        
                        {!notification.is_read && (
                          <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                        )}

                        <div className="relative z-10 flex items-start space-x-4">
                          <div className={`p-4 bg-gradient-to-r ${notification.color} rounded-2xl shadow-lg flex-shrink-0`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-white font-bold text-xl">{notification.title}</h3>
                              <div className="flex items-center space-x-2 text-white/60 text-sm ml-4">
                                <Clock className="h-4 w-4" />
                                <span>{formatDate(notification.created_at)}</span>
                              </div>
                            </div>
                            <p className="text-white/80 text-base leading-relaxed mb-4">{notification.message}</p>
                            <div className="flex space-x-3">
                              {!notification.is_read && (
                                <Button 
                                  onClick={() => markAsRead(notification.id)}
                                  size="sm" 
                                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Отметить прочитанным
                                </Button>
                              )}
                              <Button 
                                onClick={() => deleteNotification(notification.id)}
                                size="sm" 
                                variant="outline" 
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Удалить
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </TabsContent>

              <TabsContent value="unread" className="space-y-4 mt-6">
                {notifications.filter(n => !n.is_read).length > 0 ? (
                  notifications.filter(n => !n.is_read).map((notification) => {
                    const Icon = getIconComponent(notification.icon)
                    return (
                      <div 
                        key={notification.id}
                        className="relative bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-2xl p-6 border-2 border-white/20 shadow-xl hover:scale-[1.02] transition-all cursor-pointer overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>

                        <div className="relative z-10 flex items-start space-x-4">
                          <div className={`p-4 bg-gradient-to-r ${notification.color} rounded-2xl shadow-lg flex-shrink-0`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-white font-bold text-xl">{notification.title}</h3>
                              <div className="flex items-center space-x-2 text-white/60 text-sm ml-4">
                                <Clock className="h-4 w-4" />
                                <span>{formatDate(notification.created_at)}</span>
                              </div>
                            </div>
                            <p className="text-white/80 text-base leading-relaxed mb-4">{notification.message}</p>
                            <div className="flex space-x-3">
                              <Button 
                                onClick={() => markAsRead(notification.id)}
                                size="sm" 
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Отметить прочитанным
                              </Button>
                              <Button 
                                onClick={() => deleteNotification(notification.id)}
                                size="sm" 
                                variant="outline" 
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Удалить
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-2xl rounded-3xl p-12 border-2 border-white/20 shadow-xl text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-white font-bold text-2xl mb-2">Все уведомления прочитаны</h3>
                    <p className="text-white/70 text-lg">У вас нет непрочитанных уведомлений</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="transactions" className="space-y-4 mt-6">
                <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-2xl rounded-3xl p-12 border-2 border-white/20 shadow-xl text-center">
                  <div className="text-6xl mb-4">💰</div>
                  <h3 className="text-white font-bold text-2xl mb-2">Уведомления о транзакциях</h3>
                  <p className="text-white/70 text-lg">Здесь будут отображаться уведомления о ваших транзакциях</p>
                </div>
              </TabsContent>

              <TabsContent value="system" className="space-y-4 mt-6">
                <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-2xl rounded-3xl p-12 border-2 border-white/20 shadow-xl text-center">
                  <div className="text-6xl mb-4">⚙️</div>
                  <h3 className="text-white font-bold text-2xl mb-2">Системные уведомления</h3>
                  <p className="text-white/70 text-lg">Здесь будут отображаться системные уведомления</p>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-6">
                <div className="relative bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="p-4 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl shadow-lg border border-white/20">
                        <SettingsIcon className="h-8 w-8 text-blue-300 animate-pulse" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-white mb-1">⚙️ Настройки уведомлений</h2>
                        <p className="text-blue-200 text-base">Управляйте типами уведомлений</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: "deposit_notifications", title: "Уведомления о депозитах", description: "Получать уведомления при пополнении счета" },
                        { key: "withdrawal_notifications", title: "Уведомления о выводах", description: "Получать уведомления при выводе средств" },
                        { key: "referral_notifications", title: "Уведомления о рефералах", description: "Получать уведомления о новых рефералах" },
                        { key: "system_notifications", title: "Системные уведомления", description: "Получать важные системные сообщения" },
                        { key: "email_notifications", title: "Email уведомления", description: "Дублировать уведомления на email" },
                        { key: "push_notifications", title: "Push уведомления", description: "Получать push-уведомления в браузере" },
                      ].map((setting) => (
                        <div key={setting.key} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-white font-bold text-lg mb-1">{setting.title}</h3>
                              <p className="text-white/60 text-sm">{setting.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={preferences[setting.key as keyof typeof preferences]}
                                onChange={(e) => setPreferences({...preferences, [setting.key]: e.target.checked})}
                                className="sr-only peer" 
                              />
                              <div className="w-14 h-7 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600"></div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={savePreferences}
                      className="w-full mt-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg py-6 rounded-xl shadow-2xl hover:scale-105 transition-all"
                    >
                      Сохранить настройки
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl hover:scale-105 transition-all overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 text-center">
                  <div className="text-5xl mb-4">📬</div>
                  <h3 className="text-white font-bold text-3xl mb-2">{stats.total}</h3>
                  <p className="text-white/70 text-sm">Всего уведомлений</p>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-red-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl hover:scale-105 transition-all overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 text-center">
                  <div className="text-5xl mb-4">🔴</div>
                  <h3 className="text-white font-bold text-3xl mb-2">{stats.unread}</h3>
                  <p className="text-white/70 text-sm">Непрочитанных</p>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl hover:scale-105 transition-all overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-white font-bold text-3xl mb-2">{stats.read}</h3>
                  <p className="text-white/70 text-sm">Прочитанных</p>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl hover:scale-105 transition-all overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 text-center">
                  <div className="text-5xl mb-4">📅</div>
                  <h3 className="text-white font-bold text-3xl mb-2">Сегодня</h3>
                  <p className="text-white/70 text-sm">Последнее обновление</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <AuthGuard>
      <NotificationsContent />
    </AuthGuard>
  )
}
