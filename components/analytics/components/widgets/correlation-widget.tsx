"use client"

export function CorrelationWidget() {
  const assets = ["SOL", "USDC", "JUP", "ORCA"]
  const correlations = [
    [1.0, 0.2, 0.65, 0.45],
    [0.2, 1.0, 0.15, 0.25],
    [0.65, 0.15, 1.0, 0.55],
    [0.45, 0.25, 0.55, 1.0],
  ]

  const getColor = (value: number) => {
    if (value > 0.7) return "bg-accent"
    if (value > 0.4) return "bg-warning"
    return "bg-primary"
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="flex gap-1">
          <div className="w-12" />
          {assets.map((asset) => (
            <div key={asset} className="w-12 text-center text-xs font-bold">
              {asset}
            </div>
          ))}
        </div>

        {correlations.map((row, i) => (
          <div key={i} className="flex gap-1">
            <div className="w-12 text-xs font-bold flex items-center">{assets[i]}</div>
            {row.map((value, j) => (
              <div
                key={j}
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold text-white ${getColor(value)}`}
              >
                {value.toFixed(2)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
