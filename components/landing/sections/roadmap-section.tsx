"use client"

import { motion } from "framer-motion"

export function RoadmapSection() {
  const phases = [
    {
      phase: "Phase 1",
      title: "MVP Launch",
      status: "In Progress",
      progress: 85,
      timeline: "Q4 2025",
      features: ["Portfolio tracking", "AI recommendations", "Basic execution"],
    },
    {
      phase: "Phase 2",
      title: "Marketplace & Integrations",
      status: "Planned",
      progress: 0,
      timeline: "Q1 2026",
      features: ["Strategy marketplace", "Jupiter/Orca integration", "Mobile app"],
    },
    {
      phase: "Phase 3",
      title: "Institutional Features",
      status: "Research",
      progress: 0,
      timeline: "Q2 2026",
      features: ["Multi-sig vaults", "Compliance reporting", "OTC desk"],
    },
    {
      phase: "Phase 4",
      title: "Cross-Chain Expansion",
      status: "Vision",
      progress: 0,
      timeline: "Q3 2026",
      features: ["Ethereum support", "Arbitrum support", "Base support"],
    },
  ]

  return (
    <section id="roadmap" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">Building the Future of Private DeFi</h2>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {phases.map((phase, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="glass p-6 rounded-xl"
          >
            <div className="mb-4">
              <p className="font-mono text-sm mb-1" style={{ color: "var(--accent)" }}>
                {phase.phase}
              </p>
              <h3 className="text-xl font-bold mb-2">{phase.title}</h3>
              <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
                {phase.status}
              </p>
              <div className="w-full rounded-full h-2 mb-2" style={{ backgroundColor: "var(--surface)" }}>
                <div
                  className="bg-gradient-to-r from-[#6b46c1] to-[#00d9ff] h-2 rounded-full transition-all"
                  style={{ width: `${phase.progress}%` }}
                />
              </div>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {phase.timeline}
              </p>
            </div>
            <ul className="space-y-1">
              {phase.features.map((feature, j) => (
                <li key={j} className="text-sm flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
