# 🛡️ ShadowVault Protocol

<div align="center">

**Privacy-First Encrypted Vault System on Solana**

*Powered by Arcium MPC Network*

[![Solana](https://img.shields.io/badge/Solana-Devnet-14F195?logo=solana)](https://solana.com)
[![Arcium](https://img.shields.io/badge/Powered%20by-Arcium%20MPC-7C3AED)](https://arcium.com)
[![Anchor](https://img.shields.io/badge/Framework-Anchor-blueviolet)](https://www.anchor-lang.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Live Demo](#) • [Documentation](#architecture) • [Report Bug](https://github.com/kikiprojecto/shadowvault-protocol/issues)

</div>

---

## 📖 Table of Contents

- [What is ShadowVault?](#-what-is-shadowvault)
- [Why Privacy Matters](#-why-privacy-matters-in-defi)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Setup Instructions](#-setup-instructions)
- [Deployment](#-deployment)
- [Usage Guide](#-usage-guide)
- [Security](#-security-considerations)
- [Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 What is ShadowVault?

**ShadowVault** is a privacy-preserving vault system built on Solana that leverages **Arcium's Multi-Party Computation (MPC)** network to keep your balances and transactions completely private on-chain.

### The Problem

Traditional blockchain systems expose all transaction details publicly:
- ❌ Your balance is visible to everyone
- ❌ Transaction amounts are public
- ❌ Trading strategies can be front-run
- ❌ Financial privacy is non-existent

### The Solution

ShadowVault uses **encrypted computation** to:
- ✅ Keep balances encrypted on-chain
- ✅ Process transactions in encrypted space
- ✅ Verify operations without revealing data
- ✅ Maintain complete financial privacy

---

## 🔐 Why Privacy Matters in DeFi

### Financial Privacy is a Right

In traditional finance, your bank balance and transaction history are private. **Why should blockchain be different?**

### Real-World Use Cases

1. **Institutional Investors**: Protect trading strategies from front-running
2. **High-Net-Worth Individuals**: Keep wealth private from public scrutiny
3. **Businesses**: Maintain confidential financial operations
4. **Privacy-Conscious Users**: Exercise financial sovereignty

### The Privacy Trilemma

Most blockchain systems force you to choose between:
- **Transparency** (public ledger)
- **Verifiability** (trustless computation)
- **Privacy** (confidential data)

**ShadowVault achieves all three** using Arcium MPC.

---

## ✨ Features

### 🔒 Encrypted Operations

| Operation | Description | Privacy Level |
|-----------|-------------|---------------|
| **Initialize Vault** | Create encrypted vault with initial balance | 🔐 Fully Private |
| **Deposit** | Add funds with encrypted amounts | 🔐 Fully Private |
| **Withdraw** | Remove funds with balance verification | 🔐 Fully Private |
| **Transfer** | Send funds between vaults privately | 🔐 Fully Private |
| **Balance Check** | Verify sufficient funds without revealing amount | 🔐 Fully Private |

### 🛡️ Privacy Guarantees

- ✅ **Balance Privacy**: Your vault balance is encrypted on-chain
- ✅ **Transaction Privacy**: Transfer amounts remain confidential
- ✅ **Computation Privacy**: MPC network processes encrypted data
- ✅ **Verification Privacy**: Balance checks don't reveal amounts
- ✅ **Atomic Operations**: All transactions are atomic and secure
- ✅ **No Trusted Setup**: Decentralized MPC network

### 🚀 Additional Features

- **Real-time Validation**: Instant vault existence checking
- **Transaction History**: Track all operations with timestamps
- **Multi-Wallet Support**: Phantom, Solflare, Backpack, and more
- **Responsive UI**: Beautiful, modern interface with Tailwind CSS
- **Error Handling**: Comprehensive error messages and recovery
- **Auto-Refresh**: Real-time balance updates

---

## 🔬 How It Works

### Arcium MPC Network

**Multi-Party Computation (MPC)** allows multiple parties to jointly compute a function over their inputs while keeping those inputs private.

```
┌─────────────────────────────────────────────────────────┐
│                    Arcium MPC Network                   │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  Node 1  │  │  Node 2  │  │  Node 3  │            │
│  │          │  │          │  │          │            │
│  │ Secret   │  │ Secret   │  │ Secret   │            │
│  │ Share 1  │  │ Share 2  │  │ Share 3  │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│       │              │              │                  │
│       └──────────────┴──────────────┘                  │
│                      │                                  │
│              Encrypted Computation                      │
│                      │                                  │
│              ┌───────▼────────┐                        │
│              │  Result (Enc)  │                        │
│              └────────────────┘                        │
└─────────────────────────────────────────────────────────┘
```

### Flow Diagram

```
┌──────────────┐
│     USER     │
└──────┬───────┘
       │ 1. Submit encrypted transaction
       ▼
┌──────────────────────────────────────────────┐
│         Solana Smart Contract                │
│  • Validate transaction                      │
│  • Queue computation                         │
│  • Emit event                                │
└──────┬───────────────────────────────────────┘
       │ 2. Forward to MPC
       ▼
┌──────────────────────────────────────────────┐
│         Arcium MPC Network                   │
│  • Decrypt secret shares                     │
│  • Perform computation (add/subtract/verify) │
│  • Re-encrypt result                         │
└──────┬───────────────────────────────────────┘
       │ 3. Return encrypted result
       ▼
┌──────────────────────────────────────────────┐
│         Solana Smart Contract                │
│  • Receive callback                          │
│  • Update encrypted state                    │
│  • Emit result event                         │
└──────┬───────────────────────────────────────┘
       │ 4. Confirm to user
       ▼
┌──────────────┐
│     USER     │
└──────────────┘
```

### Encrypted Computation Example

**Deposit Operation:**

```rust
// 1. User submits encrypted deposit
let encrypted_amount = arcium_encrypt(500); // 500 SOL

// 2. Smart contract queues computation
queue_computation(DepositInputs {
    current_balance: vault.encrypted_balance,  // Encrypted
    deposit_amount: encrypted_amount,          // Encrypted
});

// 3. MPC computes: new_balance = current_balance + deposit_amount
// All computation happens in encrypted space!

// 4. Callback updates vault
vault.encrypted_balance = mpc_result.new_balance; // Still encrypted!
```

**The balance never leaves encrypted space!** 🔐

---

## 🛠️ Technology Stack

### Blockchain Layer

| Technology | Version | Purpose |
|------------|---------|---------|
| **Solana** | Mainnet/Devnet | High-performance blockchain |
| **Anchor** | 0.29.0 | Solana smart contract framework |
| **Rust** | 1.75+ | Smart contract language |

### MPC Layer

| Technology | Purpose |
|------------|---------|
| **Arcium MPC Network** | Encrypted computation |
| **Secret Sharing** | Distribute encrypted data |
| **Zero-Knowledge Proofs** | Verify without revealing |

### Frontend Layer

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.5 | React framework |
| **TypeScript** | 5.6.2 | Type-safe development |
| **Tailwind CSS** | 3.4.10 | Styling |
| **Solana Wallet Adapter** | Latest | Wallet integration |
| **Lucide React** | Latest | Icon library |

### Development Tools

- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

---

## 🏗️ Architecture

### Project Structure

```
shadowvault-protocol/
├── programs/
│   └── shadowvault_mxe/
│       └── src/
│           └── lib.rs              # Solana smart contract
├── encrypted-ixs/
│   └── src/
│       └── lib.rs                  # MPC instruction definitions
├── app/
│   ├── layout.tsx                  # Root layout with wallet provider
│   ├── dashboard/
│   │   └── page.tsx                # Main dashboard
│   └── vault/
│       └── [address]/
│           └── page.tsx            # Vault details page
├── components/
│   ├── WalletButton.tsx            # Wallet connection
│   ├── WalletProvider.tsx          # Solana wallet context
│   ├── CreateVaultForm.tsx         # Vault creation
│   ├── VaultList.tsx               # Vault listing
│   ├── DepositModal.tsx            # Deposit interface
│   ├── WithdrawModal.tsx           # Withdrawal interface
│   └── TransferForm.tsx            # Transfer interface
└── lib/
    ├── constants.ts                # Configuration
    ├── anchor-client.ts            # Anchor program client
    └── idl.ts                      # Program IDL
```

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                   │
│  • User Interface                                       │
│  • Wallet Integration                                   │
│  • Transaction Signing                                  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ RPC Calls
                   ▼
┌─────────────────────────────────────────────────────────┐
│              Solana Blockchain (Devnet)                 │
│  • programs/shadowvault_mxe                             │
│  • Account Storage (Encrypted)                          │
│  • Event Emissions                                      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ MPC Integration
                   ▼
┌─────────────────────────────────────────────────────────┐
│              Arcium MPC Network                         │
│  • encrypted-ixs/                                       │
│  • Encrypted Computation                                │
│  • Secret Sharing                                       │
└─────────────────────────────────────────────────────────┘
```

### Callback Pattern

ShadowVault uses a **two-phase commit pattern**:

1. **Phase 1 - Queue Computation**
   ```rust
   pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
       // Validate and queue computation
       arcium_mpc_sdk::queue_computation(
           &ctx.accounts.comp_def,
           &ctx.accounts.computation,
           inputs,
       )?;
       Ok(())
   }
   ```

2. **Phase 2 - Process Callback**
   ```rust
   pub fn deposit_callback(ctx: Context<DepositCallback>) -> Result<()> {
       // Get encrypted result from MPC
       let result = arcium_mpc_sdk::get_computation_result(
           &ctx.accounts.computation,
       )?;
       
       // Update encrypted state
       ctx.accounts.vault_data.encrypted_balance = result.new_balance;
       Ok(())
   }
   ```

### encrypted-ixs vs programs

| Component | Purpose | Language | Execution |
|-----------|---------|----------|-----------|
| **programs/** | On-chain smart contract | Rust | Solana VM |
| **encrypted-ixs/** | MPC computation logic | Rust | Arcium MPC Network |

**Key Difference**: `programs/` runs on Solana's blockchain, while `encrypted-ixs/` runs in Arcium's secure MPC environment.

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Rust** 1.75+ ([Install](https://rustup.rs/))
- **Solana CLI** 1.18+ ([Install](https://docs.solana.com/cli/install-solana-cli-tools))
- **Anchor** 0.29.0 ([Install](https://www.anchor-lang.com/docs/installation))
- **Git** ([Download](https://git-scm.com/))

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/kikiprojecto/shadowvault-protocol.git
   cd shadowvault-protocol
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build Smart Contracts**
   ```bash
   anchor build
   ```

4. **Run Tests**
   ```bash
   anchor test
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open Browser**
   ```
   http://localhost:3000/dashboard
   ```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Solana Configuration
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com

# Program Configuration
NEXT_PUBLIC_PROGRAM_ID=Br2ApMKRBGKfiCgmccs3yhFkQpsERND7ZA9i4Q3QRj97

# Arcium Configuration (Optional)
NEXT_PUBLIC_ARCIUM_API_URL=https://api.arcium.com
NEXT_PUBLIC_ARCIUM_API_KEY=your_api_key_here
```

### Local Development

```bash
# Terminal 1 - Start local validator
solana-test-validator

# Terminal 2 - Deploy program
anchor deploy

# Terminal 3 - Start frontend
npm run dev
```

---

## 🌐 Deployment

### Smart Contract

- **Program ID**: `Br2ApMKRBGKfiCgmccs3yhFkQpsERND7ZA9i4Q3QRj97`
- **Network**: Solana Devnet
- **Status**: ✅ Deployed & Verified
- **Explorer**: [View on Solana Explorer](https://explorer.solana.com/address/Br2ApMKRBGKfiCgmccs3yhFkQpsERND7ZA9i4Q3QRj97?cluster=devnet)

### Testnet Links

- **Solana Devnet**: https://api.devnet.solana.com
- **Solana Explorer**: https://explorer.solana.com/?cluster=devnet
- **Solana Faucet**: https://faucet.solana.com/

### Frontend Deployment

**Option 1: Vercel (Recommended)**
```bash
npm install -g vercel
vercel deploy
```

**Option 2: Netlify**
```bash
npm run build
netlify deploy --prod
```

**Option 3: Self-Hosted**
```bash
npm run build
npm start
```

---

## 📚 Usage Guide

### 1. Connect Wallet

1. Click **"Connect Wallet"** in the top right
2. Select your wallet (Phantom, Solflare, Backpack)
3. Approve the connection

### 2. Create a Vault

1. Navigate to **"Create Vault"** tab
2. Enter initial balance (e.g., 1.5 SOL)
3. Click **"Create Encrypted Vault"**
4. Approve the transaction
5. Wait for MPC computation (~3-5 seconds)
6. Your vault is created! 🎉

### 3. Deposit Funds

1. Go to **"My Vaults"** tab
2. Click **"Deposit"** on your vault
3. Enter deposit amount
4. Click **"Confirm Deposit"**
5. Approve transaction
6. Wait for confirmation

### 4. Withdraw Funds

1. Go to **"My Vaults"** tab
2. Click **"Withdraw"** on your vault
3. Enter withdrawal amount
4. Click **"Confirm Withdraw"**
5. MPC verifies you have sufficient balance
6. If sufficient, withdrawal completes
7. If insufficient, transaction is rejected (vault unchanged)

### 5. Transfer Between Vaults

1. Navigate to **"Transfer"** tab
2. Select source vault
3. Enter destination vault address
4. System validates destination exists ✓
5. Enter transfer amount
6. Click **"Send Private Transfer"**
7. MPC performs atomic transfer
8. Both vaults updated if successful

### 6. View Vault Details

1. Click **"View Details"** on any vault
2. See encrypted balance
3. View transaction history
4. Access quick actions

---

## 🔒 Security Considerations

### What's Encrypted

✅ **Vault Balances**: Stored as encrypted values on-chain  
✅ **Transaction Amounts**: Deposit, withdraw, and transfer amounts  
✅ **Computation Results**: All MPC outputs remain encrypted  
✅ **Balance Checks**: Verification happens without revealing amounts  

### What's NOT Encrypted

❌ **Vault Addresses**: Public keys are visible (necessary for routing)  
❌ **Transaction Existence**: That a transaction occurred is public  
❌ **Transaction Types**: Whether it's a deposit/withdraw/transfer  
❌ **Timestamps**: When transactions occurred  
❌ **Success/Failure**: Whether a transaction succeeded  

### Trust Assumptions

1. **Arcium MPC Network**: Trust that MPC nodes don't collude
2. **Solana Validators**: Trust in Solana's consensus mechanism
3. **Smart Contract**: Trust in audited contract code
4. **Wallet Security**: User responsible for private key security

### Security Best Practices

- ✅ Always verify transaction details before signing
- ✅ Use hardware wallets for large amounts
- ✅ Keep private keys secure and never share them
- ✅ Verify program ID matches official deployment
- ✅ Start with small amounts to test the system
- ✅ Review transaction history regularly

### Audit Status

- 🔄 **Smart Contract**: Pending professional audit
- 🔄 **MPC Integration**: Pending Arcium review
- ✅ **Frontend**: Open source and reviewable

---

## 🗺️ Future Roadmap

### Phase 1: Core Features (✅ Complete)
- ✅ Encrypted vault creation
- ✅ Deposit/withdraw operations
- ✅ Vault-to-vault transfers
- ✅ Balance verification
- ✅ Transaction history
- ✅ Frontend UI/UX

### Phase 2: Enhanced Privacy (Q2 2025)
- 🔄 Zero-knowledge balance proofs
- 🔄 Anonymous vault addresses
- 🔄 Stealth transactions
- 🔄 Privacy-preserving analytics

### Phase 3: DeFi Integration (Q3 2025)
- 📋 Encrypted lending/borrowing
- 📋 Private liquidity pools
- 📋 Confidential yield farming
- 📋 Cross-chain bridges

### Phase 4: Advanced Features (Q4 2025)
- 📋 Multi-signature vaults
- 📋 Time-locked transfers
- 📋 Programmable privacy policies
- 📋 Mobile app

### Phase 5: Mainnet (2026)
- 📋 Professional security audit
- 📋 Mainnet deployment
- 📋 Insurance fund
- 📋 Governance token

**Legend**: ✅ Complete | 🔄 In Progress | 📋 Planned

---

## 🤝 Contributing

We welcome contributions from the community!

### How to Contribute

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit Your Changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Keep commits atomic and descriptive

### Reporting Issues

Found a bug? [Open an issue](https://github.com/kikiprojecto/shadowvault-protocol/issues) with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 ShadowVault Protocol

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **Arcium Team** - For the amazing MPC network
- **Solana Foundation** - For the high-performance blockchain
- **Anchor Framework** - For making Solana development easier
- **Open Source Community** - For inspiration and support

---

## 📞 Contact & Links

- **GitHub**: [kikiprojecto/shadowvault-protocol](https://github.com/kikiprojecto/shadowvault-protocol)
- **Documentation**: [View Docs](./ARCHITECTURE.md)
- **Issues**: [Report Bug](https://github.com/kikiprojecto/shadowvault-protocol/issues)
- **Discussions**: [Join Discussion](https://github.com/kikiprojecto/shadowvault-protocol/discussions)

---

<div align="center">

**Built with ❤️ for the Arcium Hackathon**

*Privacy is not a crime. It's a right.* 🛡️

⭐ **Star this repo if you believe in financial privacy!** ⭐

</div>
