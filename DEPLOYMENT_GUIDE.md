# ShadowVault Protocol - Complete Deployment Guide

## 📋 Overview

**ShadowVault Protocol** is a privacy-preserving DeFi vault on Solana that enables encrypted trading strategies with MEV protection through intent-based execution.

### Key Features

✅ **VaultAccount State** - Complete implementation with:
- `owner: Pubkey` - Vault owner with full control
- `encrypted_strategy_hash: [u8; 32]` - Encrypted strategy commitment
- `total_value_locked: u64` - TVL tracking
- `execution_count: u64` - Trade execution counter
- `is_paused: bool` - Emergency pause flag
- `bump: u8` - PDA bump seed

✅ **All 5 Instructions Implemented**:
1. `initialize_vault` - Create new vault with PDA
2. `deposit` - Deposit SPL tokens into vault
3. `execute_trade` - Execute trade with encrypted parameters
4. `withdraw` - Withdraw from vault (owner only)
5. `pause_vault` - Emergency pause/unpause

✅ **Security Features**:
- PDA-based custody for secure asset management
- Owner verification on all sensitive operations
- Reentrancy protection via Anchor's account validation
- Overflow-safe arithmetic with checked operations
- Emergency pause mechanism

✅ **Event Emissions**:
- `VaultInitialized` - Vault creation
- `Deposited` - Token deposits
- `TradeIntentSubmitted` - Trade intent submission
- `TradeExecuted` - Trade execution
- `Withdrawn` - Token withdrawals
- `VaultPaused` - Pause state changes

✅ **Comprehensive Documentation**:
- Detailed inline comments for all functions
- Security considerations documented
- Architecture overview in header
- Error handling with custom error codes

---

## 🚀 Quick Start - Solana Playground

### Option 1: Single File Deployment (Recommended for Playground)

1. **Open Solana Playground**: https://beta.solpg.io

2. **Create New Project**:
   - Click "Create a new project"
   - Select "Anchor (Rust)"
   - Name it "shadowvault"

3. **Replace lib.rs**:
   - Open the generated `src/lib.rs`
   - Delete all content
   - Copy and paste the entire content from `SOLANA_PLAYGROUND_lib.rs`

4. **Update Anchor.toml**:
   ```toml
   [programs.localnet]
   shadowvault = "ShdwVlt1111111111111111111111111111111111111"

   [programs.devnet]
   shadowvault = "ShdwVlt1111111111111111111111111111111111111"

   [programs.mainnet]
   shadowvault = "ShdwVlt1111111111111111111111111111111111111"
   ```

5. **Build**:
   - Click the "Build" button (🔨)
   - Wait for compilation to complete
   - Fix any errors if they appear

6. **Deploy**:
   - Connect your wallet (Phantom/Solflare)
   - Ensure you have SOL on devnet (use faucet if needed)
   - Click "Deploy"
   - Confirm the transaction

7. **Test**:
   - Use the built-in test framework or
   - Create a client script to interact with your program

---

## 📁 File Structure

### Current Modular Structure
```
programs/shadowvault/src/
├── lib.rs                          # Main program entry (enhanced)
├── state.rs                        # State account definitions
├── errors.rs                       # Custom error codes
└── instructions/
    ├── mod.rs                      # Instruction module exports
    ├── initialize.rs               # Initialize vault
    ├── deposit.rs                  # Deposit tokens
    ├── submit_trade_intent.rs      # Submit trade intent
    ├── execute_trade.rs            # Execute trade
    ├── withdraw.rs                 # Withdraw tokens
    └── pause_vault.rs              # Pause/unpause vault
```

### Standalone File (Solana Playground)
```
SOLANA_PLAYGROUND_lib.rs            # Complete single-file implementation
```

---

## 🔧 Local Development Setup

### Prerequisites
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.29.0
avm use 0.29.0
```

### Build and Deploy
```bash
# Clone repository
cd shadowvault-protocol

# Build
anchor build

# Get program ID
anchor keys list

