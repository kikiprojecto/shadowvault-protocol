"use client"

import { Star, Lock } from "lucide-react"

interface StrategyListItemProps {
  strategy: any
}

export function StrategyListItem({ strategy }: StrategyListItemProps) {
  return (
    <div className="glass p-6 rounded-xl border border-border hover:border-border-glow transition group cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold group-hover:text-accent transition">{strategy.name}</h3>
            {strategy.verified && <Lock size={16} className="text-accent" />}
          </div>
          <p className="text-sm text-text-secondary font-mono mb-3">{strategy.creator}</p>

          <div className="flex flex-wrap gap-2">
            {strategy.tags.map((tag: string) => (
              <span key={tag} className="px-2 py-1 bg-surface rounded-full text-xs text-text-secondary">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8 ml-8">
          <div className="text-center">
            <p className="text-xs text-text-muted mb-1">Return</p>
            <p className="text-2xl font-bold gradient-text">{strategy.return}%</p>
          </div>

          <div className="text-center">
            <p className="text-xs text-text-muted mb-1">Success</p>
            <p className="text-2xl font-bold text-accent">{strategy.successRate}%</p>
          </div>

          <div className="text-center">
            <p className="text-xs text-text-muted mb-1">Users</p>
            <p className="text-2xl font-bold">{(strategy.users / 1000).toFixed(1)}K</p>
          </div>

          <div className="text-center">
            <div className="flex items-center gap-1 mb-1">
              <Star size={14} className="fill-accent text-accent" />
              <span className="text-sm font-bold">{strategy.rating}</span>
            </div>
            <p className="text-xs text-text-muted">{strategy.reviews} reviews</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-text-muted mb-2">${strategy.price}/mo</p>
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-secondary/30 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
