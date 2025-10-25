"use client"

import { motion } from "framer-motion"
import { Lock, Eye, EyeOff, Copy, Check } from "lucide-react"
import { useState } from "react"

export function SecuritySection() {
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Encryption Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass p-6 rounded-xl border border-border"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Lock size={24} className="text-accent" />
          Encryption Status
        </h2>

        <div className="space-y-4">
          {[
            { label: "MPC Nodes Active", value: "5/5", status: "active" },
            { label: "Encryption Level", value: "AES-256", status: "active" },
            { label: "Session Status", value: "Encrypted", status: "active" },
            { label: "Last Sync", value: "2 seconds ago", status: "active" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
              <span className="text-text-secondary">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold">{item.value}</span>
                <div className="w-2 h-2 rounded-full bg-accent pulse-glow" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Session Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass p-6 rounded-xl border border-border"
      >
        <h3 className="text-xl font-bold mb-4">Session Management</h3>

        <div className="space-y-3">
          {[
            { device: "Chrome on MacOS", location: "San Francisco, CA", time: "Active now" },
            { device: "Safari on iPhone", location: "San Francisco, CA", time: "2 hours ago" },
            { device: "Firefox on Windows", location: "New York, NY", time: "1 day ago" },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
              <div>
                <p className="font-semibold">{session.device}</p>
                <p className="text-sm text-text-secondary">{session.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-muted">{session.time}</p>
                <button className="text-xs text-danger hover:underline mt-1">Revoke</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Private Key Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="glass p-6 rounded-xl border border-border-glow bg-danger/5"
      >
        <h3 className="text-xl font-bold mb-4">Private Key Management</h3>

        <div className="p-4 bg-surface rounded-lg border border-border mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-text-secondary">Ephemeral Session Key</p>
            <button onClick={() => setShowKey(!showKey)} className="p-1 hover:bg-primary/20 rounded-lg transition">
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="font-mono text-sm break-all">
            {showKey ? "0x742d35Cc6634C0532925a3b844Bc9e7595f8f2a" : "••••••••••••••••••••••••••••••••••••••••"}
          </div>
        </div>

        <button
          onClick={copyToClipboard}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-border-glow transition font-semibold"
        >
          {copied ? (
            <>
              <Check size={16} className="text-accent" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy Key
            </>
          )}
        </button>

        <p className="text-xs text-text-muted mt-4">
          This key is generated per session and never stored. It's used only for encrypting your data in MPC nodes.
        </p>
      </motion.div>

      {/* Two-Factor Authentication */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="glass p-6 rounded-xl border border-border"
      >
        <h3 className="text-xl font-bold mb-4">Two-Factor Authentication</h3>

        <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
          <div>
            <p className="font-semibold">Authenticator App</p>
            <p className="text-sm text-text-secondary">Add an extra layer of security</p>
          </div>
          <button className="px-4 py-2 rounded-lg border border-border hover:border-border-glow transition font-semibold">
            Enable
          </button>
        </div>
      </motion.div>
    </div>
  )
}
