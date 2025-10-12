# Architecture

## Components
- Frontend (Next.js): UI, wallet, encryption, Arcium client
- Arcium MPC: Encrypted routing computation
- Solana Program (Anchor): Vault, intents, execution, events
- DEX CPIs: Jupiter/Raydium/Orca swap adapters (future work)

## Data Flow
```
+---------+      +--------------------+      +---------------------+      +-------------+
|  User   | ---> |  Frontend (Encrypt)| ---> |  Arcium MPC Network | ---> |  Program    |
+---------+      +--------------------+      +---------------------+      +-------------+
       ^                   |                               |                        |
       |                   v                               v                        v
       |             +-----------+                   +-----------+              +--------+
       |             |  Decrypt  |<------------------|  Results  |<-------------|  DEXes |
       |             +-----------+                   +-----------+              +--------+
```

## Accounts
- `VaultAccount`: owner, encrypted_strategy_hash, tvl, execution_count, is_paused, bump
- `TradeIntent`: user, vault, token_in/out, amount, max_slippage_bps, strategy_type, timestamp, bump
- `ExecutionResult`: intent, executed_amount, received_amount, success, bump

## PDAs
- Vault: seeds [`"vault"`, owner]
- Intent: seeds [`"intent"`, user, vault]
- Result: seeds [`"result"`, intent]

## Security
- Owner-only controls (pause, withdraw) with PDA checks
- Strict input validation and overflow checks
- No sensitive data on-chain; only commitments and minimal metadata
- Client-side key material; never persisted
