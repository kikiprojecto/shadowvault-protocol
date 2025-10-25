"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Download, RotateCcw } from "lucide-react"
import { WidgetGrid } from "./components/widget-grid"
import { CustomizationPanel } from "./components/customization-panel"

export function AnalyticsDashboard() {
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [widgets, setWidgets] = useState([
    { id: 1, type: "performance", title: "Performance Chart", size: "large" },
    { id: 2, type: "risk", title: "Risk Metrics", size: "medium" },
    { id: 3, type: "allocation", title: "Asset Allocation", size: "medium" },
    { id: 4, type: "transactions", title: "Transaction Timeline", size: "large" },
    { id: 5, type: "correlation", title: "Market Correlation", size: "large" },
    { id: 6, type: "insights", title: "AI Insights", size: "medium" },
  ])

  const handleReset = () => {
    setWidgets([
      { id: 1, type: "performance", title: "Performance Chart", size: "large" },
      { id: 2, type: "risk", title: "Risk Metrics", size: "medium" },
      { id: 3, type: "allocation", title: "Asset Allocation", size: "medium" },
      { id: 4, type: "transactions", title: "Transaction Timeline", size: "large" },
      { id: 5, type: "correlation", title: "Market Correlation", size: "large" },
      { id: 6, type: "insights", title: "AI Insights", size: "medium" },
    ])
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <div className="glass border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-text-secondary mt-1">Customizable widgets for deep portfolio insights</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="p-2 hover:bg-surface rounded-lg transition"
              title="Reset to default layout"
            >
              <RotateCcw size={20} />
            </button>
            <button className="p-2 hover:bg-surface rounded-lg transition" title="Export data">
              <Download size={20} />
            </button>
            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className={`p-2 rounded-lg transition ${isCustomizing ? "bg-primary text-white" : "hover:bg-surface"}`}
              title="Customize dashboard"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <motion.div layout className={`transition-all duration-300 ${isCustomizing ? "lg:w-2/3" : "w-full"}`}>
            <WidgetGrid widgets={widgets} setWidgets={setWidgets} isCustomizing={isCustomizing} />
          </motion.div>

          {/* Customization Panel */}
          {isCustomizing && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:w-1/3"
            >
              <CustomizationPanel widgets={widgets} setWidgets={setWidgets} />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
