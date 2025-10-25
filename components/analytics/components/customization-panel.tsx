"use client"

import { motion } from "framer-motion"
import { Plus } from "lucide-react"

interface Widget {
  id: number
  type: string
  title: string
  size: string
}

interface CustomizationPanelProps {
  widgets: Widget[]
  setWidgets: (widgets: Widget[]) => void
}

export function CustomizationPanel({ widgets, setWidgets }: CustomizationPanelProps) {
  const availableWidgets = [
    { type: "performance", title: "Performance Chart", description: "Historical returns visualization" },
    { type: "risk", title: "Risk Metrics", description: "Risk assessment and gauges" },
    { type: "allocation", title: "Asset Allocation", description: "Portfolio composition" },
    { type: "transactions", title: "Transaction Timeline", description: "Recent activity log" },
    { type: "correlation", title: "Market Correlation", description: "Asset correlation heatmap" },
    { type: "insights", title: "AI Insights", description: "Personalized recommendations" },
  ]

  const addWidget = (type: string, title: string) => {
    const newWidget = {
      id: Math.max(...widgets.map((w) => w.id), 0) + 1,
      type,
      title,
      size: "medium",
    }
    setWidgets([...widgets, newWidget])
  }

  const existingTypes = widgets.map((w) => w.type)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass p-6 rounded-xl border border-border sticky top-24"
    >
      <h2 className="text-xl font-bold mb-4">Customize Dashboard</h2>

      <div className="space-y-3">
        <p className="text-sm text-text-secondary mb-4">Add widgets to your dashboard</p>

        {availableWidgets.map((widget) => {
          const isAdded = existingTypes.includes(widget.type)

          return (
            <button
              key={widget.type}
              onClick={() => addWidget(widget.type, widget.title)}
              disabled={isAdded}
              className={`w-full p-3 rounded-lg border transition text-left ${
                isAdded
                  ? "bg-surface border-border opacity-50 cursor-not-allowed"
                  : "glass border-border hover:border-border-glow hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{widget.title}</p>
                  <p className="text-xs text-text-muted mt-1">{widget.description}</p>
                </div>
                {!isAdded && <Plus size={16} className="text-accent" />}
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
        <p className="text-xs text-text-secondary">
          Drag widgets to reorder them. Click the X button to remove widgets from your dashboard.
        </p>
      </div>
    </motion.div>
  )
}
