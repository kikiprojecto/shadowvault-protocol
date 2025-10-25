"use client"

import { motion } from "framer-motion"
import { Star, Lock } from "lucide-react"

interface StrategyCardProps {
  strategy: any
}

export function StrategyCard({ strategy }: StrategyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass p-6 rounded-xl border border-border hover:border-border-glow transition group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold group-hover:text-accent transition">{strategy.name}</h3>
            {strategy.verified && <Lock size={16} className="text-accent" />}
          </div>
          <p className="text-sm text-text-secondary font-mono">{strategy.creator}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold gradient-text">{strategy.return}%</p>
          <p className="text-xs text-text-muted">Expected Return</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-border">
        <div>
          <p className="text-xs text-text-muted">Success Rate</p>
          <p className="font-bold text-accent">{strategy.successRate}%</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Active Users</p>
          <p className="font-bold">{strategy.users.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${
            strategy.risk === "LOW"
              ? "bg-accent/20 text-accent"
              : strategy.risk === "MODERATE"
                ? "bg-warning/20 text-warning"
                : "bg-danger/20 text-danger"
          }`}
        >
          {strategy.risk}
        </span>
        <div className="flex items-center gap-1">
          <Star size={14} className="fill-accent text-accent" />
          <span className="text-sm font-bold">{strategy.rating}</span>
          <span className="text-xs text-text-muted">({strategy.reviews})</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {strategy.tags.map((tag: string) => (
          <span key={tag} className="px-2 py-1 bg-surface rounded-full text-xs text-text-secondary">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="font-bold">${strategy.price}/mo</p>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-secondary/30 transition text-sm">
          Subscribe
        </button>
      </div>
    </motion.div>
  )
}
