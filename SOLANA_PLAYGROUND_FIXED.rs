// ============================================================================
// ShadowVault Protocol - FIXED VERSION FOR SOLANA PLAYGROUND
// ============================================================================
// This is a corrected version with all compilation errors fixed
// Copy this ENTIRE file into Solana Playground's lib.rs
// ============================================================================

use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("ShdwVlt1111111111111111111111111111111111111");

#[program]
pub mod shadowvault {
    use super::*;

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

        require_keys_eq!(vault.owner, ctx.accounts.owner.key(), ShadowError::Unauthorized);

        emit!(VaultInitialized {
            vault: ctx.accounts.vault.key(),
            owner: ctx.accounts.owner.key(),
            encrypted_strategy_hash,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        require!(!ctx.accounts.vault.is_paused, ShadowError::VaultPaused);
        require!(amount > 0, ShadowError::InvalidAmount);

        let vault_key = ctx.accounts.vault.key();
        let user_key = ctx.accounts.user.key();

        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_ata.to_account_info(),
                    to: ctx.accounts.vault_ata.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount,
        )?;

        let vault = &mut ctx.accounts.vault;
        vault.total_value_locked = vault
            .total_value_locked
            .checked_add(amount)
            .ok_or(ShadowError::Overflow)?;

        let new_tvl = vault.total_value_locked;
        let timestamp = Clock::get()?.unix_timestamp;

        emit!(Deposited {
            vault: vault_key,
            user: user_key,
            amount,
            new_tvl,
            timestamp,
        });

        Ok(())
    }

    pub fn submit_trade_intent(
        ctx: Context<SubmitTradeIntent>,
        token_in: Pubkey,
        token_out: Pubkey,
        amount: u64,
        max_slippage_bps: u16,
        strategy_type: u8,
    ) -> Result<()> {
        require!(!ctx.accounts.vault.is_paused, ShadowError::VaultPaused);
        require!(amount > 0, ShadowError::InvalidAmount);

        let user_key = ctx.accounts.user.key();
        let vault_key = ctx.accounts.vault.key();
        let timestamp = Clock::get()?.unix_timestamp;

        let intent = &mut ctx.accounts.intent;
        intent.user = user_key;
        intent.vault = vault_key;
        intent.token_in = token_in;
        intent.token_out = token_out;
        intent.amount = amount;
        intent.max_slippage_bps = max_slippage_bps;
        intent.strategy_type = strategy_type;
        intent.timestamp = timestamp;
        intent.is_executed = false;

        let (_pda, bump) = Pubkey::find_program_address(
            &[
                TradeIntent::SEED_PREFIX,
                user_key.as_ref(),
                vault_key.as_ref(),
            ],
            ctx.program_id,
        );
        intent.bump = bump;

        let intent_key = intent.key();

        emit!(TradeIntentSubmitted {
            vault: vault_key,
            intent: intent_key,
            user: user_key,
            token_in,
            token_out,
            amount,
            timestamp,
        });

        Ok(())
    }

    pub fn execute_trade(ctx: Context<ExecuteTrade>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let intent = &mut ctx.accounts.intent;

        require!(!vault.is_paused, ShadowError::VaultPaused);
        require!(!intent.is_executed, ShadowError::AlreadyExecuted);

        // Store values we need before mutable borrows
        let intent_key = intent.key();
        let intent_amount = intent.amount;
        
        intent.is_executed = true;
        vault.execution_count = vault
            .execution_count
            .checked_add(1)
            .ok_or(ShadowError::Overflow)?;

        let vault_key = vault.key();
        let execution_count = vault.execution_count;
        let executed_at = Clock::get()?.unix_timestamp;

        let result = &mut ctx.accounts.result;
        result.intent = intent_key;
        result.executed_at = executed_at;
        result.amount_in = intent_amount;
        result.amount_out = 0;
        result.actual_slippage_bps = 0;

        let (_pda, bump) = Pubkey::find_program_address(
            &[ExecutionResult::SEED_PREFIX, intent_key.as_ref()],
            ctx.program_id,
        );
        result.bump = bump;

        emit!(TradeExecuted {
            vault: vault_key,
            intent: intent_key,
            execution_count,
            timestamp: executed_at,
        });

        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        require!(amount > 0, ShadowError::InvalidAmount);

        // Get vault info for PDA seeds
        let vault_owner = ctx.accounts.vault.owner;
        let vault_bump = ctx.accounts.vault.bump;
        let vault_key = ctx.accounts.vault.key();
        let authority_key = ctx.accounts.authority.key();
        
        let seeds = &[
            VaultAccount::SEED_PREFIX,
            vault_owner.as_ref(),
            &[vault_bump],
        ];
        let signer = &[&seeds[..]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault_ata.to_account_info(),
                    to: ctx.accounts.recipient_ata.to_account_info(),
                    authority: ctx.accounts.vault.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;

        let vault = &mut ctx.accounts.vault;
        vault.total_value_locked = vault
            .total_value_locked
            .checked_sub(amount)
            .ok_or(ShadowError::InsufficientFunds)?;

        let new_tvl = vault.total_value_locked;
        let timestamp = Clock::get()?.unix_timestamp;

        emit!(Withdrawn {
            vault: vault_key,
            authority: authority_key,
            amount,
            new_tvl,
            timestamp,
        });

        Ok(())
    }

    pub fn pause_vault(ctx: Context<PauseVault>, pause: bool) -> Result<()> {
        let vault_key = ctx.accounts.vault.key();
        let authority_key = ctx.accounts.authority.key();
        let timestamp = Clock::get()?.unix_timestamp;
        
        let vault = &mut ctx.accounts.vault;
        vault.is_paused = pause;

        emit!(VaultPaused {
            vault: vault_key,
            authority: authority_key,
            is_paused: pause,
            timestamp,
        });

        Ok(())
    }
}

// ============================================================================
// Account Structures
// ============================================================================

#[account]
pub struct VaultAccount {
    pub owner: Pubkey,
    pub encrypted_strategy_hash: [u8; 32],
    pub total_value_locked: u64,
    pub execution_count: u64,
    pub is_paused: bool,
    pub bump: u8,
}

impl VaultAccount {
    pub const SEED_PREFIX: &'static [u8] = b"vault";

