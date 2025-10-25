"use client"

import { motion } from "framer-motion"
import { RefreshCw, Download } from "lucide-react"

export function PortfolioTab() {
  const assets = [
    { symbol: "SOL", name: "Solana", balance: "125.45", value: "$18,750.00", change: "+12.5%", allocation: "39%" },
    { symbol: "USDC", name: "USD Coin", balance: "15,000", value: "$15,000.00", change: "+0.1%", allocation: "31%" },
    { symbol: "JUP", name: "Jupiter", balance: "8,500", value: "$8,925.00", change: "+5.2%", allocation: "19%" },
    { symbol: "ORCA", name: "Orca", balance: "2,100", value: "$4,907.33", change: "-2.3%", allocation: "11%" },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold">Encrypted Portfolio</h2>
          <p className="text-text-secondary">All values computed in MPC</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-surface rounded-lg transition">
            <RefreshCw size={20} />
          </button>
          <button className="p-2 hover:bg-surface rounded-lg transition">
            <Download size={20} />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left font-semibold text-text-secondary">Asset</th>
                <th className="px-6 py-4 text-right font-semibold text-text-secondary">Balance</th>
                <th className="px-6 py-4 text-right font-semibold text-text-secondary">Value</th>
                <th className="px-6 py-4 text-right font-semibold text-text-secondary">24h Change</th>
                <th className="px-6 py-4 text-right font-semibold text-text-secondary">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, i) => (
                <tr key={i} className="border-b border-border hover:bg-primary/5 transition">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold">{asset.symbol}</p>
                      <p className="text-sm text-text-secondary">{asset.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">{asset.balance}</td>
                  <td className="px-6 py-4 text-right font-semibold">{asset.value}</td>
                  <td
                    className={`px-6 py-4 text-right font-semibold ${asset.change.startsWith("+") ? "text-accent" : "text-danger"}`}
                  >
                    {asset.change}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-surface rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                          style={{ width: asset.allocation }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{asset.allocation}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Portfolio Insights */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Diversity Score", value: "72", recommendation: "Consider adding stablecoin exposure" },
          { title: "Risk Exposure", value: "MODERATE", recommendation: "Balanced across risk categories" },
          { title: "Performance", value: "+34.2%", recommendation: "Outperforming HODL strategy" },
        ].map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
            className="glass p-6 rounded-xl"
          >
            <p className="text-text-secondary text-sm mb-2">{insight.title}</p>
            <p className="text-3xl font-bold gradient-text mb-3">{insight.value}</p>
            <p className="text-sm text-text-secondary">{insight.recommendation}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
