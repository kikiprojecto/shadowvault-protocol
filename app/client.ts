/**
 * ShadowVault Protocol - Complete Client
 * Uses the exported IDL from Solana Playground
 */

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Connection, Keypair, SystemProgram } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createMint,
  mintTo,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import idl from "./idl/shadowvault.json";

// Type for the ShadowVault program
type ShadowVault = anchor.Program<typeof idl>;

async function main() {
  console.log("============================================================");
  console.log("🛡️  ShadowVault Protocol - Complete Demo");
  console.log("============================================================\n");

  // ============================================================================
  // 1. Setup Connection and Wallet
  // ============================================================================
  
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
  // Load wallet from environment or create new one
  const wallet = anchor.Wallet.local();
  
  console.log("✅ Wallet:", wallet.publicKey.toString());
  
  const balance = await connection.getBalance(wallet.publicKey);
  console.log("💰 Balance:", balance / 1e9, "SOL\n");
  
  if (balance < 0.1 * 1e9) {
    console.log("⚠️  Low balance! Get devnet SOL from: https://faucet.solana.com\n");
    return;
  }

  // ============================================================================
  // 2. Setup Program
  // ============================================================================
  
  // Deployed program ID on Solana Devnet
  const programId = new PublicKey("HKFDPxSMDTcMjNWnDR3u4YH5VKcxTKieV9snBY5HumBe");
  
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    { commitment: "confirmed" }
  );
  
  anchor.setProvider(provider);
  
  const program = new Program(
    idl as any,
    programId,
    provider
  ) as unknown as ShadowVault;
  
  console.log("✅ Program ID:", programId.toString());
  console.log("✅ Program loaded\n");

  // ============================================================================
  // 3. Derive Vault PDA
  // ============================================================================
  
  const [vaultPDA, vaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), wallet.publicKey.toBuffer()],
    programId
  );
  
  console.log("🔑 Vault PDA:", vaultPDA.toString());
  console.log("🔑 Bump:", vaultBump, "\n");

  // ============================================================================
  // 4. Initialize Vault
  // ============================================================================
  
  console.log("📍 Initializing vault...");
  
  const encryptedStrategyHash = Array.from(new Uint8Array(32).fill(1));
  
  try {
    const tx = await program.methods
      .initializeVault(encryptedStrategyHash)
      .accounts({
        payer: wallet.publicKey,
        owner: wallet.publicKey,
        vault: vaultPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    console.log("✅ Vault initialized!");
    console.log("   TX:", tx);
    console.log("   Explorer:", `https://explorer.solana.com/tx/${tx}?cluster=devnet\n`);
    
    await connection.confirmTransaction(tx, "confirmed");
    
  } catch (error: any) {
    if (error.message?.includes("already in use")) {
      console.log("ℹ️  Vault already exists (OK)\n");
    } else {
      console.error("❌ Error:", error.message);
      throw error;
    }
  }

  // ============================================================================
  // 5. Fetch Vault Data
  // ============================================================================
  
  console.log("📍 Fetching vault data...");
  
  const vaultAccount = await program.account.vaultAccount.fetch(vaultPDA);
  
  console.log("✅ Vault Details:");
  console.log("   Owner:", vaultAccount.owner.toString());
  console.log("   TVL:", vaultAccount.totalValueLocked.toString());
  console.log("   Execution Count:", vaultAccount.executionCount.toString());
  console.log("   Is Paused:", vaultAccount.isPaused);
  console.log("");

  // ============================================================================
  // 6. Create Test Token
  // ============================================================================
  
  console.log("📍 Creating test token...");
  
  const tokenMint = await createMint(
    connection,
    wallet.payer,
    wallet.publicKey,
    null,
    6
  );
  
  console.log("✅ Token Mint:", tokenMint.toString());
  
  const userTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    wallet.payer,
    tokenMint,
    wallet.publicKey
  );
  
  console.log("✅ User Token Account:", userTokenAccount.address.toString());
  
  await mintTo(
    connection,
    wallet.payer,
    tokenMint,
    userTokenAccount.address,
    wallet.publicKey,
    10_000_000
  );
  
  console.log("✅ Minted 10 tokens\n");

  // ============================================================================
  // 7. Deposit Tokens
  // ============================================================================
  
  console.log("📍 Depositing tokens...");
  
  const vaultTokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    vaultPDA,
    true
  );
  
  const depositAmount = new anchor.BN(1_000_000);
  
  try {
    const tx = await program.methods
      .deposit(depositAmount)
      .accounts({
        user: wallet.publicKey,
        tokenMint: tokenMint,
        userAta: userTokenAccount.address,
        vault: vaultPDA,
        vaultAta: vaultTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    console.log("✅ Deposit successful!");
    console.log("   Amount:", depositAmount.toString());
    console.log("   TX:", tx);
    console.log("   Explorer:", `https://explorer.solana.com/tx/${tx}?cluster=devnet\n`);
    
  } catch (error: any) {
    console.error("❌ Deposit error:", error.message, "\n");
  }

  // ============================================================================
  // 8. Submit Trade Intent
  // ============================================================================
  
  console.log("📍 Submitting trade intent...");
  
  const tokenOut = await createMint(
    connection,
    wallet.payer,
    wallet.publicKey,
    null,
    6
  );
  
  console.log("✅ Token Out:", tokenOut.toString());
  
  const [intentPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("intent"),
      wallet.publicKey.toBuffer(),
      vaultPDA.toBuffer(),
    ],
    programId
  );
  
  console.log("✅ Intent PDA:", intentPDA.toString());
  
  try {
    const tx = await program.methods
      .submitTradeIntent(
        tokenMint,
        tokenOut,
        new anchor.BN(100_000),
        100,
        0
      )
      .accounts({
        user: wallet.publicKey,
        vault: vaultPDA,
        intent: intentPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    console.log("✅ Trade intent submitted!");
    console.log("   TX:", tx);
    console.log("   Explorer:", `https://explorer.solana.com/tx/${tx}?cluster=devnet\n`);
    
  } catch (error: any) {
    console.error("❌ Intent error:", error.message, "\n");
  }

  // ============================================================================
  // 9. Pause Vault
  // ============================================================================
  
  console.log("📍 Pausing vault...");
  
  try {
    const tx = await program.methods
      .pauseVault(true)
      .accounts({
        authority: wallet.publicKey,
        vault: vaultPDA,
        owner: wallet.publicKey,
      })
      .rpc();
    
    console.log("✅ Vault paused!");
    console.log("   TX:", tx, "\n");
    
  } catch (error: any) {
    console.error("❌ Pause error:", error.message, "\n");
  }

  // ============================================================================
  // 10. Unpause Vault
  // ============================================================================
  
  console.log("📍 Unpausing vault...");
  
  try {
    const tx = await program.methods
      .pauseVault(false)
      .accounts({
        authority: wallet.publicKey,
        vault: vaultPDA,
        owner: wallet.publicKey,
      })
      .rpc();
    
    console.log("✅ Vault unpaused!");
    console.log("   TX:", tx, "\n");
    
  } catch (error: any) {
    console.error("❌ Unpause error:", error.message, "\n");
  }

  // ============================================================================
  // 11. Withdraw Tokens
  // ============================================================================
  
  console.log("📍 Withdrawing tokens...");
  
  const withdrawAmount = new anchor.BN(500_000);
  
  try {
    const tx = await program.methods
      .withdraw(withdrawAmount)
      .accounts({
        authority: wallet.publicKey,
        tokenMint: tokenMint,
        vault: vaultPDA,
        owner: wallet.publicKey,
        vaultAta: vaultTokenAccount,
        recipientAta: userTokenAccount.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    console.log("✅ Withdrawal successful!");
    console.log("   Amount:", withdrawAmount.toString());
    console.log("   TX:", tx, "\n");
    
  } catch (error: any) {
    console.error("❌ Withdraw error:", error.message, "\n");
  }

  // ============================================================================
  // Final Summary
  // ============================================================================
  
  const finalVault = await program.account.vaultAccount.fetch(vaultPDA);
  
  console.log("============================================================");
  console.log("🎉 Demo Complete!");
  console.log("============================================================\n");
  console.log("📊 Final Vault State:");
  console.log("   Owner:", finalVault.owner.toString());
  console.log("   TVL:", finalVault.totalValueLocked.toString());
  console.log("   Execution Count:", finalVault.executionCount.toString());
  console.log("   Is Paused:", finalVault.isPaused);
  console.log("\n✅ All operations completed successfully!");
  console.log("\n🔗 View vault on Explorer:");
  console.log(`   https://explorer.solana.com/address/${vaultPDA.toString()}?cluster=devnet\n`);
}

main()
  .then(() => {
    console.log("✨ Script finished!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });
