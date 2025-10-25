"use client"

import { motion } from "framer-motion"
import { Lock, Database, Shield } from "lucide-react"

export function SecurityGuarantees() {
  const guarantees = [
    {
      icon: Lock,
      number: "1",
      title: "1-of-N Honest Security",
      description:
        "Privacy maintained even if 99% of nodes are compromised. Cryptographic guarantees, not trust assumptions.",
    },
    {
      icon: Database,
      number: "0",
      title: "Zero-Knowledge Architecture",
      description:
        "Platform operators cannot access user data. Frontend, backend, and RPC nodes see only encrypted blobs.",
    },
    {
      icon: Shield,
      number: "100%",
      title: "Cryptographic Verification",
      description: "All computations verifiable on Solana blockchain. Cheaters identified and slashed automatically.",
    },
  ]

  return (
    <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">Trust Through Cryptography</h2>
        <p className="text-xl" style={{ color: "var(--text-secondary)" }}>
          Not Promises
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {guarantees.map((guarantee, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-xl text-center transition"
            style={{ borderColor: "var(--border)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-glow)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <guarantee.icon size={40} className="mx-auto mb-4" style={{ color: "var(--accent)" }} />
            <div className="text-6xl font-bold mb-4 gradient-text">{guarantee.number}</div>
            <h3 className="text-2xl font-bold mb-3">{guarantee.title}</h3>
            <p style={{ color: "var(--text-secondary)" }}>{guarantee.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
