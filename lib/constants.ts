import { PublicKey, clusterApiUrl } from "@solana/web3.js";

// Program ID from declare_id! in programs/shadowvault_mxe/src/lib.rs
export const PROGRAM_ID = new PublicKey(
  "Br2ApMKRBGKfiCgmccs3yhFkQpsERND7ZA9i4Q3QRj97"
);

// Solana cluster configuration
export const CLUSTER = process.env.NEXT_PUBLIC_SOLANA_CLUSTER || "devnet";
export const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_RPC_ENDPOINT || clusterApiUrl(CLUSTER as any);

// Arcium MPC configuration
export const ARCIUM_API_URL =
  process.env.NEXT_PUBLIC_ARCIUM_API_URL || "https://api.arcium.com";

// Vault PDA seeds
export const VAULT_METADATA_SEED = "vault_metadata";
export const VAULT_DATA_SEED = "vault_data";

// Transaction confirmation settings
export const CONFIRMATION_COMMITMENT = "confirmed";
export const PREFLIGHT_COMMITMENT = "processed";

// UI Constants
export const APP_NAME = "ShadowVault";
export const APP_DESCRIPTION =
  "Privacy-preserving vault system powered by Arcium MPC";

// Feature flags
export const FEATURES = {
  DEPOSITS: true,
  WITHDRAWALS: true,
  TRANSFERS: true,
  BALANCE_CHECKS: true,
};
