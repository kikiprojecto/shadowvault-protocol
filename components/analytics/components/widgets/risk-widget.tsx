"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

export function RiskWidget() {
  const data = [
    { name: "Low Risk", value: 45 },
    { name: "Medium Risk", value: 35 },
    { name: "High Risk", value: 20 },
  ]

  const COLORS = ["#00ff88", "#ffb800", "#ff3366"]

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="space-y-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-2 bg-surface rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
              <span className="text-sm">{item.name}</span>
            </div>
            <span className="font-bold">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
