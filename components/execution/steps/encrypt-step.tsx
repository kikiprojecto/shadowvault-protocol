"use client"

import { motion } from "framer-motion"
import { Lock } from "lucide-react"
import { useState, useEffect } from "react"

interface EncryptStepProps {
  data: any
  setData: (data: any) => void
}

export function EncryptStep({ data }: EncryptStepProps) {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setStage((s) => Math.min(s + 1, 3))
          return 0
        }
        return prev + Math.random() * 30
      })
    }, 300)

    return () => clearInterval(timer)
  }, [])

  const stages = [
    { name: "Generating Keys", icon: "🔑" },
    { name: "Splitting Data", icon: "📊" },
    { name: "Distributing to MPC Nodes", icon: "🔗" },
    { name: "Verifying Encryption", icon: "✓" },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="text-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="inline-block"
        >
          <Lock size={48} className="text-accent" />
        </motion.div>
        <h3 className="text-2xl font-bold mt-4">Encrypting Your Strategy</h3>
        <p className="text-text-secondary mt-2">This typically takes 5-10 seconds</p>
      </div>

      <div className="space-y-4">
        {stages.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-lg border transition ${
              i <= stage ? "bg-primary/10 border-border-glow" : "bg-surface border-border"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div className="flex-1">
                <p className={`font-semibold ${i <= stage ? "text-accent" : "text-text-secondary"}`}>{s.name}</p>
                {i === stage && (
                  <div className="mt-2 h-1 bg-surface rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                )}
              </div>
              {i < stage && <span className="text-accent font-bold">✓</span>}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass p-4 rounded-lg border border-border">
        <p className="text-sm text-text-secondary">
          Your strategy is being encrypted across 5 MPC nodes. No single entity can access your strategy logic or
          execution details.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Nodes Active", value: "5/5" },
          { label: "Encryption", value: "AES-256" },
          { label: "Progress", value: `${Math.min(stage * 25 + Math.floor(progress / 4), 100)}%` },
        ].map((stat, i) => (
          <div key={i} className="p-3 bg-surface rounded-lg text-center">
            <p className="text-accent font-bold">{stat.value}</p>
            <p className="text-xs text-text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
