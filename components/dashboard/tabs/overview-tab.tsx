"use client"

import { motion } from "framer-motion"
import { MetricsCard } from "../components/metrics-card"
import { PerformanceChart } from "../components/performance-chart"
import { AllocationChart } from "../components/allocation-chart"
import { RecentActivity } from "../components/recent-activity"
import { RecommendationsCarousel } from "../components/recommendations-carousel"
import { TrendingUp, AlertCircle, Zap } from "lucide-react"

export function OverviewTab() {
  const metrics = [
    {
      title: "Total Portfolio Value",
      value: "$47,582.33",
      change: "+$1,245.67",
      changePercent: "+2.68%",
      icon: TrendingUp,
      positive: true,
    },
    {
      title: "24h Change",
      value: "+5.2%",
      change: "vs Market: +2.1%",
      changePercent: "+3.1%",
      icon: TrendingUp,
      positive: true,
    },
    {
      title: "Risk Score",
      value: "6.8/10",
      change: "MODERATE",
      changePercent: "Stable",
      icon: AlertCircle,
      positive: true,
    },
    {
      title: "Active Strategies",
      value: "3",
      change: "All performing well",
      changePercent: "100% active",
      icon: Zap,
      positive: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <MetricsCard {...metric} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <PerformanceChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <AllocationChart />
        </motion.div>
      </div>

      {/* Activity and Recommendations */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <RecentActivity />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <RecommendationsCarousel />
        </motion.div>
      </div>
    </div>
  )
}
