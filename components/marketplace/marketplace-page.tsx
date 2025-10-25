"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Grid3x3, List } from "lucide-react"
import { FilterSidebar } from "./components/filter-sidebar"
import { StrategyGrid } from "./components/strategy-grid"

export function MarketplacePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    strategyType: [],
    riskLevel: [],
    performanceRange: [0, 100],
    priceRange: [0, 500],
    verificationStatus: false,
  })

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <div className="glass border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold mb-4">Strategy Marketplace</h1>

          {/* Search Bar */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search strategies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass rounded-lg border border-border outline-none focus:border-border-glow transition"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-primary text-white" : "hover:bg-surface"}`}
              >
                <Grid3x3 size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-primary text-white" : "hover:bg-surface"}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-64 flex-shrink-0 hidden lg:block"
          >
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </motion.div>

          {/* Strategies Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <StrategyGrid viewMode={viewMode} searchQuery={searchQuery} filters={filters} />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
