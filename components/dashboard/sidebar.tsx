"use client"

import { LayoutDashboard, Vault, Brain, Zap, ShoppingBag, Settings, LogOut, ChevronLeft } from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const [sessionTime] = useState("23:45:12")

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", id: "overview" },
    { icon: Vault, label: "Portfolio", id: "portfolio" },
    { icon: Brain, label: "AI Strategies", id: "strategies" },
    { icon: Zap, label: "Execute", id: "execute" },
    { icon: ShoppingBag, label: "Marketplace", id: "marketplace" },
    { icon: Settings, label: "Settings", id: "settings" },
  ]

  return (
    <aside
      className={`fixed left-0 top-0 h-screen glass border-r border-border transition-all duration-300 z-40 ${
        open ? "w-64" : "w-20"
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className={`flex items-center gap-2 ${!open && "hidden"}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-sm">SV</span>
          </div>
          <span className="font-bold">ShadowVault</span>
        </div>
        <button onClick={onToggle} className="p-1 hover:bg-surface rounded-lg transition hidden md:block">
          <ChevronLeft size={20} className={`transition-transform ${!open && "rotate-180"}`} />
        </button>
      </div>

      <nav className="px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition group"
          >
            <item.icon size={20} className="text-accent group-hover:text-secondary transition" />
            <span className={`font-semibold transition ${!open && "hidden"}`}>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-border ${!open && "hidden"}`}>
        <div className="glass p-4 rounded-lg mb-4">
          <p className="text-xs text-text-muted mb-2">MPC NODES ACTIVE</p>
          <p className="text-lg font-bold text-accent mb-3">5/5</p>
          <p className="text-xs text-text-muted mb-2">ENCRYPTION LEVEL</p>
          <p className="text-sm font-semibold mb-3">AES-256</p>
          <p className="text-xs text-text-muted mb-1">SESSION VALID FOR</p>
          <p className="text-sm font-mono text-accent">{sessionTime}</p>
        </div>
        <button className="w-full px-4 py-2 rounded-lg border border-danger text-danger hover:bg-danger/10 transition font-semibold flex items-center justify-center gap-2">
          <LogOut size={16} />
          Disconnect
        </button>
      </div>
    </aside>
  )
}