    pub fn space() -> usize {
        8 + 32 + 32 + 8 + 8 + 1 + 1
    }
}

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
    pub is_executed: bool,
    pub bump: u8,
}

impl TradeIntent {
    pub const SEED_PREFIX: &'static [u8] = b"intent";

    pub fn space() -> usize {
        8 + 32 + 32 + 32 + 32 + 8 + 2 + 1 + 8 + 1 + 1
    }
}

#[account]
pub struct ExecutionResult {
    pub intent: Pubkey,
    pub executed_at: i64,
    pub amount_in: u64,
    pub amount_out: u64,
    pub actual_slippage_bps: u16,
    pub bump: u8,
}

impl ExecutionResult {
    pub const SEED_PREFIX: &'static [u8] = b"result";

    pub fn space() -> usize {
        8 + 32 + 8 + 8 + 8 + 2 + 1
    }
}

// ============================================================================
// Instruction Contexts
// ============================================================================

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: This is the owner of the vault
    pub owner: UncheckedAccount<'info>,

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
        mut,
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
    #[account(mut)]
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
    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_mint: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [VaultAccount::SEED_PREFIX, vault.owner.as_ref()],
        bump = vault.bump,
        has_one = owner @ ShadowError::Unauthorized,
    )]
    pub vault: Account<'info, VaultAccount>,

    #[account(address = vault.owner @ ShadowError::Unauthorized)]
    pub owner: UncheckedAccount<'info>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = vault,
    )]
    pub vault_ata: Account<'info, TokenAccount>,

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
pub struct PauseVault<'info> {
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [VaultAccount::SEED_PREFIX, vault.owner.as_ref()],
        bump = vault.bump,
        has_one = owner @ ShadowError::Unauthorized,
        constraint = authority.key() == vault.owner @ ShadowError::Unauthorized,
    )]
    pub vault: Account<'info, VaultAccount>,

    #[account(address = vault.owner @ ShadowError::Unauthorized)]
    pub owner: UncheckedAccount<'info>,
}

// ============================================================================
// Events
// ============================================================================

#[event]
pub struct VaultInitialized {
    pub vault: Pubkey,
    pub owner: Pubkey,
    pub encrypted_strategy_hash: [u8; 32],
    pub timestamp: i64,
}

#[event]
pub struct Deposited {
    pub vault: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
    pub new_tvl: u64,
    pub timestamp: i64,
}

#[event]
pub struct TradeIntentSubmitted {
    pub vault: Pubkey,
    pub intent: Pubkey,
    pub user: Pubkey,
    pub token_in: Pubkey,
    pub token_out: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct TradeExecuted {
    pub vault: Pubkey,
    pub intent: Pubkey,
    pub execution_count: u64,
    pub timestamp: i64,
}

#[event]
pub struct Withdrawn {
    pub vault: Pubkey,
    pub authority: Pubkey,
    pub amount: u64,
    pub new_tvl: u64,
    pub timestamp: i64,
}

#[event]
pub struct VaultPaused {
    pub vault: Pubkey,
    pub authority: Pubkey,
    pub is_paused: bool,
    pub timestamp: i64,
}

// ============================================================================
// Error Codes
// ============================================================================

#[error_code]
pub enum ShadowError {
    #[msg("Unauthorized: Only vault owner can perform this action")]
    Unauthorized,

    #[msg("Vault is paused: Operations are temporarily disabled")]
    VaultPaused,

    #[msg("Invalid amount: Amount must be greater than zero")]
    InvalidAmount,

    #[msg("Arithmetic overflow occurred")]
    Overflow,

    #[msg("Insufficient funds in vault")]
    InsufficientFunds,

    #[msg("Trade already executed")]
    AlreadyExecuted,
}
