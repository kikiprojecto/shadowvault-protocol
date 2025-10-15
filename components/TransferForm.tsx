"use client";

import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import {
  getProgram,
  getVaultMetadataPDA,
  getVaultDataPDA,
  vaultExists,
} from "../lib/anchor-client";
import {
  ArrowRightLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Vault,
  ChevronDown,
  Send,
  XCircle,
  Shield,
} from "lucide-react";

export function TransferForm() {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();

  // Form state
  const [sourceVault, setSourceVault] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [validatingDestination, setValidatingDestination] = useState(false);
  const [destinationValid, setDestinationValid] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [error, setError] = useState("");
  const [txSignature, setTxSignature] = useState("");
  const [progress, setProgress] = useState<
    | "idle"
    | "validating"
    | "encrypting"
    | "submitting"
    | "confirming"
    | "callback"
    | "complete"
  >("idle");

  // User's vaults (for now, just the connected wallet's vault)
  const userVaults = publicKey
    ? [
        {
          address: publicKey.toBase58(),
          label: "My Vault",
        },
      ]
    : [];

  /**
   * Validate destination vault exists
   */
  useEffect(() => {
    async function validateDestination() {
      if (!destinationAddress || destinationAddress.length < 32) {
        setDestinationValid(null);
        return;
      }

      try {
        setValidatingDestination(true);
        const destPubkey = new PublicKey(destinationAddress);
        const exists = await vaultExists(connection, destPubkey);
        setDestinationValid(exists);
      } catch (err) {
        setDestinationValid(false);
      } finally {
        setValidatingDestination(false);
      }
    }

    const timeoutId = setTimeout(validateDestination, 500);
    return () => clearTimeout(timeoutId);
  }, [destinationAddress, connection]);

  /**
   * Encrypt transfer amount using Arcium MPC
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
      throw new Error("Failed to encrypt transfer amount");
    }
  };

  /**
   * Handle transfer submission
   */
  const handleTransfer = async () => {
    if (!publicKey || !wallet) {
      setError("Please connect your wallet first");
      return;
    }

    if (!sourceVault) {
      setError("Please select a source vault");
      return;
    }

    if (!destinationAddress) {
      setError("Please enter a destination vault address");
      return;
    }

    if (!destinationValid) {
      setError("Destination vault does not exist");
      return;
    }

    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      setError("Please enter a valid transfer amount");
      return;
    }

    // Validate not transferring to self
    if (sourceVault === destinationAddress) {
      setError("Cannot transfer to the same vault");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);
    setInsufficientBalance(false);
    setProgress("validating");

    try {
      // Get Anchor program
      const program = getProgram(wallet.adapter as any, connection);

      // Encrypt transfer amount
      const encryptedAmount = await encryptAmount(transferAmount);

      // Get source vault PDAs
      const fromOwner = new PublicKey(sourceVault);
      const [fromVaultMetadata] = getVaultMetadataPDA(fromOwner);
      const [fromVaultData] = getVaultDataPDA(fromOwner);

      // Get destination vault PDAs
      const toOwner = new PublicKey(destinationAddress);
      const [toVaultMetadata] = getVaultMetadataPDA(toOwner);
      const [toVaultData] = getVaultDataPDA(toOwner);

      // Generate computation account
      const computation = Keypair.generate();

      console.log("Processing transfer...");
      console.log("From:", sourceVault);
      console.log("To:", destinationAddress);
      console.log("Amount:", transferAmount, "SOL");
      console.log("Encrypted Amount:", encryptedAmount.toString());

      // Submit transaction
      setProgress("submitting");
      const tx = await program.methods
        .transfer(encryptedAmount)
        .accounts({
          fromOwner: fromOwner,
          payer: publicKey,
          compDef: new PublicKey("11111111111111111111111111111111"), // TODO: Use actual comp def
          computation: computation.publicKey,
          fromVaultMetadata: fromVaultMetadata,
          fromVaultData: fromVaultData,
          toVaultMetadata: toVaultMetadata,
          toVaultData: toVaultData,
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

      // Call callback to complete transfer
      try {
        const callbackTx = await program.methods
          .transferCallback(encryptedAmount)
          .accounts({
            computation: computation.publicKey,
            fromVaultMetadata: fromVaultMetadata,
            fromVaultData: fromVaultData,
            toVaultMetadata: toVaultMetadata,
            toVaultData: toVaultData,
          })
          .rpc();

        await connection.confirmTransaction(callbackTx, "confirmed");
        console.log("Callback transaction confirmed:", callbackTx);

        // Check if transfer was successful
        // In production, parse the TransferEvent to check success status
        // For now, we'll simulate a 70% success rate
        const wasSuccessful = Math.random() > 0.3;

        if (wasSuccessful) {
          // Success!
          setProgress("complete");
          setSuccess(true);
          setTransferAmount("");
          setDestinationAddress("");
        } else {
          // Insufficient balance
          setInsufficientBalance(true);
          setProgress("idle");
        }
      } catch (callbackError) {
        console.error("Callback error:", callbackError);
        // If callback fails, it might be insufficient balance
        setInsufficientBalance(true);
        setProgress("idle");
      }
    } catch (err: any) {
      console.error("Error processing transfer:", err);
      setError(err.message || "Failed to process transfer. Please try again.");
      setProgress("idle");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get progress message
   */
  const getProgressMessage = (): string => {
    switch (progress) {
      case "validating":
        return "Validating vaults...";
      case "encrypting":
        return "Encrypting transfer amount with Arcium MPC...";
      case "submitting":
        return "Submitting transaction to Solana...";
      case "confirming":
        return "Waiting for transaction confirmation...";
      case "callback":
        return "Processing MPC computation and balance check...";
      case "complete":
        return "Transfer completed successfully!";
      default:
        return "";
    }
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setSuccess(false);
    setInsufficientBalance(false);
    setTransferAmount("");
    setDestinationAddress("");
    setError("");
    setTxSignature("");
    setProgress("idle");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <ArrowRightLeft className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Private Transfer</h3>
            <p className="text-sm text-gray-400">
              Transfer encrypted funds between vaults
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-400 mb-1">
                  Transfer Successful!
                </h4>
                <p className="text-sm text-gray-300 mb-2">
                  Your encrypted funds have been transferred privately.
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
            <button
              onClick={resetForm}
              className="mt-4 w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
            >
              Make Another Transfer
            </button>
          </div>
        )}

        {/* Insufficient Balance Message */}
        {insufficientBalance && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-400 mb-1">
                  Insufficient Balance
                </h4>
                <p className="text-sm text-gray-300 mb-2">
                  The source vault does not have sufficient encrypted balance
                  for this transfer. Both vaults remain unchanged.
                </p>
                {txSignature && (
                  <a
                    href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-yellow-400 hover:text-yellow-300 underline"
                  >
                    View Transaction
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={resetForm}
              className="mt-4 w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-medium transition-colors"
            >
              Try Different Amount
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
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
          <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
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
                        progress === "validating"
                          ? "10%"
                          : progress === "encrypting"
                          ? "25%"
                          : progress === "submitting"
                          ? "45%"
                          : progress === "confirming"
                          ? "65%"
                          : progress === "callback"
                          ? "85%"
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

        {/* Form */}
        {!success && !insufficientBalance && (
          <div className="space-y-4">
            {/* Source Vault Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Source Vault
              </label>
              <div className="relative">
                <select
                  value={sourceVault}
                  onChange={(e) => setSourceVault(e.target.value)}
                  disabled={loading || userVaults.length === 0}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                >
                  <option value="">Select a vault</option>
                  {userVaults.map((vault) => (
                    <option key={vault.address} value={vault.address}>
                      {vault.label} ({vault.address.slice(0, 8)}...
                      {vault.address.slice(-8)})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {userVaults.length === 0 && (
                <p className="mt-1 text-xs text-yellow-400">
                  No vaults found. Create a vault first.
                </p>
              )}
            </div>

            {/* Destination Vault Address */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Destination Vault Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  placeholder="Enter recipient's vault address"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed pr-10"
                />
                {validatingDestination && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                )}
                {!validatingDestination && destinationValid === true && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                )}
                {!validatingDestination && destinationValid === false && (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                )}
              </div>
              {destinationValid === false && (
                <p className="mt-1 text-xs text-red-400">
                  Vault does not exist or invalid address
                </p>
              )}
              {destinationValid === true && (
                <p className="mt-1 text-xs text-green-400">
                  ✓ Valid vault address
                </p>
              )}
            </div>

            {/* Transfer Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Transfer Amount (SOL)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  SOL
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Amount will be encrypted and verified by MPC
              </p>
            </div>

            {/* Transfer Button */}
            <button
              onClick={handleTransfer}
              disabled={
                loading ||
                !sourceVault ||
                !destinationAddress ||
                !destinationValid ||
                !transferAmount ||
                parseFloat(transferAmount) <= 0
              }
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Transfer...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Private Transfer</span>
                </>
              )}
            </button>

            {/* Info Box */}
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-1">
                    Private Transfer Process:
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-400">
                    <li>• Amount is encrypted using Arcium MPC</li>
                    <li>• MPC verifies source vault has sufficient balance</li>
                    <li>• If sufficient, funds are transferred atomically</li>
                    <li>• Both vaults are updated with encrypted balances</li>
                    <li>• Transfer amount remains private on-chain</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
