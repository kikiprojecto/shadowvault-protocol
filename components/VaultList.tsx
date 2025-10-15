"use client";

import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  getProgram,
  getVaultData,
  getVaultMetadata,
  VaultData,
  VaultMetadata,
} from "../lib/anchor-client";
import {
  Vault,
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  Eye,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

interface VaultInfo {
  address: string;
  metadata: VaultMetadata | null;
  data: VaultData | null;
}

export function VaultList() {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();

  const [vaults, setVaults] = useState<VaultInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedAddress, setCopiedAddress] = useState("");

  /**
   * Fetch vaults owned by connected wallet
   */
  useEffect(() => {
    async function fetchVaults() {
      if (!publicKey || !wallet) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const program = getProgram(wallet.adapter as any, connection);

        // Get vault data for the connected wallet
        const metadata = await getVaultMetadata(program, publicKey);
        const data = await getVaultData(program, publicKey);

        if (metadata && data) {
          setVaults([
            {
              address: publicKey.toBase58(),
              metadata,
              data,
            },
          ]);
        } else {
          setVaults([]);
        }
      } catch (err: any) {
        console.error("Error fetching vaults:", err);
        setError("Failed to load vaults. Please try again.");
        setVaults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchVaults();
  }, [publicKey, wallet, connection]);

  /**
   * Copy vault address to clipboard
   */
  const copyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(""), 2000);
  };

  /**
   * Format date from timestamp
   */
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /**
   * Shorten address for display
   */
  const shortenAddress = (address: string): string => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-6 bg-gray-700 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-32"></div>
              </div>
              <div className="h-6 w-20 bg-gray-700 rounded"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="h-16 bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-700 rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 bg-gray-700 rounded flex-1"></div>
              <div className="h-10 bg-gray-700 rounded flex-1"></div>
              <div className="h-10 bg-gray-700 rounded flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-400 mb-2">
          Error Loading Vaults
        </h3>
        <p className="text-gray-300 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (vaults.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-12 text-center">
        <Vault className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          No Vaults Found
        </h3>
        <p className="text-gray-500 mb-6">
          You haven't created any encrypted vaults yet.
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all duration-200">
          Create Your First Vault
        </button>
      </div>
    );
  }

  // Vault list
  return (
    <div className="space-y-4">
      {vaults.map((vault, index) => (
        <div
          key={vault.address}
          className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-200"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {/* Vault Address */}
              <div className="flex items-center gap-2 mb-2">
                <Vault className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-200">
                  Vault #{index + 1}
                </h3>
              </div>

              {/* Address with Copy */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-gray-400">
                  {shortenAddress(vault.address)}
                </span>
                <button
                  onClick={() => copyAddress(vault.address)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Copy address"
                >
                  {copiedAddress === vault.address ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                vault.data?.isActive
                  ? "bg-green-500/10 border border-green-500/30"
                  : "bg-red-500/10 border border-red-500/30"
              }`}
            >
              {vault.data?.isActive ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">
                    Active
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-red-400">
                    Inactive
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Vault Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Created Date */}
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">Created</span>
              </div>
              <p className="text-sm font-semibold text-gray-200">
                {vault.data?.createdAt
                  ? formatDate(vault.data.createdAt.toNumber())
                  : "Unknown"}
              </p>
            </div>

            {/* Transaction Count */}
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Vault className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">Transactions</span>
              </div>
              <p className="text-sm font-semibold text-gray-200">
                {vault.data?.encryptedTxCount?.toString() || "0"}
              </p>
            </div>
          </div>

          {/* Encrypted Balance Display */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Encrypted Balance</p>
                <p className="text-lg font-bold text-purple-400">
                  {vault.data?.encryptedBalance?.toString() || "0"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Balance is encrypted and private
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Eye className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 hover:border-green-600/50 rounded-lg font-medium text-green-400 transition-all duration-200"
              disabled
            >
              <ArrowDownCircle className="w-4 h-4" />
              <span className="text-sm">Deposit</span>
            </button>

            <button
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 hover:border-red-600/50 rounded-lg font-medium text-red-400 transition-all duration-200"
              disabled
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span className="text-sm">Withdraw</span>
            </button>

            <button
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/30 hover:border-purple-600/50 rounded-lg font-medium text-purple-400 transition-all duration-200"
              disabled
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">Details</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
