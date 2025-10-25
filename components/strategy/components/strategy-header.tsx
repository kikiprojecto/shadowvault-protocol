"use client"

import { motion } from "framer-motion"
import { Star, Lock, TrendingUp, Users } from "lucide-react"

export function StrategyHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass p-8 rounded-xl bg-gradient-to-br from-primary/10 via-surface-glass to-secondary/10 border border-border-glow"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">Yield Maximizer Alpha</h1>
            <Lock size={24} className="text-accent" />
          </div>
          <p className="text-lg text-text-secondary">
            Deploy liquidity across top 3 lending protocols with weekly rebalancing
          </p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 glass rounded-lg hover:border-border-glow transition">
            <Star size={20} className="text-accent" />
          </button>
          <button className="p-3 glass rounded-lg hover:border-border-glow transition">
            <TrendingUp size={20} className="text-accent" />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: "Expected Return", value: "24.5%", icon: TrendingUp },
          { label: "Risk Level", value: "MODERATE", icon: Lock },
          { label: "Active Users", value: "1,247", icon: Users },
          { label: "Success Rate", value: "89%", icon: Star },
        ].map((stat, i) => (
          <div key={i} className="p-4 bg-surface rounded-lg">
            <p className="text-text-secondary text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold gradient-text">{stat.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
