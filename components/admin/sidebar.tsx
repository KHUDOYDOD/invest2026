"use client"

import type React from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  LineChart,
  CreditCard,
  Settings,
  MessageSquare,
  FileText,
  BarChart3,
  Shield,
  Database,
  Palette,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Rocket,
  Wallet,
  Percent,
  Activity,
  Star,
  TrendingUp,
  UserCheck,
  Globe,
  Layout,
  Search,
  Cpu,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
  badgeColor?: string
  description?: string
}

type NavCategory = {
  title: string
  icon: React.ReactNode
  color: string
  items: NavItem[]
}

const navCategories: NavCategory[] = [
  {
    title: "📊 Главная",
    icon: <LayoutDashboard className="h-5 w-5" />,
    color: "from-blue-500 to-cyan-500",
    items: [
      {
        label: "Панель управления",
        href: "/admin/dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
        description: "Общая статистика и аналитика"
      },
      {
        label: "Аналитика",
        href: "/admin/analytics",
        icon: <TrendingUp className="h-4 w-4" />,
        badge: "Live",
        badgeColor: "green"
      },
    ],
  },
  {
    title: "👥 Пользователи",
    icon: <Users className="h-5 w-5" />,
    color: "from-purple-500 to-pink-500",
    items: [
      {
        label: "Все пользователи",
        href: "/admin/users",
        icon: <Users className="h-4 w-4" />,
        description: "Управление пользователями"
      },
      {
        label: "Роли и права",
        href: "/admin/roles",
        icon: <UserCheck className="h-4 w-4" />,
      },
      {
        label: "Активность",
        href: "/admin/user-activity",
        icon: <Activity className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "💰 Финансы",
    icon: <Wallet className="h-5 w-5" />,
    color: "from-green-500 to-emerald-500",
    items: [
      {
        label: "Заявки пользователей",
        href: "/admin/requests-simple",
        icon: <CreditCard className="h-4 w-4" />,
        badge: "Упрощено",
        badgeColor: "blue",
        description: "Пополнения и выводы"
      },
      {
        label: "Антифрод система",
        href: "/admin/requests-detailed",
        icon: <Shield className="h-4 w-4" />,
        badge: "Детально",
        badgeColor: "red",
        description: "Проверка мошенничества"
      },
      {
        label: "Инвестиции",
        href: "/admin/investments",
        icon: <LineChart className="h-4 w-4" />,
      },
      {
        label: "Транзакции",
        href: "/admin/transactions",
        icon: <BarChart3 className="h-4 w-4" />,
      },
      {
        label: "Планы прибыли",
        href: "/admin/profit-plans",
        icon: <Percent className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "🎨 Контент сайта",
    icon: <Palette className="h-5 w-5" />,
    color: "from-pink-500 to-rose-500",
    items: [
      {
        label: "Запуски проектов",
        href: "/admin/project-launches",
        icon: <Rocket className="h-4 w-4" />,
        badge: "Новое",
        badgeColor: "green",
        description: "Обратный отсчет до запусков"
      },
      {
        label: "Статистика сайта",
        href: "/admin/statistics",
        icon: <TrendingUp className="h-4 w-4" />,
        badge: "Редактор",
        badgeColor: "cyan",
        description: "Цифры на главной странице"
      },
      {
        label: "Управление сайтом",
        href: "/admin/site-management",
        icon: <Globe className="h-4 w-4" />,
      },
      {
        label: "Компоненты",
        href: "/admin/components-management",
        icon: <Layout className="h-4 w-4" />,
      },
      {
        label: "Отзывы",
        href: "/admin/testimonials",
        icon: <MessageSquare className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "⚙️ Система",
    icon: <Settings className="h-5 w-5" />,
    color: "from-orange-500 to-red-500",
    items: [
      {
        label: "Безопасность",
        href: "/admin/security",
        icon: <Shield className="h-4 w-4" />,
      },
      {
        label: "База данных",
        href: "/admin/database",
        icon: <Database className="h-4 w-4" />,
      },
      {
        label: "Настройки",
        href: "/admin/settings",
        icon: <Settings className="h-4 w-4" />,
      },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["💰 Финансы", "🎨 Контент сайта"])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const toggleCategory = (title: string) => {
    setExpandedCategories((prev) => 
      prev.includes(title) ? prev.filter((cat) => cat !== title) : [...prev, title]
    )
  }

  const isActive = (href: string) => pathname === href

  const filteredCategories = navCategories.map((category) => ({
    ...category,
    items: category.items.filter((item) => 
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.items.length > 0)

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen transition-all duration-300 ease-in-out z-50",
          "bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950",
          "border-r border-white/10 shadow-2xl",
          isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "w-80"
        )}
      >
        {/* Анимированный фон */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent" />
        </div>

        <div className="relative h-full flex flex-col">
          {/* Хедер */}
          <div className="p-5 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-950" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-white">Admin Panel</h2>
                    <p className="text-blue-300 text-xs">Панель управления</p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-white hover:bg-white/10 lg:hidden p-2 rounded-lg"
              >
                {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
              </Button>
            </div>

            {/* Поиск */}
            {!isCollapsed && (
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-md transition-all"
                />
              </div>
            )}
          </div>

          {/* Навигация */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {filteredCategories.map((category) => (
              <div key={category.title} className="mb-2">
                {!isCollapsed && (
                  <button
                    onClick={() => toggleCategory(category.title)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={cn(
                        "p-2 rounded-lg bg-gradient-to-r shadow-md",
                        category.color
                      )}>
                        {category.icon}
                      </div>
                      <span className="font-semibold text-white text-sm">
                        {category.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-gray-400 transition-transform duration-200",
                        expandedCategories.includes(category.title) ? "rotate-180" : ""
                      )}
                    />
                  </button>
                )}

                {/* Элементы категории */}
                <div
                  className={cn(
                    "mt-2 space-y-1 transition-all duration-300",
                    expandedCategories.includes(category.title) || isCollapsed
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  )}
                >
                  {category.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group relative flex items-center justify-between p-3 rounded-lg transition-all duration-200",
                        isCollapsed ? "mx-0" : "ml-4",
                        isActive(item.href)
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 shadow-md"
                          : "hover:bg-white/10 border border-transparent hover:border-white/10"
                      )}
                    >
                      <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                        <div
                          className={cn(
                            "p-2 rounded-lg transition-all duration-200 flex-shrink-0",
                            isActive(item.href)
                              ? "bg-white/20"
                              : "bg-white/5 group-hover:bg-white/15"
                          )}
                        >
                          <div
                            className={cn(
                              "transition-colors",
                              isActive(item.href) ? "text-white" : "text-gray-300 group-hover:text-white"
                            )}
                          >
                            {item.icon}
                          </div>
                        </div>
                        {!isCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div
                              className={cn(
                                "font-medium text-sm transition-colors truncate",
                                isActive(item.href) ? "text-white" : "text-gray-300 group-hover:text-white"
                              )}
                            >
                              {item.label}
                            </div>
                            {item.description && !isActive(item.href) && (
                              <div className="text-xs text-gray-500 truncate mt-0.5">
                                {item.description}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {!isCollapsed && item.badge && (
                        <Badge
                          className={cn(
                            "text-xs px-2 py-0.5 font-medium flex-shrink-0",
                            item.badgeColor === "green" && "bg-green-500/20 text-green-300 border border-green-500/30",
                            item.badgeColor === "blue" && "bg-blue-500/20 text-blue-300 border border-blue-500/30",
                            item.badgeColor === "red" && "bg-red-500/20 text-red-300 border border-red-500/30",
                            item.badgeColor === "cyan" && "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
                            !item.badgeColor && "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}

                      {/* Активный индикатор */}
                      {isActive(item.href) && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Футер */}
          {!isCollapsed && (
            <div className="p-3 border-t border-white/10 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-xl">
              <div className="p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl border border-green-500/30">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">Система активна</p>
                    <p className="text-xs text-green-200 truncate">Все работает отлично</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Кнопка сворачивания для десктопа */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-slate-900 hover:bg-slate-800 border border-white/20 rounded-full text-white shadow-xl p-0 items-center justify-center"
        >
          <ChevronRight className={cn(
            "h-3 w-3 transition-transform duration-300",
            isCollapsed ? "" : "rotate-180"
          )} />
        </Button>
      </aside>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  )
}
