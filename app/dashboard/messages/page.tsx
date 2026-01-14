"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Send, MessageCircle, Clock, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface Message {
  id: number
  subject: string
  message: string
  status: string
  priority: string
  from_user: string
  from_email: string
  admin_reply: string | null
  is_read: boolean
  created_at: string
  replied_at: string | null
}

function MessagesContent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [newSubject, setNewSubject] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        toast.error("Пользователь не авторизован")
        return
      }

      const response = await fetch("/api/messages", {
        headers: {
          "x-user-id": userId,
        },
      })

      const data = await response.json()

      if (data.success) {
        setMessages(data.messages)
      } else {
        toast.error(data.error || "Ошибка при загрузке сообщений")
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast.error("Ошибка при загрузке сообщений")
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newSubject.trim() || !newMessage.trim()) {
      toast.error("Заполните тему и текст сообщения")
      return
    }

    setSending(true)

    try {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        toast.error("Пользователь не авторизован")
        return
      }

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          subject: newSubject,
          message: newMessage,
          priority: "medium",
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Сообщение успешно отправлено")
        setNewSubject("")
        setNewMessage("")
        fetchMessages()
      } else {
        toast.error(data.error || "Ошибка при отправке сообщения")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Ошибка при отправке сообщения")
    } finally {
      setSending(false)
    }
  }

  const markAsRead = async (messageId: number) => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const response = await fetch("/api/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          messageId,
          isRead: true,
        }),
      })

      const data = await response.json()

      if (data.success) {
        fetchMessages()
      }
    } catch (error) {
      console.error("Error marking message as read:", error)
    }
  }

  const deleteMessage = async (messageId: number) => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const response = await fetch(`/api/messages?id=${messageId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": userId,
        },
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Сообщение удалено")
        fetchMessages()
      } else {
        toast.error(data.error || "Ошибка при удалении")
      }
    } catch (error) {
      console.error("Error deleting message:", error)
      toast.error("Ошибка при удалении сообщения")
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

  const getStatusColor = (status: string) => {
    return status === "replied"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800"
  }

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <DashboardHeader />

      <div className="flex relative z-10">
        <DashboardNav activeItem="messages" />

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
              
              <div className="relative z-10 text-center space-y-4">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-full px-6 py-3 border-2 border-blue-400/30 shadow-lg mb-4">
                  <MessageCircle className="h-6 w-6 text-blue-400 animate-pulse" />
                  <span className="text-white font-bold text-lg">Центр сообщений</span>
                  {unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white">{unreadCount} новых</Badge>
                  )}
                </div>

                <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                  💬 Сообщения
                </h1>
                
                <p className="text-blue-100 max-w-2xl mx-auto text-xl font-medium">
                  Все ваши сообщения и уведомления в одном месте
                </p>
              </div>
            </div>

            <Tabs defaultValue="inbox" className="w-full">
              <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-xl p-1">
                <TabsTrigger value="inbox" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 text-white rounded-lg">
                  Входящие
                </TabsTrigger>
                <TabsTrigger value="sent" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 text-white rounded-lg">
                  Отправленные
                </TabsTrigger>
                <TabsTrigger value="new" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 text-white rounded-lg">
                  Новое
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inbox" className="space-y-6 mt-6">
                <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-2xl rounded-2xl p-6 border-2 border-white/20 shadow-xl">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                    <Input 
                      placeholder="Поиск сообщений..." 
                      className="pl-12 bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 h-14 text-lg focus:border-blue-400 transition-all"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="text-white text-xl">Загрузка сообщений...</div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-2xl rounded-3xl p-12 border-2 border-white/20 shadow-xl text-center">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-white font-bold text-2xl mb-2">Нет сообщений</h3>
                    <p className="text-white/70 text-lg">У вас пока нет сообщений</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id}
                        className="relative bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-2xl p-6 border-2 border-white/20 shadow-xl hover:scale-[1.02] transition-all cursor-pointer overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        
                        {!message.is_read && (
                          <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                        )}

                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-white font-bold text-xl">{message.subject}</h3>
                                <Badge className={getStatusColor(message.status)}>
                                  {message.status === "replied" ? "Отвечено" : message.is_read ? "Прочитано" : "Новое"}
                                </Badge>
                              </div>
                              <p className="text-blue-200 text-sm mb-2">От: {message.from_user || "Служба поддержки"}</p>
                            </div>
                            <div className="flex items-center space-x-2 text-white/60 text-sm">
                              <Clock className="h-4 w-4" />
                              <span>{formatDate(message.created_at)}</span>
                            </div>
                          </div>
                          <p className="text-white/80 text-base leading-relaxed mb-3">{message.message}</p>
                          
                          {message.admin_reply && (
                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-3">
                              <p className="text-green-300 font-bold text-sm mb-2">Ответ от администратора:</p>
                              <p className="text-white/90 text-sm">{message.admin_reply}</p>
                              {message.replied_at && (
                                <p className="text-white/50 text-xs mt-2">{formatDate(message.replied_at)}</p>
                              )}
                            </div>
                          )}

                          <div className="flex space-x-3 mt-4">
                            {!message.is_read && (
                              <Button 
                                onClick={() => markAsRead(message.id)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Отметить прочитанным
                              </Button>
                            )}
                            <Button 
                              onClick={() => deleteMessage(message.id)}
                              variant="outline" 
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              Удалить
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sent" className="space-y-6 mt-6">
                <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-2xl rounded-3xl p-12 border-2 border-white/20 shadow-xl text-center">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-white font-bold text-2xl mb-2">Нет отправленных сообщений</h3>
                  <p className="text-white/70 text-lg">Отправленные сообщения будут отображаться здесь</p>
                </div>
              </TabsContent>

              <TabsContent value="new" className="space-y-6 mt-6">
                <div className="relative bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="p-4 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl shadow-lg border border-white/20">
                        <Send className="h-8 w-8 text-blue-300 animate-pulse" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-white mb-1">✉️ Новое сообщение</h2>
                        <p className="text-blue-200 text-base">Напишите в службу поддержки</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <Label htmlFor="subject" className="text-white font-bold text-lg mb-3 block">
                          📝 Тема сообщения
                        </Label>
                        <Input
                          id="subject"
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          placeholder="Введите тему сообщения"
                          className="bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 h-14 text-lg focus:border-blue-400 transition-all"
                        />
                      </div>
                      
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <Label htmlFor="message" className="text-white font-bold text-lg mb-3 block">
                          ✍️ Текст сообщения
                        </Label>
                        <Textarea
                          id="message"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Опишите ваш вопрос или проблему..."
                          className="bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 min-h-[200px] text-lg focus:border-blue-400 transition-all"
                        />
                      </div>

                      <Button 
                        onClick={sendMessage}
                        disabled={sending}
                        className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-xl py-7 rounded-xl shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
                      >
                        <Send className="h-6 w-6 mr-3" />
                        {sending ? "Отправка..." : "Отправить сообщение"}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl hover:scale-105 transition-all overflow-hidden group cursor-pointer">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 text-center">
                  <div className="text-5xl mb-4">📞</div>
                  <h3 className="text-white font-bold text-lg mb-2">Связаться с поддержкой</h3>
                  <p className="text-white/70 text-sm">Ответим в течение 5 минут</p>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl hover:scale-105 transition-all overflow-hidden group cursor-pointer">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 text-center">
                  <div className="text-5xl mb-4">❓</div>
                  <h3 className="text-white font-bold text-lg mb-2">База знаний</h3>
                  <p className="text-white/70 text-sm">Ответы на частые вопросы</p>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl hover:scale-105 transition-all overflow-hidden group cursor-pointer">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 text-center">
                  <div className="text-5xl mb-4">💬</div>
                  <h3 className="text-white font-bold text-lg mb-2">Онлайн чат</h3>
                  <p className="text-white/70 text-sm">Общайтесь в реальном времени</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <AuthGuard>
      <MessagesContent />
    </AuthGuard>
  )
}
