/**
 * ShadowVault Protocol - Solana Playground Client
 * 
 * This client demonstrates how to interact with the ShadowVault program
 * in Solana Playground environment.
 */

// Solana Playground automatically provides these globals:
// - pg: Playground object with wallet, connection, PROGRAM_ID
// - web3: @solana/web3.js
// - anchor: @coral-xyz/anchor
// - splToken: @solana/spl-token

// Main function
const main = async () => {
  console.log("🛡️ ShadowVault Protocol - Client Demo\n");

  // ============================================================================
  // 1. Setup - Get wallet and connection from Playground
  // ============================================================================
  
  // Check if wallet is connected
  if (!pg.wallet || !pg.wallet.publicKey) {
    throw new Error("❌ Wallet not connected! Please connect your wallet in Solana Playground.");
  }

  const wallet = pg.wallet;
  const connection = pg.connection;
  
  console.log("✅ Wallet connected:", wallet.publicKey.toString());
  console.log("✅ Cluster:", connection.rpcEndpoint);
  
  // Check wallet balance
  const balance = await connection.getBalance(wallet.publicKey);
  console.log("💰 Wallet balance:", balance / web3.LAMPORTS_PER_SOL, "SOL\n");
  
  if (balance < 0.1 * web3.LAMPORTS_PER_SOL) {
    console.log("⚠️  Low balance! Get devnet SOL from: https://faucet.solana.com");
  }

  // ============================================================================
  // 2. Setup Program
  // ============================================================================
  
  // Get the deployed program
  const programId = pg.PROGRAM_ID;
  console.log("📋 Program ID:", programId.toString());
  
  // Create provider
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    { commitment: "confirmed" }
  );
  anchor.setProvider(provider);
  
  // Load the program IDL
  const idl = await anchor.Program.fetchIdl(programId, provider);
  const program = new anchor.Program(idl, programId, provider);
  
  console.log("✅ Program loaded successfully\n");

  // ============================================================================
  // 3. Derive Vault PDA
  // ============================================================================
  
  const [vaultPDA, vaultBump] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), wallet.publicKey.toBuffer()],
    programId
  );
  
  console.log("🔑 Vault PDA:", vaultPDA.toString());
  console.log("🔑 Vault Bump:", vaultBump, "\n");

  // ============================================================================
  // 4. Check if vault exists
  // ============================================================================
  
  let vaultExists = false;
  try {
    const vaultAccount = await program.account.vaultAccount.fetch(vaultPDA);
    vaultExists = true;
    console.log("✅ Vault already exists!");
    console.log("   Owner:", vaultAccount.owner.toString());
    console.log("   TVL:", vaultAccount.totalValueLocked.toString());
    console.log("   Execution Count:", vaultAccount.executionCount.toString());
    console.log("   Is Paused:", vaultAccount.isPaused);
    console.log("");
  } catch (error) {
    console.log("ℹ️  Vault does not exist yet. Will create one.\n");
  }

  // ============================================================================
  // 5. Initialize Vault (if not exists)
  // ============================================================================
  
  if (!vaultExists) {
    console.log("🚀 Initializing vault...");
    
    // Create encrypted strategy hash (32 bytes)
    // In production, this would be a hash of your encrypted strategy
    const encryptedStrategyHash = Array.from(new Uint8Array(32).fill(1));
    
    try {
      const tx = await program.methods
        .initializeVault(encryptedStrategyHash)
        .accounts({
          payer: wallet.publicKey,
          owner: wallet.publicKey,
          vault: vaultPDA,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      
      console.log("✅ Vault initialized!");
      console.log("   Transaction:", tx);
      console.log("   Explorer:", `https://explorer.solana.com/tx/${tx}?cluster=devnet\n`);
      
      // Wait for confirmation
      await connection.confirmTransaction(tx, "confirmed");
      
      // Fetch vault account
      const vaultAccount = await program.account.vaultAccount.fetch(vaultPDA);
      console.log("📊 Vault Details:");
      console.log("   Owner:", vaultAccount.owner.toString());
      console.log("   TVL:", vaultAccount.totalValueLocked.toString());
      console.log("   Execution Count:", vaultAccount.executionCount.toString());
      console.log("   Is Paused:", vaultAccount.isPaused);
      console.log("");
      
    } catch (error) {
      console.error("❌ Error initializing vault:", error.message);
      throw error;
    }
  }

  // ============================================================================
  // 6. Create Test Token (for deposit demo)
  // ============================================================================
  
  console.log("🪙 Creating test token...");
  
  const tokenMint = await splToken.createMint(
    connection,
    wallet.keypair, // Playground provides keypair
    wallet.publicKey,
    null,
    6 // 6 decimals
  );
  
  console.log("✅ Token created:", tokenMint.toString());
  
  // Create token account for user
  const userTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
    connection,
    wallet.keypair,
    tokenMint,
    wallet.publicKey
  );
  
  console.log("✅ User token account:", userTokenAccount.address.toString());
  
  // Mint some tokens to user
  await splToken.mintTo(
    connection,
    wallet.keypair,
    tokenMint,
    userTokenAccount.address,
    wallet.publicKey,
    10_000_000 // 10 tokens (6 decimals)
  );
  
  console.log("✅ Minted 10 tokens to user\n");

  // ============================================================================
  // 7. Deposit Tokens
  // ============================================================================
  
  console.log("💰 Depositing tokens into vault...");
  
  // Get or create vault token account
  const vaultTokenAccount = await splToken.getAssociatedTokenAddress(
    tokenMint,
    vaultPDA,
    true // allowOwnerOffCurve
  );
  
  const depositAmount = new anchor.BN(1_000_000); // 1 token
  
  try {
    const tx = await program.methods
      .deposit(depositAmount)
      .accounts({
        user: wallet.publicKey,
        tokenMint: tokenMint,
        userAta: userTokenAccount.address,
        vault: vaultPDA,
        vaultAta: vaultTokenAccount,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
        associatedTokenProgram: splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
    
    console.log("✅ Deposit successful!");
    console.log("   Amount:", depositAmount.toString());
    console.log("   Transaction:", tx);
    console.log("   Explorer:", `https://explorer.solana.com/tx/${tx}?cluster=devnet\n`);
    
    // Fetch updated vault
    const vaultAccount = await program.account.vaultAccount.fetch(vaultPDA);
    console.log("📊 Updated TVL:", vaultAccount.totalValueLocked.toString(), "\n");
    
  } catch (error) {
    console.error("❌ Error depositing:", error.message);
    console.log("   This might be because the vault is paused or insufficient balance\n");
  }

  // ============================================================================
  // 8. Submit Trade Intent
  // ============================================================================
  
  console.log("📝 Submitting trade intent...");
  
  // Create another token for token_out
  const tokenOut = await splToken.createMint(
    connection,
    wallet.keypair,
    wallet.publicKey,
    null,
    6
  );
  
  console.log("✅ Token out created:", tokenOut.toString());
  
  // Derive intent PDA
  const [intentPDA] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("intent"),
      wallet.publicKey.toBuffer(),
      vaultPDA.toBuffer(),
    ],
    programId
  );
  
  console.log("🔑 Intent PDA:", intentPDA.toString());
  
  try {
    const tx = await program.methods
      .submitTradeIntent(
        tokenMint,
        tokenOut,
        new anchor.BN(100_000), // 0.1 token
        100, // 1% slippage
        0    // strategy type
      )
      .accounts({
        user: wallet.publicKey,
        vault: vaultPDA,
        intent: intentPDA,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
    
    console.log("✅ Trade intent submitted!");
    console.log("   Transaction:", tx);
    console.log("   Explorer:", `https://explorer.solana.com/tx/${tx}?cluster=devnet\n`);
    
    // Fetch intent
    const intent = await program.account.tradeIntent.fetch(intentPDA);
    console.log("📊 Intent Details:");
    console.log("   User:", intent.user.toString());
    console.log("   Amount:", intent.amount.toString());
    console.log("   Max Slippage:", intent.maxSlippageBps, "bps");
    console.log("   Strategy Type:", intent.strategyType);
    console.log("");
    
  } catch (error) {
    console.error("❌ Error submitting intent:", error.message);
    console.log("   Intent might already exist for this user/vault combination\n");
  }

  // ============================================================================
  // 9. Pause Vault (Demo)
  // ============================================================================
  
  console.log("⏸️  Pausing vault (demo)...");
  
  try {
    const tx = await program.methods
      .pauseVault(true)
      .accounts({
        authority: wallet.publicKey,
        vault: vaultPDA,
      })
      .rpc();
    
    console.log("✅ Vault paused!");
    console.log("   Transaction:", tx);
    console.log("   Explorer:", `https://explorer.solana.com/tx/${tx}?cluster=devnet\n`);
    
    // Verify
    const vaultAccount = await program.account.vaultAccount.fetch(vaultPDA);
    console.log("📊 Vault is paused:", vaultAccount.isPaused, "\n");
    
  } catch (error) {
    console.error("❌ Error pausing vault:", error.message);
  }

  // ============================================================================
  // 10. Unpause Vault
  // ============================================================================
  
  console.log("▶️  Unpausing vault...");
  
  try {
    const tx = await program.methods
      .pauseVault(false)
      .accounts({
        authority: wallet.publicKey,
        vault: vaultPDA,
      })
      .rpc();
    
    console.log("✅ Vault unpaused!");
    console.log("   Transaction:", tx);
    console.log("   Explorer:", `https://explorer.solana.com/tx/${tx}?cluster=devnet\n`);
    
  } catch (error) {
    console.error("❌ Error unpausing vault:", error.message);
  }

  // ============================================================================
  // 11. Withdraw Tokens
  // ============================================================================
  
  console.log("💸 Withdrawing tokens from vault...");
  
  const withdrawAmount = new anchor.BN(500_000); // 0.5 token
  
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
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
        associatedTokenProgram: splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
    
    console.log("✅ Withdrawal successful!");
    console.log("   Amount:", withdrawAmount.toString());
    console.log("   Transaction:", tx);
    console.log("   Explorer:", `https://explorer.solana.com/tx/${tx}?cluster=devnet\n`);
    
    // Fetch updated vault
    const vaultAccount = await program.account.vaultAccount.fetch(vaultPDA);
    console.log("📊 Updated TVL:", vaultAccount.totalValueLocked.toString(), "\n");
    
  } catch (error) {
    console.error("❌ Error withdrawing:", error.message);
  }

  // ============================================================================
  // Final Summary
  // ============================================================================
  
  console.log("=" .repeat(60));
  console.log("🎉 Demo Complete!");
  console.log("=" .repeat(60));
  
  const finalVault = await program.account.vaultAccount.fetch(vaultPDA);
  console.log("\n📊 Final Vault State:");
  console.log("   Owner:", finalVault.owner.toString());
  console.log("   TVL:", finalVault.totalValueLocked.toString());
  console.log("   Execution Count:", finalVault.executionCount.toString());
  console.log("   Is Paused:", finalVault.isPaused);
  console.log("\n✅ All operations completed successfully!");
  console.log("\n🔗 View your vault on Solana Explorer:");
  console.log(`   https://explorer.solana.com/address/${vaultPDA.toString()}?cluster=devnet`);
};

// Run the main function
main()
  .then(() => {
    console.log("\n✨ Script finished successfully!");
  })
  .catch((error) => {
    console.error("\n❌ Error:", error);
    console.error("\n💡 Common issues:");
    console.error("   1. Make sure your wallet is connected");
    console.error("   2. Ensure you have enough SOL (get from faucet)");
    console.error("   3. Check that the program is deployed");
    console.error("   4. Verify you're on the correct cluster (devnet)");
  });
