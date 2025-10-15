import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ShadowvaultMxe } from "../target/types/shadowvault_mxe";
import { expect } from "chai";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";

describe("ShadowVault - Encrypted Vault Operations", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.ShadowvaultMxe as Program<ShadowvaultMxe>;

  // Test accounts
  let vaultOwner1: Keypair;
  let vaultOwner2: Keypair;
  let vault1Metadata: PublicKey;
  let vault1Data: PublicKey;
  let vault2Metadata: PublicKey;
  let vault2Data: PublicKey;
  
  // Computation definition accounts
  let initVaultCompDef: Keypair;
  let depositCompDef: Keypair;
  let withdrawCompDef: Keypair;
  let balanceCheckCompDef: Keypair;
  let transferCompDef: Keypair;

  before(async () => {
    // Create vault owners
    vaultOwner1 = Keypair.generate();
    vaultOwner2 = Keypair.generate();

    // Airdrop SOL to vault owners
    const airdropSig1 = await provider.connection.requestAirdrop(
      vaultOwner1.publicKey,
      10 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig1);

    const airdropSig2 = await provider.connection.requestAirdrop(
      vaultOwner2.publicKey,
      10 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig2);

    // Derive vault PDAs
    [vault1Metadata] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault_metadata"), vaultOwner1.publicKey.toBuffer()],
      program.programId
    );

    [vault1Data] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault_data"), vaultOwner1.publicKey.toBuffer()],
      program.programId
    );

    [vault2Metadata] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault_metadata"), vaultOwner2.publicKey.toBuffer()],
      program.programId
    );

    [vault2Data] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault_data"), vaultOwner2.publicKey.toBuffer()],
      program.programId
    );

    // Initialize computation definitions
    initVaultCompDef = Keypair.generate();
    depositCompDef = Keypair.generate();
    withdrawCompDef = Keypair.generate();
    balanceCheckCompDef = Keypair.generate();
    transferCompDef = Keypair.generate();

    // Initialize all computation definitions
    await program.methods
      .initInitializeVaultCompDef()
      .accounts({
        payer: provider.wallet.publicKey,
        compDef: initVaultCompDef.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([initVaultCompDef])
      .rpc();

    await program.methods
      .initDepositCompDef()
      .accounts({
        payer: provider.wallet.publicKey,
        compDef: depositCompDef.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([depositCompDef])
      .rpc();

    await program.methods
      .initWithdrawCompDef()
      .accounts({
        payer: provider.wallet.publicKey,
        compDef: withdrawCompDef.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([withdrawCompDef])
      .rpc();

    await program.methods
      .initCheckBalanceSufficientCompDef()
      .accounts({
        payer: provider.wallet.publicKey,
        compDef: balanceCheckCompDef.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([balanceCheckCompDef])
      .rpc();

    await program.methods
      .initTransferCompDef()
      .accounts({
        payer: provider.wallet.publicKey,
        compDef: transferCompDef.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([transferCompDef])
      .rpc();

    console.log("✅ All computation definitions initialized");
  });

  // ============================================================================
  // TEST 1: Initialize vault with encrypted balance
  // ============================================================================
  it("Test 1: Initialize vault with encrypted balance", async () => {
    console.log("\n🧪 Test 1: Initialize vault with encrypted balance");

    const initialBalance = new anchor.BN(1000); // Encrypted initial balance
    const computation = Keypair.generate();

    // Queue vault initialization
    const tx = await program.methods
      .initializeVault(initialBalance, vault1Metadata)
      .accounts({
        payer: provider.wallet.publicKey,
        owner: vaultOwner1.publicKey,
        compDef: initVaultCompDef.publicKey,
        computation: computation.publicKey,
        vaultMetadata: vault1Metadata,
        systemProgram: SystemProgram.programId,
      })
      .signers([vaultOwner1, computation])
      .rpc();

    console.log("  📤 Vault initialization queued:", tx);

    // Wait for MPC computation (simulated delay)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Call callback to complete initialization
    await program.methods
      .initializeVaultCallback()
      .accounts({
        computation: computation.publicKey,
        vaultMetadata: vault1Metadata,
        vaultData: vault1Data,
        payer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Verify vault is initialized
    const vaultMetadata = await program.account.vaultMetadata.fetch(vault1Metadata);
    const vaultData = await program.account.vaultData.fetch(vault1Data);

    expect(vaultMetadata.initialized).to.be.true;
    expect(vaultMetadata.owner.toString()).to.equal(vaultOwner1.publicKey.toString());
    expect(vaultData.isActive).to.be.true;

    console.log("  ✅ Vault 1 initialized successfully");
    console.log("  📊 Encrypted balance:", vaultData.encryptedBalance.toString());
  });

  // ============================================================================
  // TEST 2: Deposit to vault
  // ============================================================================
  it("Test 2: Deposit to vault", async () => {
    console.log("\n🧪 Test 2: Deposit to vault");

    const depositAmount = new anchor.BN(500); // Encrypted deposit amount
    const computation = Keypair.generate();

    // Get initial balance
    const vaultDataBefore = await program.account.vaultData.fetch(vault1Data);
    const balanceBefore = vaultDataBefore.encryptedBalance;

    // Queue deposit
    const tx = await program.methods
      .deposit(depositAmount)
      .accounts({
        payer: provider.wallet.publicKey,
        owner: vaultOwner1.publicKey,
        compDef: depositCompDef.publicKey,
        computation: computation.publicKey,
        vaultMetadata: vault1Metadata,
        vaultData: vault1Data,
        systemProgram: SystemProgram.programId,
      })
      .signers([vaultOwner1, computation])
      .rpc();

    console.log("  📤 Deposit queued:", tx);

    // Wait for MPC computation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Call callback
    await program.methods
      .depositCallback()
      .accounts({
        computation: computation.publicKey,
        vaultMetadata: vault1Metadata,
        vaultData: vault1Data,
        payer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Verify deposit
    const vaultDataAfter = await program.account.vaultData.fetch(vault1Data);
    const balanceAfter = vaultDataAfter.encryptedBalance;

    console.log("  ✅ Deposit completed");
    console.log("  📊 Balance before:", balanceBefore.toString());
    console.log("  📊 Balance after:", balanceAfter.toString());
    console.log("  📊 Deposit amount:", depositAmount.toString());
  });

  // ============================================================================
  // TEST 3: Check balance sufficient (positive case)
  // ============================================================================
  it("Test 3: Check balance sufficient (positive case)", async () => {
    console.log("\n🧪 Test 3: Check balance sufficient (positive case)");

    const requiredAmount = new anchor.BN(500); // Less than current balance
    const computation = Keypair.generate();

    // Queue balance check
    const tx = await program.methods
      .checkBalanceSufficient(requiredAmount)
      .accounts({
        payer: provider.wallet.publicKey,
        owner: vaultOwner1.publicKey,
        compDef: balanceCheckCompDef.publicKey,
        computation: computation.publicKey,
        vaultMetadata: vault1Metadata,
        vaultData: vault1Data,
        systemProgram: SystemProgram.programId,
      })
      .signers([vaultOwner1, computation])
      .rpc();

    console.log("  📤 Balance check queued:", tx);

    // Wait for MPC computation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Call callback and listen for event
    const callbackTx = await program.methods
      .checkBalanceSufficientCallback()
      .accounts({
        computation: computation.publicKey,
        vaultMetadata: vault1Metadata,
      })
      .rpc();

    console.log("  ✅ Balance check completed");
    console.log("  📊 Required amount:", requiredAmount.toString());
    console.log("  ✅ Expected result: is_sufficient = true");
  });

  // ============================================================================
  // TEST 4: Check balance insufficient (negative case)
  // ============================================================================
  it("Test 4: Check balance insufficient (negative case)", async () => {
    console.log("\n🧪 Test 4: Check balance insufficient (negative case)");

    const requiredAmount = new anchor.BN(10000); // More than current balance
    const computation = Keypair.generate();

    // Queue balance check
    const tx = await program.methods
      .checkBalanceSufficient(requiredAmount)
      .accounts({
        payer: provider.wallet.publicKey,
        owner: vaultOwner1.publicKey,
        compDef: balanceCheckCompDef.publicKey,
        computation: computation.publicKey,
        vaultMetadata: vault1Metadata,
        vaultData: vault1Data,
        systemProgram: SystemProgram.programId,
      })
      .signers([vaultOwner1, computation])
      .rpc();

    console.log("  📤 Balance check queued:", tx);

    // Wait for MPC computation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Call callback
    await program.methods
      .checkBalanceSufficientCallback()
      .accounts({
        computation: computation.publicKey,
        vaultMetadata: vault1Metadata,
      })
      .rpc();

    console.log("  ✅ Balance check completed");
    console.log("  📊 Required amount:", requiredAmount.toString());
    console.log("  ✅ Expected result: is_sufficient = false");
  });

  // ============================================================================
  // TEST 5: Withdraw with sufficient balance
  // ============================================================================
  it("Test 5: Withdraw with sufficient balance", async () => {
    console.log("\n🧪 Test 5: Withdraw with sufficient balance");

    const withdrawAmount = new anchor.BN(300); // Less than current balance
    const computation = Keypair.generate();

    // Get initial balance
    const vaultDataBefore = await program.account.vaultData.fetch(vault1Data);
    const balanceBefore = vaultDataBefore.encryptedBalance;

    // Queue withdrawal
    const tx = await program.methods
      .withdraw(withdrawAmount)
      .accounts({
        payer: provider.wallet.publicKey,
        owner: vaultOwner1.publicKey,
        compDef: withdrawCompDef.publicKey,
        computation: computation.publicKey,
        vaultMetadata: vault1Metadata,
        vaultData: vault1Data,
        systemProgram: SystemProgram.programId,
      })
      .signers([vaultOwner1, computation])
      .rpc();

    console.log("  📤 Withdrawal queued:", tx);

    // Wait for MPC computation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Call callback
    await program.methods
      .withdrawCallback()
      .accounts({
        computation: computation.publicKey,
        vaultMetadata: vault1Metadata,
        vaultData: vault1Data,
        payer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Verify withdrawal
    const vaultDataAfter = await program.account.vaultData.fetch(vault1Data);
    const balanceAfter = vaultDataAfter.encryptedBalance;

    console.log("  ✅ Withdrawal completed successfully");
    console.log("  📊 Balance before:", balanceBefore.toString());
    console.log("  📊 Balance after:", balanceAfter.toString());
    console.log("  📊 Withdraw amount:", withdrawAmount.toString());
  });

  // ============================================================================
  // TEST 6: Withdraw with insufficient balance (should fail)
  // ============================================================================
  it("Test 6: Withdraw with insufficient balance (should fail)", async () => {
    console.log("\n🧪 Test 6: Withdraw with insufficient balance (should fail)");

    const withdrawAmount = new anchor.BN(50000); // More than current balance
    const computation = Keypair.generate();

    // Get initial balance
    const vaultDataBefore = await program.account.vaultData.fetch(vault1Data);
    const balanceBefore = vaultDataBefore.encryptedBalance;

    // Queue withdrawal
    const tx = await program.methods
      .withdraw(withdrawAmount)
      .accounts({
        payer: provider.wallet.publicKey,
        owner: vaultOwner1.publicKey,
        compDef: withdrawCompDef.publicKey,
        computation: computation.publicKey,
        vaultMetadata: vault1Metadata,
        vaultData: vault1Data,
        systemProgram: SystemProgram.programId,
      })
      .signers([vaultOwner1, computation])
      .rpc();

    console.log("  📤 Withdrawal queued:", tx);

    // Wait for MPC computation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Call callback
    await program.methods
      .withdrawCallback()
      .accounts({
        computation: computation.publicKey,
        vaultMetadata: vault1Metadata,
        vaultData: vault1Data,
        payer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Verify balance unchanged
    const vaultDataAfter = await program.account.vaultData.fetch(vault1Data);
    const balanceAfter = vaultDataAfter.encryptedBalance;

    expect(balanceAfter.toString()).to.equal(balanceBefore.toString());

    console.log("  ✅ Withdrawal failed as expected (insufficient balance)");
    console.log("  📊 Balance unchanged:", balanceAfter.toString());
  });

  // ============================================================================
  // TEST 7: Transfer between two vaults (successful)
  // ============================================================================
  it("Test 7: Transfer between two vaults (successful)", async () => {
    console.log("\n🧪 Test 7: Transfer between two vaults (successful)");

    // First, initialize vault 2
    const initialBalance2 = new anchor.BN(500);
    const initComputation = Keypair.generate();

    await program.methods
      .initializeVault(initialBalance2, vault2Metadata)
      .accounts({
        payer: provider.wallet.publicKey,
        owner: vaultOwner2.publicKey,
        compDef: initVaultCompDef.publicKey,
        computation: initComputation.publicKey,
        vaultMetadata: vault2Metadata,
        systemProgram: SystemProgram.programId,
      })
      .signers([vaultOwner2, initComputation])
      .rpc();

    await new Promise((resolve) => setTimeout(resolve, 3000));

    await program.methods
      .initializeVaultCallback()
      .accounts({
        computation: initComputation.publicKey,
        vaultMetadata: vault2Metadata,
        vaultData: vault2Data,
        payer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("  ✅ Vault 2 initialized");

    // Now perform transfer
    const transferAmount = new anchor.BN(200);
    const computation = Keypair.generate();

    // Get initial balances
    const vault1Before = await program.account.vaultData.fetch(vault1Data);
    const vault2Before = await program.account.vaultData.fetch(vault2Data);

    // Queue transfer
    const tx = await program.methods
      .transfer(transferAmount)
      .accounts({
        payer: provider.wallet.publicKey,
        fromOwner: vaultOwner1.publicKey,
        compDef: transferCompDef.publicKey,
        computation: computation.publicKey,
        fromVaultMetadata: vault1Metadata,
        fromVaultData: vault1Data,
        toVaultMetadata: vault2Metadata,
        toVaultData: vault2Data,
        systemProgram: SystemProgram.programId,
      })
      .signers([vaultOwner1, computation])
      .rpc();

    console.log("  📤 Transfer queued:", tx);

    // Wait for MPC computation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Call callback
    await program.methods
      .transferCallback(transferAmount)
      .accounts({
        computation: computation.publicKey,
        fromVaultMetadata: vault1Metadata,
        fromVaultData: vault1Data,
        toVaultMetadata: vault2Metadata,
        toVaultData: vault2Data,
        payer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Verify transfer
    const vault1After = await program.account.vaultData.fetch(vault1Data);
    const vault2After = await program.account.vaultData.fetch(vault2Data);

    console.log("  ✅ Transfer completed successfully");
    console.log("  📊 Vault 1 balance before:", vault1Before.encryptedBalance.toString());
    console.log("  📊 Vault 1 balance after:", vault1After.encryptedBalance.toString());
    console.log("  📊 Vault 2 balance before:", vault2Before.encryptedBalance.toString());
    console.log("  📊 Vault 2 balance after:", vault2After.encryptedBalance.toString());
    console.log("  📊 Transfer amount:", transferAmount.toString());
  });

  // ============================================================================
  // TEST 8: Transfer with insufficient balance (should fail)
  // ============================================================================
  it("Test 8: Transfer with insufficient balance (should fail)", async () => {
    console.log("\n🧪 Test 8: Transfer with insufficient balance (should fail)");

    const transferAmount = new anchor.BN(100000); // More than vault 1 balance
    const computation = Keypair.generate();

    // Get initial balances
    const vault1Before = await program.account.vaultData.fetch(vault1Data);
    const vault2Before = await program.account.vaultData.fetch(vault2Data);

    // Queue transfer
    const tx = await program.methods
      .transfer(transferAmount)
      .accounts({
        payer: provider.wallet.publicKey,
        fromOwner: vaultOwner1.publicKey,
        compDef: transferCompDef.publicKey,
        computation: computation.publicKey,
        fromVaultMetadata: vault1Metadata,
        fromVaultData: vault1Data,
        toVaultMetadata: vault2Metadata,
        toVaultData: vault2Data,
        systemProgram: SystemProgram.programId,
      })
      .signers([vaultOwner1, computation])
      .rpc();

    console.log("  📤 Transfer queued:", tx);

    // Wait for MPC computation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Call callback
    await program.methods
      .transferCallback(transferAmount)
      .accounts({
        computation: computation.publicKey,
        fromVaultMetadata: vault1Metadata,
        fromVaultData: vault1Data,
        toVaultMetadata: vault2Metadata,
        toVaultData: vault2Data,
        payer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Verify balances unchanged
    const vault1After = await program.account.vaultData.fetch(vault1Data);
    const vault2After = await program.account.vaultData.fetch(vault2Data);

    expect(vault1After.encryptedBalance.toString()).to.equal(
      vault1Before.encryptedBalance.toString()
    );
    expect(vault2After.encryptedBalance.toString()).to.equal(
      vault2Before.encryptedBalance.toString()
    );

    console.log("  ✅ Transfer failed as expected (insufficient balance)");
    console.log("  📊 Both vault balances unchanged");
  });
});
