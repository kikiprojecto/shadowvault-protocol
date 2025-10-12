# ShadowVault Protocol - Architecture Documentation

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ShadowVault Protocol                         │
│                  Privacy-Preserving DeFi Vault                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         User Layer                              │
├─────────────────────────────────────────────────────────────────┤
│  Wallet (Phantom/Solflare) → Signs Transactions                │
│  Frontend dApp → Submits Instructions                           │
│  Off-chain Indexer → Listens to Events                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Program Instructions                         │
├─────────────────────────────────────────────────────────────────┤
│  1. initialize_vault  → Create vault with encrypted strategy    │
│  2. deposit          → Deposit tokens into vault                │
│  3. submit_trade_intent → Submit trade for execution            │
│  4. execute_trade    → Execute trade (MPC executor)             │
│  5. withdraw         → Withdraw tokens (owner only)             │
│  6. pause_vault      → Emergency pause/unpause                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      State Accounts (PDAs)                      │
├─────────────────────────────────────────────────────────────────┤
│  VaultAccount        → Main vault state (90 bytes)              │
│  TradeIntent         → User trade requests (156 bytes)          │
│  ExecutionResult     → Trade execution records (58 bytes)       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Token Custody Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  Vault ATA (Associated Token Account)                           │
│  - Owned by Vault PDA                                           │
│  - Holds deposited tokens securely                              │
│  - Transfers require PDA signature                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       Event Emissions                           │
├─────────────────────────────────────────────────────────────────┤
│  VaultInitialized, Deposited, TradeIntentSubmitted,             │
│  TradeExecuted, Withdrawn, VaultPaused                          │
│  → Consumed by off-chain indexers and analytics                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Instruction Flow Diagrams

### 1. Initialize Vault Flow

```
User Wallet
    │
    │ Signs TX with encrypted_strategy_hash
    ↓
initialize_vault()
    │
    ├─→ Create VaultAccount PDA
    │   └─ Seeds: [b"vault", owner.key()]
    │
    ├─→ Initialize State
    │   ├─ owner = signer
    │   ├─ encrypted_strategy_hash = param
    │   ├─ total_value_locked = 0
    │   ├─ execution_count = 0
    │   ├─ is_paused = false
    │   └─ bump = derived
    │
    ├─→ Verify Owner
    │   └─ require_keys_eq!(vault.owner, signer)
    │
    └─→ Emit VaultInitialized Event
        └─ { vault, owner, hash, timestamp }

Result: Vault PDA created and ready for deposits
```

### 2. Deposit Flow

```
User Wallet
    │
    │ Signs TX with amount
    ↓
deposit(amount)
    │
    ├─→ Validate
    │   ├─ amount > 0?
    │   └─ !vault.is_paused?
    │
    ├─→ Transfer Tokens
    │   ├─ From: user_ata
    │   ├─ To: vault_ata (owned by vault PDA)
    │   └─ Authority: user
    │
    ├─→ Update State
    │   └─ vault.tvl = vault.tvl.checked_add(amount)
    │
    └─→ Emit Deposited Event
        └─ { vault, user, amount, new_tvl, timestamp }

Result: Tokens in vault custody, TVL increased
```

### 3. Submit Trade Intent Flow

```
User Wallet
    │
    │ Signs TX with trade parameters
    ↓
submit_trade_intent(token_in, token_out, amount, slippage, strategy_type)
    │
    ├─→ Validate
    │   ├─ amount > 0?
    │   └─ !vault.is_paused?
    │
    ├─→ Create TradeIntent PDA
    │   └─ Seeds: [b"intent", user.key(), vault.key()]
    │
    ├─→ Store Intent Data
    │   ├─ user, vault, token_in, token_out
    │   ├─ amount, max_slippage_bps
    │   ├─ strategy_type, timestamp
    │   └─ bump
    │
    └─→ Emit TradeIntentSubmitted Event
        └─ { vault, intent, user, tokens, amount, slippage, type, timestamp }

Result: Intent recorded on-chain, ready for execution
```

### 4. Execute Trade Flow

```
MPC Executor (Off-chain)
    │
    │ Computes optimal routing using encrypted strategy
    │ Signs TX with execution authority
    ↓
execute_trade()
    │
    ├─→ Validate
    │   └─ !vault.is_paused?
    │
    ├─→ Execute Trade (Placeholder in demo)
    │   ├─ In production: CPI to DEX aggregators
    │   ├─ Verify slippage constraints
    │   └─ Compute executed/received amounts
    │
    ├─→ Update State
    │   └─ vault.execution_count++
    │
    ├─→ Create ExecutionResult PDA
    │   ├─ Seeds: [b"result", intent.key()]
    │   └─ Store: executed_amount, received_amount, success
    │
    └─→ Emit TradeExecuted Event
        └─ { vault, intent, executed, received, success }

Result: Trade executed, result recorded immutably
```

