"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function PerformanceWidget() {
  const data = [
    { date: "Jan", value: 10000 },
    { date: "Feb", value: 12500 },
    { date: "Mar", value: 11800 },
    { date: "Apr", value: 14200 },
    { date: "May", value: 13500 },
    { date: "Jun", value: 15800 },
  ]

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
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
  )
}
