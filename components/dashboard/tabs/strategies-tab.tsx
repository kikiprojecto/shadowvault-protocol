"use client"

import { motion } from "framer-motion"
import { Zap } from "lucide-react"

export function StrategiesTab() {
  const strategies = [
    {
      name: "Yield Maximizer Alpha",
      confidence: 87,
      return: "24.5%",
      risk: "MODERATE",
      description: "Deploy liquidity across top 3 lending protocols. Rebalance weekly based on APY fluctuations.",
      features: [
        { label: "APY Opportunity", value: 60 },
        { label: "Risk Profile Match", value: 25 },
        { label: "Market Conditions", value: 15 },
      ],
    },
    {
      name: "Conservative Staking",
      confidence: 92,
      return: "12.3%",
      risk: "LOW",
      description: "Stake SOL and JUP on established validators. Minimal risk with steady returns.",
      features: [
        { label: "Validator Reputation", value: 70 },
        { label: "Yield Stability", value: 20 },
        { label: "Network Health", value: 10 },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="text-2xl font-bold mb-2">AI-Powered Strategy Recommendations</h2>
        <p className="text-text-secondary">XorSHAP Explainable AI | Encrypted Computation</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {strategies.map((strategy, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="glass p-6 rounded-xl hover:border-border-glow transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{strategy.name}</h3>
                <p className="text-text-secondary text-sm mt-1">{strategy.description}</p>
              </div>
              <div className="text-right">
                <p className="text-accent font-bold">{strategy.confidence}%</p>
                <p className="text-xs text-text-muted">Confidence</p>
              </div>
            </div>

            <div className="flex gap-4 mb-4 pb-4 border-b border-border">
              <div>
                <p className="text-2xl font-bold gradient-text">{strategy.return}</p>
                <p className="text-xs text-text-muted">Expected Return</p>
              </div>
              <div>
                <p className={`font-bold ${strategy.risk === "LOW" ? "text-accent" : "text-warning"}`}>
                  {strategy.risk}
                </p>
                <p className="text-xs text-text-muted">Risk Level</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {strategy.features.map((feature, j) => (
                <div key={j}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">{feature.label}</span>
                    <span className="font-semibold">{feature.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${feature.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-secondary/30 transition flex items-center justify-center gap-2">
                <Zap size={16} />
                Execute Strategy
              </button>
              <button className="flex-1 px-4 py-2 rounded-lg border border-border hover:border-border-glow transition font-semibold">
                Simulate
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
