"use client"

import { motion } from "framer-motion"
import { CheckCircle, AlertCircle } from "lucide-react"

interface ReviewStepProps {
  data: any
  setData: (data: any) => void
}

export function ReviewStep({ data }: ReviewStepProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="glass p-6 rounded-lg border border-border">
        <h3 className="font-bold mb-4">Execution Summary</h3>

        <div className="space-y-3">
          {[
            { label: "Strategy", value: data.strategyName },
            { label: "Capital", value: `$${data.capital.toLocaleString()}` },
            { label: "Risk Level", value: `${data.riskTolerance}/10` },
            { label: "Time Horizon", value: `${data.timeHorizon} days` },
            { label: "Encryption", value: data.encryption ? "Enabled" : "Disabled" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between p-3 bg-surface rounded-lg">
              <span className="text-text-secondary">{item.label}</span>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-6 rounded-lg border border-border-glow bg-primary/5">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <CheckCircle size={20} className="text-accent" />
          Fee Breakdown
        </h3>

        <div className="space-y-2">
          {[
            { label: "Strategy Fee", value: "$24.95" },
            { label: "Network Fee", value: "$0.25" },
            { label: "MPC Computation", value: "$5.00" },
            { label: "Total", value: "$30.20", highlight: true },
          ].map((item, i) => (
            <div key={i} className={`flex justify-between ${item.highlight ? "font-bold text-lg" : ""}`}>
              <span className={item.highlight ? "text-accent" : "text-text-secondary"}>{item.label}</span>
              <span className={item.highlight ? "text-accent" : ""}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-4 rounded-lg border border-warning/30 bg-warning/5 flex gap-3">
        <AlertCircle size={20} className="text-warning flex-shrink-0 mt-0.5" />
        <p className="text-sm text-text-secondary">
          Once executed, this strategy will begin trading immediately. You can pause or modify it anytime from your
          dashboard.
        </p>
      </div>
    </motion.div>
  )
}
