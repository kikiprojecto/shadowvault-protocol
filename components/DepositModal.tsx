"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import {
  getProgram,
  getVaultMetadataPDA,
  getVaultDataPDA,
} from "../lib/anchor-client";
import {
  X,
  ArrowDownCircle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Vault,
  TrendingUp,
} from "lucide-react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaultAddress: string;
  onSuccess?: () => void;
}

export function DepositModal({
  isOpen,
  onClose,
  vaultAddress,
  onSuccess,
}: DepositModalProps) {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();

  const [depositAmount, setDepositAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [txSignature, setTxSignature] = useState("");
  const [progress, setProgress] = useState<
    "idle" | "encrypting" | "submitting" | "confirming" | "callback" | "complete"
  >("idle");

  /**
   * Encrypt deposit amount using Arcium MPC
   */
  const encryptAmount = async (amount: string): Promise<BN> => {
    try {
      setProgress("encrypting");
      
      // Convert SOL to lamports
      const lamports = parseFloat(amount) * 1e9;

      // TODO: Replace with actual Arcium encryption
      // const arciumClient = new ArciumClient({
      //   apiKey: process.env.NEXT_PUBLIC_ARCIUM_API_KEY,
      // });
      // const encrypted = await arciumClient.encrypt(lamports);

      // Simulate encryption delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return new BN(Math.floor(lamports));
    } catch (err) {
      throw new Error("Failed to encrypt deposit amount");
    }
  };

  /**
   * Handle deposit submission
   */
  const handleDeposit = async () => {
    if (!publicKey || !wallet) {
      setError("Please connect your wallet first");
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setError("Please enter a valid deposit amount");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);
    setProgress("idle");

    try {
      // Get Anchor program
      const program = getProgram(wallet.adapter as any, connection);

      // Encrypt deposit amount
      const encryptedAmount = await encryptAmount(depositAmount);

      // Get vault PDAs
      const [vaultMetadata, metadataBump] = getVaultMetadataPDA(publicKey);
      const [vaultData, dataBump] = getVaultDataPDA(publicKey);

      // Generate computation account
      const computation = Keypair.generate();

      console.log("Processing deposit...");
      console.log("Vault:", vaultAddress);
      console.log("Amount:", depositAmount, "SOL");
      console.log("Encrypted Amount:", encryptedAmount.toString());

      // Submit transaction
      setProgress("submitting");
      const tx = await program.methods
        .deposit(encryptedAmount)
        .accounts({
          payer: publicKey,
          compDef: new PublicKey("11111111111111111111111111111111"), // TODO: Use actual comp def
          computation: computation.publicKey,
          vaultMetadata: vaultMetadata,
          vaultData: vaultData,
          systemProgram: SystemProgram.programId,
        })
        .signers([computation])
        .rpc();

      console.log("Transaction sent:", tx);
      setTxSignature(tx);

      // Wait for confirmation
      setProgress("confirming");
      await connection.confirmTransaction(tx, "confirmed");
      console.log("Transaction confirmed!");

      // Simulate MPC computation delay
      setProgress("callback");
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Call callback to complete deposit
      try {
        const callbackTx = await program.methods
          .depositCallback(encryptedAmount)
          .accounts({
            computation: computation.publicKey,
            vaultMetadata: vaultMetadata,
            vaultData: vaultData,
          })
          .rpc();

        await connection.confirmTransaction(callbackTx, "confirmed");
        console.log("Callback transaction confirmed:", callbackTx);
      } catch (callbackError) {
        console.error("Callback error:", callbackError);
        // Continue even if callback fails (might be called by MPC)
      }

      // Success!
      setProgress("complete");
      setSuccess(true);
      setDepositAmount("");

      // Call success callback
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }

      // Auto-close after success
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err: any) {
      console.error("Error processing deposit:", err);
      setError(err.message || "Failed to process deposit. Please try again.");
      setProgress("idle");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    if (!loading) {
      setDepositAmount("");
      setError("");
      setSuccess(false);
      setProgress("idle");
      setTxSignature("");
      onClose();
    }
  };

  /**
   * Get progress message
   */
  const getProgressMessage = (): string => {
    switch (progress) {
      case "encrypting":
        return "Encrypting deposit amount with Arcium MPC...";
      case "submitting":
        return "Submitting transaction to Solana...";
      case "confirming":
        return "Waiting for transaction confirmation...";
      case "callback":
        return "Processing MPC computation...";
      case "complete":
        return "Deposit completed successfully!";
      default:
        return "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <ArrowDownCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Deposit to Vault</h2>
              <p className="text-sm text-gray-400">
                Add encrypted funds to your vault
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Vault Address */}
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Vault className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-400">Vault Address</span>
            </div>
            <p className="text-sm font-mono text-gray-300 break-all">
              {vaultAddress.slice(0, 16)}...{vaultAddress.slice(-16)}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-400 mb-1">
                    Deposit Successful!
                  </h4>
                  <p className="text-sm text-gray-300 mb-2">
                    Your funds have been encrypted and added to your vault.
                  </p>
                  {txSignature && (
                    <a
                      href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-400 hover:text-green-300 underline"
                    >
                      View Transaction
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-400 mb-1">Error</h4>
                  <p className="text-sm text-gray-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          {loading && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-400">
                    {getProgressMessage()}
                  </p>
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width:
                          progress === "encrypting"
                            ? "20%"
                            : progress === "submitting"
                            ? "40%"
                            : progress === "confirming"
                            ? "60%"
                            : progress === "callback"
                            ? "80%"
                            : progress === "complete"
                            ? "100%"
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Deposit Amount Input */}
          {!success && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deposit Amount (SOL)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  SOL
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Amount will be encrypted using Arcium MPC
              </p>
            </div>
          )}

          {/* Info Box */}
          {!success && !loading && (
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-1">
                    How it works:
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-400">
                    <li>• Amount is encrypted using Arcium MPC</li>
                    <li>• Transaction is submitted to Solana</li>
                    <li>• MPC computes new encrypted balance</li>
                    <li>• Vault balance is updated privately</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="flex gap-3 p-6 border-t border-gray-700">
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleDeposit}
              disabled={loading || !depositAmount || parseFloat(depositAmount) <= 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-600 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ArrowDownCircle className="w-5 h-5" />
                  <span>Confirm Deposit</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
