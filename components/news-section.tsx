"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, Newspaper } from "lucide-react"

// Эти данные будут управляться через админ панель
const mockNews = [
  {
    id: 1,
    title: "Добро пожаловать на нашу платформу",
    description: "Мы рады приветствовать вас на нашей инвестиционной платформе.",
    category: "Общие",
    date: "2024-12-01",
    time: "10:00",
    image: "/placeholder.svg?height=200&width=300",
    isActive: true,
  },
  {
    id: 2,
    title: "Начинаем работу",
    description: "Платформа готова к приему первых инвесторов.",
    category: "Новости",
    date: "2024-12-01",
    time: "12:00",
    image: "/placeholder.svg?height=200&width=300",
    isActive: true,
  },
]

export function NewsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [news, setNews] = useState(mockNews)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Фильтруем только активные новости
  const activeNews = news.filter((article) => article.isActive)

  if (activeNews.length === 0) {
    return null // Не показываем секцию, если нет активных новостей
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 mb-6 backdrop-blur-sm">
            <Newspaper className="h-5 w-5 mr-3 text-blue-400 animate-pulse" />
            <span className="text-blue-300 font-medium">Последние обновления</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            📰 Новости и обновления
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Будьте в курсе последних событий и обновлений платформы
          </p>
        </div>

        <div
          className={`grid md:grid-cols-${Math.min(activeNews.length, 3)} gap-8 ${isVisible ? "animate-scale-in" : "opacity-0"}`}
        >
          {activeNews.map((article, index) => (
            <Card
              key={article.id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">{article.category}</Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-white group-hover:text-blue-400 transition-colors duration-300">
                  {article.title}
                </CardTitle>
                <CardDescription className="text-slate-300">{article.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(article.date).toLocaleDateString("ru-RU")}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {article.time}
                  </div>
                </div>

                <Button variant="ghost" className="w-full text-blue-400 hover:text-white hover:bg-blue-600/20 group">
                  Читать далее
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
          >
            <Newspaper className="h-5 w-5 mr-2" />
            Все новости
          </Button>
        </div>
      </div>
    </section>
  )
}
