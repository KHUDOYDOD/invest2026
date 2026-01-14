"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { ReferralStats } from "@/components/dashboard/referral-stats"
import { motion } from "framer-motion"

function ReferralsContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <DashboardHeader />

      <div className="flex relative z-10">
        <DashboardNav activeItem="referrals" />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h1 className="text-4xl font-bold text-white">Реферальная программа</h1>
              <p className="text-white/70 text-lg">Приглашайте друзей и получайте до 10% от их депозитов</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ReferralStats />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function ReferralsPage() {
  return (
    <AuthGuard>
      <ReferralsContent />
    </AuthGuard>
  )
}
