"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function SimilarStrategies() {
  const similar = [
    { name: "Conservative Staking", return: "12.3%", risk: "LOW", users: 892 },
    { name: "Arbitrage Opportunity", return: "18.7%", risk: "MODERATE", users: 456 },
    { name: "Aggressive Growth", return: "32.1%", risk: "HIGH", users: 234 },
  ]

  return (
    <div className="glass p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Similar Strategies</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {similar.map((strategy, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-4 bg-surface rounded-lg border border-border hover:border-border-glow transition cursor-pointer group"
          >
            <h3 className="font-bold mb-3 group-hover:text-accent transition">{strategy.name}</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-text-secondary text-sm">Return</span>
                <span className="font-bold text-accent">{strategy.return}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary text-sm">Risk</span>
                <span
                  className={`font-bold ${strategy.risk === "LOW" ? "text-accent" : strategy.risk === "MODERATE" ? "text-warning" : "text-danger"}`}
                >
                  {strategy.risk}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary text-sm">Users</span>
                <span className="font-bold">{strategy.users}</span>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition font-semibold text-sm">
              View <ArrowRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
