use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::errors::ShadowError;
use crate::state::VaultAccount;

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

    /// Recipient ATA for authority (usually owner)
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

pub fn handler(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    require!(amount > 0, ShadowError::InvalidAmount);

    // Only owner can withdraw by default
    require_keys_eq!(ctx.accounts.vault.owner, ctx.accounts.authority.key(), ShadowError::Unauthorized);

    // Derive signer seeds for PDA authority if needed for outbound transfer
    let seeds: &[&[u8]] = &[VaultAccount::SEED_PREFIX, ctx.accounts.vault.owner.as_ref()];
    let (_pda, bump) = Pubkey::find_program_address(seeds, ctx.program_id);
    require_eq!(bump, ctx.accounts.vault.bump, ShadowError::InvalidAccount);
    let signer_seeds: &[&[&[u8]]] = &[&[VaultAccount::SEED_PREFIX, ctx.accounts.vault.owner.as_ref(), &[bump]]];

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
    vault.tvl = vault
        .tvl
        .checked_sub(amount)
        .ok_or(ShadowError::MathOverflow)?;

    Ok(())
}
