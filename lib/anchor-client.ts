import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PROGRAM_ID, RPC_ENDPOINT } from "./constants";
import idl from "../target/idl/shadowvault_mxe.json";

export type ShadowvaultMxe = Program;

/**
 * Initialize Anchor program with wallet and connection
 */
export function getProgram(wallet: AnchorWallet): Program {
  const connection = new Connection(RPC_ENDPOINT, "confirmed");
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
    preflightCommitment: "processed",
  });

  return new Program(idl as Idl, PROGRAM_ID, provider);
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
 * Get vault balance (encrypted)
 */
export async function getVaultBalance(
  program: Program,
  owner: PublicKey
): Promise<bigint | null> {
  try {
    const [vaultData] = getVaultDataPDA(owner);
    const vault = await program.account.vaultData.fetch(vaultData);
    return vault.encryptedBalance;
  } catch (error) {
    console.error("Error fetching vault balance:", error);
    return null;
  }
}

/**
 * Get vault metadata
 */
export async function getVaultMetadata(
  program: Program,
  owner: PublicKey
): Promise<any | null> {
  try {
    const [vaultMetadata] = getVaultMetadataPDA(owner);
    return await program.account.vaultMetadata.fetch(vaultMetadata);
  } catch (error) {
    console.error("Error fetching vault metadata:", error);
    return null;
  }
}

/**
 * Get vault data
 */
export async function getVaultData(
  program: Program,
  owner: PublicKey
): Promise<any | null> {
  try {
    const [vaultData] = getVaultDataPDA(owner);
    return await program.account.vaultData.fetch(vaultData);
  } catch (error) {
    console.error("Error fetching vault data:", error);
    return null;
  }
}
