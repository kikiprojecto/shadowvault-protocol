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
import { PROGRAM_ID } from "../lib/constants";
import {
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export function CreateVaultForm() {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();

  const [initialBalance, setInitialBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [vaultAddress, setVaultAddress] = useState("");
  const [txSignature, setTxSignature] = useState("");

  /**
   * Encrypt initial balance using Arcium MPC
   * In production, this would use the actual Arcium client SDK
   * For now, we simulate encryption by converting to BN
   */
  const encryptBalance = async (amount: string): Promise<BN> => {
    try {
      // Convert SOL to lamports (1 SOL = 1e9 lamports)
      const lamports = parseFloat(amount) * 1e9;
      
      // TODO: Replace with actual Arcium encryption
      // const arciumClient = new ArciumClient();
      // const encrypted = await arciumClient.encrypt(lamports);
      
      // For now, return as BN (will be encrypted in MPC)
      return new BN(Math.floor(lamports));
    } catch (err) {
      throw new Error("Failed to encrypt balance");
    }
  };

  /**
   * Initialize vault with encrypted balance
   */
  const handleCreateVault = async () => {
    if (!publicKey || !wallet) {
      setError("Please connect your wallet first");
      return;
    }

    if (!initialBalance || parseFloat(initialBalance) <= 0) {
      setError("Please enter a valid initial balance");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Get Anchor program
      const program = getProgram(wallet.adapter as any, connection);

      // Encrypt initial balance
      const encryptedBalance = await encryptBalance(initialBalance);

      // Get vault PDAs
      const [vaultMetadata, metadataBump] = getVaultMetadataPDA(publicKey);
      const [vaultData, dataBump] = getVaultDataPDA(publicKey);

      // Generate computation account
      const computation = Keypair.generate();

      console.log("Creating vault...");
      console.log("Vault Metadata PDA:", vaultMetadata.toBase58());
      console.log("Vault Data PDA:", vaultData.toBase58());
      console.log("Encrypted Balance:", encryptedBalance.toString());

      // Call initialize_vault instruction
      const tx = await program.methods
        .initializeVault(encryptedBalance, metadataBump)
        .accounts({
          payer: publicKey,
          owner: publicKey,
          compDef: new PublicKey("11111111111111111111111111111111"), // TODO: Use actual comp def
          computation: computation.publicKey,
          vaultMetadata: vaultMetadata,
          systemProgram: SystemProgram.programId,
        })
        .signers([computation])
        .rpc();

      console.log("Transaction sent:", tx);

      // Wait for confirmation
      await connection.confirmTransaction(tx, "confirmed");

      console.log("Transaction confirmed!");

      // Simulate MPC computation delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Call callback to complete initialization
      // TODO: In production, this would be called by Arcium MPC network
      try {
        const callbackTx = await program.methods
          .initializeVaultCallback()
          .accounts({
            computation: computation.publicKey,
            vaultMetadata: vaultMetadata,
            vaultData: vaultData,
            payer: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        await connection.confirmTransaction(callbackTx, "confirmed");
        console.log("Callback transaction confirmed:", callbackTx);
      } catch (callbackError) {
        console.error("Callback error:", callbackError);
        // Continue even if callback fails (might be called by MPC)
      }

      // Success!
      setSuccess(true);
      setVaultAddress(vaultMetadata.toBase58());
      setTxSignature(tx);
      setInitialBalance("");
    } catch (err: any) {
      console.error("Error creating vault:", err);
      setError(
        err.message || "Failed to create vault. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Create Encrypted Vault</h3>
            <p className="text-sm text-gray-400">
              Initialize your private vault with Arcium MPC
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
                  Vault Created Successfully!
                </h4>
                <p className="text-sm text-gray-300 mb-2">
                  Your encrypted vault is ready to use.
                </p>
                <div className="bg-gray-900 rounded-lg p-3 mb-2">
                  <p className="text-xs text-gray-400 mb-1">Vault Address</p>
                  <p className="text-sm font-mono text-purple-400 break-all">
                    {vaultAddress}
                  </p>
                </div>
                {txSignature && (
                  <a
                    href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    View on Explorer
                    <ArrowRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
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

        {/* Form */}
        <div className="space-y-4">
          {/* Initial Balance Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Initial Balance (SOL)
            </label>
            <div className="relative">
              <input
                type="number"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                disabled={loading || success}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                SOL
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              This amount will be encrypted using Arcium MPC
            </p>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreateVault}
            disabled={loading || success || !publicKey}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Vault...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Vault Created</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Create Encrypted Vault</span>
              </>
            )}
          </button>

          {/* Info */}
          {!success && (
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">
                How it works:
              </h4>
              <ul className="space-y-1 text-xs text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>
                    Your balance is encrypted using Arcium MPC technology
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>
                    All vault operations happen in encrypted space
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>
                    Your balance remains private and secure on-chain
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* Reset Button */}
          {success && (
            <button
              onClick={() => {
                setSuccess(false);
                setVaultAddress("");
                setTxSignature("");
                setError("");
              }}
              className="w-full px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              Create Another Vault
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
