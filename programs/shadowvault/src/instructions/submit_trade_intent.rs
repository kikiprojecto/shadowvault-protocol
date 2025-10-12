use anchor_lang::prelude::*;

use crate::errors::ShadowError;
use crate::state::{TradeIntent, VaultAccount};

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

pub fn handler(
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

    emit!(crate::TradeIntentSubmitted {
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
