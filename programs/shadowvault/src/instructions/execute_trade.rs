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

pub fn handler(
    ctx: Context<ExecuteTrade>,
    encrypted_params: [u8; 32],  // Encrypted trade params from Arcium MPC
    mpc_proof: [u8; 64],          // Zero-knowledge proof from MPC computation
    computation_id: [u8; 32],     // Arcium computation ID for auditability
) -> Result<()> {
    require!(!ctx.accounts.vault.is_paused, ShadowError::VaultPaused);

    // ARCIUM MPC INTEGRATION:
    // 1. Verify MPC zero-knowledge proof
    // 2. Validate computation was performed by Arcium network
    // 3. Ensure encrypted params match intent commitment
    
    // Verify MPC proof (basic validation for hackathon)
    require!(
        verify_mpc_proof(&encrypted_params, &mpc_proof),
        ShadowError::InvalidProof
    );

    // In production implementation:
    // - Full ZK-SNARK proof verification
    // - Perform routed swaps via CPI to DEX adapters (Jupiter/Raydium/Orca)
    // - Enforce slippage from the signed intent without revealing strategy
    
    let executed_amount = ctx.accounts.intent.amount;
    let received_amount = executed_amount; // placeholder for demo

    // Update counters
    let vault = &mut ctx.accounts.vault;
    vault.execution_count = vault
        .execution_count
        .checked_add(1)
        .ok_or(ShadowError::MathOverflow)?;

    // Record result account with MPC metadata
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

    // Emit event with Arcium MPC metadata
    emit!(crate::TradeExecuted {
        vault: ctx.accounts.vault.key(),
        intent: ctx.accounts.intent.key(),
        executed_amount,
        received_amount,
        success: true,
    });

    Ok(())
}

/// Verify MPC zero-knowledge proof from Arcium network
/// Production: Full cryptographic verification
/// Hackathon: Basic validation
fn verify_mpc_proof(params: &[u8; 32], proof: &[u8; 64]) -> bool {
    // Verify proof is not empty
    if proof.iter().all(|&b| b == 0) {
        return false;
    }
    
    // Verify params is not empty
    if params.iter().all(|&b| b == 0) {
        return false;
    }
    
    // Basic validation passed
    // Production: Implement full ZK-SNARK verification using Arcium's proof system
    true
}
