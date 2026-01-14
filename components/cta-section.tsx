'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'

export function CTASection() {
  const { t } = useLanguage()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Проверяем наличие токена в localStorage
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative z-10 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        {isLoggedIn ? (
          <>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              👋 Добро пожаловать!
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Управляйте своими инвестициями в личном кабинете
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-white text-black border-4 border-black hover:bg-gray-100 hover:border-gray-800 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/20 px-8 py-6 text-lg font-bold"
                >
                  📊 {t('header.dashboard')}
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              🚀 {t('cta.title')}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-black border-4 border-black hover:bg-gray-100 hover:border-gray-800 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/20 px-8 py-6 text-lg font-bold"
                >
                  ✨ {t('cta.button')}
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-4 border-white bg-transparent text-white hover:bg-white hover:text-black hover:border-black transform hover:scale-105 transition-all duration-300 px-8 py-6 text-lg font-bold shadow-2xl"
                >
                  🔐 {t('header.login')}
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
