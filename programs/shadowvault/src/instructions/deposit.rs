use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::errors::ShadowError;
use crate::state::VaultAccount;

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

pub fn handler(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    require!(amount > 0, ShadowError::InvalidAmount);
    require!(!ctx.accounts.vault.is_paused, ShadowError::VaultPaused);

    let signer_seeds: &[&[u8]] = &[VaultAccount::SEED_PREFIX, ctx.accounts.vault.owner.as_ref()];
    let (_pda, bump) = Pubkey::find_program_address(signer_seeds, ctx.program_id);
    require_eq!(bump, ctx.accounts.vault.bump, ShadowError::InvalidAccount);

    // transfer from user -> vault custody
    let cpi_accounts = Transfer {
        from: ctx.accounts.user_ata.to_account_info(),
        to: ctx.accounts.vault_ata.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
    token::transfer(cpi_ctx, amount)?;

    // increase TVL
    let vault = &mut ctx.accounts.vault;
    vault.tvl = vault
        .tvl
        .checked_add(amount)
        .ok_or(ShadowError::MathOverflow)?;

    Ok(())
}
