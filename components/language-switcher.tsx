"use client"

import { useState } from 'react'
import { useLanguage, languages, Language } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe, Check } from 'lucide-react'

// Компонент флага с яркими цветами
function FlagIcon({ code, size = 'md' }: { code: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const flagStyles: Record<string, JSX.Element> = {
    ru: (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white/30 shadow-lg flex flex-col`}>
        <div className="h-1/3 bg-white"></div>
        <div className="h-1/3 bg-blue-600"></div>
        <div className="h-1/3 bg-red-600"></div>
      </div>
    ),
    en: (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white/30 shadow-lg bg-blue-700 relative`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-0.5 bg-white"></div>
          <div className="absolute w-0.5 h-full bg-white"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-1 bg-red-600 rotate-45 origin-center"></div>
          <div className="absolute w-full h-1 bg-red-600 -rotate-45 origin-center"></div>
        </div>
      </div>
    ),
    kk: (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white/30 shadow-lg bg-cyan-400 flex items-center justify-center`}>
        <div className="text-yellow-400 text-lg font-bold">★</div>
      </div>
    ),
    tg: (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white/30 shadow-lg flex flex-col`}>
        <div className="h-1/3 bg-red-600"></div>
        <div className="h-1/3 bg-white"></div>
        <div className="h-1/3 bg-green-600"></div>
      </div>
    ),
    ky: (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white/30 shadow-lg bg-red-600 flex items-center justify-center`}>
        <div className="text-yellow-400 text-2xl">☀</div>
      </div>
    ),
    uz: (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white/30 shadow-lg flex flex-col`}>
        <div className="h-1/3 bg-blue-500"></div>
        <div className="h-1/3 bg-white flex items-center justify-center">
          <div className="text-red-600 text-xs">☪</div>
        </div>
        <div className="h-1/3 bg-green-600"></div>
      </div>
    ),
  }

  return flagStyles[code] || (
    <div className={`${sizeClasses[size]} rounded-full bg-gray-500 border-2 border-white/30 shadow-lg`} />
  )
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)

  const currentLanguage = languages[language]

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl px-3 py-2 h-auto flex items-center gap-2"
        >
          <FlagIcon code={language} size="sm" />
          <span className="hidden md:inline text-sm font-medium">{currentLanguage.name}</span>
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white rounded-xl p-2">
        <div className="px-3 py-2 text-xs text-white/60 font-semibold uppercase tracking-wider">
          Выберите язык
        </div>
        {Object.entries(languages).map(([code, lang]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => {
              setLanguage(code as Language)
              setOpen(false)
            }}
            className="flex items-center justify-between cursor-pointer text-white/90 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white p-3 rounded-lg my-1"
          >
            <span className="flex items-center gap-3">
              <FlagIcon code={code} size="md" />
              <span className="font-medium text-base">{lang.name}</span>
            </span>
            {language === code && (
              <Check className="h-5 w-5 text-green-400 flex-shrink-0 font-bold" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
