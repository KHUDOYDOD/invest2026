"use client"

import { useState, useEffect } from "react"
import { AdminGuard } from "@/components/admin-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Star, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar,
  Filter,
  Trash2,
  Eye,
  MessageCircle
} from "lucide-react"

interface Testimonial {
  id: number
  rating: number
  title: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  adminComment?: string
  user: {
    name: string
    email: string
    location: string
  }
  createdAt: string
  updatedAt: string
  approvedAt?: string
  approvedBy?: string
}

interface Stats {
  pending: number
  approved: number
  rejected: number
  total: number
}

function TestimonialsAdminContent() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, rejected: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [adminComment, setAdminComment] = useState("")
  const [processing, setProcessing] = useState<number | null>(null)

  useEffect(() => {
    loadTestimonials()
  }, [filter])

  const loadTestimonials = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      if (!token) return

      const params = new URLSearchParams({
        status: filter,
        limit: '50'
      })

      const response = await fetch(`/api/admin/testimonials?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTestimonials(data.testimonials)
          setStats(data.stats)
        }
      }
    } catch (error) {
      console.error('Error loading testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (testimonialId: number, status: 'approved' | 'rejected') => {
    try {
      setProcessing(testimonialId)
      const token = localStorage.getItem('authToken')
      if (!token) return

      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          adminComment: adminComment.trim() || undefined
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Обновляем список отзывов
          loadTestimonials()
          setSelectedTestimonial(null)
          setAdminComment("")
        }
      }
    } catch (error) {
      console.error('Error updating testimonial:', error)
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (testimonialId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) return

    try {
      setProcessing(testimonialId)
      const token = localStorage.getItem('authToken')
      if (!token) return

      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        loadTestimonials()
        setSelectedTestimonial(null)
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error)
    } finally {
      setProcessing(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
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
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminGuard>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 mb-6 backdrop-blur-sm">
            <MessageSquare className="h-5 w-5 mr-3 text-purple-400" />
            <span className="text-purple-300 font-medium">Модерация отзывов</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            📝 Управление отзывами
          </h1>
          
          <p className="text-white/80 max-w-2xl mx-auto">
            Модерируйте отзывы пользователей, одобряйте или отклоняйте их для публикации на сайте
          </p>
        </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">{stats.total}</div>
                  <div className="text-white/60 text-sm">Всего отзывов</div>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-500/20 backdrop-blur-xl border-yellow-500/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.pending}</div>
                  <div className="text-yellow-300 text-sm">На модерации</div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-500/20 backdrop-blur-xl border-green-500/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{stats.approved}</div>
                  <div className="text-green-300 text-sm">Одобрено</div>
                </CardContent>
              </Card>
              
              <Card className="bg-red-500/20 backdrop-blur-xl border-red-500/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">{stats.rejected}</div>
                  <div className="text-red-300 text-sm">Отклонено</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { key: 'all', label: 'Все отзывы', count: stats.total },
                { key: 'pending', label: 'На модерации', count: stats.pending },
                { key: 'approved', label: 'Одобренные', count: stats.approved },
                { key: 'rejected', label: 'Отклоненные', count: stats.rejected }
              ].map((filterOption) => (
                <Button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  variant={filter === filterOption.key ? "default" : "outline"}
                  className={`${
                    filter === filterOption.key 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {filterOption.label} ({filterOption.count})
                </Button>
              ))}
            </div>

            {/* Testimonials List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
                <p className="text-white/60 mt-4">Загрузка отзывов...</p>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60 text-lg">Отзывы не найдены</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < testimonial.rating 
                                    ? 'text-yellow-400 fill-yellow-400' 
                                    : 'text-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                          <Badge className={`${getStatusColor(testimonial.status)} border`}>
                            {getStatusIcon(testimonial.status)}
                            <span className="ml-2">{getStatusText(testimonial.status)}</span>
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedTestimonial(testimonial)}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Подробнее
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(testimonial.id)}
                            disabled={processing === testimonial.id}
                            className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <h3 className="text-white font-bold text-xl mb-3">
                        {testimonial.title}
                      </h3>
                      
                      <p className="text-white/80 mb-4 leading-relaxed">
                        {testimonial.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                            {testimonial.user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{testimonial.user.name}</p>
                            <p className="text-white/60 text-sm">{testimonial.user.location}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-white/60 text-sm flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(testimonial.createdAt)}
                          </p>
                          {testimonial.approvedAt && (
                            <p className="text-green-400 text-sm">
                              Одобрен: {formatDate(testimonial.approvedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {testimonial.adminComment && (
                        <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                          <p className="text-blue-300 text-sm font-medium mb-1">
                            Комментарий модератора:
                          </p>
                          <p className="text-blue-200 text-sm">
                            {testimonial.adminComment}
                          </p>
                        </div>
                      )}
                      
                      {testimonial.status === 'pending' && (
                        <div className="mt-4 flex gap-3">
                          <Button
                            onClick={() => handleStatusChange(testimonial.id, 'approved')}
                            disabled={processing === testimonial.id}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Одобрить
                          </Button>
                          
                          <Button
                            onClick={() => handleStatusChange(testimonial.id, 'rejected')}
                            disabled={processing === testimonial.id}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Отклонить
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Modal for detailed view */}
            {selectedTestimonial && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <MessageCircle className="h-6 w-6 text-purple-400" />
                      Детали отзыва
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-6 w-6 ${
                              i < selectedTestimonial.rating 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                      <Badge className={`${getStatusColor(selectedTestimonial.status)} border`}>
                        {getStatusIcon(selectedTestimonial.status)}
                        <span className="ml-2">{getStatusText(selectedTestimonial.status)}</span>
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-bold text-xl mb-2">
                        {selectedTestimonial.title}
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {selectedTestimonial.content}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                        {selectedTestimonial.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedTestimonial.user.name}</p>
                        <p className="text-white/60 text-sm">{selectedTestimonial.user.email}</p>
                        <p className="text-white/60 text-sm">{selectedTestimonial.user.location}</p>
                      </div>
                    </div>
                    
                    {selectedTestimonial.status === 'pending' && (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white font-medium">
                            Комментарий модератора (необязательно)
                          </Label>
                          <Textarea
                            value={adminComment}
                            onChange={(e) => setAdminComment(e.target.value)}
                            placeholder="Добавьте комментарий для пользователя..."
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 mt-2"
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleStatusChange(selectedTestimonial.id, 'approved')}
                            disabled={processing === selectedTestimonial.id}
                            className="bg-green-600 hover:bg-green-700 text-white flex-1"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Одобрить отзыв
                          </Button>
                          
                          <Button
                            onClick={() => handleStatusChange(selectedTestimonial.id, 'rejected')}
                            disabled={processing === selectedTestimonial.id}
                            className="bg-red-600 hover:bg-red-700 text-white flex-1"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Отклонить отзыв
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button
                        onClick={() => {
                          setSelectedTestimonial(null)
                          setAdminComment("")
                        }}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Закрыть
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </AdminGuard>
      )
    }

export default function TestimonialsAdminPage() {
  return (
    <AdminGuard>
      <TestimonialsAdminContent />
    </AdminGuard>
  )
}