use anchor_lang::prelude::*;

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
