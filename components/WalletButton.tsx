"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";

export function WalletButton() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="flex items-center gap-4">
      {connected && publicKey && (
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
          <Wallet className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-mono text-gray-300">
            {publicKey.toBase58().slice(0, 4)}...
            {publicKey.toBase58().slice(-4)}
          </span>
        </div>
      )}
      <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!from-purple-700 hover:!to-pink-700 !rounded-lg !px-6 !py-3 !font-semibold !transition-all !duration-200" />
    </div>
  );
}