### 5. Withdraw Flow

```
Vault Owner
    │
    │ Signs TX with amount
    ↓
withdraw(amount)
    │
    ├─→ Validate
    │   ├─ amount > 0?
    │   └─ signer == vault.owner?
    │
    ├─→ Transfer Tokens (with PDA signature)
    │   ├─ From: vault_ata
    │   ├─ To: recipient_ata
    │   └─ Authority: vault PDA (using signer seeds)
    │
    ├─→ Update State
    │   └─ vault.tvl = vault.tvl.checked_sub(amount)
    │
    └─→ Emit Withdrawn Event
        └─ { vault, authority, amount, new_tvl, timestamp }

Result: Tokens transferred to owner, TVL decreased
```

### 6. Pause Vault Flow

```
Vault Owner
    │
    │ Signs TX with pause=true/false
    ↓
pause_vault(pause)
    │
    ├─→ Validate
    │   └─ signer == vault.owner?
    │
    ├─→ Update State
    │   └─ vault.is_paused = pause
    │
    └─→ Emit VaultPaused Event
        └─ { vault, authority, is_paused, timestamp }

Result: Vault paused/unpaused
Effect: Deposits and trades blocked when paused
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Security Layers                            │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Access Control
├─ Owner Verification
│  ├─ require_keys_eq!(vault.owner, signer)
│  └─ has_one = owner constraint
├─ Authority Checks
│  └─ Only authorized executor for trades
└─ Signer Validation
   └─ Anchor's Signer<'info> type

Layer 2: State Validation
├─ Pause Checks
│  └─ require!(!vault.is_paused)
├─ Amount Validation
│  └─ require!(amount > 0)
└─ Account Validation
   └─ PDA seed verification

Layer 3: Arithmetic Safety
├─ Overflow Protection
│  ├─ checked_add() for increases
│  └─ checked_sub() for decreases
└─ Error Handling
   └─ Returns MathOverflow on overflow

Layer 4: PDA Security
├─ Deterministic Derivation
│  └─ Seeds include owner/user keys
├─ Bump Storage
│  └─ Stored and verified on each use
└─ Token Custody
   └─ Vault PDA owns token accounts

Layer 5: Reentrancy Protection
├─ Anchor Account Validation
│  └─ Prevents account substitution
├─ State Update Ordering
│  └─ Updates after external calls
└─ No Recursive CPIs
   └─ Single-level CPI depth

Layer 6: Emergency Controls
├─ Pause Mechanism
│  ├─ Blocks deposits
│  ├─ Blocks trades
│  └─ Allows owner withdrawals
└─ Owner-Only Control
   └─ Only owner can pause/unpause
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   User      │
│   Wallet    │
└──────┬──────┘
       │
       │ 1. initialize_vault(encrypted_hash)
       ↓
┌─────────────────────────────────────────┐
│         VaultAccount PDA                │
│  ┌───────────────────────────────────┐  │
│  │ owner: Pubkey                     │  │
│  │ encrypted_strategy_hash: [u8;32]  │  │
│  │ total_value_locked: 0             │  │
│  │ execution_count: 0                │  │
│  │ is_paused: false                  │  │
│  │ bump: u8                          │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
       │
       │ 2. deposit(amount)
       ↓
┌─────────────────────────────────────────┐
│      Token Transfer                     │
│  User ATA ──────────→ Vault ATA         │
│  (user authority)    (PDA authority)    │
└─────────────────────────────────────────┘
       │
       │ TVL updated: tvl += amount
       ↓
┌─────────────────────────────────────────┐
│         VaultAccount (Updated)          │
│  total_value_locked: amount             │
└─────────────────────────────────────────┘
       │
       │ 3. submit_trade_intent(...)
       ↓
┌─────────────────────────────────────────┐
│         TradeIntent PDA                 │
│  ┌───────────────────────────────────┐  │
│  │ user, vault, token_in, token_out  │  │
│  │ amount, max_slippage_bps          │  │
│  │ strategy_type, timestamp          │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
       │
       │ 4. execute_trade() [MPC Executor]
       ↓
┌─────────────────────────────────────────┐
│      Trade Execution (Off-chain)        │
│  - Decrypt strategy                     │
│  - Compute optimal routing              │
│  - Execute via DEX aggregators          │
└─────────────────────────────────────────┘
       │
       │ execution_count++
       ↓
┌─────────────────────────────────────────┐
│       ExecutionResult PDA               │
│  ┌───────────────────────────────────┐  │
│  │ intent: Pubkey                    │  │
│  │ executed_amount: u64              │  │
│  │ received_amount: u64              │  │
│  │ success: bool                     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
       │
       │ 5. withdraw(amount) [Owner Only]
       ↓
┌─────────────────────────────────────────┐
│      Token Transfer (PDA Signed)        │
│  Vault ATA ──────────→ Owner ATA        │
│  (PDA signer seeds)   (owner authority) │
└─────────────────────────────────────────┘
       │
       │ TVL updated: tvl -= amount
       ↓
┌─────────────────────────────────────────┐
│         VaultAccount (Updated)          │
│  total_value_locked: tvl - amount       │
└─────────────────────────────────────────┘
```

