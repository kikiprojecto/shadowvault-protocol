// ============================================================================
// ShadowVault Protocol - Privacy-Preserving DeFi Vault on Solana
// ============================================================================
// 
// A decentralized vault protocol enabling private trading strategies through:
// - Encrypted strategy commitments (zero-knowledge proofs ready)
// - Intent-based trading with MEV protection
// - PDA-based custody for secure asset management
// - Emergency pause mechanisms for risk mitigation
//
// Architecture:
// - VaultAccount: Main vault state with encrypted strategy hash
// - TradeIntent: User-submitted trade requests with privacy guarantees
// - ExecutionResult: On-chain execution records for transparency
//
// Security Features:
// - Owner-only withdrawal and pause controls
// - Reentrancy protection via Anchor's account validation
// - Overflow-safe arithmetic with checked operations
// - PDA-based authority for secure token custody
//
// Version: 1.0.0 (Anchor 0.29.0)
// ============================================================================

use anchor_lang::prelude::*;

// Module declarations
pub mod state;
pub mod instructions;
pub mod errors;

use crate::instructions::*;
use crate::state::*;

// ============================================================================
// Program ID Declaration
// ============================================================================
// IMPORTANT: Replace with your deployed program ID when deploying to devnet/mainnet
// This must match the program ID in Anchor.toml
// Generate new ID with: anchor keys list
declare_id!("ShdwVlt1111111111111111111111111111111111111");

// ============================================================================
// Program Instructions
// ============================================================================
#[program]
pub mod shadowvault {
    use super::*;

