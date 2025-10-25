"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Play } from "lucide-react"

export function LiveDemoSection() {
  const [activeDemo, setActiveDemo] = useState(0)

  const demos = [
    {
      title: "Portfolio Encryption",
      description: "See how your portfolio data is encrypted across MPC nodes",
      metrics: { nodes: 5, time: "2.3s", status: "Encrypted" },
    },
    {
      title: "AI Recommendation",
      description: "Watch AI generate personalized strategies in real-time",
      metrics: { confidence: "87%", features: 12, time: "4.1s" },
    },
    {
      title: "Order Execution",
      description: "Experience MEV-protected order routing",
      metrics: { slippage: "0.1%", mev: "Protected", time: "3.8s" },
    },
    {
      title: "Strategy Verification",
      description: "Verify strategy performance with zero-knowledge proofs",
      metrics: { users: 97, success: "89%", return: "34%" },
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
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">See It In Action</h2>
        <p className="text-xl" style={{ color: "var(--text-secondary)" }}>
          Interactive demo of core features
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          {demos.map((demo, i) => (
            <button
              key={i}
              onClick={() => setActiveDemo(i)}
              className="w-full text-left p-4 rounded-lg transition glass"
              style={{
                borderColor: activeDemo === i ? "var(--border-glow)" : "var(--border)",
                backgroundColor: activeDemo === i ? "rgba(107, 70, 193, 0.1)" : "transparent",
              }}
            >
              <h3 className="font-bold text-lg mb-1">{demo.title}</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {demo.description}
              </p>
            </button>
          ))}
        </motion.div>

        <motion.div
          key={activeDemo}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="glass p-8 rounded-xl flex flex-col items-center justify-center min-h-96"
        >
          <div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6b46c1] to-[#00d9ff] flex items-center justify-center mb-6 hover:shadow-lg transition cursor-pointer"
            style={{ boxShadow: "0 0 20px rgba(0, 217, 255, 0.3)" }}
          >
            <Play size={32} className="text-white ml-1" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-center">{demos[activeDemo].title}</h3>
          <p className="text-center mb-6" style={{ color: "var(--text-secondary)" }}>
            {demos[activeDemo].description}
          </p>
          <div className="grid grid-cols-3 gap-4 w-full">
            {Object.entries(demos[activeDemo].metrics).map(([key, value]) => (
              <div key={key} className="text-center p-3 border rounded-lg" style={{ borderColor: "var(--border)" }}>
                <p className="font-bold" style={{ color: "var(--accent)" }}>
                  {value}
                </p>
                <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>
                  {key}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
