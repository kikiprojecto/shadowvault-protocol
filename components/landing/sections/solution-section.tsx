"use client"

import { motion } from "framer-motion"
import { Lock, Zap, Brain, CheckCircle } from "lucide-react"

export function SolutionSection() {
  const steps = [
    {
      icon: Lock,
      title: "Connect Securely",
      description: "Wallet connection generates ephemeral keypair. Zero wallet exposure to RPC or frontend.",
    },
    {
      icon: Zap,
      title: "Encrypted Analysis",
      description:
        "Portfolio data split across Arcium MPC nodes. Computation on encrypted state, no decryption needed.",
    },
    {
      icon: Brain,
      title: "AI Recommendations",
      description:
        "XorSHAP decision tree runs in encrypted environment. Personalized strategies without data collection.",
    },
    {
      icon: CheckCircle,
      title: "Private Execution",
      description: "MEV-protected swaps via confidential order routing. Execution details revealed only on settlement.",
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
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">End-to-End Encrypted Intelligence</h2>
        <p className="text-xl" style={{ color: "var(--text-secondary)" }}>
          How ShadowVault secures your edge
        </p>
      </motion.div>

      <div className="space-y-8">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex gap-6 items-start"
          >
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-[#6b46c1] to-[#00d9ff]">
                <step.icon size={24} className="text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
              <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
                {step.description}
              </p>
            </div>
            <div className="text-4xl font-bold" style={{ color: "rgba(107, 70, 193, 0.2)" }}>
              {String(i + 1).padStart(2, "0")}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
