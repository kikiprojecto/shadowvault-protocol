"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function RecommendationsCarousel() {
  const [current, setCurrent] = useState(0)

  const recommendations = [
    {
      title: "Yield Maximizer Alpha",
      confidence: 87,
      return: "24.5%",
      risk: "MODERATE",
    },
    {
      title: "Conservative Staking",
      confidence: 92,
      return: "12.3%",
      risk: "LOW",
    },
    {
      title: "Arbitrage Opportunity",
      confidence: 78,
      return: "18.7%",
      risk: "MODERATE",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % recommendations.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="glass p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-4">AI Recommendations</h3>

      <div className="relative">
        <div className="glass p-6 rounded-lg border border-border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold">{recommendations[current].title}</h4>
              <p className="text-sm text-text-secondary mt-1">Confidence: {recommendations[current].confidence}%</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${recommendations[current].risk === "LOW" ? "bg-accent/20 text-accent" : "bg-warning/20 text-warning"}`}
            >
              {recommendations[current].risk}
            </span>
          </div>

          <p className="text-3xl font-bold gradient-text mb-4">{recommendations[current].return}</p>

          <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-secondary/30 transition">
            View Details
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + recommendations.length) % recommendations.length)}
            className="p-2 hover:bg-surface rounded-lg transition"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {recommendations.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition ${i === current ? "bg-accent w-6" : "bg-text-muted"}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrent((prev) => (prev + 1) % recommendations.length)}
            className="p-2 hover:bg-surface rounded-lg transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
