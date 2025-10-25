"use client"

import { motion } from "framer-motion"
import { User, Wallet, Key } from "lucide-react"

export function AccountSection() {
  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass p-6 rounded-xl border border-border"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <User size={24} className="text-accent" />
          Profile Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Display Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-2 glass rounded-lg border border-border outline-none focus:border-border-glow transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-2 glass rounded-lg border border-border outline-none focus:border-border-glow transition"
            />
          </div>

          <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-secondary/30 transition">
            Save Changes
          </button>
        </div>
      </motion.div>

      {/* Connected Wallet */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass p-6 rounded-xl border border-border"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Wallet size={20} className="text-accent" />
          Connected Wallet
        </h3>

        <div className="p-4 bg-surface rounded-lg border border-border mb-4">
          <p className="text-sm text-text-secondary mb-1">Wallet Address</p>
          <p className="font-mono font-bold">0x742d...8f2a</p>
          <p className="text-sm text-text-muted mt-2">Connected 2 weeks ago</p>
        </div>

        <button className="w-full px-4 py-2 rounded-lg border border-danger text-danger hover:bg-danger/10 transition font-semibold">
          Disconnect Wallet
        </button>
      </motion.div>

      {/* API Access */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="glass p-6 rounded-xl border border-border"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Key size={20} className="text-accent" />
          API Keys
        </h3>

        <div className="space-y-3">
          {[
            { name: "Production API Key", created: "2 weeks ago", status: "active" },
            { name: "Development API Key", created: "1 month ago", status: "active" },
          ].map((key, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
              <div>
                <p className="font-semibold">{key.name}</p>
                <p className="text-sm text-text-secondary">Created {key.created}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm rounded-lg border border-border hover:border-border-glow transition">
                  Regenerate
                </button>
                <button className="px-3 py-1 text-sm rounded-lg border border-danger text-danger hover:bg-danger/10 transition">
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 px-4 py-2 rounded-lg border border-border hover:border-border-glow transition font-semibold">
          Create New API Key
        </button>
      </motion.div>
    </div>
  )
}
