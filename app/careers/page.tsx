"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Clock, Briefcase, DollarSign } from "lucide-react"

interface Career {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string
  responsibilities: string
  salary_range: string
}

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null)

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await fetch('/api/admin/careers?active=true')
        if (response.ok) {
          const data = await response.json()
          setCareers(data.data || [])
        }
      } catch (error) {
        console.error('Error loading careers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCareers()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="outline" className="border-slate-600 bg-slate-800/50 text-white hover:bg-slate-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            На главную
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
          Карьера в Invest2026
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Присоединяйтесь к нашей команде профессионалов и развивайте будущее инвестиций
        </p>
      </div>

      {/* Vacancies */}
      <div className="container mx-auto px-4 py-16">
        {careers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-2xl font-bold text-white mb-4">Вакансий пока нет</h3>
            <p className="text-slate-400">Следите за обновлениями на нашем сайте</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {careers.map((career) => (
              <div
                key={career.id}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-300 shadow-2xl cursor-pointer"
                onClick={() => setSelectedCareer(career)}
              >
                <h3 className="text-2xl font-bold text-white mb-4">{career.title}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-slate-300">
                    <Briefcase className="h-5 w-5 mr-3 text-blue-400" />
                    {career.department}
                  </div>
                  <div className="flex items-center text-slate-300">
                    <MapPin className="h-5 w-5 mr-3 text-green-400" />
                    {career.location}
                  </div>
                  <div className="flex items-center text-slate-300">
                    <Clock className="h-5 w-5 mr-3 text-purple-400" />
                    {career.type === 'full-time' ? 'Полная занятость' : career.type === 'part-time' ? 'Частичная занятость' : 'Контракт'}
                  </div>
                  {career.salary_range && (
                    <div className="flex items-center text-slate-300">
                      <DollarSign className="h-5 w-5 mr-3 text-yellow-400" />
                      {career.salary_range}
                    </div>
                  )}
                </div>

                <p className="text-slate-400 mb-6 line-clamp-3">{career.description}</p>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Подробнее
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal with career details */}
      {selectedCareer && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCareer(null)}
        >
          <div
            className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-white mb-6">{selectedCareer.title}</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-3">Описание</h3>
                <p className="text-slate-300 leading-relaxed">{selectedCareer.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-green-400 mb-3">Требования</h3>
                <div className="text-slate-300 leading-relaxed whitespace-pre-line">{selectedCareer.requirements}</div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-purple-400 mb-3">Обязанности</h3>
                <div className="text-slate-300 leading-relaxed whitespace-pre-line">{selectedCareer.responsibilities}</div>
              </div>

              {selectedCareer.salary_range && (
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">Зарплата</h3>
                  <p className="text-slate-300">{selectedCareer.salary_range}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => window.location.href = '/contacts'}
              >
                Откликнуться
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
                onClick={() => setSelectedCareer(null)}
              >
                Закрыть
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