# Update declare_id! in lib.rs with the program ID

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Run tests
anchor test
```

---

## 🔐 Security Considerations

### Implemented Security Features

1. **Owner-Only Operations**:
   - Withdraw: Only vault owner can withdraw funds
   - Pause: Only vault owner can pause/unpause
   - Verified with `require_keys_eq!` macros

2. **Reentrancy Protection**:
   - Anchor's account validation prevents reentrancy
   - State updates happen after external calls
   - PDA-based authority ensures secure token custody

3. **Overflow Protection**:
   - All arithmetic uses `checked_add()` and `checked_sub()`
   - Returns `MathOverflow` error on overflow
   - Prevents integer overflow exploits

4. **PDA Security**:
   - Vault accounts use PDA derivation
   - Bump seeds stored and verified
   - Seeds: `[b"vault", owner.key()]`

5. **Pause Mechanism**:
   - Emergency pause blocks deposits and trades
   - Withdrawals remain available to owner
   - Prevents further damage during incidents

### Production Recommendations

⚠️ **Before Mainnet Deployment**:

1. **Audit**: Get a professional security audit
2. **Testing**: Extensive testing on devnet/testnet
3. **MPC Integration**: Implement actual MPC network for trade execution
4. **DEX Integration**: Add real DEX routing (Jupiter/Raydium/Orca)
5. **ZK Proofs**: Implement zero-knowledge proof verification
6. **Rate Limiting**: Add rate limits on sensitive operations
7. **Multi-sig**: Consider multi-sig for owner operations
8. **Monitoring**: Set up real-time monitoring and alerts

---

## 📊 State Account Details

### VaultAccount (90 bytes)
```rust
pub struct VaultAccount {
    pub owner: Pubkey,                      // 32 bytes
    pub encrypted_strategy_hash: [u8; 32],  // 32 bytes
    pub total_value_locked: u64,            // 8 bytes
    pub execution_count: u64,               // 8 bytes
    pub is_paused: bool,                    // 1 byte
    pub bump: u8,                           // 1 byte
}
// + 8 bytes discriminator = 90 bytes total
```

### TradeIntent (156 bytes)
```rust
pub struct TradeIntent {
    pub user: Pubkey,              // 32 bytes
    pub vault: Pubkey,             // 32 bytes
    pub token_in: Pubkey,          // 32 bytes
    pub token_out: Pubkey,         // 32 bytes
    pub amount: u64,               // 8 bytes
    pub max_slippage_bps: u16,     // 2 bytes
    pub strategy_type: u8,         // 1 byte
    pub timestamp: i64,            // 8 bytes
    pub bump: u8,                  // 1 byte
}
// + 8 bytes discriminator = 156 bytes total
```

### ExecutionResult (58 bytes)
```rust
pub struct ExecutionResult {
    pub intent: Pubkey,            // 32 bytes
    pub executed_amount: u64,      // 8 bytes
    pub received_amount: u64,      // 8 bytes
    pub success: bool,             // 1 byte
    pub bump: u8,                  // 1 byte
}
// + 8 bytes discriminator = 58 bytes total
```

---

## 🎯 Instruction Usage Examples

### 1. Initialize Vault
```typescript
const encryptedStrategyHash = new Uint8Array(32).fill(1); // Your encrypted strategy

