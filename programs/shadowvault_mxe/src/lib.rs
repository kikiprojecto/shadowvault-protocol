use anchor_lang::prelude::*;
use arcium_mpc_sdk::{Enc, Shared};
use encrypted_ixs::{
    AddTogetherInputs, AddTogetherOutputs, VaultInitInputs, VaultInitOutputs, VaultAccount,
};

declare_id!("Br2ApMKRBGKfiCgmccs3yhFkQpsERND7ZA9i4Q3QRj97");

#[program]
pub mod shadowvault_mxe {
    use super::*;

    // ============================================================================
    // REFERENCE EXAMPLE - ADD TOGETHER (Kept as reference)
    // ============================================================================

    /// Initialize computation definition for add_together
    pub fn init_add_together_comp_def(ctx: Context<InitAddTogetherCompDef>) -> Result<()> {
        msg!("Initializing add_together computation definition");
        
        // Initialize computation definition for encrypted addition
        arcium_mpc_sdk::init_comp_def::<AddTogetherInputs, AddTogetherOutputs>(
            &ctx.accounts.comp_def,
            &ctx.accounts.payer,
            &ctx.accounts.system_program,
        )?;
        
        msg!("Add together computation definition initialized");
        Ok(())
    }

    /// Queue encrypted addition computation
    pub fn add_together(
        ctx: Context<AddTogether>,
        a: u64,
        b: u64,
    ) -> Result<()> {
        msg!("Queueing add_together computation: {} + {}", a, b);
        
        // Create encrypted inputs
        let inputs = AddTogetherInputs {
            a: Enc::<Shared, u64>::new(a),
            b: Enc::<Shared, u64>::new(b),
        };
        
        // Queue computation to Arcium MPC network
        arcium_mpc_sdk::queue_computation(
            &ctx.accounts.comp_def,
            &ctx.accounts.computation,
            &ctx.accounts.payer,
            &ctx.accounts.system_program,
            inputs,
        )?;
        
        msg!("Add together computation queued");
        Ok(())
    }

    /// Handle callback from add_together computation
    pub fn add_together_callback(ctx: Context<AddTogetherCallback>) -> Result<()> {
        msg!("Processing add_together callback");
        
        // Get encrypted result from MPC computation
        let result: AddTogetherOutputs = arcium_mpc_sdk::get_computation_result(
            &ctx.accounts.computation,
        )?;
        
        // Store result in result account
        ctx.accounts.result.sum = result.sum.value();
        
        msg!("Add together result: {}", ctx.accounts.result.sum);
        Ok(())
    }

    // ============================================================================
    // VAULT INITIALIZATION - ENCRYPTED VAULT CREATION
    // ============================================================================

    /// Initialize computation definition for initialize_vault
    pub fn init_initialize_vault_comp_def(
        ctx: Context<InitInitializeVaultCompDef>
    ) -> Result<()> {
        msg!("Initializing initialize_vault computation definition");
        
        // Initialize computation definition for encrypted vault initialization
        arcium_mpc_sdk::init_comp_def::<VaultInitInputs, VaultInitOutputs>(
            &ctx.accounts.comp_def,
            &ctx.accounts.payer,
            &ctx.accounts.system_program,
        )?;
        
        msg!("Initialize vault computation definition initialized");
        Ok(())
    }

    /// Queue encrypted vault initialization computation
    /// 
    /// This function:
    /// 1. Accepts encrypted initial balance as input
    /// 2. Creates a PDA account to store vault metadata
    /// 3. Queues computation to Arcium MPC network
    /// 4. Sets up callback for encrypted result
    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
        initial_balance: u64,
        bump: u8,
    ) -> Result<()> {
        msg!("Initializing encrypted vault for owner: {}", ctx.accounts.owner.key());
        msg!("Initial encrypted balance: {}", initial_balance);
        
        // Create encrypted inputs for MPC computation
        let inputs = VaultInitInputs {
            initial_balance,
            owner_pubkey: ctx.accounts.owner.key().to_bytes(),
        };
        
        // Initialize vault metadata PDA
        let vault_metadata = &mut ctx.accounts.vault_metadata;
        vault_metadata.owner = ctx.accounts.owner.key();
        vault_metadata.bump = bump;
        vault_metadata.computation_queued = true;
        vault_metadata.initialized = false;
        
        // Queue computation to Arcium MPC network
        arcium_mpc_sdk::queue_computation(
            &ctx.accounts.comp_def,
            &ctx.accounts.computation,
            &ctx.accounts.payer,
            &ctx.accounts.system_program,
            inputs,
        )?;
        
        msg!("Vault initialization computation queued");
        msg!("Vault metadata PDA: {}", vault_metadata.key());
        Ok(())
    }

    /// Handle callback from initialize_vault computation
    /// 
    /// This function:
    /// 1. Receives encrypted vault data from MPC network
    /// 2. Stores encrypted balance and metadata
    /// 3. Marks vault as initialized
    pub fn initialize_vault_callback(
        ctx: Context<InitializeVaultCallback>
    ) -> Result<()> {
        msg!("Processing initialize_vault callback");
        
        // Get encrypted result from MPC computation
        let result: VaultInitOutputs = arcium_mpc_sdk::get_computation_result(
            &ctx.accounts.computation,
        )?;
        
        // Store encrypted vault data
        let vault_data = &mut ctx.accounts.vault_data;
        vault_data.encrypted_balance = result.balance;
        vault_data.owner = result.owner;
        vault_data.is_active = result.is_active;
        vault_data.created_at = result.created_at;
        
        // Update vault metadata
        let vault_metadata = &mut ctx.accounts.vault_metadata;
        vault_metadata.initialized = true;
        vault_metadata.computation_queued = false;
        
        msg!("Vault initialized successfully");
        msg!("Owner: {:?}", vault_data.owner);
        msg!("Active: {}", vault_data.is_active);
        msg!("Created at: {}", vault_data.created_at);
        
        Ok(())
    }
}

