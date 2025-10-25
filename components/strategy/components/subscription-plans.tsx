"use client"

import { motion } from "framer-motion"
import { Check, Lock } from "lucide-react"

export function SubscriptionPlans() {
  const plans = [
    {
      name: "Basic",
      price: "$9.99",
      period: "/month",
      features: ["Real-time signals", "Basic analytics", "Email support"],
      popular: false,
    },
    {
      name: "Pro",
      price: "$29.99",
      period: "/month",
      features: ["All Basic features", "Advanced analytics", "Priority support", "Custom alerts", "API access"],
      popular: true,
    },
    {
      name: "Lifetime",
      price: "$299",
      period: "one-time",
      features: ["All Pro features", "Lifetime access", "No recurring fees", "VIP support"],
      popular: false,
    },
  ]

  return (
    <div className="space-y-4">
      {plans.map((plan, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className={`glass p-6 rounded-xl border transition ${
            plan.popular ? "border-border-glow bg-primary/5" : "border-border"
          }`}
        >
          {plan.popular && (
            <div className="mb-3 inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold">
              MOST POPULAR
            </div>
          )}

          <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
          <div className="mb-4">
            <span className="text-3xl font-bold gradient-text">{plan.price}</span>
            <span className="text-text-secondary text-sm">{plan.period}</span>
          </div>

          <button
            className={`w-full px-4 py-2 rounded-lg font-semibold mb-4 transition ${
              plan.popular
                ? "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-secondary/30"
                : "border border-border hover:border-border-glow text-text-primary"
            }`}
          >
            Subscribe Now
          </button>

          <div className="space-y-3">
            {plan.features.map((feature, j) => (
              <div key={j} className="flex items-center gap-2">
                <Check size={16} className="text-accent flex-shrink-0" />
                <span className="text-sm text-text-secondary">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="glass p-4 rounded-xl border border-border-glow bg-primary/5"
      >
        <div className="flex gap-2 items-start">
          <Lock size={16} className="text-accent mt-1 flex-shrink-0" />
          <p className="text-sm text-text-secondary">
            All subscriptions include encrypted data storage and MPC-verified performance metrics.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
