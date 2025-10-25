"use client"

import type { LucideIcon } from "lucide-react"

interface MetricsCardProps {
  title: string
  value: string
  change: string
  changePercent: string
  icon: LucideIcon
  positive: boolean
}

export function MetricsCard({ title, value, change, changePercent, icon: Icon, positive }: MetricsCardProps) {
  return (
    <div className="glass p-6 rounded-xl hover:border-border-glow transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-text-secondary text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <Icon size={24} className="text-accent" />
      </div>
      <div className="flex items-center justify-between">
        <p className={`text-sm font-semibold ${positive ? "text-accent" : "text-danger"}`}>{change}</p>
        <p className="text-xs text-text-muted">{changePercent}</p>
      </div>
    </div>
  )
}
