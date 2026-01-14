"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  MessageSquare, 
  ArrowLeft, 
  Filter, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Calendar,
  Award,
  ThumbsUp,
  Quote
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface Testimonial {
  id: number
  rating: number
  title: string
  content: string
  user: {
    name: string
    email: string
    avatar: string
    location: string
  }
  createdAt: string
  approvedAt: string
}

interface Stats {
  total: number
  averageRating: number
  ratingDistribution: { [key: number]: number }
  positivePercentage: number
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    averageRating: 0,
    ratingDistribution: {},
    positivePercentage: 0
  })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)

  useEffect(() => {
    loadTestimonials()
  }, [page, ratingFilter])

  const loadTestimonials = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      })
      
      const response = await fetch(`/api/testimonials?${params}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          let filteredTestimonials = data.testimonials
          
          if (ratingFilter) {
            filteredTestimonials = data.testimonials.filter((t: Testimonial) => t.rating === ratingFilter)
          }
          
          setTestimonials(filteredTestimonials)
          setTotalPages(data.pagination.totalPages)
          
          // Вычисляем статистику
          const total = data.testimonials.length
          const ratings = data.testimonials.map((t: Testimonial) => t.rating)
          const averageRating = ratings.reduce((a: number, b: number) => a + b, 0) / total
          const positivePercentage = Math.round((ratings.filter((r: number) => r >= 4).length / total) * 100)
          
          const ratingDistribution: { [key: number]: number } = {}
          for (let i = 1; i <= 5; i++) {
            ratingDistribution[i] = ratings.filter((r: number) => r === i).length
          }
          
          setStats({
            total,
            averageRating: Math.round(averageRating * 10) / 10,
            ratingDistribution,
            positivePercentage
          })
        }
      }
    } catch (error) {
      console.error('Error loading testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRatingText = (rating: number) => {
    const texts = {
      5: 'Превосходно',
      4: 'Отлично', 
      3: 'Хорошо',
      2: 'Удовлетворительно',
      1: 'Неудовлетворительно'
    }
    return texts[rating as keyof typeof texts] || 'Не указано'
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 5) return 'text-green-400'
    if (rating >= 4) return 'text-blue-400'
    if (rating >= 3) return 'text-yellow-400'
    if (rating >= 2) return 'text-orange-400'
    return 'text-red-400'
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Сегодня'
    if (diffInDays === 1) return 'Вчера'
    if (diffInDays < 7) return `${diffInDays} дней назад`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} недель назад`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} месяцев назад`
    return `${Math.floor(diffInDays / 365)} лет назад`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-16">
              <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors group">
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Вернуться на главную
              </Link>
              
              <div className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 mb-8 backdrop-blur-sm">
                <MessageSquare className="h-6 w-6 mr-3 text-purple-400" />
                <span className="text-purple-300 font-semibold text-lg">Отзывы клиентов</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8 leading-tight">
                ⭐ Отзывы наших клиентов
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12 leading-relaxed">
                Честные отзывы от реальных инвесторов. Все отзывы проверены и одобрены администрацией для обеспечения достоверности информации
              </p>

              {/* Enhanced Stats */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
                <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 hover:scale-105 transition-transform">
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
                    <div className="text-sm text-white/70">Всего отзывов</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 hover:scale-105 transition-transform">
                  <CardContent className="p-6 text-center">
                    <Star className="h-8 w-8 text-yellow-400 mx-auto mb-3 fill-yellow-400" />
                    <div className="text-3xl font-bold text-white mb-1">{stats.averageRating}</div>
                    <div className="text-sm text-white/70">Средняя оценка</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 hover:scale-105 transition-transform">
                  <CardContent className="p-6 text-center">
                    <ThumbsUp className="h-8 w-8 text-green-400 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">{stats.positivePercentage}%</div>
                    <div className="text-sm text-white/70">Положительных</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 hover:scale-105 transition-transform">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">100%</div>
                    <div className="text-sm text-white/70">Проверенных</div>
                  </CardContent>
                </Card>
              </div>

              {/* Rating Distribution */}
              <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/30 max-w-4xl mx-auto">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-blue-400" />
                  Распределение оценок
                </h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = stats.ratingDistribution[rating] || 0
                    const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
                    return (
                      <div key={rating} className="flex items-center gap-4">
                        <div className="flex items-center gap-1 w-20">
                          <span className="text-white font-medium">{rating}</span>
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        </div>
                        <div className="flex-1 bg-slate-700/50 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${getRatingColor(rating)} bg-current`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-white/70 text-sm w-16 text-right">
                          {count} ({percentage}%)
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Enhanced Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              <Button
                onClick={() => setRatingFilter(null)}
                variant={ratingFilter === null ? "default" : "outline"}
                className={`${
                  ratingFilter === null 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                } px-6 py-3 rounded-full transition-all duration-300`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Все отзывы ({stats.total})
              </Button>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating] || 0
                return (
                  <Button
                    key={rating}
                    onClick={() => setRatingFilter(rating)}
                    variant={ratingFilter === rating ? "default" : "outline"}
                    className={`${
                      ratingFilter === rating 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    } px-6 py-3 rounded-full transition-all duration-300`}
                  >
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {rating} - {getRatingText(rating)} ({count})
                  </Button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials Grid */}
        <section className="pb-20 px-4">
          <div className="container mx-auto max-w-7xl">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 mx-auto mb-6"></div>
                <p className="text-white/60 text-xl">Загрузка отзывов...</p>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-16">
                <MessageSquare className="h-20 w-20 text-white/40 mx-auto mb-6" />
                <p className="text-white/60 text-xl">Отзывы с такой оценкой не найдены</p>
                <Button 
                  onClick={() => setRatingFilter(null)}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                >
                  Показать все отзывы
                </Button>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {testimonials.map((testimonial, index) => (
                    <Card 
                      key={testimonial.id} 
                      className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:bg-white/15 hover:scale-105 transition-all duration-500 group h-full relative overflow-hidden"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-bl-full"></div>
                      <Quote className="absolute top-4 right-4 h-6 w-6 text-purple-400/50" />
                      
                      <CardContent className="p-8 flex flex-col h-full relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 transition-colors ${
                                  i < testimonial.rating 
                                    ? "text-yellow-400 fill-yellow-400" 
                                    : "text-gray-500"
                                }`}
                              />
                            ))}
                          </div>
                          <Badge 
                            className={`${getRatingColor(testimonial.rating)} bg-current/20 border-current/30`}
                          >
                            {getRatingText(testimonial.rating)}
                          </Badge>
                        </div>
                        
                        <h3 className="text-white font-bold text-xl mb-4 group-hover:text-yellow-400 transition-colors leading-tight">
                          {testimonial.title}
                        </h3>
                        
                        <p className="mb-8 text-white/80 leading-relaxed flex-grow text-lg">
                          "{testimonial.content}"
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                          <div className="flex items-center">
                            <div className="mr-4">
                              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {testimonial.user.name.charAt(0)}
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold text-white text-lg">{testimonial.user.name}</p>
                              <p className="text-sm text-white/60 flex items-center">
                                <Award className="h-4 w-4 mr-1" />
                                {testimonial.user.location}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-white/60 text-sm flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {getTimeAgo(testimonial.approvedAt)}
                            </p>
                            <p className="text-white/40 text-xs mt-1">
                              {formatDate(testimonial.approvedAt)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <Button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 px-6 py-3 rounded-full"
                    >
                      ← Предыдущая
                    </Button>
                    
                    <div className="flex space-x-1">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
                        return (
                          <Button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            variant={pageNum === page ? "default" : "outline"}
                            className={`${
                              pageNum === page 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                            } w-12 h-12 rounded-full`}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>
                    
                    <Button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 px-6 py-3 rounded-full"
                    >
                      Следующая →
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}