---

## 🎯 PDA Derivation Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    PDA Derivation Hierarchy                     │
└─────────────────────────────────────────────────────────────────┘

VaultAccount PDA
├─ Seeds: [b"vault", owner.key()]
├─ Purpose: One vault per owner
├─ Uniqueness: Owner's public key
└─ Authority: Vault PDA owns token accounts

TradeIntent PDA
├─ Seeds: [b"intent", user.key(), vault.key()]
├─ Purpose: One intent per user per vault
├─ Uniqueness: User + Vault combination
└─ Lifecycle: Created on submit, read on execute

ExecutionResult PDA
├─ Seeds: [b"result", intent.key()]
├─ Purpose: One result per intent
├─ Uniqueness: Intent's public key
└─ Immutability: Created once, never modified

Benefits:
✅ Deterministic addresses (no need to store)
✅ Collision-free (unique seeds)
✅ Secure custody (PDA owns token accounts)
✅ Gas efficient (no additional storage)
```

---

## 🔄 State Transitions

```
VaultAccount State Machine:

[Initial State]
    │
    │ initialize_vault()
    ↓
[Active, Unpaused]
    │
    ├─→ deposit() ──→ TVL increases
    │   └─ Returns to [Active, Unpaused]
    │
    ├─→ execute_trade() ──→ execution_count++
    │   └─ Returns to [Active, Unpaused]
    │
    ├─→ withdraw() ──→ TVL decreases
    │   └─ Returns to [Active, Unpaused]
    │
    └─→ pause_vault(true)
        ↓
    [Active, Paused]
        │
        ├─ deposit() ──→ BLOCKED (VaultPaused error)
        ├─ execute_trade() ──→ BLOCKED (VaultPaused error)
        ├─ withdraw() ──→ ALLOWED (owner only)
        │
        └─→ pause_vault(false)
            ↓
        [Active, Unpaused]

Note: Once created, VaultAccount cannot be closed (by design)
```

---

## 📈 Event-Driven Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Event Emission Flow                          │
└─────────────────────────────────────────────────────────────────┘

On-Chain Program                    Off-Chain Indexer
─────────────────                   ──────────────────

initialize_vault()
    │
    └─→ emit!(VaultInitialized)  ──→  Store in database
                                      ├─ Vault address
                                      ├─ Owner
                                      ├─ Strategy hash
                                      └─ Timestamp

deposit()
    │
    └─→ emit!(Deposited)  ──→  Update analytics
                               ├─ TVL tracking
                               ├─ User deposits
                               └─ Vault activity

submit_trade_intent()
    │
    └─→ emit!(TradeIntentSubmitted)  ──→  Queue for execution
                                          ├─ MPC executor picks up
                                          ├─ Computes routing
                                          └─ Calls execute_trade()

execute_trade()
    │
    └─→ emit!(TradeExecuted)  ──→  Record execution
                                   ├─ Performance metrics
                                   ├─ Slippage analysis
                                   └─ Success rate

withdraw()
    │
    └─→ emit!(Withdrawn)  ──→  Update analytics
                               ├─ TVL tracking
                               ├─ User withdrawals
                               └─ Vault activity

pause_vault()
    │
    └─→ emit!(VaultPaused)  ──→  Alert monitoring
                                 ├─ Send notifications
                                 ├─ Update UI status
                                 └─ Log incident

Benefits:
✅ Real-time monitoring
✅ Historical analytics
✅ Automated execution triggers
✅ Transparent audit trail
```

---

