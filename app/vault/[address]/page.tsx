"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  getProgram,
  getVaultData,
  getVaultMetadata,
  VaultData,
  VaultMetadata,
} from "../../../lib/anchor-client";
import { DepositModal } from "../../../components/DepositModal";
import { WithdrawModal } from "../../../components/WithdrawModal";
import {
  ArrowLeft,
  Copy,
  Check,
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  Eye,
  Shield,
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

interface TransactionEvent {
  type: "deposit" | "withdraw" | "transfer_in" | "transfer_out" | "initialized";
  timestamp: number;
  amount?: string;
  success?: boolean;
  txSignature?: string;
  from?: string;
  to?: string;
}

export default function VaultDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();

  const vaultAddress = params.address as string;

  // Vault data
  const [vaultData, setVaultData] = useState<VaultData | null>(null);
  const [vaultMetadata, setVaultMetadata] = useState<VaultMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Transaction history
  const [transactions, setTransactions] = useState<TransactionEvent[]>([]);

  // Modals
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  // UI state
  const [copiedAddress, setCopiedAddress] = useState(false);

  /**
   * Fetch vault data
   */
  const fetchVaultData = async () => {
    if (!wallet) {
      setLoading(false);
      return;
    }

    try {
      setRefreshing(true);
      const program = getProgram(wallet.adapter as any, connection);
      const ownerPubkey = new PublicKey(vaultAddress);

      const [metadata, data] = await Promise.all([
        getVaultMetadata(program, ownerPubkey),
        getVaultData(program, ownerPubkey),
      ]);

      setVaultMetadata(metadata);
      setVaultData(data);

      // Fetch transaction history (simulated for now)
      // In production, fetch from program events
      if (data) {
        const mockTransactions: TransactionEvent[] = [
          {
            type: "initialized",
            timestamp: data.createdAt.toNumber(),
            amount: "1000000000", // 1 SOL encrypted
          },
          {
            type: "deposit",
            timestamp: data.createdAt.toNumber() + 3600,
            amount: "500000000", // 0.5 SOL encrypted
            success: true,
            txSignature: "5x7K...",
          },
          {
            type: "withdraw",
            timestamp: data.createdAt.toNumber() + 7200,
            amount: "250000000", // 0.25 SOL encrypted
            success: true,
            txSignature: "8m9N...",
          },
          {
            type: "transfer_out",
            timestamp: data.createdAt.toNumber() + 10800,
            amount: "100000000", // 0.1 SOL encrypted
            success: true,
            to: "Br2A...Rj97",
            txSignature: "3p4Q...",
          },
        ];
        setTransactions(mockTransactions);
      }

      setError("");
    } catch (err: any) {
      console.error("Error fetching vault data:", err);
      setError("Failed to load vault data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVaultData();
  }, [vaultAddress, wallet, connection]);

  /**
   * Copy address to clipboard
   */
  const copyAddress = async () => {
    await navigator.clipboard.writeText(vaultAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  /**
   * Format date
   */
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Format relative time
   */
  const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  /**
   * Get transaction icon
   */
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownCircle className="w-5 h-5 text-green-400" />;
      case "withdraw":
        return <ArrowUpCircle className="w-5 h-5 text-red-400" />;
      case "transfer_in":
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case "transfer_out":
        return <TrendingDown className="w-5 h-5 text-orange-400" />;
      case "initialized":
        return <Shield className="w-5 h-5 text-purple-400" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  /**
   * Get transaction label
   */
  const getTransactionLabel = (tx: TransactionEvent): string => {
    switch (tx.type) {
      case "deposit":
        return "Deposit";
      case "withdraw":
        return "Withdraw";
      case "transfer_in":
        return `Transfer from ${tx.from?.slice(0, 8)}...`;
      case "transfer_out":
        return `Transfer to ${tx.to?.slice(0, 8)}...`;
      case "initialized":
        return "Vault Initialized";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading vault details...</p>
        </div>
      </div>
    );
  }

  if (error || !vaultData || !vaultMetadata) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Vault Not Found</h2>
          <p className="text-gray-400 mb-6">
            {error || "This vault does not exist or could not be loaded."}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-purple-400" />
              <h1 className="text-xl font-bold">Vault Details</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Vault Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vault Address Card */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Vault Address</h2>
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                    vaultData.isActive
                      ? "bg-green-500/10 border border-green-500/30"
                      : "bg-red-500/10 border border-red-500/30"
                  }`}
                >
                  {vaultData.isActive ? (
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

              <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-mono text-gray-300 break-all flex-1">
                    {vaultAddress}
                  </p>
                  <button
                    onClick={copyAddress}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
                  >
                    {copiedAddress ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400">Created</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-200">
                    {formatDate(vaultData.createdAt.toNumber())}
                  </p>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400">Transactions</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-200">
                    {vaultData.encryptedTxCount.toString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Encrypted Balance Card */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-medium text-gray-400">
                      Encrypted Balance
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-purple-400 mb-2">
                    {vaultData.encryptedBalance.toString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Balance is encrypted and remains private on-chain
                  </p>
                </div>
                <div className="p-4 bg-purple-500/20 rounded-xl">
                  <Shield className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Transaction History</h2>
                <button
                  onClick={fetchVaultData}
                  disabled={refreshing}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-5 h-5 text-gray-400 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx, index) => (
                    <div
                      key={index}
                      className="bg-gray-900/50 rounded-lg p-4 hover:bg-gray-900/70 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-800 rounded-lg">
                          {getTransactionIcon(tx.type)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-gray-200">
                              {getTransactionLabel(tx)}
                            </p>
                            <span className="text-xs text-gray-500">
                              {formatRelativeTime(tx.timestamp)}
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            {tx.amount && (
                              <p className="text-sm text-gray-400">
                                Amount: {tx.amount} (encrypted)
                              </p>
                            )}
                            {tx.success !== undefined && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${
                                  tx.success
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {tx.success ? "Success" : "Failed"}
                              </span>
                            )}
                          </div>
                        </div>

                        {tx.txSignature && (
                          <a
                            href={`https://explorer.solana.com/tx/${tx.txSignature}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

              <div className="space-y-3">
                <button
                  onClick={() => setIsDepositOpen(true)}
                  disabled={!vaultData.isActive}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-600 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <ArrowDownCircle className="w-5 h-5" />
                  <span>Deposit</span>
                </button>

                <button
                  onClick={() => setIsWithdrawOpen(true)}
                  disabled={!vaultData.isActive}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-600 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <ArrowUpCircle className="w-5 h-5" />
                  <span>Withdraw</span>
                </button>

                <button
                  onClick={() => router.push("/dashboard?tab=transfer")}
                  disabled={!vaultData.isActive}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>Transfer</span>
                </button>
              </div>

              {!vaultData.isActive && (
                <p className="mt-4 text-xs text-yellow-400 text-center">
                  Vault is inactive. Actions are disabled.
                </p>
              )}

              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">
                  Vault Stats
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Deposits:</span>
                    <span className="font-mono text-gray-300">
                      {vaultData.encryptedTotalDeposits.toString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Withdrawals:</span>
                    <span className="font-mono text-gray-300">
                      {vaultData.encryptedTotalWithdrawals.toString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        vaultAddress={vaultAddress}
        onSuccess={fetchVaultData}
      />

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        vaultAddress={vaultAddress}
        onSuccess={fetchVaultData}
      />
    </div>
  );
}
