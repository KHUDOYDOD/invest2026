"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Linkedin, Twitter } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  role: string
  image_emoji: string
  bio: string
  email: string
  linkedin: string
  twitter: string
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch('/api/admin/team?active=true')
        if (response.ok) {
          const data = await response.json()
          setTeamMembers(data.data || [])
        }
      } catch (error) {
        console.error('Error loading team:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
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
          Наша команда
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Профессионалы с многолетним опытом в финансах, технологиях и инвестициях, работающие для вашего успеха
        </p>
      </div>

      {/* Team Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="text-7xl mb-4">{member.image_emoji}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-blue-400 font-semibold mb-4">{member.role}</p>
                <p className="text-slate-300 text-sm leading-relaxed">{member.bio}</p>
              </div>

              <div className="flex justify-center gap-4 pt-6 border-t border-white/10">
                <a
                  href={`mailto:${member.email}`}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                >
                  <Mail className="h-5 w-5 text-blue-400" />
                </a>
                <a
                  href={member.linkedin}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                >
                  <Linkedin className="h-5 w-5 text-blue-400" />
                </a>
                <a
                  href={member.twitter}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                >
                  <Twitter className="h-5 w-5 text-blue-400" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Присоединяйтесь к нашей команде</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Мы всегда ищем талантливых специалистов для развития нашей платформы
          </p>
          <Link href="/careers">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
            >
              Вакансии
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
