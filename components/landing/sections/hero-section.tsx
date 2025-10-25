"use client"

import { motion } from "framer-motion"
import { ArrowRight, Lock, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Gradient orbs */}
      <div
        className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: "rgba(107, 70, 193, 0.2)" }}
      />
      <div
        className="absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: "rgba(0, 217, 255, 0.2)" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span
            className="inline-block px-4 py-2 rounded-full glass text-sm font-mono tracking-widest"
            style={{ color: "var(--accent)" }}
          >
            ARCIUM ENCRYPTED COMPUTE
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="gradient-text">Your DeFi Intelligence,</span>
          <br />
          <span className="gradient-text">Completely Private</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          AI-powered portfolio insights without exposing your strategies. Military-grade encryption meets institutional
          DeFi.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <button
            className="px-8 py-3 rounded-full bg-gradient-to-r from-[#6b46c1] to-[#00d9ff] text-white font-semibold hover:shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
            style={{ boxShadow: "0 0 20px rgba(0, 217, 255, 0.3)" }}
          >
            Launch Application
            <ArrowRight size={20} />
          </button>
          <button
            className="px-8 py-3 rounded-full border glass font-semibold transition"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            View Architecture
          </button>
        </motion.div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {[
            { icon: Lock, label: "ZERO-KNOWLEDGE SECURITY" },
            { icon: Zap, label: "AI-POWERED ANALYSIS" },
            { icon: Lock, label: "SOLANA NATIVE" },
            { icon: Lock, label: "MPC ENCRYPTED" },
          ].map((item, i) => (
            <div key={i} className="glass p-3 rounded-lg text-center">
              <item.icon size={20} className="mx-auto mb-2" style={{ color: "var(--accent)" }} />
              <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                {item.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
