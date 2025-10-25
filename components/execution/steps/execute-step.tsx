"use client"

import { motion } from "framer-motion"
import { CheckCircle, Clock } from "lucide-react"
import { useState, useEffect } from "react"

interface ExecuteStepProps {
  data: any
  setData: (data: any) => void
}

export function ExecuteStep({ data }: ExecuteStepProps) {
  const [status, setStatus] = useState("executing")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setStatus("completed")
          return 100
        }
        return prev + Math.random() * 25
      })
    }, 400)

    return () => clearInterval(timer)
  }, [])

  const stages = [
    { name: "Submitting Order", status: "completed" },
    { name: "MEV Protection Active", status: "completed" },
    { name: "Routing Through MPC", status: progress > 33 ? "completed" : "executing" },
    { name: "Executing on DEX", status: progress > 66 ? "completed" : progress > 33 ? "executing" : "pending" },
    { name: "Settlement", status: progress > 90 ? "completed" : progress > 66 ? "executing" : "pending" },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="text-center py-8">
        {status === "executing" ? (
          <>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="inline-block"
            >
              <Clock size={48} className="text-accent" />
            </motion.div>
            <h3 className="text-2xl font-bold mt-4">Executing Strategy</h3>
            <p className="text-text-secondary mt-2">Your order is being processed securely</p>
          </>
        ) : (
          <>
            <CheckCircle size={48} className="text-accent mx-auto" />
            <h3 className="text-2xl font-bold mt-4">Execution Complete!</h3>
            <p className="text-text-secondary mt-2">Your strategy is now active</p>
          </>
        )}
      </div>

      <div className="space-y-3">
        {stages.map((stage, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-lg border flex items-center gap-3 transition ${
              stage.status === "completed"
                ? "bg-accent/10 border-accent"
                : stage.status === "executing"
                  ? "bg-primary/10 border-border-glow"
                  : "bg-surface border-border"
            }`}
          >
            {stage.status === "completed" ? (
              <CheckCircle size={20} className="text-accent flex-shrink-0" />
            ) : stage.status === "executing" ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
                <Clock size={20} className="text-primary flex-shrink-0" />
              </motion.div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-text-muted flex-shrink-0" />
            )}
            <span className="font-semibold">{stage.name}</span>
          </motion.div>
        ))}
      </div>

      <div className="glass p-4 rounded-lg border border-border">
        <p className="text-sm text-text-secondary mb-3">Overall Progress</p>
        <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <p className="text-xs text-text-muted mt-2">{Math.floor(progress)}% complete</p>
      </div>

      {status === "completed" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-4 rounded-lg border border-accent/30 bg-accent/5"
        >
          <p className="text-sm text-text-secondary">
            Your strategy is now live and actively trading. Monitor performance in your dashboard.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
