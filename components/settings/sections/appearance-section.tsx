"use client"

import { motion } from "framer-motion"
import { Palette } from "lucide-react"
import { useState } from "react"

export function AppearanceSection() {
  const [theme, setTheme] = useState("dark")
  const [fontSize, setFontSize] = useState("medium")

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass p-6 rounded-xl border border-border"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Palette size={24} className="text-accent" />
          Theme
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { id: "light", label: "Light", preview: "bg-white" },
            { id: "dark", label: "Dark", preview: "bg-surface" },
            { id: "auto", label: "Auto", preview: "bg-gradient-to-r from-white to-surface" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-4 rounded-lg border-2 transition ${
                theme === t.id ? "border-accent bg-primary/10" : "border-border hover:border-border-glow"
              }`}
            >
              <div className={`w-full h-20 rounded-lg mb-3 ${t.preview}`} />
              <p className="font-semibold">{t.label}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Font Size */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass p-6 rounded-xl border border-border"
      >
        <h3 className="text-xl font-bold mb-4">Font Size</h3>

        <div className="space-y-4">
          <div className="flex gap-4">
            {[
              { id: "small", label: "Small", size: "text-sm" },
              { id: "medium", label: "Medium", size: "text-base" },
              { id: "large", label: "Large", size: "text-lg" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFontSize(f.id)}
                className={`flex-1 px-4 py-2 rounded-lg border transition ${
                  fontSize === f.id ? "border-accent bg-primary/10" : "border-border hover:border-border-glow"
                }`}
              >
                <p className={f.size}>{f.label}</p>
              </button>
            ))}
          </div>

          <div className="p-4 bg-surface rounded-lg border border-border">
            <p className={fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base"}>
              This is how your text will look with the selected font size.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Display Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="glass p-6 rounded-xl border border-border"
      >
        <h3 className="text-xl font-bold mb-4">Display Options</h3>

        <div className="space-y-3">
          {[
            { label: "Compact Mode", description: "Reduce spacing and padding" },
            { label: "Animations", description: "Enable smooth transitions" },
            { label: "Reduce Motion", description: "Minimize animations for accessibility" },
          ].map((option, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
              <div>
                <p className="font-semibold">{option.label}</p>
                <p className="text-sm text-text-secondary">{option.description}</p>
              </div>
              <button className="relative w-12 h-6 rounded-full bg-surface border border-border transition">
                <div className="absolute top-1 left-1 w-4 h-4 bg-text-muted rounded-full transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
