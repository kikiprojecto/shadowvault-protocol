"use client"

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { useState } from "react"

export function PerformanceChart() {
  const [timeframe, setTimeframe] = useState("7d")

  const data = [
    { time: "Mon", value: 42000 },
    { time: "Tue", value: 43500 },
    { time: "Wed", value: 41200 },
    { time: "Thu", value: 45800 },
    { time: "Fri", value: 44200 },
    { time: "Sat", value: 46500 },
    { time: "Sun", value: 47582 },
  ]

  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">Portfolio Performance</h3>
          <p className="text-text-secondary text-sm">Data computed in MPC</p>
        </div>
        <div className="flex gap-2">
          {["24h", "7d", "30d", "ALL"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                timeframe === tf ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6b46c1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6b46c1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 70, 193, 0.1)" />
          <XAxis dataKey="time" stroke="#a8a8b8" />
          <YAxis stroke="#a8a8b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a24",
              border: "1px solid rgba(107, 70, 193, 0.3)",
              borderRadius: "8px",
            }}
          />
          <Area type="monotone" dataKey="value" stroke="#6b46c1" fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
