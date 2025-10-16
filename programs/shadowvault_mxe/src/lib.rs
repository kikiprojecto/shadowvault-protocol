use anchor_lang::prelude::*;
use arcium_anchor::prelude::*;

declare_id!("11111111111111111111111111111111");

#[arcium_program]
pub mod shadowvault_mxe {
    use super::*;

    pub fn init_initialize_vault_comp_def(ctx: Context<InitInitializeVaultCompDef>) -> Result<()> {
        init_comp_def(ctx.accounts, true, 0, None, None)?;
        Ok(())
    }

    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
        computation_offset: u64,
        encrypted_balance: [u8; 32],
        pub_key: [u8; 32],
        nonce: u128,
    ) -> Result<()> {
        ctx.accounts.sign_pda_account.bump = ctx.bumps.sign_pda_account;
        
        let args = vec![
            Argument::ArcisPubkey(pub_key),
            Argument::PlaintextU128(nonce),
            Argument::EncryptedU64(encrypted_balance),
        ];
        
        queue_computation(
            ctx.accounts,
            computation_offset,
            args,
            None,
            vec![InitializeVaultCallback::callback_ix(&[])],
        )?;
        Ok(())
    }

    #[arcium_callback(encrypted_ix = "initialize_vault")]
    pub fn initialize_vault_callback(
        ctx: Context<InitializeVaultCallback>,
        output: ComputationOutputs<InitializeVaultOutput>,
    ) -> Result<()> {
        match output {
            ComputationOutputs::Success(_data) => {},
            _ => return Err(VaultError::AbortedComputation.into()),
        };

        emit!(VaultInitializedEvent {
            vault: ctx.accounts.vault_account.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }
}

#[init_computation_definition_accounts("initialize_vault", payer)]
#[derive(Accounts)]
pub struct InitInitializeVaultCompDef<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
}

#[queue_computation_accounts("initialize_vault", payer)]
#[derive(Accounts)]
#[instruction(computation_offset: u64)]
pub struct InitializeVault<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account(
        init_if_needed,
        space = 9,
        payer = payer,
        seeds = [&SIGN_PDA_SEED],
        bump,
        address = derive_sign_pda!(),
    )]
    pub sign_pda_account: Account<'info, SignerAccount>,
    
    #[account(
        init,
        payer = payer,
        space = 8 + 32 + 1 + 8,
        seeds = [b"vault", payer.key().as_ref()],
        bump,
    )]
    pub vault_account: Account<'info, VaultAccount>,
    
    #[account(address = derive_mxe_pda!())]
    pub mxe_account: Account<'info, MXEAccount>,
    
    pub system_program: Program<'info, System>,
}

#[callback_accounts("initialize_vault", payer)]
#[derive(Accounts)]
pub struct InitializeVaultCallback<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account(mut)]
    pub vault_account: Account<'info, VaultAccount>,
}

#[account]
pub struct VaultAccount {
    pub owner: Pubkey,
    pub is_active: bool,
    pub created_at: i64,
}

#[event]
pub struct VaultInitializedEvent {
    pub vault: Pubkey,
    pub timestamp: i64,
}

#[error_code]
pub enum VaultError {
    #[msg("Computation aborted")]
    AbortedComputation,
    #[msg("Invalid vault state")]
    InvalidVaultState,
}
