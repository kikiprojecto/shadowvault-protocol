"use client"

import { motion } from "framer-motion"

interface ConfigureStepProps {
  data: any
  setData: (data: any) => void
}

export function ConfigureStep({ data, setData }: ConfigureStepProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2">Strategy</label>
        <div className="glass p-4 rounded-lg border border-border">
          <p className="font-bold">{data.strategyName}</p>
          <p className="text-sm text-text-secondary mt-1">Yield Maximizer Alpha - Expected return 24.5%</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Capital to Deploy</label>
        <div className="glass p-4 rounded-lg border border-border">
          <input
            type="number"
            value={data.capital}
            onChange={(e) => setData({ ...data, capital: Number(e.target.value) })}
            className="w-full bg-transparent text-2xl font-bold outline-none"
          />
          <p className="text-sm text-text-secondary mt-2">≈ ${(data.capital * 148.5).toLocaleString()}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-4">
          Risk Tolerance: <span className="text-accent">{data.riskTolerance}/10</span>
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="10"
            value={data.riskTolerance}
            onChange={(e) => setData({ ...data, riskTolerance: Number(e.target.value) })}
            className="w-full h-2 bg-surface rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-text-muted">
            <span>Conservative</span>
            <span>Aggressive</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-4">
          Time Horizon: <span className="text-accent">{data.timeHorizon} days</span>
        </label>
        <input
          type="range"
          min="7"
          max="365"
          value={data.timeHorizon}
          onChange={(e) => setData({ ...data, timeHorizon: Number(e.target.value) })}
          className="w-full h-2 bg-surface rounded-full appearance-none cursor-pointer accent-primary"
        />
      </div>

      <div className="flex items-center gap-3 p-4 bg-surface rounded-lg border border-border">
        <input
          type="checkbox"
          checked={data.encryption}
          onChange={(e) => setData({ ...data, encryption: e.target.checked })}
          className="w-4 h-4 rounded cursor-pointer"
        />
        <label className="flex-1 cursor-pointer">
          <p className="font-semibold">Full Order Encryption</p>
          <p className="text-sm text-text-secondary">Recommended for MEV protection</p>
        </label>
      </div>
    </motion.div>
  )
}
