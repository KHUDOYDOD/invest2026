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
    <div className="min-h-screen bg-slate-900">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Project Launches */}
      <ProjectLaunches />

      {/* Trust Indicators */}
      <section className="py-16 bg-slate-900">
        <TrustIndicators />
      </section>

      {/* User Activity Rows */}
      <section className="py-12 bg-slate-800/50">
        <UserActivityRows />
      </section>

      {/* New Users Showcase */}
      <section className="py-12 bg-slate-900">
        <NewUsersShowcase />
      </section>

      {/* Live Activity - One clean section */}
      <section className="py-12 bg-slate-800/50">
        <LiveActivityFeed />
      </section>

      {/* Investment Plans */}
      <section id="plans" className="py-20 px-4 bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <InvestmentPlans />
        </div>
      </section>

      {/* Profit Calculator */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Калькулятор доходности
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Рассчитайте потенциальную прибыль от ваших инвестиций
            </p>
          </div>
          <ProfitCalculator />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-900">
        <Features />
      </section>

      {/* Statistics */}
      <section className="py-20 bg-slate-800/50">
        <Statistics />
      </section>

      {/* News Section */}
      <section className="py-20 bg-slate-900">
        <NewsSection />
      </section>

      {/* Mobile App */}
      <section className="py-20 bg-slate-800/50">
        <MobileApp />
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-900">
        <Testimonials />
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-slate-800/50">
        <TrustIndicators />
      </section>

      {/* CTA */}
      <CTASection />

      <Footer />

      {/* Live Chat */}
      <LiveChat />
    </div>
  )
}