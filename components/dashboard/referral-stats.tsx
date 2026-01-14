"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, Users, DollarSign, Share, UserPlus, TrendingUp, Gift, Award } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface Referral {
  id: number
  name: string
  email: string
  registrationDate: string
  level: number
  totalInvested: number
  earned: number
  status: string
}

interface ReferralData {
  referralCode: string
  totalReferrals: number
  totalEarned: number
  totalInvested: number
  referrals: Referral[]
}

export function ReferralStats() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadReferralData()
  }, [])

  const loadReferralData = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const response = await fetch(`/api/user/referrals?userId=${userId}`)
      const data = await response.json()

      if (response.ok) {
        setReferralData(data)
      }
    } catch (error) {
      console.error("Error loading referral data:", error)
    } finally {
      setLoading(false)
    }
  }

  const referralLink = referralData?.referralCode 
    ? `${window.location.origin}/register?ref=${referralData.referralCode}`
    : ""

  const copyToClipboard = () => {
    if (!referralLink) return
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success("Ссылка скопирована в буфер обмена!")
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnSocial = (platform: string) => {
    const text = "Присоединяйся к InvestPro и начни зарабатывать!"
    const url = referralLink
    
    const urls: Record<string, string> = {
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    }
    
    if (urls[platform]) {
      window.open(urls[platform], "_blank")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const totalReferrals = referralData?.totalReferrals || 0
  const totalEarned = referralData?.totalEarned || 0
  const totalInvested = referralData?.totalInvested || 0
  const referrals = referralData?.referrals || []

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-xl border-blue-400/30 text-white hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Всего рефералов</p>
                  <p className="text-3xl font-bold">{totalReferrals}</p>
                </div>
                <div className="p-3 bg-blue-500/30 rounded-full">
                  <Users className="h-8 w-8 text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-600/20 to-emerald-800/20 backdrop-blur-xl border-green-400/30 text-white hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Заработано</p>
                  <p className="text-3xl font-bold">${totalEarned.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-500/30 rounded-full">
                  <DollarSign className="h-8 w-8 text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-xl border-purple-400/30 text-white hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Инвестировано</p>
                  <p className="text-3xl font-bold">${totalInvested.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-500/30 rounded-full">
                  <TrendingUp className="h-8 w-8 text-purple-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Referral Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-yellow-400" />
              Ваша реферальная ссылка
            </CardTitle>
            <CardDescription className="text-white/70">
              Поделитесь этой ссылкой и получайте до 10% от депозитов приглашенных пользователей
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="referral-link" className="text-white/90">Реферальная ссылка</Label>
              <div className="flex space-x-2">
                <Input 
                  id="referral-link" 
                  value={referralLink} 
                  readOnly 
                  className="bg-white/10 border-white/20 text-white"
                />
                <Button 
                  onClick={copyToClipboard} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? "Скопировано!" : "Копировать"}
                </Button>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={() => shareOnSocial("telegram")}
                className="flex-1 bg-[#0088cc] hover:bg-[#0077b3]"
              >
                <Share className="h-4 w-4 mr-2" />
                Telegram
              </Button>
              <Button 
                onClick={() => shareOnSocial("whatsapp")}
                className="flex-1 bg-[#25D366] hover:bg-[#20bd5a]"
              >
                <Share className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button 
                onClick={() => shareOnSocial("twitter")}
                className="flex-1 bg-[#1DA1F2] hover:bg-[#1a8cd8]"
              >
                <Share className="h-4 w-4 mr-2" />
                Twitter
              </Button>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-400/30">
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-400" />
                Условия реферальной программы
              </h4>
              <ul className="text-sm text-white/80 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>1-й уровень: <strong className="text-green-400">5%</strong> от депозитов приглашенных пользователей</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>2-й уровень: <strong className="text-green-400">3%</strong> от депозитов пользователей 2-го уровня</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>3-й уровень: <strong className="text-green-400">2%</strong> от депозитов пользователей 3-го уровня</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Выплаты происходят автоматически при каждом депозите реферала</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Referrals List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              Ваши рефералы
            </CardTitle>
            <CardDescription className="text-white/70">
              Список пользователей, зарегистрированных по вашей ссылке
            </CardDescription>
          </CardHeader>
          <CardContent>
            {referrals.length > 0 ? (
              <div className="space-y-3">
                {referrals.map((referral, index) => (
                  <motion.div
                    key={referral.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {referral.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{referral.name}</h4>
                        <p className="text-sm text-white/60">{referral.email}</p>
                        <p className="text-xs text-white/40">
                          Регистрация: {new Date(referral.registrationDate).toLocaleDateString("ru-RU")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge 
                        variant={referral.level === 1 ? "default" : "secondary"}
                        className={referral.level === 1 ? "bg-blue-600" : "bg-purple-600"}
                      >
                        {referral.level} уровень
                      </Badge>
                      <p className="text-sm">
                        <span className="text-white/60">Инвестировал:</span>
                        <span className="text-white font-medium"> ${referral.totalInvested.toFixed(2)}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-white/60">Заработано:</span>
                        <span className="text-green-400 font-medium"> ${referral.earned.toFixed(2)}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="h-10 w-10 text-blue-400" />
                  </div>
                </motion.div>
                <h3 className="text-lg font-medium text-white mb-2">Нет рефералов</h3>
                <p className="text-white/60 mb-6">Поделитесь своей реферальной ссылкой, чтобы начать зарабатывать</p>
                <Button 
                  onClick={copyToClipboard} 
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Скопировать ссылку
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
