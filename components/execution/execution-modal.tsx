"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ChevronLeft } from "lucide-react"
import { ConfigureStep } from "./steps/configure-step"
import { ReviewStep } from "./steps/review-step"
import { EncryptStep } from "./steps/encrypt-step"
import { ExecuteStep } from "./steps/execute-step"

interface ExecutionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ExecutionModal({ isOpen, onClose }: ExecutionModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [executionData, setExecutionData] = useState({
    strategyName: "Yield Maximizer Alpha",
    capital: 10000,
    riskTolerance: 5,
    timeHorizon: 30,
    encryption: true,
  })

  const steps = [
    { title: "Configure", component: ConfigureStep },
    { title: "Review", component: ReviewStep },
    { title: "Encrypt", component: EncryptStep },
    { title: "Execute", component: ExecuteStep },
  ]

  const CurrentStepComponent = steps[currentStep].component

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="glass rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-2xl font-bold">Execute Strategy</h2>
              <p className="text-text-secondary text-sm mt-1">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-surface rounded-lg transition">
              <X size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pt-6">
            <div className="flex gap-2 mb-6">
              {steps.map((step, i) => (
                <div key={i} className="flex-1">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      i <= currentStep ? "bg-gradient-to-r from-primary to-secondary" : "bg-surface"
                    }`}
                  />
                  <p className={`text-xs mt-2 font-semibold ${i <= currentStep ? "text-accent" : "text-text-muted"}`}>
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CurrentStepComponent data={executionData} setData={setExecutionData} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6 flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-border-glow disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="flex gap-2">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`w-2 h-2 rounded-full transition ${i === currentStep ? "bg-accent w-6" : "bg-text-muted"}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {currentStep === steps.length - 1 ? "Complete" : "Next"}
              {currentStep !== steps.length - 1 && <ChevronRight size={16} />}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
