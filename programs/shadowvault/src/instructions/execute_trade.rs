use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

use crate::errors::ShadowError;
use crate::state::{ExecutionResult, TradeIntent, VaultAccount};

#[derive(Accounts)]
pub struct ExecuteTrade<'info> {
    /// Vault authority must sign to execute trades (e.g., off-chain MPC executor)
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

    /// Custody accounts (for illustration; routing is executed via CPIs to DEXes)
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

pub fn handler(ctx: Context<ExecuteTrade>) -> Result<()> {
    require!(!ctx.accounts.vault.is_paused, ShadowError::VaultPaused);

    // In a production implementation, this function would:
    // - Verify MPC off-chain attestation/proof that private routing was computed
    // - Perform routed swaps via CPI to DEX adapters (Jupiter/Raydium/Orca)
    // - Enforce slippage from the signed intent without revealing strategy
    // For hackathon scope, we mock success while keeping on-chain invariants correct.

    let executed_amount = ctx.accounts.intent.amount;
    let received_amount = executed_amount; // placeholder equality to keep balances consistent for demo

    // Update counters
    let vault = &mut ctx.accounts.vault;
    vault.execution_count = vault
        .execution_count
        .checked_add(1)
        .ok_or(ShadowError::MathOverflow)?;

    // Record result account
    let result = &mut ctx.accounts.result;
    result.intent = ctx.accounts.intent.key();
    result.executed_amount = executed_amount;
    result.received_amount = received_amount;

    let (_pda, bump) = Pubkey::find_program_address(
        &[ExecutionResult::SEED_PREFIX, ctx.accounts.intent.key().as_ref()],
        ctx.program_id,
    );
    result.bump = bump;
    result.success = true;

    emit!(crate::TradeExecuted {
        vault: ctx.accounts.vault.key(),
        intent: ctx.accounts.intent.key(),
        executed_amount,
        received_amount,
        success: true,
    });

    Ok(())
}
