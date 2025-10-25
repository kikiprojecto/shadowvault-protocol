"use client"

import type React from "react"

import { motion } from "framer-motion"
import { PerformanceWidget } from "./widgets/performance-widget"
import { RiskWidget } from "./widgets/risk-widget"
import { AllocationWidget } from "./widgets/allocation-widget"
import { TransactionsWidget } from "./widgets/transactions-widget"
import { CorrelationWidget } from "./widgets/correlation-widget"
import { InsightsWidget } from "./widgets/insights-widget"
import { X } from "lucide-react"

interface Widget {
  id: number
  type: string
  title: string
  size: string
}

interface WidgetGridProps {
  widgets: Widget[]
  setWidgets: (widgets: Widget[]) => void
  isCustomizing: boolean
}

export function WidgetGrid({ widgets, setWidgets, isCustomizing }: WidgetGridProps) {
  const widgetComponents: Record<string, React.ComponentType<any>> = {
    performance: PerformanceWidget,
    risk: RiskWidget,
    allocation: AllocationWidget,
    transactions: TransactionsWidget,
    correlation: CorrelationWidget,
    insights: InsightsWidget,
  }

  const removeWidget = (id: number) => {
    setWidgets(widgets.filter((w) => w.id !== id))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
      {widgets.map((widget, index) => {
        const Component = widgetComponents[widget.type]
        const colSpan = widget.size === "large" ? "lg:col-span-2" : ""

        return (
          <motion.div
            key={widget.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={`relative group ${colSpan}`}
          >
            <div className="glass p-6 rounded-xl border border-border hover:border-border-glow transition h-full">
              {isCustomizing && (
                <button
                  onClick={() => removeWidget(widget.id)}
                  className="absolute top-2 right-2 p-1 bg-danger/20 hover:bg-danger/30 rounded-lg opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={16} className="text-danger" />
                </button>
              )}

              <h3 className="text-lg font-bold mb-4">{widget.title}</h3>
              {Component && <Component />}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
