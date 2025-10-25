"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function AllocationChart() {
  const data = [
    { name: "SOL", value: 39 },
    { name: "USDC", value: 31 },
    { name: "JUP", value: 19 },
    { name: "ORCA", value: 11 },
  ]

  const COLORS = ["#6b46c1", "#00d9ff", "#00ff88", "#ffb800"]

  return (
    <div className="glass p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-6">Asset Allocation</h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a24",
              border: "1px solid rgba(107, 70, 193, 0.3)",
              borderRadius: "8px",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
