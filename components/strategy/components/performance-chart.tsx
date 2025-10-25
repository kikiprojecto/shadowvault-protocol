"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function PerformanceChart() {
  const [timeframe, setTimeframe] = useState("30d")

  const data = [
    { date: "Day 1", value: 10000 },
    { date: "Day 5", value: 10850 },
    { date: "Day 10", value: 10450 },
    { date: "Day 15", value: 12100 },
    { date: "Day 20", value: 11800 },
    { date: "Day 25", value: 13450 },
    { date: "Day 30", value: 12450 },
  ]

  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Performance Analytics</h2>
          <p className="text-text-secondary">Historical returns and metrics</p>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d", "1y", "all"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                timeframe === tf ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6b46c1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6b46c1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 70, 193, 0.1)" />
          <XAxis dataKey="date" stroke="#a8a8b8" />
          <YAxis stroke="#a8a8b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a24",
              border: "1px solid rgba(107, 70, 193, 0.3)",
              borderRadius: "8px",
            }}
          />
          <Line type="monotone" dataKey="value" stroke="#6b46c1" strokeWidth={2} dot={{ fill: "#00ff88" }} />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid md:grid-cols-4 gap-4 mt-6">
        {[
          { label: "Total Return", value: "+24.5%", positive: true },
          { label: "Avg Monthly", value: "+8.2%", positive: true },
          { label: "Max Drawdown", value: "-3.2%", positive: false },
          { label: "Sharpe Ratio", value: "2.14", positive: true },
        ].map((metric, i) => (
          <div key={i} className="p-3 bg-surface rounded-lg">
            <p className="text-text-secondary text-sm mb-1">{metric.label}</p>
            <p className={`text-lg font-bold ${metric.positive ? "text-accent" : "text-danger"}`}>{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
