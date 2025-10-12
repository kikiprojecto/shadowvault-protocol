use anchor_lang::prelude::*;

use crate::errors::ShadowError;
use crate::state::VaultAccount;

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

pub fn handler(ctx: Context<TogglePause>, pause: bool) -> Result<()> {
    require_keys_eq!(ctx.accounts.vault.owner, ctx.accounts.authority.key(), ShadowError::Unauthorized);
    ctx.accounts.vault.is_paused = pause;
    Ok(())
}
