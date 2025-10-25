"use client"

import { motion } from "framer-motion"
import { Database, Brain, AlertTriangle } from "lucide-react"

export function ProblemSection() {
  const problems = [
    {
      icon: Database,
      title: "Transparent Analytics",
      description:
        "Portfolio trackers require full wallet exposure. Every strategy visible to competitors and MEV bots.",
    },
    {
      icon: Brain,
      title: "Centralized AI Services",
      description: "AI advisors harvest your trading data. Your insights become their training data.",
    },
    {
      icon: AlertTriangle,
      title: "Dark Pool Vulnerabilities",
      description: "Centralized dark pools can front-run orders. Single point of failure, opaque operations.",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">The Privacy Problem in DeFi</h2>
        <p className="text-xl" style={{ color: "var(--text-secondary)" }}>
          Current solutions expose your competitive edge
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {problems.map((problem, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-xl transition"
            style={{ borderColor: "var(--border)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-glow)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <problem.icon size={40} className="mb-4" style={{ color: "var(--danger)" }} />
            <h3 className="text-xl font-bold mb-3">{problem.title}</h3>
            <p style={{ color: "var(--text-secondary)" }}>{problem.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
