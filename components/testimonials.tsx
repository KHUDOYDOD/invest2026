"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, ArrowRight, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

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

export function Testimonials() {
  const { t } = useLanguage()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials?limit=5')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTestimonials(data.testimonials)
          setTotalCount(data.pagination.total)
        }
      }
    } catch (error) {
      console.error('Error loading testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const itemsPerPage = 3
  const totalPages = Math.ceil(testimonials.length / itemsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const visibleTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage,
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long'
    })
  }

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
            <p className="text-white/60 mt-4">{t('common.loading')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-6 backdrop-blur-sm animate-pulse">
            <Star className="h-5 w-5 mr-3 text-yellow-400 fill-yellow-400" />
            <span className="text-indigo-300 font-medium">Реальные отзывы</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            ⭐ {t('testimonials.title')}
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            {t('testimonials.subtitle')}
          </p>
          
          {totalCount > 5 && (
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30 max-w-md mx-auto">
              <p className="text-blue-300 font-medium">
                Показано 5 из {totalCount} отзывов
              </p>
            </div>
          )}
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 text-lg">Отзывы пока не добавлены</p>
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="grid md:grid-cols-3 gap-6">
                {visibleTestimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
                          />
                        ))}
                        <span className="ml-2 text-white/60 text-sm">
                          {formatDate(testimonial.approvedAt)}
                        </span>
                      </div>
                      
                      <h3 className="text-white font-bold text-lg mb-3 group-hover:text-yellow-400 transition-colors">
                        {testimonial.title}
                      </h3>
                      
                      <p className="mb-6 text-white/80 leading-relaxed">
                        {testimonial.content}
                      </p>
                      
                      <div className="flex items-center">
                        <div className="mr-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                            {testimonial.user.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-white">{testimonial.user.name}</p>
                          <p className="text-sm text-white/60">{testimonial.user.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={prevSlide} 
                    className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={i === currentIndex ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentIndex(i)}
                      className={`w-8 h-8 p-0 rounded-full ${
                        i === currentIndex 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                          : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={nextSlide} 
                    className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Link to all testimonials */}
            {totalCount > 5 && (
              <div className="text-center mt-12">
                <Link href="/testimonials">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto">
                    <MessageSquare className="h-5 w-5" />
                    Посмотреть все {totalCount} отзывов
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
