"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto glass p-12 rounded-2xl text-center"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(107, 70, 193, 0.1), rgba(26, 26, 36, 0.7), rgba(0, 217, 255, 0.1))",
        }}
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">Start Protecting Your Edge Today</h2>
        <p className="text-xl mb-8" style={{ color: "var(--text-secondary)" }}>
          Join the beta and get 6 months of Pro features free
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            className="px-8 py-3 rounded-full bg-gradient-to-r from-[#6b46c1] to-[#00d9ff] text-white font-semibold hover:shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
            style={{ boxShadow: "0 0 20px rgba(0, 217, 255, 0.3)" }}
          >
            Launch ShadowVault
            <ArrowRight size={20} />
          </button>
          <button
            className="px-8 py-3 rounded-full border glass font-semibold transition"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            Read Documentation
          </button>
        </div>

        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Built for Colosseum Cypherpunk Hackathon
        </p>
      </motion.div>
    </section>
  )
}
