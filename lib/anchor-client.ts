import { AnchorProvider, Program, Idl, BN } from "@coral-xyz/anchor";
import { Connection, PublicKey, Commitment } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PROGRAM_ID, RPC_ENDPOINT } from "./constants";
import { SHADOWVAULT_MXE_IDL } from "./idl";

// Type the IDL
export type ShadowvaultMxeIDL = {
  version: string;
  name: string;
  instructions: any[];
  accounts: any[];
  types: any[];
  events: any[];
  errors: any[];
  metadata?: {
    address: string;
  };
};

// Use the IDL
const idl = SHADOWVAULT_MXE_IDL as Idl;

// Program type
export type ShadowvaultMxeProgram = Program<ShadowvaultMxeIDL>;

/**
 * Initialize Anchor program with wallet and connection
 * @param wallet - Anchor wallet adapter
 * @param connection - Optional Solana connection (defaults to RPC_ENDPOINT)
 * @returns Anchor Program instance
 */
export function getProgram(
  wallet: AnchorWallet,
  connection?: Connection
): ShadowvaultMxeProgram {
  const conn = connection || new Connection(RPC_ENDPOINT, "confirmed");
  
  const provider = new AnchorProvider(conn, wallet, {
    commitment: "confirmed",
    preflightCommitment: "processed",
  });

  return new Program(idl, PROGRAM_ID, provider) as ShadowvaultMxeProgram;
}

/**
 * Get program with custom connection
 * @param wallet - Anchor wallet adapter
 * @param rpcUrl - Custom RPC URL
 * @param commitment - Transaction commitment level
 * @returns Anchor Program instance
 */
export function getProgramWithConnection(
  wallet: AnchorWallet,
  rpcUrl: string,
  commitment: Commitment = "confirmed"
): ShadowvaultMxeProgram {
  const connection = new Connection(rpcUrl, commitment);
  return getProgram(wallet, connection);
}

/**
 * Get vault metadata PDA
 */
export function getVaultMetadataPDA(owner: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault_metadata"), owner.toBuffer()],
    PROGRAM_ID
  );
}

/**
 * Get vault data PDA
 */
export function getVaultDataPDA(owner: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault_data"), owner.toBuffer()],
    PROGRAM_ID
  );
}

/**
 * Check if vault exists for owner
 */
export async function vaultExists(
  connection: Connection,
  owner: PublicKey
): Promise<boolean> {
  try {
    const [vaultMetadata] = getVaultMetadataPDA(owner);
    const accountInfo = await connection.getAccountInfo(vaultMetadata);
    return accountInfo !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Vault account types
 */
export interface VaultMetadata {
  owner: PublicKey;
  bump: number;
  computationQueued: boolean;
  initialized: boolean;
}

export interface VaultData {
  encryptedBalance: BN;
  encryptedTotalDeposits: BN;
  encryptedTotalWithdrawals: BN;
  encryptedTxCount: BN;
  owner: number[];
  isActive: boolean;
  createdAt: BN;
}

/**
 * Get vault balance (encrypted)
 * @param program - Anchor program instance
 * @param owner - Vault owner public key
 * @returns Encrypted balance as BN or null if not found
 */
export async function getVaultBalance(
  program: ShadowvaultMxeProgram,
  owner: PublicKey
): Promise<BN | null> {
  try {
    const [vaultData] = getVaultDataPDA(owner);
    const vault = await program.account?.vaultData?.fetch(vaultData);
    if (!vault) return null;
    return (vault as any).encryptedBalance as BN;
  } catch (error) {
    console.error("Error fetching vault balance:", error);
    return null;
  }
}

/**
 * Get vault metadata
 * @param program - Anchor program instance
 * @param owner - Vault owner public key
 * @returns Vault metadata or null if not found
 */
export async function getVaultMetadata(
  program: ShadowvaultMxeProgram,
  owner: PublicKey
): Promise<VaultMetadata | null> {
  try {
    const [vaultMetadata] = getVaultMetadataPDA(owner);
    const metadata = await program.account?.vaultMetadata?.fetch(vaultMetadata);
    return metadata as VaultMetadata | null;
  } catch (error) {
    console.error("Error fetching vault metadata:", error);
    return null;
  }
}

/**
 * Get vault data
 * @param program - Anchor program instance
 * @param owner - Vault owner public key
 * @returns Vault data or null if not found
 */
export async function getVaultData(
  program: ShadowvaultMxeProgram,
  owner: PublicKey
): Promise<VaultData | null> {
  try {
    const [vaultData] = getVaultDataPDA(owner);
    const data = await program.account?.vaultData?.fetch(vaultData);
    return data as VaultData | null;
  } catch (error) {
    console.error("Error fetching vault data:", error);
    return null;
  }
}

/**
 * Get all vault accounts for a program
 * @param program - Anchor program instance
 * @returns Array of vault data accounts
 */
export async function getAllVaults(
  program: ShadowvaultMxeProgram
): Promise<Array<{ publicKey: PublicKey; account: VaultData }>> {
  try {
    const vaults = await program.account?.vaultData?.all();
    return (vaults || []) as Array<{ publicKey: PublicKey; account: VaultData }>;
  } catch (error) {
    console.error("Error fetching all vaults:", error);
    return [];
  }
}
