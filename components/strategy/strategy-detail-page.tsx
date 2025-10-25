"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { StrategyHeader } from "./components/strategy-header"
import { PerformanceChart } from "./components/performance-chart"
import { XorSHAPChart } from "./components/xorshap-chart"
import { MPCVerification } from "./components/mpc-verification"
import { UserReviews } from "./components/user-reviews"
import { SimilarStrategies } from "./components/similar-strategies"
import { SubscriptionPlans } from "./components/subscription-plans"

export function StrategyDetailPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <div className="glass border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button className="p-2 hover:bg-surface rounded-lg transition">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Strategy Details</h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StrategyHeader />

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <PerformanceChart />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <XorSHAPChart />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <MPCVerification />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <UserReviews />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <SimilarStrategies />
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-1"
          >
            <SubscriptionPlans />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
