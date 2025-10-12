use anchor_lang::prelude::*;

#[account]
pub struct VaultAccount {
    pub owner: Pubkey,
    // 32-byte hash of encrypted strategy commitment; reveals nothing about strategy
    pub encrypted_strategy_hash: [u8; 32],
    pub tvl: u64,
    pub execution_count: u64,
    pub is_paused: bool,
    pub bump: u8,
}

impl VaultAccount {
    pub const SEED_PREFIX: &'static [u8] = b"vault";

    pub fn space() -> usize {
        // discriminator + fields
        8 + // anchor discriminator
        32 + // owner
        32 + // encrypted_strategy_hash
        8 + // tvl
        8 + // execution_count
        1 + // is_paused
        1 // bump
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
    pub bump: u8,
}

impl TradeIntent {
    pub const SEED_PREFIX: &'static [u8] = b"intent";

    pub fn space() -> usize {
        8 + // disc
        32 + // user
        32 + // vault
        32 + // token_in
        32 + // token_out
        8 + // amount
        2 + // max_slippage_bps
        1 + // strategy_type
        8 + // timestamp
        1 // bump
    }
}

#[account]
pub struct ExecutionResult {
    pub intent: Pubkey,
    pub executed_amount: u64,
    pub received_amount: u64,
    pub success: bool,
    pub bump: u8,
}

impl ExecutionResult {
    pub const SEED_PREFIX: &'static [u8] = b"result";

    pub fn space() -> usize {
        8 + // disc
        32 + // intent
        8 + // executed_amount
        8 + // received_amount
        1 + // success
        1 // bump
    }
}
