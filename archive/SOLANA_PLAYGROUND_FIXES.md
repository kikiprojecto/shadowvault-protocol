# 🔧 Solana Playground - Error Fixes & Troubleshooting

## ❌ Error: "Cannot read properties of undefined (reading 'publicKey')"

### Root Cause
The error occurs when `pg.wallet.publicKey` is undefined because:
1. Wallet is not connected in Solana Playground
2. Using wrong wallet access pattern
3. Playground globals not loaded

### ✅ Solution

**Step 1: Connect Your Wallet**
1. Click "Connect" button in top-right of Solana Playground
2. Select your wallet (Phantom, Solflare, etc.)
3. Approve the connection
4. Wait for "Connected" status

**Step 2: Use Correct Client Code**

Replace your `client.ts` with this fixed version:

```typescript
// Fixed client.ts for Solana Playground
const anchor = require("@coral-xyz/anchor");

const main = async () => {
  console.log("🛡️ ShadowVault Protocol Client\n");

  // ✅ FIX 1: Check wallet connection first
  if (!pg.wallet || !pg.wallet.publicKey) {
    throw new Error(
      "❌ WALLET NOT CONNECTED!\n" +
      "Please click 'Connect' in the top-right corner of Solana Playground."
    );
  }

  const wallet = pg.wallet;
  const connection = pg.connection;
  
  console.log("✅ Wallet:", wallet.publicKey.toString());
  console.log("✅ Cluster:", connection.rpcEndpoint);
  
  // ✅ FIX 2: Check balance
  const balance = await connection.getBalance(wallet.publicKey);
  console.log("💰 Balance:", balance / web3.LAMPORTS_PER_SOL, "SOL\n");
  
  if (balance < 0.1 * web3.LAMPORTS_PER_SOL) {
    console.log("⚠️  Low balance! Get SOL from:");
    console.log("   https://faucet.solana.com\n");
    return; // Exit if no balance
  }

  // ✅ FIX 3: Get program safely
  const programId = pg.PROGRAM_ID;
  console.log("📋 Program:", programId.toString());
  
  // ✅ FIX 4: Create provider with proper config
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    { commitment: "confirmed", preflightCommitment: "confirmed" }
  );
  
  // ✅ FIX 5: Load IDL safely
  let program;
  try {
    const idl = await anchor.Program.fetchIdl(programId, provider);
    program = new anchor.Program(idl, programId, provider);
    console.log("✅ Program loaded\n");
  } catch (error) {
    console.error("❌ Failed to load program. Make sure it's deployed!");
    throw error;
  }

  // ✅ FIX 6: Derive vault PDA
  const [vaultPDA, bump] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), wallet.publicKey.toBuffer()],
    programId
  );
  
  console.log("🔑 Vault PDA:", vaultPDA.toString(), "\n");

  // ✅ FIX 7: Initialize vault with error handling
  try {
    const hash = Array.from(new Uint8Array(32).fill(1));
    
    const tx = await program.methods
      .initializeVault(hash)
      .accounts({
        payer: wallet.publicKey,
        owner: wallet.publicKey,
        vault: vaultPDA,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
    
    console.log("✅ Vault initialized!");
    console.log("   TX:", tx);
    console.log("   Explorer:", `https://explorer.solana.com/tx/${tx}?cluster=devnet\n`);
    
  } catch (error) {
    if (error.message.includes("already in use")) {
      console.log("ℹ️  Vault already exists (this is OK)\n");
    } else {
      console.error("❌ Error:", error.message);
      throw error;
    }
  }

  // ✅ FIX 8: Fetch and display vault
  try {
    const vault = await program.account.vaultAccount.fetch(vaultPDA);
    console.log("📊 Vault State:");
    console.log("   Owner:", vault.owner.toString());
    console.log("   TVL:", vault.totalValueLocked.toString());
    console.log("   Executions:", vault.executionCount.toString());
    console.log("   Paused:", vault.isPaused);
    console.log("\n✅ Success!");
  } catch (error) {
    console.error("❌ Failed to fetch vault:", error.message);
  }
};

