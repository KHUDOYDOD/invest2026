"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star, MessageSquare, Send, CheckCircle, Clock, XCircle } from "lucide-react"
import { useUser } from "@/contexts/user-context"

interface UserTestimonial {
  id: number
  rating: number
  title: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  adminComment?: string
  createdAt: string
  updatedAt: string
}

function TestimonialsContent() {
  const { user } = useUser()
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [userTestimonials, setUserTestimonials] = useState<UserTestimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserTestimonials()
  }, [])

  const loadUserTestimonials = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return

      const response = await fetch('/api/user/testimonials', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUserTestimonials(data.testimonials)
        }
      }
    } catch (error) {
      console.error('Error loading user testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      setMessage("Пожалуйста, заполните все поля")
      return
    }

    if (content.length > 1000) {
      setMessage("Отзыв слишком длинный (максимум 1000 символов)")
      return
    }

    setIsSubmitting(true)
    setMessage("")

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setMessage("Необходимо войти в систему")
        return
      }

      const response = await fetch('/api/testimonials/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          title: title.trim(),
          content: content.trim()
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage("Отзыв отправлен на модерацию. Спасибо!")
        setTitle("")
        setContent("")
        setRating(5)
        loadUserTestimonials() // Обновляем список отзывов
      } else {
        setMessage(data.error || "Произошла ошибка при отправке отзыва")
      }
    } catch (error) {
      setMessage("Произошла ошибка при отправке отзыва")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-400" />
      default:
        return <Clock className="h-5 w-5 text-yellow-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Одобрен'
      case 'rejected':
        return 'Отклонен'
      default:
        return 'На модерации'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'rejected':
        return 'text-red-400 bg-red-500/20 border-red-500/30'
      default:
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <DashboardHeader />

      <div className="flex relative z-10">
        <DashboardNav activeItem="testimonials" />

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 mb-6 backdrop-blur-sm">
                <MessageSquare className="h-5 w-5 mr-3 text-purple-400" />
                <span className="text-purple-300 font-medium">Отзывы</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                ⭐ Ваши отзывы
              </h1>
              
              <p className="text-white/80 max-w-2xl mx-auto">
                Поделитесь своим опытом использования нашей платформы. Все отзывы проходят модерацию перед публикацией
              </p>
            </div>

            {/* Create Testimonial Form */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Star className="h-6 w-6 text-yellow-400" />
                  Написать отзыв
                </CardTitle>
                <CardDescription className="text-white/70">
                  Расскажите о своем опыте работы с нашей платформой
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Rating */}
                  <div className="space-y-2">
                    <Label className="text-white font-medium">Оценка</Label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="transition-colors"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= rating 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-400 hover:text-yellow-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-3 text-white/80">
                        {rating} из 5 звезд
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white font-medium">
                      Заголовок отзыва
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Краткое описание вашего опыта"
                      maxLength={200}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <div className="text-right text-sm text-white/60">
                      {title.length}/200
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-white font-medium">
                      Текст отзыва
                    </Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Расскажите подробнее о своем опыте использования платформы..."
                      rows={6}
                      maxLength={1000}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
                    />
                    <div className="text-right text-sm text-white/60">
                      {content.length}/1000
                    </div>
                  </div>

                  {/* Message */}
                  {message && (
                    <div className={`p-4 rounded-lg ${
                      message.includes('Спасибо') 
                        ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                        : 'bg-red-500/20 border border-red-500/30 text-red-400'
                    }`}>
                      {message}
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !title.trim() || !content.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Отправляем...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Отправить отзыв
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* User's Testimonials */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-blue-400" />
                  Ваши отзывы
                </CardTitle>
                <CardDescription className="text-white/70">
                  История ваших отзывов и их статус модерации
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
                    <p className="text-white/60 mt-4">Загрузка отзывов...</p>
                  </div>
                ) : userTestimonials.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">У вас пока нет отзывов</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userTestimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="bg-white/5 rounded-xl p-6 border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < testimonial.rating 
                                      ? 'text-yellow-400 fill-yellow-400' 
                                      : 'text-gray-400'
                                  }`}
                                />
                              ))}
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(testimonial.status)}`}>
                              {getStatusIcon(testimonial.status)}
                              <span className="text-sm font-medium">
                                {getStatusText(testimonial.status)}
                              </span>
                            </div>
                          </div>
                          <span className="text-white/60 text-sm">
                            {new Date(testimonial.createdAt).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                        
                        <h3 className="text-white font-bold text-lg mb-2">
                          {testimonial.title}
                        </h3>
                        
                        <p className="text-white/80 mb-4">
                          {testimonial.content}
                        </p>
                        
                        {testimonial.adminComment && (
                          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                            <p className="text-blue-300 text-sm font-medium mb-1">
                              Комментарий модератора:
                            </p>
                            <p className="text-blue-200 text-sm">
                              {testimonial.adminComment}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function TestimonialsPage() {
  return (
    <AuthGuard>
      <TestimonialsContent />
    </AuthGuard>
  )
}