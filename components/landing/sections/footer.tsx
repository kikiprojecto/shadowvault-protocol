"use client"
import { Github, Twitter, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8" style={{ borderTopColor: "var(--border)", borderTopWidth: "1px" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6b46c1] to-[#00d9ff] flex items-center justify-center">
                <span className="text-white font-bold text-sm">SV</span>
              </div>
              <span className="font-bold">ShadowVault</span>
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Private DeFi Intelligence
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li>
                <a href="#" className="transition hover:opacity-80">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:opacity-80">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:opacity-80">
                  Security
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li>
                <a href="#" className="transition hover:opacity-80">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:opacity-80">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:opacity-80">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="transition"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="transition"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="transition"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col sm:flex-row justify-between items-center text-sm"
          style={{ borderTopColor: "var(--border)", borderTopWidth: "1px", color: "var(--text-muted)" }}
        >
          <p>&copy; 2025 ShadowVault AI. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="transition hover:opacity-80">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:opacity-80">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
