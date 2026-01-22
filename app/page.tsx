import Link from "next/link"
import { Button } from "@/components/ui/button"
import { InvestmentPlans } from "@/components/investment-plans"
import { Features } from "@/components/features"
import { Statistics } from "@/components/statistics"
import { Testimonials } from "@/components/testimonials"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { ProfitCalculator } from "@/components/profit-calculator"
import { LiveChat } from "@/components/live-chat"
import { NewsSection } from "@/components/news-section"

import { MobileApp } from "@/components/mobile-app"
import { TrustIndicators } from "@/components/trust-indicators"
import { LiveActivityFeed } from "@/components/live-activity-feed"
import { UserActivityRows } from "@/components/user-activity-rows"
import { ProjectLaunches } from "@/components/project-launches"

import { NewUsersShowcase } from "@/components/new-users-showcase"
import { CTASection } from "@/components/cta-section"


export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />

      {/* Project Launches - positioned below header */}
      <ProjectLaunches />

      {/* Hero Section */}
      <HeroSection />

      {/* Trust Indicators */}
      <div className="relative z-10">
        <TrustIndicators />
      </div>

      {/* User Activity Rows */}
      <div className="relative z-10">
        <UserActivityRows />
      </div>

      {/* New Users Showcase */}
      <div className="relative z-10">
        <NewUsersShowcase />
      </div>

      {/* Live Activity Feed */}
      <div className="relative z-10">
        <LiveActivityFeed />
      </div>

      {/* Statistics */}
      <div className="relative z-10">
        <Statistics />
      </div>

      {/* Profit Calculator */}
      <section className="py-20 px-4 relative z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              💹 Калькулятор доходности
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Рассчитайте потенциальную прибыль от ваших инвестиций
            </p>
          </div>
          <ProfitCalculator />
        </div>
      </section>



      {/* Investment Plans */}
      <section id="plans" className="py-20 px-4 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 relative z-10 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <InvestmentPlans />
        </div>
      </section>

      {/* Features */}
      <div className="relative z-10">
        <Features />
      </div>

      {/* News Section */}
      <section className="relative z-10 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative z-10">
          <NewsSection />
        </div>
      </section>

      {/* Mobile App */}
      <section className="relative z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative z-10">
          <MobileApp />
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.2s' }}></div>
        </div>
        <div className="relative z-10">
          <Testimonials />
        </div>
      </section>

      {/* CTA */}
      <CTASection />

      <Footer />

      {/* Live Chat */}
      <LiveChat />


    </div>
  )
}