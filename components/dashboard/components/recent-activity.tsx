"use client"

import { CheckCircle, Clock, AlertCircle } from "lucide-react"

export function RecentActivity() {
  const activities = [
    { time: "2 min ago", action: "Swap", amount: "10 SOL → 1,485 USDC", status: "completed" },
    { time: "1 hour ago", action: "Stake", amount: "50 JUP", status: "completed" },
    { time: "3 hours ago", action: "Deposit", amount: "+$5,000 USDC", status: "completed" },
    { time: "5 hours ago", action: "Withdraw", amount: "-$2,500 USDC", status: "pending" },
    { time: "1 day ago", action: "Strategy", amount: "Yield Maximizer Alpha", status: "completed" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} className="text-accent" />
      case "pending":
        return <Clock size={16} className="text-warning" />
      default:
        return <AlertCircle size={16} className="text-danger" />
    }
  }

  return (
    <div className="glass p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-4">Recent Activity</h3>

      <div className="space-y-3">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-center justify-between p-3 hover:bg-primary/5 rounded-lg transition">
            <div className="flex items-center gap-3 flex-1">
              {getStatusIcon(activity.status)}
              <div>
                <p className="font-semibold">{activity.action}</p>
                <p className="text-sm text-text-secondary">{activity.amount}</p>
              </div>
            </div>
            <p className="text-xs text-text-muted">{activity.time}</p>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 px-4 py-2 rounded-lg border border-border hover:border-border-glow transition font-semibold">
        View All Activity
      </button>
    </div>
  )
}