await program.methods
  .initializeVault(Array.from(encryptedStrategyHash))
  .accounts({
    payer: wallet.publicKey,
    owner: wallet.publicKey,
    vault: vaultPDA,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

### 2. Deposit Tokens
```typescript
await program.methods
  .deposit(new BN(1000000)) // 1 token (6 decimals)
  .accounts({
    user: wallet.publicKey,
    tokenMint: tokenMint,
    userAta: userATA,
    vault: vaultPDA,
    vaultAta: vaultATA,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

### 3. Submit Trade Intent
```typescript
await program.methods
  .submitTradeIntent(
    tokenInMint,
    tokenOutMint,
    new BN(1000000),  // amount
    100,              // 1% slippage
    0                 // strategy type
  )
  .accounts({
    user: wallet.publicKey,
    vault: vaultPDA,
    intent: intentPDA,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

### 4. Execute Trade
```typescript
await program.methods
  .executeTrade()
  .accounts({
    authority: executor.publicKey,
    vault: vaultPDA,
    intent: intentPDA,
    vaultTokenIn: vaultTokenInATA,
    vaultTokenOut: vaultTokenOutATA,
    result: resultPDA,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .signers([executor])
  .rpc();
```

### 5. Withdraw
```typescript
await program.methods
  .withdraw(new BN(500000))
  .accounts({
    authority: wallet.publicKey,
    tokenMint: tokenMint,
    vault: vaultPDA,
    owner: wallet.publicKey,
    vaultAta: vaultATA,
    recipientAta: recipientATA,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

### 6. Pause/Unpause Vault
```typescript
await program.methods
  .pauseVault(true) // true to pause, false to unpause
  .accounts({
    authority: wallet.publicKey,
    vault: vaultPDA,
  })
  .rpc();
```

---

## 🧪 Testing

### Unit Tests (Recommended)
Create `tests/shadowvault.ts`:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Shadowvault } from "../target/types/shadowvault";
import { expect } from "chai";

describe("shadowvault", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Shadowvault as Program<Shadowvault>;

  it("Initializes vault", async () => {
    const [vaultPDA] = await PublicKey.findProgramAddress(
      [Buffer.from("vault"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    const hash = new Uint8Array(32).fill(1);
    
    await program.methods
      .initializeVault(Array.from(hash))
      .accounts({
        payer: provider.wallet.publicKey,
        owner: provider.wallet.publicKey,
        vault: vaultPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const vault = await program.account.vaultAccount.fetch(vaultPDA);
    expect(vault.owner.toString()).to.equal(provider.wallet.publicKey.toString());
    expect(vault.totalValueLocked.toNumber()).to.equal(0);
    expect(vault.isPaused).to.be.false;
  });

  // Add more tests...
});
```

---

## 📈 Event Monitoring

### Listen to Events
```typescript
// Subscribe to all events
program.addEventListener("VaultInitialized", (event, slot) => {
  console.log("Vault initialized:", event.vault.toString());
  console.log("Owner:", event.owner.toString());
  console.log("Timestamp:", event.timestamp.toString());
});

program.addEventListener("Deposited", (event, slot) => {
  console.log("Deposit:", event.amount.toString());
  console.log("New TVL:", event.newTvl.toString());
});

program.addEventListener("TradeExecuted", (event, slot) => {
  console.log("Trade executed:", event.executedAmount.toString());
  console.log("Received:", event.receivedAmount.toString());
});
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Program ID mismatch"
**Solution**: Update `declare_id!` in lib.rs with your actual program ID from `anchor keys list`

### Issue 2: "Account not initialized"
**Solution**: Ensure you call `initialize_vault` before other operations

### Issue 3: "Unauthorized error"
**Solution**: Make sure the signer is the vault owner for withdraw/pause operations

### Issue 4: "Vault is paused"
**Solution**: Unpause the vault first: `pauseVault(false)`

### Issue 5: "Math overflow"
**Solution**: Check that amounts don't exceed u64::MAX and TVL calculations are valid

---

## 📚 Additional Resources

- **Anchor Documentation**: https://www.anchor-lang.com/
- **Solana Cookbook**: https://solanacookbook.com/
- **Solana Playground**: https://beta.solpg.io
- **SPL Token Program**: https://spl.solana.com/token

---

## ✅ Checklist for Deployment

- [ ] Copy `SOLANA_PLAYGROUND_lib.rs` content
- [ ] Paste into Solana Playground
- [ ] Update program ID in `declare_id!`
- [ ] Build successfully
- [ ] Deploy to devnet
- [ ] Test all 5 instructions
- [ ] Verify events are emitted
- [ ] Check state updates
- [ ] Test pause/unpause functionality
- [ ] Test error cases
- [ ] Document any custom modifications

---

## 🎉 Success Criteria

Your ShadowVault Protocol is ready when:

✅ All 5 instructions work correctly
✅ Events are emitted for all state changes
✅ Security checks pass (owner verification, pause checks)
✅ PDA derivation works correctly
✅ TVL updates accurately
✅ Emergency pause functions properly
✅ Comprehensive documentation is in place

---

## 📞 Support

For issues or questions:
1. Check the error codes in the program
2. Review the inline documentation
3. Test on devnet first
4. Use Solana Explorer to inspect transactions

---

**Version**: 1.0.0  
**Anchor Version**: 0.29.0  
**Solana Version**: Compatible with latest stable

**Ready to deploy to Solana Playground! 🚀**
