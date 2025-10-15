"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import {
  Wallet,
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  Check,
} from "lucide-react";

export function WalletButton() {
  const { connected, publicKey, disconnect, wallet, select, wallets } =
    useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch SOL balance
  useEffect(() => {
    if (connected && publicKey) {
      const fetchBalance = async () => {
        try {
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      };

      fetchBalance();
      const interval = setInterval(fetchBalance, 10000); // Update every 10s

      return () => clearInterval(interval);
    } else {
      setBalance(null);
    }
  }, [connected, publicKey, connection]);

  // Copy address to clipboard
  const copyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Open explorer
  const openExplorer = () => {
    if (publicKey) {
      window.open(
        `https://explorer.solana.com/address/${publicKey.toBase58()}?cluster=devnet`,
        "_blank"
      );
    }
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    setIsOpen(false);
    await disconnect();
  };

  // If not connected, show wallet selection buttons
  if (!connected) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
        >
          <Wallet className="w-5 h-5" />
          <span>Connect Wallet</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Wallet Selection Dropdown */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-700">
              <p className="text-sm font-semibold text-gray-300">
                Select Wallet
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {wallets.map((w) => (
                <button
                  key={w.adapter.name}
                  onClick={() => {
                    select(w.adapter.name);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors"
                >
                  {w.adapter.icon && (
                    <img
                      src={w.adapter.icon}
                      alt={w.adapter.name}
                      className="w-6 h-6"
                    />
                  )}
                  <span className="text-sm font-medium">{w.adapter.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Click outside to close */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }

  // If connected, show wallet info
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-purple-500 rounded-lg transition-all duration-200"
      >
        {/* Wallet Icon */}
        {wallet?.adapter.icon && (
          <img
            src={wallet.adapter.icon}
            alt={wallet.adapter.name}
            className="w-5 h-5"
          />
        )}

        {/* Balance and Address */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-purple-400">
              {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
            </span>
          </div>
          <span className="text-xs font-mono text-gray-400">
            {publicKey?.toBase58().slice(0, 4)}...
            {publicKey?.toBase58().slice(-4)}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              {wallet?.adapter.icon && (
                <img
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                  className="w-8 h-8"
                />
              )}
              <div>
                <p className="text-sm font-semibold">{wallet?.adapter.name}</p>
                <p className="text-xs text-gray-400">Connected</p>
              </div>
            </div>

            {/* Balance */}
            <div className="bg-gray-900 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Balance</p>
              <p className="text-lg font-bold text-purple-400">
                {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="p-4 border-b border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Wallet Address</p>
            <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-2">
              <span className="text-xs font-mono text-gray-300 flex-1 truncate">
                {publicKey?.toBase58()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={copyAddress}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-left"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm">
                {copied ? "Copied!" : "Copy Address"}
              </span>
            </button>

            <button
              onClick={openExplorer}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-left"
            >
              <ExternalLink className="w-4 h-4 text-gray-400" />
              <span className="text-sm">View on Explorer</span>
            </button>

            <button
              onClick={handleDisconnect}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-900/20 text-red-400 rounded-lg transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Disconnect</span>
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
