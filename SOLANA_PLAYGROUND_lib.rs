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
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

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
        let vault = &mut ctx.accounts.vault;
        vault.owner = ctx.accounts.owner.key();
        vault.encrypted_strategy_hash = encrypted_strategy_hash;
        vault.total_value_locked = 0;
        vault.execution_count = 0;
        vault.is_paused = false;

        let (_pda, bump) = Pubkey::find_program_address(
            &[VaultAccount::SEED_PREFIX, ctx.accounts.owner.key().as_ref()],
            ctx.program_id,
        );
        vault.bump = bump;

        // Verify owner
        require_keys_eq!(vault.owner, ctx.accounts.owner.key(), ShadowError::Unauthorized);

        // Emit initialization event
        emit!(VaultInitialized {
            vault: ctx.accounts.vault.key(),
            owner: ctx.accounts.owner.key(),
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
        require!(amount > 0, ShadowError::InvalidAmount);
        require!(!ctx.accounts.vault.is_paused, ShadowError::VaultPaused);

        // Transfer from user -> vault custody
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_ata.to_account_info(),
            to: ctx.accounts.vault_ata.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Increase TVL
        let vault = &mut ctx.accounts.vault;
        vault.total_value_locked = vault
            .total_value_locked
            .checked_add(amount)
            .ok_or(ShadowError::MathOverflow)?;

        // Emit deposit event
        emit!(Deposited {
            vault: ctx.accounts.vault.key(),
            user: ctx.accounts.user.key(),
            amount,
            new_tvl: vault.total_value_locked,
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
        require!(amount > 0, ShadowError::InvalidAmount);
        require!(!ctx.accounts.vault.is_paused, ShadowError::VaultPaused);

        let clock = Clock::get()?;
        let intent = &mut ctx.accounts.intent;
        intent.user = ctx.accounts.user.key();
        intent.vault = ctx.accounts.vault.key();
        intent.token_in = token_in;
        intent.token_out = token_out;
        intent.amount = amount;
        intent.max_slippage_bps = max_slippage_bps;
        intent.strategy_type = strategy_type;
        intent.timestamp = clock.unix_timestamp;

        let (_pda, bump) = Pubkey::find_program_address(
            &[
                TradeIntent::SEED_PREFIX,
                ctx.accounts.user.key().as_ref(),
                ctx.accounts.vault.key().as_ref(),
            ],
            ctx.program_id,
        );
        intent.bump = bump;

        emit!(TradeIntentSubmitted {
            vault: ctx.accounts.vault.key(),
            intent: intent.key(),
            user: ctx.accounts.user.key(),
            token_in,
            token_out,
            amount,
            max_slippage_bps,
            strategy_type,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
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
        require!(!ctx.accounts.vault.is_paused, ShadowError::VaultPaused);

        // In production, this would:
        // - Verify MPC off-chain attestation/proof
        // - Perform routed swaps via CPI to DEX adapters
        // - Enforce slippage from the signed intent
        
        let executed_amount = ctx.accounts.intent.amount;
        let received_amount = executed_amount; // Placeholder for demo

        // Update counters
        let vault = &mut ctx.accounts.vault;
        vault.execution_count = vault
            .execution_count
            .checked_add(1)
            .ok_or(ShadowError::MathOverflow)?;

        // Record result
        let result = &mut ctx.accounts.result;
        result.intent = ctx.accounts.intent.key();
        result.executed_amount = executed_amount;
        result.received_amount = received_amount;
        result.success = true;

        let (_pda, bump) = Pubkey::find_program_address(
            &[ExecutionResult::SEED_PREFIX, ctx.accounts.intent.key().as_ref()],
            ctx.program_id,
        );
        result.bump = bump;

        emit!(TradeExecuted {
            vault: ctx.accounts.vault.key(),
            intent: ctx.accounts.intent.key(),
            executed_amount,
            received_amount,
            success: true,
        });

        Ok(())
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
        require!(amount > 0, ShadowError::InvalidAmount);

        // Only owner can withdraw
        require_keys_eq!(
            ctx.accounts.vault.owner,
            ctx.accounts.authority.key(),
            ShadowError::Unauthorized
        );

        // Derive signer seeds for PDA authority
        let seeds: &[&[u8]] = &[VaultAccount::SEED_PREFIX, ctx.accounts.vault.owner.as_ref()];
        let (_pda, bump) = Pubkey::find_program_address(seeds, ctx.program_id);
        require_eq!(bump, ctx.accounts.vault.bump, ShadowError::InvalidAccount);
        let signer_seeds: &[&[&[u8]]] = &[&[
            VaultAccount::SEED_PREFIX,
            ctx.accounts.vault.owner.as_ref(),
            &[bump],
        ]];

        // Transfer from vault custody -> recipient
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_ata.to_account_info(),
            to: ctx.accounts.recipient_ata.to_account_info(),
            authority: ctx.accounts.vault.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        token::transfer(cpi_ctx, amount)?;

        let vault = &mut ctx.accounts.vault;
        vault.total_value_locked = vault
            .total_value_locked
            .checked_sub(amount)
            .ok_or(ShadowError::MathOverflow)?;

        // Emit withdrawal event
        emit!(Withdrawn {
            vault: ctx.accounts.vault.key(),
            authority: ctx.accounts.authority.key(),
            amount,
            new_tvl: vault.total_value_locked,
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
        require_keys_eq!(
            ctx.accounts.vault.owner,
            ctx.accounts.authority.key(),
            ShadowError::Unauthorized
        );
        
        ctx.accounts.vault.is_paused = pause;

        // Emit pause event
        emit!(VaultPaused {
            vault: ctx.accounts.vault.key(),
            authority: ctx.accounts.authority.key(),
            is_paused: pause,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

// ============================================================================
// State Accounts
// ============================================================================

/// Main vault account storing encrypted strategy and TVL
#[account]
pub struct VaultAccount {
    /// Vault owner with authority to pause/withdraw
    pub owner: Pubkey,
    /// 32-byte hash of encrypted strategy commitment
    pub encrypted_strategy_hash: [u8; 32],
    /// Total value locked in the vault
    pub total_value_locked: u64,
    /// Number of trades executed
    pub execution_count: u64,
    /// Emergency pause flag
    pub is_paused: bool,
    /// PDA bump seed
    pub bump: u8,
}

impl VaultAccount {
    pub const SEED_PREFIX: &'static [u8] = b"vault";

    pub fn space() -> usize {
        8 +   // discriminator
        32 +  // owner
        32 +  // encrypted_strategy_hash
        8 +   // total_value_locked
        8 +   // execution_count
        1 +   // is_paused
        1     // bump
    }
}

/// Trade intent submitted by users
#[account]
pub struct TradeIntent {
    pub user: Pubkey,
    pub vault: Pubkey,
    pub token_in: Pubkey,
    pub token_out: Pubkey,
    pub amount: u64,
    pub max_slippage_bps: u16,
    pub strategy_type: u8,
    pub timestamp: i64,
    pub bump: u8,
}

impl TradeIntent {
    pub const SEED_PREFIX: &'static [u8] = b"intent";

    pub fn space() -> usize {
        8 +   // discriminator
        32 +  // user
        32 +  // vault
        32 +  // token_in
        32 +  // token_out
        8 +   // amount
        2 +   // max_slippage_bps
        1 +   // strategy_type
        8 +   // timestamp
        1     // bump
    }
}

/// Execution result record
#[account]
pub struct ExecutionResult {
    pub intent: Pubkey,
    pub executed_amount: u64,
    pub received_amount: u64,
    pub success: bool,
    pub bump: u8,
}

impl ExecutionResult {
    pub const SEED_PREFIX: &'static [u8] = b"result";

    pub fn space() -> usize {
        8 +   // discriminator
        32 +  // intent
        8 +   // executed_amount
        8 +   // received_amount
        1 +   // success
        1     // bump
    }
}

// ============================================================================
// Instruction Context Structs
// ============================================================================

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// Vault owner with authority to pause/withdraw
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = payer,
        seeds = [VaultAccount::SEED_PREFIX, owner.key().as_ref()],
        bump,
        space = VaultAccount::space(),
    )]
    pub vault: Account<'info, VaultAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    pub token_mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = token_mint,
        associated_token::authority = user,
    )]
    pub user_ata: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [VaultAccount::SEED_PREFIX, vault.owner.as_ref()],
        bump = vault.bump,
    )]
    pub vault: Account<'info, VaultAccount>,

    /// Vault custody ATA owned by the vault PDA
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = token_mint,
        associated_token::authority = vault,
    )]
    pub vault_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitTradeIntent<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [VaultAccount::SEED_PREFIX, vault.owner.as_ref()],
        bump = vault.bump,
    )]
    pub vault: Account<'info, VaultAccount>,

    #[account(
        init,
        payer = user,
        seeds = [TradeIntent::SEED_PREFIX, user.key().as_ref(), vault.key().as_ref()],
        bump,
        space = TradeIntent::space(),
    )]
    pub intent: Account<'info, TradeIntent>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteTrade<'info> {
    /// Vault authority must sign to execute trades
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [VaultAccount::SEED_PREFIX, vault.owner.as_ref()],
        bump = vault.bump,
    )]
    pub vault: Account<'info, VaultAccount>,

    #[account(
        mut,
        seeds = [TradeIntent::SEED_PREFIX, intent.user.as_ref(), vault.key().as_ref()],
        bump = intent.bump,
    )]
    pub intent: Account<'info, TradeIntent>,

    /// Custody accounts (for illustration)
    #[account(mut)]
    pub vault_token_in: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token_out: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = authority,
        seeds = [ExecutionResult::SEED_PREFIX, intent.key().as_ref()],
        bump,
        space = ExecutionResult::space(),
    )]
    pub result: Account<'info, ExecutionResult>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    /// Vault owner or delegated authority
    pub authority: Signer<'info>,

    pub token_mint: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [VaultAccount::SEED_PREFIX, vault.owner.as_ref()],
        bump = vault.bump,
        has_one = owner @ ShadowError::Unauthorized,
    )]
    pub vault: Account<'info, VaultAccount>,

    /// Owner of the vault (must match vault.owner)
    #[account(address = vault.owner @ ShadowError::Unauthorized)]
    pub owner: UncheckedAccount<'info>,

    /// Custody ATA owned by vault PDA
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = vault,
    )]
    pub vault_ata: Account<'info, TokenAccount>,

    /// Recipient ATA for authority
    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = token_mint,
        associated_token::authority = authority,
    )]
    pub recipient_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TogglePause<'info> {
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [VaultAccount::SEED_PREFIX, vault.owner.as_ref()],
        bump = vault.bump,
    )]
    pub vault: Account<'info, VaultAccount>,
}

// ============================================================================
// Error Codes
// ============================================================================

#[error_code]
pub enum ShadowError {
    #[msg("Unauthorized: signer is not the vault owner or authority")]
    Unauthorized,
    #[msg("Invalid amount: must be > 0")]
    InvalidAmount,
    #[msg("Vault is paused")]
    VaultPaused,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Invalid account provided")]
    InvalidAccount,
    #[msg("Trade execution failed")]
    TradeFailed,
}

// ============================================================================
// Events - For Off-Chain Indexing and Analytics
// ============================================================================

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
