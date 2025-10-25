"use client"

import { CheckCircle, Lock, Shield } from "lucide-react"

export function MPCVerification() {
  return (
    <div className="glass p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-6">MPC Verification & Security</h2>

      <div className="space-y-4">
        {[
          {
            icon: CheckCircle,
            title: "Performance Verified",
            description: "Historical returns verified across 5 MPC nodes with cryptographic proofs",
            status: "verified",
          },
          {
            icon: Lock,
            title: "Zero-Knowledge Proof",
            description: "Strategy logic encrypted and verified without revealing implementation details",
            status: "verified",
          },
          {
            icon: Shield,
            title: "Byzantine Fault Tolerant",
            description: "Computation continues even if 2 of 5 nodes are compromised or offline",
            status: "verified",
          },
        ].map((item, i) => (
          <div key={i} className="flex gap-4 p-4 bg-surface rounded-lg border border-border">
            <item.icon size={24} className="text-accent flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-text-secondary">{item.description}</p>
            </div>
            <span className="text-accent font-bold text-sm whitespace-nowrap">VERIFIED</span>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-border-glow">
        <p className="text-sm text-text-secondary">
          All strategy computations are performed in encrypted environments and verified on-chain. No single entity can
          access or manipulate strategy logic.
        </p>
      </div>
    </div>
  )
}
