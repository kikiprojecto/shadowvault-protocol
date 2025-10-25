"use client"

import { CheckCircle, Clock } from "lucide-react"

export function TransactionsWidget() {
  const transactions = [
    { time: "2 min ago", action: "Swap", amount: "10 SOL → 1,485 USDC", status: "completed" },
    { time: "1 hour ago", action: "Stake", amount: "50 JUP", status: "completed" },
    { time: "3 hours ago", action: "Deposit", amount: "+$5,000 USDC", status: "completed" },
    { time: "5 hours ago", action: "Withdraw", amount: "-$2,500 USDC", status: "pending" },
  ]

  return (
    <div className="space-y-2">
      {transactions.map((tx, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-lg">
          <div className="flex items-center gap-3 flex-1">
            {tx.status === "completed" ? (
              <CheckCircle size={16} className="text-accent flex-shrink-0" />
            ) : (
              <Clock size={16} className="text-warning flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="font-semibold text-sm">{tx.action}</p>
              <p className="text-xs text-text-muted truncate">{tx.amount}</p>
            </div>
          </div>
          <p className="text-xs text-text-muted whitespace-nowrap ml-2">{tx.time}</p>
        </div>
      ))}
    </div>
  )
}