    /// Initialize a new vault with encrypted strategy commitment
    /// 
    /// # Arguments
    /// * `encrypted_strategy_hash` - 32-byte hash of encrypted trading strategy
    ///   This hash commits to the strategy without revealing it on-chain
    /// 
    /// # Security
    /// - Creates PDA-based vault account owned by the signer
    /// - Only the vault owner can pause or withdraw funds
    /// - Strategy hash enables future ZK proof verification
    /// 
    /// # Events
    /// Emits `VaultInitialized` with vault address and owner
    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
        encrypted_strategy_hash: [u8; 32],
    ) -> Result<()> {
        let vault_key = ctx.accounts.vault.key();
        let owner_key = ctx.accounts.owner.key();
        
        initialize::handler(ctx, encrypted_strategy_hash)?;
        
        // Emit initialization event
        emit!(VaultInitialized {
            vault: vault_key,
            owner: owner_key,
            encrypted_strategy_hash,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    /// Deposit tokens into the vault
    /// 
    /// # Arguments
    /// * `amount` - Amount of tokens to deposit (must be > 0)
    /// 
    /// # Security
    /// - Vault must not be paused
    /// - Uses SPL token transfer with proper authority checks
    /// - Updates TVL with overflow protection
    /// - Tokens held in vault PDA's associated token account
    /// 
    /// # Events
    /// Emits `Deposited` with user, amount, and new TVL
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let vault_key = ctx.accounts.vault.key();
        let user_key = ctx.accounts.user.key();
        let old_tvl = ctx.accounts.vault.tvl;
        
        deposit::handler(ctx, amount)?;
        
        // Emit deposit event
        emit!(Deposited {
            vault: vault_key,
            user: user_key,
            amount,
            new_tvl: old_tvl + amount,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    /// Submit a trade intent for private execution
    /// 
    /// # Arguments
    /// * `token_in` - Input token mint address
    /// * `token_out` - Output token mint address
    /// * `amount` - Amount to trade
    /// * `max_slippage_bps` - Maximum slippage in basis points (e.g., 100 = 1%)
    /// * `strategy_type` - Strategy identifier (0-255)
    /// 
    /// # Privacy Model
    /// - Intent is public but execution routing is private
    /// - Off-chain executor uses encrypted strategy to determine optimal path
    /// - On-chain verification ensures slippage bounds are respected
    /// 
    /// # Events
    /// Emits `TradeIntentSubmitted` with intent details
    pub fn submit_trade_intent(
        ctx: Context<SubmitTradeIntent>,
        token_in: Pubkey,
        token_out: Pubkey,
        amount: u64,
        max_slippage_bps: u16,
        strategy_type: u8,
    ) -> Result<()> {
        submit_trade_intent::handler(
            ctx,
            token_in,
            token_out,
            amount,
            max_slippage_bps,
            strategy_type,
        )
    }

    /// Execute a submitted trade intent
    /// 
    /// # Security
    /// - Only authorized executor can call (MPC network in production)
    /// - Vault must not be paused
    /// - Validates slippage against intent parameters
    /// - Creates immutable execution result record
    /// 
    /// # Production Notes
    /// Current implementation is a placeholder for hackathon demo.
    /// Production version should:
    /// - Verify MPC attestation/proof of private routing computation
    /// - Execute actual swaps via CPI to DEX aggregators (Jupiter/Raydium)
    /// - Enforce slippage protection from signed intent
    /// 
    /// # Events
    /// Emits `TradeExecuted` with execution results
    pub fn execute_trade(ctx: Context<ExecuteTrade>) -> Result<()> {
        execute_trade::handler(ctx)
    }

    /// Withdraw tokens from the vault
    /// 
    /// # Arguments
    /// * `amount` - Amount to withdraw (must be > 0)
    /// 
    /// # Security
    /// - Only vault owner can withdraw
    /// - Uses PDA signer seeds for secure token transfer
    /// - Updates TVL with underflow protection
    /// - Requires sufficient balance in vault custody
    /// 
    /// # Events
    /// Emits `Withdrawn` with withdrawal details
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let vault_key = ctx.accounts.vault.key();
        let authority_key = ctx.accounts.authority.key();
        let old_tvl = ctx.accounts.vault.tvl;
        
        withdraw::handler(ctx, amount)?;
        
        // Emit withdrawal event
        emit!(Withdrawn {
            vault: vault_key,
            authority: authority_key,
            amount,
            new_tvl: old_tvl.saturating_sub(amount),
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    /// Pause or unpause the vault (emergency control)
    /// 
    /// # Arguments
    /// * `pause` - true to pause, false to unpause
    /// 
    /// # Security
    /// - Only vault owner can pause/unpause
    /// - When paused, deposits and trades are blocked
    /// - Withdrawals remain available to owner even when paused
    /// 
    /// # Use Cases
    /// - Emergency response to detected exploits
    /// - Maintenance windows for strategy updates
    /// - Risk mitigation during market volatility
    /// 
    /// # Events
    /// Emits `VaultPaused` with pause state
    pub fn pause_vault(ctx: Context<TogglePause>, pause: bool) -> Result<()> {
        let vault_key = ctx.accounts.vault.key();
        let authority_key = ctx.accounts.authority.key();
        
        pause_vault::handler(ctx, pause)?;
        
        // Emit pause event
        emit!(VaultPaused {
            vault: vault_key,
            authority: authority_key,
            is_paused: pause,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }
}

// ============================================================================
// Events - For Off-Chain Indexing and Analytics
// ============================================================================
// All events are emitted for transparency while preserving strategy privacy.
// Indexers can track vault activity without learning trading strategies.

/// Emitted when a new vault is initialized
#[event]
pub struct VaultInitialized {
    pub vault: Pubkey,
    pub owner: Pubkey,
    pub encrypted_strategy_hash: [u8; 32],
    pub timestamp: i64,
}

/// Emitted when tokens are deposited into a vault
#[event]
pub struct Deposited {
    pub vault: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
    pub new_tvl: u64,
    pub timestamp: i64,
}

/// Emitted when a trade intent is submitted
#[event]
pub struct TradeIntentSubmitted {
    pub vault: Pubkey,
    pub intent: Pubkey,
    pub user: Pubkey,
    pub token_in: Pubkey,
    pub token_out: Pubkey,
    pub amount: u64,
    pub max_slippage_bps: u16,
    pub strategy_type: u8,
    pub timestamp: i64,
}

/// Emitted when a trade is executed
#[event]
pub struct TradeExecuted {
    pub vault: Pubkey,
    pub intent: Pubkey,
    pub executed_amount: u64,
    pub received_amount: u64,
    pub success: bool,
}

/// Emitted when tokens are withdrawn from a vault
#[event]
pub struct Withdrawn {
    pub vault: Pubkey,
    pub authority: Pubkey,
    pub amount: u64,
    pub new_tvl: u64,
    pub timestamp: i64,
}

/// Emitted when a vault is paused or unpaused
#[event]
pub struct VaultPaused {
    pub vault: Pubkey,
    pub authority: Pubkey,
    pub is_paused: bool,
    pub timestamp: i64,
}