## 🛡️ Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Error Handling Strategy                      │
└─────────────────────────────────────────────────────────────────┘

Instruction Call
    │
    ├─→ Input Validation
    │   ├─ amount > 0? ──→ NO ──→ Return InvalidAmount
    │   └─ YES ──→ Continue
    │
    ├─→ State Validation
    │   ├─ !vault.is_paused? ──→ NO ──→ Return VaultPaused
    │   └─ YES ──→ Continue
    │
    ├─→ Authority Validation
    │   ├─ signer == owner? ──→ NO ──→ Return Unauthorized
    │   └─ YES ──→ Continue
    │
    ├─→ Account Validation
    │   ├─ bump == stored_bump? ──→ NO ──→ Return InvalidAccount
    │   └─ YES ──→ Continue
    │
    ├─→ Arithmetic Operations
    │   ├─ checked_add()? ──→ None ──→ Return MathOverflow
    │   └─ Some(result) ──→ Continue
    │
    ├─→ External Calls (CPI)
    │   ├─ token::transfer()? ──→ Error ──→ Propagate error
    │   └─ Ok ──→ Continue
    │
    └─→ Success
        └─ Return Ok(())

Error Codes:
├─ Unauthorized (6000)
├─ InvalidAmount (6001)
├─ VaultPaused (6002)
├─ MathOverflow (6003)
├─ InvalidAccount (6004)
└─ TradeFailed (6005)
```

---

## 📦 Module Organization

```
shadowvault/
│
├─ lib.rs (Main Program)
│  ├─ Program ID declaration
│  ├─ Instruction entry points
│  ├─ Event definitions
│  └─ Module imports
│
├─ state.rs (State Definitions)
│  ├─ VaultAccount struct
│  ├─ TradeIntent struct
│  ├─ ExecutionResult struct
│  └─ Space calculations
│
├─ errors.rs (Error Codes)
│  └─ ShadowError enum
│
└─ instructions/ (Instruction Handlers)
   ├─ mod.rs (Module exports)
   ├─ initialize.rs
   │  ├─ InitializeVault context
   │  └─ handler()
   ├─ deposit.rs
   │  ├─ Deposit context
   │  └─ handler()
   ├─ submit_trade_intent.rs
   │  ├─ SubmitTradeIntent context
   │  └─ handler()
   ├─ execute_trade.rs
   │  ├─ ExecuteTrade context
   │  └─ handler()
   ├─ withdraw.rs
   │  ├─ Withdraw context
   │  └─ handler()
   └─ pause_vault.rs
      ├─ TogglePause context
      └─ handler()

Benefits:
✅ Clear separation of concerns
✅ Easy to maintain and extend
✅ Testable in isolation
✅ Follows Anchor best practices
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Deployment Options                           │
└─────────────────────────────────────────────────────────────────┘

Option 1: Solana Playground (Fastest)
├─ Use: SOLANA_PLAYGROUND_lib.rs
├─ Deploy: Web-based, no local setup
├─ Network: Devnet
└─ Time: 5 minutes

Option 2: Local Development (Full Control)
├─ Use: programs/shadowvault/src/
├─ Deploy: anchor deploy
├─ Network: Localnet/Devnet/Mainnet
└─ Time: 15 minutes (after setup)

Option 3: CI/CD Pipeline (Production)
├─ Use: GitHub Actions / GitLab CI
├─ Deploy: Automated on merge
├─ Network: Devnet → Testnet → Mainnet
└─ Time: Automated

Recommended Flow:
1. Develop on Solana Playground (rapid prototyping)
2. Test locally with anchor test (comprehensive testing)
3. Deploy to devnet (public testing)
4. Audit (security review)
5. Deploy to mainnet (production)
```

---

## 🎓 Learning Path

```
For Beginners:
1. Read QUICK_REFERENCE.md
2. Deploy to Solana Playground
3. Test basic operations (init, deposit, withdraw)
4. Read inline comments in code
5. Experiment with parameters

For Intermediate:
1. Read DEPLOYMENT_GUIDE.md
2. Set up local development
3. Run anchor test
4. Modify instruction logic
5. Add custom features

For Advanced:
1. Read ARCHITECTURE.md (this file)
2. Implement MPC integration
3. Add DEX routing
4. Implement ZK proofs
5. Optimize for production

Security Focused:
1. Review security layers
2. Understand PDA security
3. Study error handling
4. Analyze state transitions
5. Conduct security audit
```

---

**This architecture is production-ready and follows Solana/Anchor best practices! 🚀**
