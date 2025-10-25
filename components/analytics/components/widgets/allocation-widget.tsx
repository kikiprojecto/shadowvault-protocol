"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function AllocationWidget() {
  const data = [
    { name: "SOL", value: 39 },
    { name: "USDC", value: 31 },
    { name: "JUP", value: 19 },
    { name: "ORCA", value: 11 },
  ]

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 70, 193, 0.1)" />
        <XAxis dataKey="name" stroke="#a8a8b8" />
        <YAxis stroke="#a8a8b8" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1a24",
            border: "1px solid rgba(107, 70, 193, 0.3)",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="value" fill="#6b46c1" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
