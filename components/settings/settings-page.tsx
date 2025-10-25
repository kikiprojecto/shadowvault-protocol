"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, User, Bell, Palette, LogOut } from "lucide-react"
import { SecuritySection } from "./sections/security-section"
import { AccountSection } from "./sections/account-section"
import { NotificationsSection } from "./sections/notifications-section"
import { AppearanceSection } from "./sections/appearance-section"

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState("security")

  const sections = [
    { id: "security", label: "Security & Privacy", icon: Lock },
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
  ]

  const renderSection = () => {
    switch (activeSection) {
      case "security":
        return <SecuritySection />
      case "account":
        return <AccountSection />
      case "notifications":
        return <NotificationsSection />
      case "appearance":
        return <AppearanceSection />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <div className="glass border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-text-secondary mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="glass p-4 rounded-xl border border-border sticky top-24 space-y-2">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeSection === section.id
                        ? "bg-primary/20 border border-border-glow text-accent"
                        : "hover:bg-surface text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-semibold">{section.label}</span>
                  </button>
                )
              })}

              <div className="border-t border-border pt-4 mt-4">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-danger hover:bg-danger/10 transition font-semibold">
                  <LogOut size={20} />
                  Disconnect Wallet
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-3"
          >
            {renderSection()}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
