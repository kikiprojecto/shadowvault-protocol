"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export function TechDeepDive() {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    {
      title: "MPC Protocol",
      content:
        "BDOZ protocol with dishonest majority security model. Cryptographic cheater identification ensures Byzantine fault tolerance.",
    },
    {
      title: "Encryption Stack",
      content:
        "X25519 key exchange with Rescue cipher for state encryption. Somewhat Homomorphic Encryption (SHE) enables computation on encrypted data.",
    },
    {
      title: "Architecture",
      content:
        "Multi-Party eXecution Environments (MXE) with Arcis DSL for encrypted logic. Solana on-chain coordination for settlement and verification.",
    },
  ]

  return (
    <section id="technology" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">Powered by Arcium MPC Network</h2>
        <p className="text-xl" style={{ color: "var(--text-secondary)" }}>
          Military-grade cryptography meets blockchain scalability
        </p>
      </motion.div>

      <div className="glass p-8 rounded-xl mb-8">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "10,000x FASTER", value: "Than FHE" },
            { label: "1 HONEST NODE", value: "Full Privacy" },
            { label: "SUB-10 SECOND", value: "Computation" },
            { label: "BYZANTINE", value: "Fault Tolerant" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-4 border rounded-lg"
              style={{ borderColor: "var(--border)" }}
            >
              <p className="font-bold text-sm" style={{ color: "var(--accent)" }}>
                {stat.label}
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2 mb-6" style={{ borderBottomColor: "var(--border)", borderBottomWidth: "1px" }}>
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className="px-4 py-2 font-semibold transition"
              style={{
                color: activeTab === i ? "var(--accent)" : "var(--text-secondary)",
                borderBottomWidth: activeTab === i ? "2px" : "0px",
                borderBottomColor: activeTab === i ? "var(--accent)" : "transparent",
              }}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <motion.p
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          {tabs[activeTab].content}
        </motion.p>
      </div>
    </section>
  )
}
