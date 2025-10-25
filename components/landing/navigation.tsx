"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6b46c1] to-[#00d9ff] flex items-center justify-center">
              <span className="text-white font-bold text-sm">SV</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline" style={{ color: "var(--text-primary)" }}>
              ShadowVault
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="transition hover:opacity-80" style={{ color: "var(--text-secondary)" }}>
              Features
            </a>
            <a href="#technology" className="transition hover:opacity-80" style={{ color: "var(--text-secondary)" }}>
              Technology
            </a>
            <a href="#security" className="transition hover:opacity-80" style={{ color: "var(--text-secondary)" }}>
              Security
            </a>
            <a href="#roadmap" className="transition hover:opacity-80" style={{ color: "var(--text-secondary)" }}>
              Roadmap
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              className="px-6 py-2 rounded-full border transition"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
            >
              Documentation
            </button>
            <button
              className="px-6 py-2 rounded-full bg-gradient-to-r from-[#6b46c1] to-[#00d9ff] text-white font-semibold hover:shadow-lg transition"
              style={{ boxShadow: "0 0 20px rgba(0, 217, 255, 0.3)" }}
            >
              Launch App
            </button>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} style={{ color: "var(--text-primary)" }}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a
              href="#features"
              className="block px-4 py-2 transition hover:opacity-80"
              style={{ color: "var(--text-secondary)" }}
            >
              Features
            </a>
            <a
              href="#technology"
              className="block px-4 py-2 transition hover:opacity-80"
              style={{ color: "var(--text-secondary)" }}
            >
              Technology
            </a>
            <a
              href="#security"
              className="block px-4 py-2 transition hover:opacity-80"
              style={{ color: "var(--text-secondary)" }}
            >
              Security
            </a>
            <a
              href="#roadmap"
              className="block px-4 py-2 transition hover:opacity-80"
              style={{ color: "var(--text-secondary)" }}
            >
              Roadmap
            </a>
            <button className="w-full mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-[#6b46c1] to-[#00d9ff] text-white font-semibold">
              Launch App
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
