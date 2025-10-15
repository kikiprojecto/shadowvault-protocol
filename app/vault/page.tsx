"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { WalletButton } from "../../components/WalletButton";
import {
  getProgram,
  getVaultData,
  getVaultMetadata,
  vaultExists,
} from "../../lib/anchor-client";
import { Connection } from "@solana/web3.js";
import { RPC_ENDPOINT } from "../../lib/constants";
import {
  Shield,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowRightLeft,
  Eye,
  Lock,
} from "lucide-react";

export default function VaultDashboard() {
  const { connected, publicKey, wallet } = useWallet();
  const [vaultData, setVaultData] = useState<any>(null);
  const [vaultMetadata, setVaultMetadata] = useState<any>(null);
  const [hasVault, setHasVault] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVault() {
      if (!connected || !publicKey || !wallet) {
        setLoading(false);
        return;
      }

      try {
        const connection = new Connection(RPC_ENDPOINT);
        const exists = await vaultExists(connection, publicKey);
        setHasVault(exists);

        if (exists) {
          const program = getProgram(wallet.adapter as any);
          const data = await getVaultData(program, publicKey);
          const metadata = await getVaultMetadata(program, publicKey);
          setVaultData(data);
          setVaultMetadata(metadata);
        }
      } catch (error) {
        console.error("Error loading vault:", error);
      } finally {
        setLoading(false);
      }
    }

    loadVault();
  }, [connected, publicKey, wallet]);

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-purple-500" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ShadowVault
                </span>
              </div>
              <WalletButton />
            </div>
          </div>
        </nav>

        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Lock className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Connect your wallet to access your encrypted vault
            </p>
            <WalletButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ShadowVault
              </span>
            </div>
            <WalletButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : !hasVault ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Vault Found</h2>
            <p className="text-gray-400 mb-6">
              Initialize your encrypted vault to get started
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200">
              Initialize Vault
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Vault Balance Card */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-300">
                  Encrypted Balance
                </h3>
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {vaultData?.encryptedBalance?.toString() || "0"}
              </div>
              <p className="text-sm text-gray-400">
                Balance is encrypted and private
              </p>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 hover:border-purple-500 rounded-xl p-6 transition-all duration-200 group">
                <ArrowDownCircle className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold mb-1">Deposit</h4>
                <p className="text-sm text-gray-400">
                  Add funds to your vault
                </p>
              </button>

              <button className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 hover:border-purple-500 rounded-xl p-6 transition-all duration-200 group">
                <ArrowUpCircle className="w-8 h-8 text-red-400 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold mb-1">Withdraw</h4>
                <p className="text-sm text-gray-400">
                  Remove funds from vault
                </p>
              </button>

              <button className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 hover:border-purple-500 rounded-xl p-6 transition-all duration-200 group">
                <ArrowRightLeft className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold mb-1">Transfer</h4>
                <p className="text-sm text-gray-400">
                  Send to another vault
                </p>
              </button>

              <button className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 hover:border-purple-500 rounded-xl p-6 transition-all duration-200 group">
                <Eye className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold mb-1">Check Balance</h4>
                <p className="text-sm text-gray-400">
                  Verify sufficient funds
                </p>
              </button>
            </div>

            {/* Vault Info */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Vault Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  <p className="font-semibold text-green-400">
                    {vaultData?.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Created</p>
                  <p className="font-semibold">
                    {vaultData?.createdAt
                      ? new Date(
                          vaultData.createdAt.toNumber() * 1000
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Transactions</p>
                  <p className="font-semibold">
                    {vaultData?.encryptedTxCount?.toString() || "0"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Owner</p>
                  <p className="font-mono text-sm">
                    {publicKey?.toBase58().slice(0, 8)}...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
