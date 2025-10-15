# 🔐 Encrypted Instructions Module

**Arcium MPC-powered encrypted data structures for ShadowVault Protocol**

---

## Overview

This module defines all encrypted data structures used in ShadowVault's private vault system. All sensitive data (balances, amounts, transaction counts) are encrypted using Arcium's `Enc<Shared, T>` type, ensuring complete privacy.

## Data Structures

### Core Vault Types

#### `VaultAccount`
The main encrypted vault account structure:
- `encrypted_balance: Enc<Shared, u64>` - Hidden balance
- `encrypted_total_deposits: Enc<Shared, u64>` - Cumulative deposits
- `encrypted_total_withdrawals: Enc<Shared, u64>` - Cumulative withdrawals
- `encrypted_tx_count: Enc<Shared, u64>` - Transaction counter
- `owner: [u8; 32]` - Public owner key (for access control)
- `created_at: i64` - Public creation timestamp
- `is_active: bool` - Public status flag

### Operation Input/Output Types

#### Vault Initialization
- `VaultInitInputs` - Initial balance and owner
- `VaultInitOutputs` - Created vault account

#### Deposits
- `DepositInputs` - Current balance + deposit amount
- `DepositOutputs` - New balance + updated metrics

#### Withdrawals
- `WithdrawInputs` - Current balance + withdrawal amount
- `WithdrawOutputs` - New balance + success flag

#### Balance Checks
- `BalanceCheckInputs` - Current balance
- `BalanceCheckOutputs` - Encrypted balance + sufficiency flag

#### Transfers (Future)
- `TransferInputs` - Source/dest balances + amount
- `TransferOutputs` - Updated balances + success flag

## Privacy Guarantees

### What's Encrypted
✅ All balances (current, deposits, withdrawals)  
✅ All transaction amounts  
✅ Transaction counts  
✅ Success/failure flags  

### What's Public
- Vault owner (needed for access control)
- Creation timestamp (metadata)
- Active status (operational state)

## Usage Example

```rust
use encrypted_ixs::{VaultAccount, DepositInputs, DepositOutputs};
use arcium_mpc_sdk::{Enc, Shared};

// Create deposit inputs (in MPC context)
let deposit_inputs = DepositInputs {
    current_balance: /* encrypted balance */,
    deposit_amount: /* encrypted amount */,
    current_total_deposits: /* encrypted total */,
    current_tx_count: /* encrypted count */,
};

// MPC computation happens here (in Solana program)
// Returns DepositOutputs with updated encrypted values
```

## Security Considerations

1. **Zero-Knowledge**: Balances never revealed on-chain
2. **Encrypted Operations**: All arithmetic done in MPC
3. **Access Control**: Owner verification before operations
4. **Audit Trail**: Encrypted metrics for compliance

## Reference Implementation

The `add_together` example demonstrates basic Arcium MPC usage:
```rust
pub struct AddTogetherInputs {
    pub a: Enc<Shared, u64>,
    pub b: Enc<Shared, u64>,
}
```

## Next Steps

1. Implement MPC instruction functions
2. Integrate with Solana program
3. Add client-side encryption helpers
4. Build frontend for vault management

---

**Built with Arcium MPC SDK for privacy-preserving computation on Solana**
