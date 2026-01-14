"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Zap,
  RefreshCw,
  BarChart3,
  Users,
  Clock,
  Award,
  Lock,
  TrendingUp,
  Headphones,
  CreditCard,
  Globe,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Features() {
  const { t } = useLanguage()
  const features = [
    {
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      title: t('features.security_title'),
      description: t('features.security_desc'),
      badge: "Сертифицировано",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Zap className="h-12 w-12 text-green-600" />,
      title: "Мгновенные выплаты",
      description: "Автоматические выплаты прибыли каждые 24 часа на любую удобную платежную систему без задержек и скрытых комиссий",
      badge: "24/7",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-purple-600" />,
      title: t('features.profit_title'),
      description: t('features.profit_desc'),
      badge: "До 3.2%",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-orange-600" />,
      title: "Детальная аналитика",
      description: "Полная статистика инвестиций, доходов и операций в режиме реального времени с возможностью экспорта отчетов",
      badge: "Real-time",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Users className="h-12 w-12 text-indigo-600" />,
      title: "Партнерская программа",
      description: "Многоуровневая реферальная система с комиссией до 10% от депозитов приглашенных инвесторов + бонусы за активность",
      badge: "До 10%",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Headphones className="h-12 w-12 text-teal-600" />,
      title: t('features.support_title'),
      description: t('features.support_desc'),
      badge: "5 мин",
      color: "from-teal-500 to-cyan-500",
    },
    {
      icon: <Award className="h-12 w-12 text-yellow-600" />,
      title: "Лицензированная деятельность",
      description: "Официально зарегистрированная компания с международными лицензиями и сертификатами качества финансовых услуг",
      badge: "Лицензия",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Lock className="h-12 w-12 text-red-600" />,
      title: "Страхование депозитов",
      description: "Все инвестиции застрахованы в международной страховой компании на сумму до $100,000 на каждого клиента",
      badge: "$100K",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: <CreditCard className="h-12 w-12 text-blue-600" />,
      title: "Множество способов оплаты",
      description: "Поддержка всех популярных платежных систем: банковские карты, электронные кошельки, криптовалюты и банковские переводы",
      badge: "20+ методов",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: <RefreshCw className="h-12 w-12 text-green-600" />,
      title: "Автоматическое реинвестирование",
      description: "Возможность автоматического реинвестирования прибыли для максимизации дохода с гибкими настройками процентов",
      badge: "Авто",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: <Globe className="h-12 w-12 text-purple-600" />,
      title: "Международная платформа",
      description: "Работаем в 50+ странах мира с поддержкой множества валют и соблюдением международных стандартов безопасности",
      badge: "50+ стран",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: <Clock className="h-12 w-12 text-orange-600" />,
      title: t('features.withdrawal_title'),
      description: t('features.withdrawal_desc'),
      badge: "2 мин",
      color: "from-orange-500 to-yellow-500",
    },
  ]

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-8 backdrop-blur-sm animate-pulse">
            <Award className="h-5 w-5 mr-3 text-yellow-400" />
            <span className="text-blue-300 font-bold">Преимущества платформы</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent mb-8 leading-tight">
            {t('features.title')} 🏆
          </h2>
          <p className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200 max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
            {t('features.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="px-6 py-3 text-base bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-green-400/50 shadow-lg shadow-green-500/30 hover:scale-110 transition-transform">
              <Shield className="h-5 w-5 mr-2 animate-pulse" />
              🔒 SSL Сертификат
            </Badge>
            <Badge className="px-6 py-3 text-base bg-gradient-to-r from-yellow-500 to-orange-600 border-2 border-yellow-400/50 shadow-lg shadow-yellow-500/30 hover:scale-110 transition-transform">
              <Award className="h-5 w-5 mr-2 animate-pulse" style={{ animationDelay: '0.3s' }} />
              🏅 Международная лицензия
            </Badge>
            <Badge className="px-6 py-3 text-base bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-blue-400/50 shadow-lg shadow-blue-500/30 hover:scale-110 transition-transform">
              <Users className="h-5 w-5 mr-2 animate-pulse" style={{ animationDelay: '0.6s' }} />
              👥 50,000+ инвесторов
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-2 border-slate-700 shadow-2xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-rotate-2 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse`}
              />

              {/* Glowing orb */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.color} rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-all duration-700`}></div>

              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 relative`}>
                    <div className="relative z-10">{feature.icon}</div>
                    <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
                  </div>
                  <Badge
                    className={`bg-gradient-to-r ${feature.color} text-white border-2 border-white/30 font-black text-sm px-4 py-2 shadow-lg animate-pulse`}
                  >
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                  {feature.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="relative">
                <CardDescription className="text-slate-300 text-base leading-relaxed group-hover:text-white transition-colors">
                  {feature.description}
                </CardDescription>
              </CardContent>

              <div
                className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 shadow-lg`}
              />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
