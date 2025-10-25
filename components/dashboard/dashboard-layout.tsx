"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import { OverviewTab } from "./tabs/overview-tab"
import { PortfolioTab } from "./tabs/portfolio-tab"
import { StrategiesTab } from "./tabs/strategies-tab"
import { ExecuteTab } from "./tabs/execute-tab"

export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
        <TopBar />

        <main className="p-4 sm:p-6 lg:p-8">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "portfolio" && <PortfolioTab />}
          {activeTab === "strategies" && <StrategiesTab />}
          {activeTab === "execute" && <ExecuteTab />}
        </main>
      </div>

      {/* Mobile tab navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-border">
        <div className="flex justify-around">
          {[
            { id: "overview", label: "Overview" },
            { id: "portfolio", label: "Portfolio" },
            { id: "strategies", label: "Strategies" },
            { id: "execute", label: "Execute" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-semibold transition ${
                activeTab === tab.id ? "text-accent border-t-2 border-accent" : "text-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
