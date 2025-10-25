"use client"

import { motion } from "framer-motion"
import { Vault, Brain, Shield, Network } from "lucide-react"

export function FeaturesGrid() {
  const features = [
    {
      icon: Vault,
      title: "Encrypted Portfolio Tracking",
      items: [
        "Real-time P&L calculation in MPC",
        "Risk metrics privately computed",
        "Multi-wallet aggregation",
        "Historical performance encrypted",
      ],
    },
    {
      icon: Brain,
      title: "AI Strategy Engine",
      items: [
        "XorSHAP explainable AI",
        "Risk-adjusted yield optimization",
        "Market regime detection",
        "Confidence scoring",
      ],
    },
    {
      icon: Shield,
      title: "MEV-Protected Execution",
      items: [
        "Confidential order flow",
        "Jupiter aggregator integration",
        "Encrypted slippage protection",
        "Atomic settlement guarantees",
      ],
    },
    {
      icon: Network,
      title: "Strategy Marketplace",
      items: [
        "Anonymous strategy trading",
        "MPC-verified performance",
        "Zero-knowledge reputation",
        "Automated profit sharing",
      ],
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">Platform Capabilities</h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-xl transition group cursor-pointer"
            style={{ borderColor: "var(--border)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-glow)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <feature.icon size={40} className="mb-4 transition" style={{ color: "var(--accent)" }} />
            <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
            <ul className="space-y-2">
              {feature.items.map((item, j) => (
                <li key={j} className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