// Run with error handling
main().catch(console.error);
```

---

## 🔍 Common Errors & Fixes

### Error 1: "Wallet not connected"
**Fix**: Click "Connect" button in Solana Playground UI

### Error 2: "Insufficient funds"
**Fix**: 
```bash
# Get devnet SOL
Visit: https://faucet.solana.com
Enter your wallet address
Request 2 SOL
```

### Error 3: "Program not found"
**Fix**: Make sure you've deployed the program first
```bash
1. Click "Build" button (🔨)
2. Wait for build to complete
3. Click "Deploy" button
4. Confirm transaction
5. Wait for deployment
```

### Error 4: "Account already in use"
**Fix**: Vault already exists - this is OK! Just fetch it instead:
```typescript
const vault = await program.account.vaultAccount.fetch(vaultPDA);
```

### Error 5: "Invalid account data"
**Fix**: Program might not match deployed version
```bash
1. Rebuild: Click "Build"
2. Redeploy: Click "Deploy"
3. Refresh page
4. Run client again
```

---

## 📝 Step-by-Step Deployment Guide

### Step 1: Prepare Smart Contract
1. Open Solana Playground: https://beta.solpg.io
2. Create new project: "Create a new project" → "Anchor (Rust)"
3. Name it: "shadowvault"

### Step 2: Paste Smart Contract
1. Open `src/lib.rs` in Playground
2. Delete all existing code
3. Copy entire content from `SOLANA_PLAYGROUND_lib.rs`
4. Paste into Playground
5. Save (Ctrl+S)

### Step 3: Update Program ID
1. Click "Build" button (🔨)
2. After build completes, look for program ID in output
3. Copy the program ID
4. Replace in line 41 of lib.rs:
   ```rust
   declare_id!("YOUR_PROGRAM_ID_HERE");
   ```
5. Save and rebuild

### Step 4: Deploy
1. Connect wallet (top-right)
2. Ensure you have 2+ SOL on devnet
3. Click "Deploy" button
4. Confirm transaction in wallet
5. Wait for "Deployed successfully" message

### Step 5: Create Client
1. Create new file: `client.ts`
2. Paste the fixed client code from above
3. Save

### Step 6: Run Client
1. Click "Run" button next to client.ts
2. Check console output
3. Should see: "✅ Success!"

---

## 🎯 Quick Test Script

Use this minimal test to verify everything works:

```typescript
// minimal-test.ts
const test = async () => {
  // Check 1: Wallet
  if (!pg.wallet?.publicKey) {
    console.log("❌ Connect wallet first!");
    return;
  }
  console.log("✅ Wallet:", pg.wallet.publicKey.toString());
  
  // Check 2: Balance
  const bal = await pg.connection.getBalance(pg.wallet.publicKey);
  console.log("✅ Balance:", bal / 1e9, "SOL");
  
  // Check 3: Program
  console.log("✅ Program:", pg.PROGRAM_ID.toString());
  
  // Check 4: PDA
  const [pda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), pg.wallet.publicKey.toBuffer()],
    pg.PROGRAM_ID
  );
  console.log("✅ Vault PDA:", pda.toString());
  
  console.log("\n🎉 All checks passed!");
};

test().catch(console.error);
```

---

## 🐛 Debug Checklist

Before running client, verify:

- [ ] Wallet is connected (green dot in UI)
- [ ] Balance > 0.1 SOL
- [ ] Program is deployed (check "Deploy" tab)
- [ ] Program ID matches in lib.rs
- [ ] Build completed successfully
- [ ] No TypeScript errors in client.ts
- [ ] Using correct cluster (devnet)

---

## 💡 Pro Tips

### Tip 1: Always Check Wallet First
```typescript
if (!pg.wallet?.publicKey) {
  throw new Error("Connect wallet first!");
}
```

### Tip 2: Use Try-Catch for All Transactions
```typescript
try {
  const tx = await program.methods.initializeVault(...).rpc();
  console.log("Success:", tx);
} catch (error) {
  console.error("Error:", error.message);
}
```

### Tip 3: Check Account Existence
```typescript
try {
  const account = await program.account.vaultAccount.fetch(pda);
  console.log("Account exists");
} catch {
  console.log("Account doesn't exist");
}
```

### Tip 4: Use Explorer Links
```typescript
console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
```

---

## 🔗 Useful Links

- **Solana Playground**: https://beta.solpg.io
- **Devnet Faucet**: https://faucet.solana.com
- **Explorer**: https://explorer.solana.com/?cluster=devnet
- **Anchor Docs**: https://www.anchor-lang.com/

---

## ✅ Success Indicators

You'll know it's working when you see:
```
✅ Wallet: <your-address>
✅ Balance: 2.0 SOL
✅ Program: <program-id>
✅ Program loaded
✅ Vault initialized!
✅ Success!
```

---

## 🆘 Still Having Issues?

1. **Refresh the page** - Solana Playground can get stuck
2. **Disconnect and reconnect wallet**
3. **Clear browser cache**
4. **Try different browser** (Chrome recommended)
5. **Check Solana status**: https://status.solana.com

---

**Last Updated**: 2025-10-09
**Tested On**: Solana Playground (beta.solpg.io)
**Anchor Version**: 0.29.0
