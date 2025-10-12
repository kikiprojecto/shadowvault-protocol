use anchor_lang::prelude::*;

use crate::state::VaultAccount;
use crate::errors::ShadowError;

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

pub fn handler(ctx: Context<InitializeVault>, encrypted_strategy_hash: [u8; 32]) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    vault.owner = ctx.accounts.owner.key();
    vault.encrypted_strategy_hash = encrypted_strategy_hash;
    vault.tvl = 0;
    vault.execution_count = 0;
    vault.is_paused = false;

    let (_pda, bump) = Pubkey::find_program_address(
        &[VaultAccount::SEED_PREFIX, ctx.accounts.owner.key().as_ref()],
        ctx.program_id,
    );
    vault.bump = bump;

    // simple owner check
    require_keys_eq!(vault.owner, ctx.accounts.owner.key(), ShadowError::Unauthorized);
    Ok(())
}
