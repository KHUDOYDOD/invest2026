"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, MessageCircle, Phone, Mail } from "lucide-react"

function SupportContent() {
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
        <DashboardNav activeItem="support" />

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden">
              {/* Animated Orbs */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
              
              <div className="relative z-10 text-center space-y-4">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-full px-6 py-3 border-2 border-blue-400/30 shadow-lg mb-4">
                  <MessageCircle className="h-6 w-6 text-blue-400 animate-pulse" />
                  <span className="text-white font-bold text-lg">Служба поддержки 24/7</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                  🎧 Поддержка
                </h1>
                
                <p className="text-blue-100 max-w-2xl mx-auto text-xl font-medium">
                  Мы всегда на связи и готовы помочь вам решить любой вопрос
                </p>

                <div className="flex items-center justify-center space-x-6 pt-4">
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <Phone className="h-5 w-5 text-green-400" />
                    <span className="text-white font-medium">Звонок</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <Mail className="h-5 w-5 text-blue-400" />
                    <span className="text-white font-medium">Email</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <MessageCircle className="h-5 w-5 text-purple-400" />
                    <span className="text-white font-medium">Чат</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="relative bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden">
                {/* Animated Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl shadow-lg border border-white/20">
                      <MessageCircle className="h-8 w-8 text-blue-300 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white mb-1">💬 Написать в поддержку</h2>
                      <p className="text-blue-200 text-sm">Опишите вашу проблему, и мы поможем</p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <Label htmlFor="subject" className="text-white font-bold text-lg mb-3 block">
                        📝 Тема обращения
                      </Label>
                      <Input
                        id="subject"
                        placeholder="Кратко опишите проблему"
                        className="bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 h-12 text-lg focus:border-blue-400 transition-all"
                      />
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <Label htmlFor="message" className="text-white font-bold text-lg mb-3 block">
                        ✍️ Сообщение
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Подробно опишите вашу проблему..."
                        className="bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 min-h-[160px] text-lg focus:border-blue-400 transition-all"
                      />
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg py-6 rounded-xl shadow-2xl hover:scale-105 transition-all">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Отправить сообщение
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Contacts Card */}
                <div className="relative bg-gradient-to-br from-green-600/20 via-emerald-600/20 to-teal-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden">
                  {/* Animated Background */}
                  <div className="absolute top-0 left-0 w-48 h-48 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-4 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-2xl shadow-lg border border-white/20">
                        <Phone className="h-8 w-8 text-green-300 animate-pulse" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white mb-1">📞 Контакты</h2>
                        <p className="text-green-200 text-sm">Свяжитесь с нами удобным способом</p>
                      </div>
                    </div>

                    {/* Contact Items */}
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-green-500/20 rounded-xl">
                            <Phone className="h-6 w-6 text-green-400" />
                          </div>
                          <div>
                            <p className="text-white font-bold text-lg mb-1">📱 Телефон</p>
                            <p className="text-green-300 text-xl font-bold">+7 (800) 123-45-67</p>
                            <p className="text-white/60 text-sm">Звонок бесплатный</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-blue-500/20 rounded-xl">
                            <Mail className="h-6 w-6 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-white font-bold text-lg mb-1">📧 Email</p>
                            <p className="text-blue-300 text-xl font-bold">support@investpro.com</p>
                            <p className="text-white/60 text-sm">Ответим в течение часа</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ Card */}
                <div className="relative bg-gradient-to-br from-orange-600/20 via-red-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden">
                  {/* Animated Background */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-4 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-2xl shadow-lg border border-white/20">
                        <HelpCircle className="h-8 w-8 text-orange-300 animate-pulse" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white mb-1">❓ FAQ</h2>
                        <p className="text-orange-200 text-sm">Часто задаваемые вопросы</p>
                      </div>
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                        <p className="text-white font-bold text-lg mb-3 flex items-center">
                          <span className="text-2xl mr-2">💰</span>
                          Как пополнить баланс?
                        </p>
                        <p className="text-white/70 text-base leading-relaxed">
                          Перейдите в раздел "Пополнить" и выберите удобный способ оплаты. Мы принимаем карты, криптовалюту и электронные кошельки.
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                        <p className="text-white font-bold text-lg mb-3 flex items-center">
                          <span className="text-2xl mr-2">⏰</span>
                          Сколько времени занимает вывод?
                        </p>
                        <p className="text-white/70 text-base leading-relaxed">
                          Обычно вывод средств занимает от 1 до 24 часов. Мы стараемся обрабатывать заявки максимально быстро.
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                        <p className="text-white font-bold text-lg mb-3 flex items-center">
                          <span className="text-2xl mr-2">👥</span>
                          Как работает реферальная программа?
                        </p>
                        <p className="text-white/70 text-base leading-relaxed">
                          Приглашайте друзей по вашей реферальной ссылке и получайте 5% от их депозитов на ваш счет автоматически.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl hover:scale-105 transition-all overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 text-center">
                  <div className="text-5xl mb-4">⚡</div>
                  <h3 className="text-white font-bold text-lg mb-2">Быстрый ответ</h3>
                  <p className="text-white/70 text-sm">Отвечаем в течение 5 минут</p>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl hover:scale-105 transition-all overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 text-center">
                  <div className="text-5xl mb-4">🌍</div>
                  <h3 className="text-white font-bold text-lg mb-2">24/7 Поддержка</h3>
                  <p className="text-white/70 text-sm">Работаем круглосуточно</p>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl hover:scale-105 transition-all overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 text-center">
                  <div className="text-5xl mb-4">🎯</div>
                  <h3 className="text-white font-bold text-lg mb-2">Профессионалы</h3>
                  <p className="text-white/70 text-sm">Опытная команда</p>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl hover:scale-105 transition-all overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 text-center">
                  <div className="text-5xl mb-4">💬</div>
                  <h3 className="text-white font-bold text-lg mb-2">Многоязычность</h3>
                  <p className="text-white/70 text-sm">Поддержка на русском</p>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl p-12 border-2 border-white/20 shadow-2xl overflow-hidden text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-6">🎧</div>
                <h2 className="text-4xl font-black text-white mb-4">Нужна помощь?</h2>
                <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
                  Наша команда поддержки всегда готова помочь вам решить любой вопрос
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-2xl hover:scale-105 transition-all">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Написать в чат
                  </Button>
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-2xl hover:scale-105 transition-all">
                    <Phone className="h-5 w-5 mr-2" />
                    Позвонить
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function SupportPage() {
  return (
    <AuthGuard>
      <SupportContent />
    </AuthGuard>
  )
}
