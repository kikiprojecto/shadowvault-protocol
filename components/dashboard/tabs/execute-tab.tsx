"use client"

import { motion } from "framer-motion"
import { ArrowDownUp, Settings } from "lucide-react"
import { useState } from "react"

export function ExecuteTab() {
  const [fromToken, setFromToken] = useState("SOL")
  const [toToken, setToToken] = useState("USDC")
  const [fromAmount, setFromAmount] = useState("10")

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Order Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:col-span-1"
      >
        <div className="glass p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-6">MEV-Protected Execution</h2>

          <div className="space-y-4">
            {/* You Pay */}
            <div>
              <label className="text-sm text-text-secondary mb-2 block">You Pay</label>
              <div className="glass p-4 rounded-lg mb-2">
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="text"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="bg-transparent text-2xl font-bold outline-none w-full"
                  />
                  <select
                    value={fromToken}
                    onChange={(e) => setFromToken(e.target.value)}
                    className="bg-surface px-3 py-1 rounded-lg outline-none font-semibold"
                  >
                    <option>SOL</option>
                    <option>USDC</option>
                    <option>JUP</option>
                  </select>
                </div>
                <p className="text-sm text-text-secondary">≈ $1,485.00</p>
              </div>
              <p className="text-xs text-text-muted">Balance: 125.45 SOL</p>
            </div>

            {/* Swap Direction */}
            <div className="flex justify-center">
              <button className="p-2 hover:bg-surface rounded-lg transition">
                <ArrowDownUp size={20} className="text-accent" />
              </button>
            </div>

            {/* You Receive */}
            <div>
              <label className="text-sm text-text-secondary mb-2 block">You Receive</label>
              <div className="glass p-4 rounded-lg mb-2">
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="text"
                    value="1,485"
                    readOnly
                    className="bg-transparent text-2xl font-bold outline-none w-full"
                  />
                  <select
                    value={toToken}
                    onChange={(e) => setToToken(e.target.value)}
                    className="bg-surface px-3 py-1 rounded-lg outline-none font-semibold"
                  >
                    <option>USDC</option>
                    <option>SOL</option>
                    <option>JUP</option>
                  </select>
                </div>
                <p className="text-sm text-text-secondary">≈ $1,485.00</p>
              </div>
            </div>

            {/* Settings */}
            <button className="w-full flex items-center justify-between p-3 glass rounded-lg hover:border-border-glow transition">
              <span className="font-semibold">Advanced Settings</span>
              <Settings size={16} />
            </button>

            {/* Execute Button */}
            <button className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-secondary/30 transition">
              Execute Swap
            </button>

            <p className="text-xs text-text-muted text-center">🔒 Order Encrypted End-to-End</p>
          </div>
        </div>
      </motion.div>

      {/* Execution Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="lg:col-span-2"
      >
        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-6">Execution Details</h3>

          <div className="space-y-6">
            {/* Preview Tab */}
            <div>
              <h4 className="font-semibold mb-4">Preview</h4>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-surface rounded-lg">
                  <span className="text-text-secondary">Route</span>
                  <span className="font-semibold">Raydium → Jupiter</span>
                </div>
                <div className="flex justify-between p-3 bg-surface rounded-lg">
                  <span className="text-text-secondary">Price Impact</span>
                  <span className="font-semibold text-accent">0.12%</span>
                </div>
                <div className="flex justify-between p-3 bg-surface rounded-lg">
                  <span className="text-text-secondary">Network Fee</span>
                  <span className="font-semibold">0.00025 SOL</span>
                </div>
                <div className="flex justify-between p-3 bg-surface rounded-lg">
                  <span className="text-text-secondary">Estimated Time</span>
                  <span className="font-semibold">~4.2s</span>
                </div>
              </div>
            </div>

            {/* Privacy Details */}
            <div>
              <h4 className="font-semibold mb-4">Privacy Details</h4>
              <div className="glass p-4 rounded-lg border border-border">
                <p className="text-sm text-text-secondary mb-3">
                  Your order is encrypted end-to-end and routed through our MEV protection layer. No bots can see your
                  order until execution.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-surface rounded-lg">
                    <p className="text-accent font-bold">1,247</p>
                    <p className="text-xs text-text-muted">Protected Orders</p>
                  </div>
                  <div className="text-center p-2 bg-surface rounded-lg">
                    <p className="text-accent font-bold">$45.2K</p>
                    <p className="text-xs text-text-muted">MEV Prevented</p>
                  </div>
                  <div className="text-center p-2 bg-surface rounded-lg">
                    <p className="text-accent font-bold">4.2s</p>
                    <p className="text-xs text-text-muted">Avg Execution</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
