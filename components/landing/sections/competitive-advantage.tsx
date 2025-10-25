"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

export function CompetitiveAdvantage() {
  const comparison = [
    { feature: "Full Privacy", shadowvault: true, trackers: false, pools: false, other: "partial" },
    { feature: "MEV Protection", shadowvault: true, trackers: false, pools: true, other: false },
    { feature: "AI-Powered", shadowvault: true, trackers: true, pools: false, other: false },
    { feature: "Decentralized", shadowvault: true, trackers: true, pools: false, other: true },
    { feature: "Explainable AI", shadowvault: true, trackers: false, pools: false, other: false },
    { feature: "Strategy Marketplace", shadowvault: true, trackers: false, pools: false, other: false },
    { feature: "Real-time Analytics", shadowvault: true, trackers: true, pools: true, other: false },
    { feature: "Institutional Grade", shadowvault: true, trackers: false, pools: true, other: false },
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
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">Why ShadowVault Wins</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="glass rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottomColor: "var(--border)", borderBottomWidth: "1px" }}>
                <th className="px-6 py-4 text-left font-bold">Feature</th>
                <th className="px-6 py-4 text-center font-bold" style={{ color: "var(--accent)" }}>
                  ShadowVault
                </th>
                <th className="px-6 py-4 text-center font-bold" style={{ color: "var(--text-secondary)" }}>
                  Traditional
                </th>
                <th className="px-6 py-4 text-center font-bold" style={{ color: "var(--text-secondary)" }}>
                  CEX Pools
                </th>
                <th className="px-6 py-4 text-center font-bold" style={{ color: "var(--text-secondary)" }}>
                  Other Privacy
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr
                  key={i}
                  className="transition"
                  style={{ borderBottomColor: "var(--border)", borderBottomWidth: "1px" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(107, 70, 193, 0.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td className="px-6 py-4 font-semibold">{row.feature}</td>
                  <td className="px-6 py-4 text-center">
                    <Check size={20} className="mx-auto" style={{ color: "var(--accent)" }} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.trackers ? (
                      <Check size={20} className="mx-auto" style={{ color: "var(--accent)" }} />
                    ) : (
                      <X size={20} className="mx-auto" style={{ color: "var(--danger)" }} />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.pools ? (
                      <Check size={20} className="mx-auto" style={{ color: "var(--accent)" }} />
                    ) : (
                      <X size={20} className="mx-auto" style={{ color: "var(--danger)" }} />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.other === true ? (
                      <Check size={20} className="mx-auto" style={{ color: "var(--accent)" }} />
                    ) : row.other === "partial" ? (
                      <span className="font-bold" style={{ color: "var(--warning)" }}>
                        ~
                      </span>
                    ) : (
                      <X size={20} className="mx-auto" style={{ color: "var(--danger)" }} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  )
}