// ============================================================================
// ACCOUNT STRUCTS - ADD TOGETHER (Reference)
// ============================================================================

#[derive(Accounts)]
pub struct InitAddTogetherCompDef<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// CHECK: Computation definition account
    #[account(mut)]
    pub comp_def: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddTogether<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// CHECK: Computation definition account
    pub comp_def: AccountInfo<'info>,
    
    /// CHECK: Computation account
    #[account(mut)]
    pub computation: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddTogetherCallback<'info> {
    /// CHECK: Computation account
    pub computation: AccountInfo<'info>,
    
    #[account(
        init_if_needed,
        payer = payer,
        space = 8 + 8,
        seeds = [b"result"],
        bump
    )]
    pub result: Account<'info, AddTogetherResult>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct AddTogetherResult {
    pub sum: u64,
}

// ============================================================================
// ACCOUNT STRUCTS - VAULT INITIALIZATION
// ============================================================================

#[derive(Accounts)]
pub struct InitInitializeVaultCompDef<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// CHECK: Computation definition account for vault initialization
    #[account(mut)]
    pub comp_def: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(initial_balance: u64, bump: u8)]
pub struct InitializeVault<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// The owner of the vault
    pub owner: Signer<'info>,
    
    /// CHECK: Computation definition account
    pub comp_def: AccountInfo<'info>,
    
    /// CHECK: Computation account for this vault initialization
    #[account(mut)]
    pub computation: AccountInfo<'info>,
    
    /// Vault metadata PDA - stores vault state and references
    #[account(
        init,
        payer = payer,
        space = 8 + VaultMetadata::SPACE,
        seeds = [b"vault_metadata", owner.key().as_ref()],
        bump
    )]
    pub vault_metadata: Account<'info, VaultMetadata>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeVaultCallback<'info> {
    /// CHECK: Computation account
    pub computation: AccountInfo<'info>,
    
    /// Vault metadata PDA
    #[account(
        mut,
        seeds = [b"vault_metadata", vault_metadata.owner.as_ref()],
        bump = vault_metadata.bump
    )]
    pub vault_metadata: Account<'info, VaultMetadata>,
    
    /// Vault data account - stores encrypted balance and vault state
    #[account(
        init,
        payer = payer,
        space = 8 + VaultData::SPACE,
        seeds = [b"vault_data", vault_metadata.owner.as_ref()],
        bump
    )]
    pub vault_data: Account<'info, VaultData>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// ============================================================================
// DATA STRUCTS
// ============================================================================

/// Vault metadata - stores vault state and references
#[account]
pub struct VaultMetadata {
    /// Owner of the vault
    pub owner: Pubkey,
    
    /// PDA bump seed
    pub bump: u8,
    
    /// Whether computation is queued
    pub computation_queued: bool,
    
    /// Whether vault is initialized
    pub initialized: bool,
}

impl VaultMetadata {
    pub const SPACE: usize = 32 + 1 + 1 + 1; // pubkey + 3 bools
}

/// Vault data - stores encrypted balance and vault state
#[account]
pub struct VaultData {
    /// Encrypted balance (stored as u64, but represents encrypted value)
    pub encrypted_balance: u64,
    
    /// Owner public key
    pub owner: [u8; 32],
    
    /// Vault active status
    pub is_active: bool,
    
    /// Creation timestamp
    pub created_at: i64,
}

impl VaultData {
    pub const SPACE: usize = 8 + 32 + 1 + 8; // u64 + [u8;32] + bool + i64
}
