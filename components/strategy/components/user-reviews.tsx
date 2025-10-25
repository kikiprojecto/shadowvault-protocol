"use client"

import { Star } from "lucide-react"

export function UserReviews() {
  const reviews = [
    {
      author: "0x742d...8f2a",
      rating: 5,
      verified: true,
      text: "Excellent strategy! Consistent returns and great risk management. Highly recommended.",
      date: "2 weeks ago",
    },
    {
      author: "0x1a2b...3c4d",
      rating: 4,
      verified: true,
      text: "Good performance overall. Would like to see more customization options.",
      date: "1 month ago",
    },
    {
      author: "0x5e6f...7g8h",
      rating: 5,
      verified: true,
      text: "Best strategy I've used. The AI recommendations are spot on.",
      date: "1 month ago",
    },
  ]

  return (
    <div className="glass p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-6">User Reviews</h2>

      <div className="space-y-4">
        {reviews.map((review, i) => (
          <div key={i} className="p-4 bg-surface rounded-lg border border-border">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-mono font-semibold">{review.author}</p>
                  {review.verified && (
                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Verified</span>
                  )}
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      size={14}
                      className={j < review.rating ? "fill-accent text-accent" : "text-text-muted"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-text-muted">{review.date}</p>
            </div>
            <p className="text-text-secondary">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
