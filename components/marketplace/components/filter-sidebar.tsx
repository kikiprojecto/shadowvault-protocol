"use client"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface FilterSidebarProps {
  filters: any
  setFilters: (filters: any) => void
}

export function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    risk: true,
    performance: true,
    price: true,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="glass p-6 rounded-xl border border-border sticky top-24 space-y-6">
      <h2 className="text-xl font-bold">Filters</h2>

      {/* Strategy Type */}
      <div>
        <button
          onClick={() => toggleSection("type")}
          className="w-full flex items-center justify-between font-semibold mb-3 hover:text-accent transition"
        >
          Strategy Type
          <ChevronDown size={16} className={`transition-transform ${expandedSections.type ? "rotate-180" : ""}`} />
        </button>
        {expandedSections.type && (
          <div className="space-y-2">
            {["Yield Farming", "Arbitrage", "Market Making", "Staking", "Hedging"].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded cursor-pointer"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({
                        ...filters,
                        strategyType: [...filters.strategyType, type],
                      })
                    } else {
                      setFilters({
                        ...filters,
                        strategyType: filters.strategyType.filter((t: string) => t !== type),
                      })
                    }
                  }}
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Risk Level */}
      <div>
        <button
          onClick={() => toggleSection("risk")}
          className="w-full flex items-center justify-between font-semibold mb-3 hover:text-accent transition"
        >
          Risk Level
          <ChevronDown size={16} className={`transition-transform ${expandedSections.risk ? "rotate-180" : ""}`} />
        </button>
        {expandedSections.risk && (
          <div className="space-y-2">
            {["Low", "Medium", "High"].map((risk) => (
              <label key={risk} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="risk"
                  className="w-4 h-4 cursor-pointer"
                  onChange={() => setFilters({ ...filters, riskLevel: [risk] })}
                />
                <span className="text-sm">{risk}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Performance Range */}
      <div>
        <button
          onClick={() => toggleSection("performance")}
          className="w-full flex items-center justify-between font-semibold mb-3 hover:text-accent transition"
        >
          Performance
          <ChevronDown
            size={16}
            className={`transition-transform ${expandedSections.performance ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSections.performance && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-secondary mb-2 block">
                Return Range: {filters.performanceRange[0]}% - {filters.performanceRange[1]}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.performanceRange[1]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    performanceRange: [filters.performanceRange[0], Number(e.target.value)],
                  })
                }
                className="w-full h-2 bg-surface rounded-full appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between font-semibold mb-3 hover:text-accent transition"
        >
          Price
          <ChevronDown size={16} className={`transition-transform ${expandedSections.price ? "rotate-180" : ""}`} />
        </button>
        {expandedSections.price && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-secondary mb-2 block">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}/month
              </label>
              <input
                type="range"
                min="0"
                max="500"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priceRange: [filters.priceRange[0], Number(e.target.value)],
                  })
                }
                className="w-full h-2 bg-surface rounded-full appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* Verification Status */}
      <div className="pt-4 border-t border-border">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.verificationStatus}
            onChange={(e) => setFilters({ ...filters, verificationStatus: e.target.checked })}
            className="w-4 h-4 rounded cursor-pointer"
          />
          <span className="text-sm font-semibold">MPC Verified Only</span>
        </label>
      </div>

      <button className="w-full px-4 py-2 rounded-lg border border-border hover:border-border-glow transition font-semibold">
        Reset Filters
      </button>
    </div>
  )
}
