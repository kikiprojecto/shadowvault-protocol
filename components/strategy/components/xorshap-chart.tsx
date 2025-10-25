"use client"

export function XorSHAPChart() {
  const features = [
    { name: "APY Opportunity", importance: 65 },
    { name: "Risk Profile Match", importance: 20 },
    { name: "Market Conditions", importance: 10 },
    { name: "Historical Performance", importance: 5 },
  ]

  return (
    <div className="glass p-6 rounded-xl">
      <div>
        <h2 className="text-2xl font-bold mb-2">XorSHAP Explainability</h2>
        <p className="text-text-secondary mb-6">Why this strategy was recommended for your portfolio</p>
      </div>

      <div className="space-y-4">
        {features.map((feature, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{feature.name}</span>
              <span className="text-accent font-bold">{feature.importance}%</span>
            </div>
            <div className="w-full h-3 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${feature.importance}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
        <p className="text-sm text-text-secondary">
          This strategy aligns with your risk tolerance and market outlook. The AI model identified strong APY
          opportunities in current market conditions while maintaining your preferred risk profile.
        </p>
      </div>
    </div>
  )
}
