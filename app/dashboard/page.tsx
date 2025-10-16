"use client";

import { useState } from "react";
import { WalletButton } from "../../components/WalletButton";
import {
  Shield,
  Vault,
  Plus,
  ArrowRightLeft,
  Github,
  BookOpen,
  Network,
} from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"vaults" | "create" | "transfer">(
    "vaults"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ShadowVault
                </h1>
                <p className="text-xs text-gray-400">
                  Privacy-First Vault System
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Network Indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <Network className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-400">
                  Devnet
                </span>
              </div>

              {/* Wallet Button */}
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-800">
            <nav className="-mb-px flex space-x-8">
              {/* My Vaults Tab */}
              <button
                onClick={() => setActiveTab("vaults")}
                className={`group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "vaults"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
                }`}
              >
                <Vault
                  className={`w-5 h-5 ${
                    activeTab === "vaults"
                      ? "text-purple-400"
                      : "text-gray-400 group-hover:text-gray-300"
                  }`}
                />
                My Vaults
              </button>

              {/* Create Vault Tab */}
              <button
                onClick={() => setActiveTab("create")}
                className={`group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "create"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
                }`}
              >
                <Plus
                  className={`w-5 h-5 ${
                    activeTab === "create"
                      ? "text-purple-400"
                      : "text-gray-400 group-hover:text-gray-300"
                  }`}
                />
                Create Vault
              </button>

              {/* Transfer Tab */}
              <button
                onClick={() => setActiveTab("transfer")}
                className={`group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "transfer"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
                }`}
              >
                <ArrowRightLeft
                  className={`w-5 h-5 ${
                    activeTab === "transfer"
                      ? "text-purple-400"
                      : "text-gray-400 group-hover:text-gray-300"
                  }`}
                />
                Transfer
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === "vaults" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Vaults</h2>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
                  Refresh
                </button>
              </div>

              {/* Vaults will be listed here */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-12 text-center">
                <Vault className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No Vaults Found
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first encrypted vault to get started
                </p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all duration-200"
                >
                  Create Your First Vault
                </button>
              </div>
            </div>
          )}

          {activeTab === "create" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Create New Vault</h2>

              {/* Create form will go here */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8">
                <div className="max-w-md mx-auto text-center">
                  <div className="p-4 bg-purple-500/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Plus className="w-10 h-10 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Initialize Encrypted Vault
                  </h3>
                  <p className="text-gray-400 mb-8">
                    Create a new vault with encrypted balance using Arcium MPC
                  </p>
                  {/* CreateVaultForm component will go here */}
                  <div className="text-sm text-gray-500">
                    Form component coming soon...
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "transfer" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Transfer Between Vaults</h2>

              {/* Transfer form will go here */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8">
                <div className="max-w-md mx-auto text-center">
                  <div className="p-4 bg-blue-500/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <ArrowRightLeft className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Encrypted Transfer
                  </h3>
                  <p className="text-gray-400 mb-8">
                    Transfer funds between vaults with complete privacy
                  </p>
                  {/* TransferForm component will go here */}
                  <div className="text-sm text-gray-500">
                    Form component coming soon...
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left Side - Links */}
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/kikiprojecto/shadowvault-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="text-sm font-medium">GitHub</span>
              </a>

              <a
                href="/docs"
                className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-medium">Documentation</span>
              </a>
            </div>

            {/* Right Side - Built with Arcium */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Built with</span>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Arcium MPC
                </span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              © 2025 ShadowVault Protocol. All rights reserved. Privacy-first
              vault system on Solana.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
