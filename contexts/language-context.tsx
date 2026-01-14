"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

// Импорт всех переводов
import ru from '@/lib/i18n/locales/ru.json'
import en from '@/lib/i18n/locales/en.json'
import kk from '@/lib/i18n/locales/kk.json'
import tg from '@/lib/i18n/locales/tg.json'
import ky from '@/lib/i18n/locales/ky.json'
import uz from '@/lib/i18n/locales/uz.json'

export type Language = 'ru' | 'en' | 'kk' | 'tg' | 'ky' | 'uz'

export const languages = {
  ru: { name: 'Русский', flag: '🇷🇺', translations: ru },
  en: { name: 'English', flag: '🇬🇧', translations: en },
  kk: { name: 'Қазақша', flag: '🇰🇿', translations: kk },
  tg: { name: 'Тоҷикӣ', flag: '🇹🇯', translations: tg },
  ky: { name: 'Кыргызча', flag: '🇰🇬', translations: ky },
  uz: { name: 'O\'zbekcha', flag: '🇺🇿', translations: uz },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Загружаем сохраненный язык из localStorage
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && languages[savedLanguage]) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = languages[language].translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Если перевод не найден, возвращаем ключ
        console.warn(`Translation missing for key: ${key} in language: ${language}`)
        return key
      }
    }

    return typeof value === 'string' ? value : key
  }

  if (!mounted) {
    return null
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
