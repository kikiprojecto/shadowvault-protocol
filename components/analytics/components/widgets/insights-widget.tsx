"use client"

import { Lightbulb } from "lucide-react"

export function InsightsWidget() {
  const insights = [
    {
      title: "Rebalance Opportunity",
      description: "SOL allocation is 8% above target. Consider rebalancing.",
      priority: "high",
    },
    {
      title: "Risk Alert",
      description: "Portfolio volatility increased 12% this week.",
      priority: "medium",
    },
    {
      title: "Yield Opportunity",
      description: "New high-yield farming opportunity detected on Orca.",
      priority: "low",
    },
  ]

  return (
    <div className="space-y-3">
      {insights.map((insight, i) => (
        <div
          key={i}
          className={`p-3 rounded-lg border ${
            insight.priority === "high"
              ? "bg-danger/10 border-danger/30"
              : insight.priority === "medium"
                ? "bg-warning/10 border-warning/30"
                : "bg-accent/10 border-accent/30"
          }`}
        >
          <div className="flex gap-2">
            <Lightbulb
              size={16}
              className={`flex-shrink-0 mt-0.5 ${
                insight.priority === "high"
                  ? "text-danger"
                  : insight.priority === "medium"
                    ? "text-warning"
                    : "text-accent"
              }`}
            />
            <div className="min-w-0">
              <p className="font-semibold text-sm">{insight.title}</p>
              <p className="text-xs text-text-secondary mt-1">{insight.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
