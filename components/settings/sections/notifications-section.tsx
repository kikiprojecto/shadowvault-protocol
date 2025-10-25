"use client"

import { motion } from "framer-motion"
import { Bell } from "lucide-react"
import { useState } from "react"

export function NotificationsSection() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    strategies: true,
    alerts: true,
    updates: false,
  })

  const toggleNotification = (key: string) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass p-6 rounded-xl border border-border"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Bell size={24} className="text-accent" />
          Notification Channels
        </h2>

        <div className="space-y-3">
          {[
            { key: "email", label: "Email Notifications", description: "Receive updates via email" },
            { key: "push", label: "Push Notifications", description: "Browser push notifications" },
            { key: "sms", label: "SMS Alerts", description: "Critical alerts via SMS" },
          ].map((channel) => (
            <div
              key={channel.key}
              className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border"
            >
              <div>
                <p className="font-semibold">{channel.label}</p>
                <p className="text-sm text-text-secondary">{channel.description}</p>
              </div>
              <button
                onClick={() => toggleNotification(channel.key)}
                className={`relative w-12 h-6 rounded-full transition ${
                  notifications[channel.key as keyof typeof notifications]
                    ? "bg-accent"
                    : "bg-surface border border-border"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications[channel.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass p-6 rounded-xl border border-border"
      >
        <h3 className="text-xl font-bold mb-4">Notification Preferences</h3>

        <div className="space-y-3">
          {[
            { key: "strategies", label: "Strategy Updates", description: "New strategy recommendations" },
            { key: "alerts", label: "Price Alerts", description: "When assets reach target prices" },
            { key: "updates", label: "Product Updates", description: "New features and improvements" },
          ].map((pref) => (
            <div
              key={pref.key}
              className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border"
            >
              <div>
                <p className="font-semibold">{pref.label}</p>
                <p className="text-sm text-text-secondary">{pref.description}</p>
              </div>
              <button
                onClick={() => toggleNotification(pref.key)}
                className={`relative w-12 h-6 rounded-full transition ${
                  notifications[pref.key as keyof typeof notifications]
                    ? "bg-accent"
                    : "bg-surface border border-border"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications[pref.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quiet Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="glass p-6 rounded-xl border border-border"
      >
        <h3 className="text-xl font-bold mb-4">Quiet Hours</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Start Time</label>
            <input type="time" className="w-full px-4 py-2 glass rounded-lg border border-border outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">End Time</label>
            <input type="time" className="w-full px-4 py-2 glass rounded-lg border border-border outline-none" />
          </div>

          <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-secondary/30 transition">
            Save Quiet Hours
          </button>
        </div>
      </motion.div>
    </div>
  )
}
