"use client"

import { Wallet, Lock, Bell, User } from "lucide-react"

export function TopBar() {
  return (
    <div className="glass border-b border-border sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="glass p-3 rounded-lg">
            <Wallet size={20} className="text-accent" />
          </div>
          <div>
            <p className="text-sm text-text-muted">Connected Wallet</p>
            <p className="font-mono font-semibold">0x742d...8f2a</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 glass px-4 py-2 rounded-lg">
            <Lock size={16} className="text-accent" />
            <span className="text-sm font-semibold">ENCRYPTED SESSION</span>
          </div>

          <button className="p-2 hover:bg-surface rounded-lg transition relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </button>

          <button className="p-2 hover:bg-surface rounded-lg transition">
            <User size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
