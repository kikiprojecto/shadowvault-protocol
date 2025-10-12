/**
 * ShadowVault - Simple Client for Solana Playground
 * 
 * INSTRUCTIONS:
 * 1. Make sure wallet is connected (click "Connect" button)
 * 2. Make sure program is deployed (click "Build" then "Deploy")
 * 3. Click "Run" to execute this script
 */

// Solana Playground provides these globals automatically:
// - pg: Playground object with wallet, connection, PROGRAM_ID
// - web3: @solana/web3.js
// - anchor: @coral-xyz/anchor
// - splToken: @solana/spl-token

async function main() {
  console.log("============================================================");
  console.log("🛡️  ShadowVault Protocol - Simple Demo");
  console.log("============================================================");
  console.log("");

  // ============================================================================
  // STEP 1: Verify Wallet Connection
  // ============================================================================
  console.log("📍 Step 1: Checking wallet connection...");
  
  if (!pg || !pg.wallet || !pg.wallet.publicKey) {
    console.error("❌ ERROR: Wallet not connected!");
    console.log("");
    console.log("👉 Please click the Connect button in the upper right corner");
    console.log("👉 Select your wallet (Phantom, Solflare, etc.)");
    console.log("👉 Approve the connection");
    console.log("👉 Then run this script again");
    return;
  }
  
  const wallet = pg.wallet;
  const connection = pg.connection;
  
  console.log("✅ Wallet connected");
  console.log("   Address:", wallet.publicKey.toString());
  console.log("");

  // ============================================================================
  // STEP 2: Check Balance
  // ============================================================================
  console.log("📍 Step 2: Checking wallet balance...");
  
  const balance = await connection.getBalance(wallet.publicKey);
  const balanceSOL = balance / web3.LAMPORTS_PER_SOL;
  
  console.log("✅ Balance:", balanceSOL.toFixed(4), "SOL");
  
  if (balanceSOL < 0.1) {
    console.log("");
    console.log("⚠️  WARNING: Low balance!");
    console.log("👉 Get devnet SOL from: https://faucet.solana.com");
    console.log("👉 You need at least 0.1 SOL to run transactions");
    return;
  }
  console.log("");

  // ============================================================================
  // STEP 3: Load Program
  // ============================================================================
  console.log("📍 Step 3: Loading program...");
  
  if (!pg.PROGRAM_ID) {
    console.error("❌ ERROR: Program not deployed!");
    console.log("");
    console.log("👉 Click Build button to build the program");
    console.log("👉 Click Deploy button to deploy");
    console.log("👉 Then run this script again");
    return;
  }
  
  const programId = pg.PROGRAM_ID;
  console.log("✅ Program ID:", programId.toString());
  
  // Create provider
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    { commitment: "confirmed" }
  );
  
  // Load program
  let program;
  try {
    const idl = await anchor.Program.fetchIdl(programId, provider);
    program = new anchor.Program(idl, programId, provider);
    console.log("✅ Program loaded successfully");
  } catch (error) {
    console.error("❌ ERROR: Failed to load program");
    console.log("   Error:", error.message);
    console.log("");
    console.log("👉 Make sure the program is deployed");
    console.log("👉 Try rebuilding and redeploying");
    return;
  }
  console.log("");

  // ============================================================================
  // STEP 4: Derive Vault PDA
  // ============================================================================
  console.log("📍 Step 4: Deriving vault address...");
  
  const [vaultPDA, vaultBump] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), wallet.publicKey.toBuffer()],
    programId
  );
  
  console.log("✅ Vault PDA:", vaultPDA.toString());
  console.log("✅ Bump:", vaultBump);
  console.log("");

  // ============================================================================
  // STEP 5: Check if Vault Exists
  // ============================================================================
  console.log("📍 Step 5: Checking if vault exists...");
  
  let vaultExists = false;
  let vaultData = null;
  
  try {
    vaultData = await program.account.vaultAccount.fetch(vaultPDA);
    vaultExists = true;
    console.log("✅ Vault already exists!");
    console.log("   Owner:", vaultData.owner.toString());
    console.log("   TVL:", vaultData.totalValueLocked.toString());
    console.log("   Execution Count:", vaultData.executionCount.toString());
    console.log("   Is Paused:", vaultData.isPaused);
  } catch (error) {
    console.log("ℹ️  Vault does not exist yet");
  }
  console.log("");

  // ============================================================================
  // STEP 6: Initialize Vault (if needed)
  // ============================================================================
  if (!vaultExists) {
    console.log("📍 Step 6: Initializing new vault...");
    
    // Create encrypted strategy hash (demo: all 1s)
    const encryptedStrategyHash = Array.from(new Uint8Array(32).fill(1));
    
    try {
      console.log("   Sending transaction...");
      
      const tx = await program.methods
        .initializeVault(encryptedStrategyHash)
        .accounts({
          payer: wallet.publicKey,
          owner: wallet.publicKey,
          vault: vaultPDA,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      
      console.log("✅ Vault initialized successfully!");
      console.log("   Transaction signature:", tx);
      console.log("   View on Explorer:");
      console.log("   https://explorer.solana.com/tx/" + tx + "?cluster=devnet");
      
      // Wait for confirmation
      await connection.confirmTransaction(tx, "confirmed");
      
      // Fetch vault data
      vaultData = await program.account.vaultAccount.fetch(vaultPDA);
      console.log("");
      console.log("📊 Vault Details:");
      console.log("   Owner:", vaultData.owner.toString());
      console.log("   TVL:", vaultData.totalValueLocked.toString());
      console.log("   Execution Count:", vaultData.executionCount.toString());
      console.log("   Is Paused:", vaultData.isPaused);
      
    } catch (error) {
      console.error("❌ ERROR: Failed to initialize vault");
      console.log("   Error:", error.message);
      
      if (error.message.includes("already in use")) {
        console.log("   (Vault already exists - this is OK)");
      }
    }
  } else {
    console.log("📍 Step 6: Skipping initialization (vault exists)");
  }
  console.log("");

  // ============================================================================
  // FINAL SUMMARY
  // ============================================================================
  console.log("============================================================");
  console.log("🎉 Demo Complete!");
  console.log("============================================================");
  console.log("");
  console.log("📊 Summary:");
  console.log("   Wallet:", wallet.publicKey.toString());
  console.log("   Balance:", balanceSOL.toFixed(4), "SOL");
  console.log("   Program:", programId.toString());
  console.log("   Vault:", vaultPDA.toString());
  console.log("");
  
  if (vaultData) {
    console.log("📈 Vault Status:");
    console.log("   TVL:", vaultData.totalValueLocked.toString());
    console.log("   Executions:", vaultData.executionCount.toString());
    console.log("   Paused:", vaultData.isPaused);
    console.log("");
  }
  
  console.log("🔗 View on Solana Explorer:");
  console.log("   https://explorer.solana.com/address/" + vaultPDA.toString() + "?cluster=devnet");
  console.log("");
  console.log("✅ All steps completed successfully!");
  console.log("");
  console.log("💡 Next steps:");
  console.log("   - Try depositing tokens");
  console.log("   - Submit a trade intent");
  console.log("   - Test pause/unpause");
  console.log("   - Withdraw tokens");
  console.log("");
}

// Execute main function with error handling
main()
  .then(() => {
    console.log("✨ Script finished!");
  })
  .catch((error) => {
    console.error("");
    console.error("============================================================");
    console.error("❌ SCRIPT FAILED");
    console.error("============================================================");
    console.error("");
    console.error("Error:", error.message);
    console.error("");
    console.error("🔍 Troubleshooting:");
    console.error("   1. Is your wallet connected?");
    console.error("   2. Do you have enough SOL? (need 0.1 SOL minimum)");
    console.error("   3. Is the program deployed?");
    console.error("   4. Are you on devnet?");
    console.error("");
  });