"use client"

import { motion } from "framer-motion"
import { StrategyCard } from "./strategy-card"
import { StrategyListItem } from "./strategy-list-item"

interface StrategyGridProps {
  viewMode: "grid" | "list"
  searchQuery: string
  filters: any
}

export function StrategyGrid({ viewMode, searchQuery, filters }: StrategyGridProps) {
  const strategies = [
    {
      id: 1,
      name: "Yield Maximizer Alpha",
      creator: "0x742d...8f2a",
      verified: true,
      return: 24.5,
      successRate: 89,
      users: 1247,
      risk: "MODERATE",
      price: 29.99,
      tags: ["Yield Farming", "DeFi"],
      rating: 4.8,
      reviews: 234,
    },
    {
      id: 2,
      name: "Conservative Staking",
      creator: "0x1a2b...3c4d",
      verified: true,
      return: 12.3,
      successRate: 95,
      users: 892,
      risk: "LOW",
      price: 9.99,
      tags: ["Staking", "Low Risk"],
      rating: 4.9,
      reviews: 156,
    },
    {
      id: 3,
      name: "Arbitrage Opportunity",
      creator: "0x5e6f...7g8h",
      verified: true,
      return: 18.7,
      successRate: 82,
      users: 456,
      risk: "MODERATE",
      price: 19.99,
      tags: ["Arbitrage", "Trading"],
      rating: 4.6,
      reviews: 89,
    },
    {
      id: 4,
      name: "Aggressive Growth",
      creator: "0x9i0j...1k2l",
      verified: false,
      return: 32.1,
      successRate: 71,
      users: 234,
      risk: "HIGH",
      price: 49.99,
      tags: ["Growth", "High Risk"],
      rating: 4.3,
      reviews: 45,
    },
    {
      id: 5,
      name: "Market Making Pro",
      creator: "0x3m4n...5o6p",
      verified: true,
      return: 21.5,
      successRate: 86,
      users: 567,
      risk: "MODERATE",
      price: 39.99,
      tags: ["Market Making", "Advanced"],
      rating: 4.7,
      reviews: 123,
    },
    {
      id: 6,
      name: "Hedging Strategy",
      creator: "0x7q8r...9s0t",
      verified: true,
      return: 8.5,
      successRate: 98,
      users: 678,
      risk: "LOW",
      price: 14.99,
      tags: ["Hedging", "Risk Management"],
      rating: 4.9,
      reviews: 201,
    },
  ]

  const filteredStrategies = strategies.filter((strategy) => {
    const matchesSearch =
      strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      strategy.creator.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType =
      filters.strategyType.length === 0 || filters.strategyType.some((type: string) => strategy.tags.includes(type))

    const matchesRisk = filters.riskLevel.length === 0 || filters.riskLevel.includes(strategy.risk)

    const matchesPerformance =
      strategy.return >= filters.performanceRange[0] && strategy.return <= filters.performanceRange[1]

    const matchesPrice = strategy.price >= filters.priceRange[0] && strategy.price <= filters.priceRange[1]

    const matchesVerification = !filters.verificationStatus || strategy.verified

    return matchesSearch && matchesType && matchesRisk && matchesPerformance && matchesPrice && matchesVerification
  })

  if (filteredStrategies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-2xl font-bold mb-2">No strategies found</p>
        <p className="text-text-secondary">Try adjusting your filters or search query</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-text-secondary mb-6">
        Showing {filteredStrategies.length} of {strategies.length} strategies
      </p>

      {viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStrategies.map((strategy, i) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <StrategyCard strategy={strategy} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStrategies.map((strategy, i) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <StrategyListItem strategy={strategy} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
