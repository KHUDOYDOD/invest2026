"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, MapPin, MessageCircle } from "lucide-react"

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="outline" className="border-slate-600 bg-slate-800/50 text-white hover:bg-slate-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            На главную
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Контакты
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Свяжитесь с нами любым удобным способом
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            <Mail className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Email</h3>
            <a href="mailto:support@invest2026.com" className="text-slate-300 hover:text-blue-400">
              support@invest2026.com
            </a>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            <Phone className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Телефон</h3>
            <a href="tel:+74951234567" className="text-slate-300 hover:text-green-400">
              +7 (495) 123-45-67
            </a>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            <MapPin className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Адрес</h3>
            <p className="text-slate-300">
              Москва, ул. Тверская, д. 1
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            <MessageCircle className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Telegram</h3>
            <a href="https://t.me/invest2026" className="text-slate-300 hover:text-cyan-400" target="_blank">
              @invest2026
            </a>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            <MessageCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">WhatsApp</h3>
            <a href="https://wa.me/74951234567" className="text-slate-300 hover:text-green-400" target="_blank">
              +7 (495) 123-45-67
            </a>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            <Mail className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Партнерам</h3>
            <a href="mailto:partners@invest2026.com" className="text-slate-300 hover:text-yellow-400">
              partners@invest2026.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
