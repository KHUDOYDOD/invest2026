"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Shield, Bell, Settings, Lock, Mail, Phone, Globe, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

function SettingsContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <DashboardHeader />

      <div className="flex relative z-10">
        <DashboardNav activeItem="settings" />

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden"
            >
              {/* Animated Orbs */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
              
              <div className="relative z-10 text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-full px-6 py-3 border-2 border-blue-400/30 shadow-lg mb-4"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <Settings className="h-6 w-6 text-blue-400" />
                  </motion.div>
                  <span className="text-white font-bold text-lg">Персональные настройки</span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                  ⚙️ Настройки
                </h1>
                
                <p className="text-blue-100 max-w-2xl mx-auto text-xl font-medium">
                  Управляйте своим аккаунтом и настройками безопасности
                </p>
              </div>
            </motion.div>

            <div className="grid gap-8">
              {/* Profile Settings */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden"
              >
                {/* Animated Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-8">
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="p-4 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl shadow-lg border border-white/20"
                    >
                      <User className="h-8 w-8 text-blue-300" />
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-black text-white mb-1">👤 Профиль</h2>
                      <p className="text-blue-200 text-sm">Основная информация о вашем аккаунте</p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <Label htmlFor="name" className="text-white font-bold text-lg mb-3 flex items-center">
                          <User className="h-5 w-5 mr-2 text-blue-400" />
                          Полное имя
                        </Label>
                        <Input 
                          id="name" 
                          placeholder="Иван Иванов" 
                          className="bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 h-12 text-lg focus:border-blue-400 transition-all" 
                        />
                      </div>

                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <Label htmlFor="email" className="text-white font-bold text-lg mb-3 flex items-center">
                          <Mail className="h-5 w-5 mr-2 text-purple-400" />
                          Email адрес
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          className="bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 h-12 text-lg focus:border-purple-400 transition-all"
                        />
                      </div>

                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <Label htmlFor="phone" className="text-white font-bold text-lg mb-3 flex items-center">
                          <Phone className="h-5 w-5 mr-2 text-green-400" />
                          Телефон
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+7 (999) 123-45-67"
                          className="bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 h-12 text-lg focus:border-green-400 transition-all"
                        />
                      </div>

                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <Label htmlFor="country" className="text-white font-bold text-lg mb-3 flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-orange-400" />
                          Страна
                        </Label>
                        <Input
                          id="country"
                          placeholder="Россия"
                          className="bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 h-12 text-lg focus:border-orange-400 transition-all"
                        />
                      </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold text-lg py-6 rounded-xl shadow-2xl">
                        <User className="h-5 w-5 mr-2" />
                        Сохранить изменения
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Security Settings */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative bg-gradient-to-br from-green-600/20 via-emerald-600/20 to-teal-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden"
              >
                {/* Animated Background */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-8">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="p-4 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-2xl shadow-lg border border-white/20"
                    >
                      <Shield className="h-8 w-8 text-green-300" />
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-black text-white mb-1">🔒 Безопасность</h2>
                      <p className="text-green-200 text-sm">Настройки безопасности вашего аккаунта</p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <Label htmlFor="current-password" className="text-white font-bold text-lg mb-3 flex items-center">
                        <Lock className="h-5 w-5 mr-2 text-yellow-400" />
                        Текущий пароль
                      </Label>
                      <div className="relative">
                        <Input 
                          id="current-password" 
                          type={showPassword ? "text" : "password"}
                          placeholder="Введите текущий пароль"
                          className="bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 h-12 text-lg focus:border-green-400 transition-all pr-12" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <Label htmlFor="new-password" className="text-white font-bold text-lg mb-3 flex items-center">
                          <Lock className="h-5 w-5 mr-2 text-green-400" />
                          Новый пароль
                        </Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="Минимум 8 символов"
                          className="bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 h-12 text-lg focus:border-green-400 transition-all"
                        />
                      </div>

                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <Label htmlFor="confirm-password" className="text-white font-bold text-lg mb-3 flex items-center">
                          <Lock className="h-5 w-5 mr-2 text-emerald-400" />
                          Подтвердите пароль
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Повторите новый пароль"
                          className="bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 h-12 text-lg focus:border-emerald-400 transition-all"
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border-2 border-yellow-500/30">
                      <div className="flex items-start space-x-3">
                        <Shield className="h-6 w-6 text-yellow-400 mt-1" />
                        <div>
                          <h3 className="text-white font-bold text-lg mb-2">💡 Советы по безопасности</h3>
                          <ul className="text-white/80 text-sm space-y-1">
                            <li>• Используйте минимум 8 символов</li>
                            <li>• Комбинируйте буквы, цифры и символы</li>
                            <li>• Не используйте личную информацию</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold text-lg py-6 rounded-xl shadow-2xl">
                        <Shield className="h-5 w-5 mr-2" />
                        Изменить пароль
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Notifications Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative bg-gradient-to-br from-orange-600/20 via-red-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden"
              >
                {/* Animated Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-8">
                    <motion.div 
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="p-4 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-2xl shadow-lg border border-white/20"
                    >
                      <Bell className="h-8 w-8 text-orange-300" />
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-black text-white mb-1">🔔 Уведомления</h2>
                      <p className="text-orange-200 text-sm">Управление уведомлениями и оповещениями</p>
                    </div>
                  </div>

                  {/* Notification Toggles */}
                  <div className="space-y-6">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 rounded-2xl p-6 border border-white/10 cursor-pointer"
                      onClick={() => setEmailNotifications(!emailNotifications)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl ${emailNotifications ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                            <Mail className={`h-6 w-6 ${emailNotifications ? 'text-green-400' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg mb-1">📧 Email уведомления</h3>
                            <p className="text-white/60 text-sm">Получать уведомления на почту</p>
                          </div>
                        </div>
                        <div className={`relative w-16 h-8 rounded-full transition-colors ${emailNotifications ? 'bg-green-500' : 'bg-gray-600'}`}>
                          <motion.div
                            animate={{ x: emailNotifications ? 32 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg"
                          />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 rounded-2xl p-6 border border-white/10 cursor-pointer"
                      onClick={() => setSmsNotifications(!smsNotifications)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl ${smsNotifications ? 'bg-blue-500/20' : 'bg-gray-500/20'}`}>
                            <Phone className={`h-6 w-6 ${smsNotifications ? 'text-blue-400' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg mb-1">📱 SMS уведомления</h3>
                            <p className="text-white/60 text-sm">Получать SMS на телефон</p>
                          </div>
                        </div>
                        <div className={`relative w-16 h-8 rounded-full transition-colors ${smsNotifications ? 'bg-blue-500' : 'bg-gray-600'}`}>
                          <motion.div
                            animate={{ x: smsNotifications ? 32 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg"
                          />
                        </div>
                      </div>
                    </motion.div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-white font-bold text-lg mb-4">📬 Типы уведомлений</h3>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-white/20" />
                          <span className="text-white">Новые инвестиции</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-white/20" />
                          <span className="text-white">Выплаты прибыли</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" className="w-5 h-5 rounded border-white/20" />
                          <span className="text-white">Новости платформы</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-white/20" />
                          <span className="text-white">Реферальные бонусы</span>
                        </label>
                      </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-700 hover:via-red-700 hover:to-pink-700 text-white font-bold text-lg py-6 rounded-xl shadow-2xl">
                        <Bell className="h-5 w-5 mr-2" />
                        Сохранить настройки
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  )
}
