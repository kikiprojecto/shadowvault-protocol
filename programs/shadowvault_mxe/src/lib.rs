use anchor_lang::prelude::*;
use arcium_mpc_sdk::{Enc, Shared};
use encrypted_ixs::{
    AddTogetherInputs, AddTogetherOutputs, VaultInitInputs, VaultInitOutputs, VaultAccount,
    DepositInputs, BalanceCheckInputs, BalanceCheckResult, WithdrawInputs, WithdrawResult,
    TransferInputs, TransferResult,
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
        
        // Validate initial balance is not zero
        require!(
            initial_balance > 0,
            VaultError::InvalidVaultState
        );
        
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
        
        // Validate vault is not already initialized
        require!(
            !ctx.accounts.vault_metadata.initialized,
            VaultError::InvalidVaultState
        );
        
        // Get encrypted result from MPC computation
        let result: VaultInitOutputs = arcium_mpc_sdk::get_computation_result(
            &ctx.accounts.computation,
        ).map_err(|_| VaultError::AbortedComputation)?;
        
        // Validate owner matches metadata
        require!(
            result.owner == ctx.accounts.vault_metadata.owner.to_bytes(),
            VaultError::InvalidOwner
        );
        
        // Validate vault is active
        require!(
            result.is_active,
            VaultError::VaultNotActive
        );
        
        // Store encrypted vault data
        let vault_data = &mut ctx.accounts.vault_data;
        vault_data.encrypted_balance = result.balance;
        vault_data.encrypted_total_deposits = 0; // Initialize to 0
        vault_data.encrypted_total_withdrawals = 0; // Initialize to 0
        vault_data.encrypted_tx_count = 0; // Initialize to 0
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

    // ============================================================================
    // DEPOSIT OPERATION - ENCRYPTED DEPOSIT TO VAULT
    // ============================================================================

    /// Initialize computation definition for deposit
    pub fn init_deposit_comp_def(
        ctx: Context<InitDepositCompDef>
    ) -> Result<()> {
        msg!("Initializing deposit computation definition");
        
        // Initialize computation definition for encrypted deposit
        arcium_mpc_sdk::init_comp_def::<(VaultAccount, DepositInputs), VaultAccount>(
            &ctx.accounts.comp_def,
            &ctx.accounts.payer,
            &ctx.accounts.system_program,
        )?;
        
        msg!("Deposit computation definition initialized");
        Ok(())
    }

    /// Queue encrypted deposit computation
    /// 
    /// This function:
    /// 1. Validates vault ownership
    /// 2. Loads current encrypted vault state
    /// 3. Creates encrypted deposit inputs
    /// 4. Queues computation to Arcium MPC network
    /// 5. Sets up callback to update vault
    pub fn deposit(
        ctx: Context<Deposit>,
        amount: u64,
    ) -> Result<()> {
        msg!("Processing deposit for vault: {}", ctx.accounts.vault_metadata.key());
        msg!("Deposit amount (encrypted): {}", amount);
        
        // Validate deposit amount is greater than zero
        require!(
            amount > 0,
            VaultError::InvalidVaultState
        );
        
        // Validate vault is initialized
        require!(
            ctx.accounts.vault_metadata.initialized,
            VaultError::VaultNotInitialized
        );
        
        // Validate vault is active
        require!(
            ctx.accounts.vault_data.is_active,
            VaultError::VaultNotActive
        );
        
        // Validate owner
        require!(
            ctx.accounts.owner.key() == ctx.accounts.vault_metadata.owner,
            VaultError::UnauthorizedAccess
        );
        
        // Load current vault state for MPC computation
        let current_vault = VaultAccount {
            encrypted_balance: ctx.accounts.vault_data.encrypted_balance,
            encrypted_total_deposits: ctx.accounts.vault_data.encrypted_total_deposits,
            encrypted_total_withdrawals: ctx.accounts.vault_data.encrypted_total_withdrawals,
            encrypted_tx_count: ctx.accounts.vault_data.encrypted_tx_count,
            owner: ctx.accounts.vault_data.owner,
            created_at: ctx.accounts.vault_data.created_at,
            is_active: ctx.accounts.vault_data.is_active,
        };
        
        // Create encrypted deposit inputs
        let deposit_inputs = DepositInputs {
            amount,
        };
        
        // Queue computation to Arcium MPC network
        // The MPC will perform: new_balance = current_balance + amount (encrypted)
        arcium_mpc_sdk::queue_computation(
            &ctx.accounts.comp_def,
            &ctx.accounts.computation,
            &ctx.accounts.payer,
            &ctx.accounts.system_program,
            (current_vault, deposit_inputs),
        )?;
        
        // Update metadata to track computation
        let vault_metadata = &mut ctx.accounts.vault_metadata;
        vault_metadata.computation_queued = true;
        
        msg!("Deposit computation queued successfully");
        Ok(())
    }

    /// Handle callback from deposit computation
    /// 
    /// This function:
    /// 1. Receives updated encrypted vault from MPC
    /// 2. Updates vault account with new encrypted balance
    /// 3. Updates total deposits and transaction count
    /// 4. Marks computation as complete
    pub fn deposit_callback(
        ctx: Context<DepositCallback>
    ) -> Result<()> {
        msg!("Processing deposit callback");
        
        // Validate vault is still active
        require!(
            ctx.accounts.vault_data.is_active,
            VaultError::VaultNotActive
        );
        
        // Get encrypted result from MPC computation
        let updated_vault: VaultAccount = arcium_mpc_sdk::get_computation_result(
            &ctx.accounts.computation,
        ).map_err(|_| VaultError::AbortedComputation)?;
        
        // Validate vault owner matches
        require!(
            updated_vault.owner == ctx.accounts.vault_data.owner,
            VaultError::InvalidOwner
        );
        
        // Update vault data with new encrypted values
        let vault_data = &mut ctx.accounts.vault_data;
        vault_data.encrypted_balance = updated_vault.encrypted_balance;
        vault_data.encrypted_total_deposits = updated_vault.encrypted_total_deposits;
        vault_data.encrypted_tx_count = updated_vault.encrypted_tx_count;
        
        // Update metadata
        let vault_metadata = &mut ctx.accounts.vault_metadata;
        vault_metadata.computation_queued = false;
        
        msg!("Deposit completed successfully");
        msg!("New encrypted balance stored");
        msg!("Transaction count updated");
        
        Ok(())
    }

    // ============================================================================
    // BALANCE CHECK OPERATION - ENCRYPTED BALANCE QUERY
    // ============================================================================

    /// Initialize computation definition for balance check
    pub fn init_check_balance_sufficient_comp_def(
        ctx: Context<InitCheckBalanceSufficientCompDef>
    ) -> Result<()> {
        msg!("Initializing check_balance_sufficient computation definition");
        
        // Initialize computation definition for encrypted balance check
        arcium_mpc_sdk::init_comp_def::<(VaultAccount, BalanceCheckInputs), BalanceCheckResult>(
            &ctx.accounts.comp_def,
            &ctx.accounts.payer,
            &ctx.accounts.system_program,
        )?;
        
        msg!("Check balance sufficient computation definition initialized");
        Ok(())
    }

    /// Queue encrypted balance check computation
    /// 
    /// This function:
    /// 1. Validates vault ownership
    /// 2. Loads current encrypted vault state
    /// 3. Creates balance check inputs with required amount
    /// 4. Queues computation to Arcium MPC network
    /// 5. Sets up callback to emit result event
    pub fn check_balance_sufficient(
        ctx: Context<CheckBalanceSufficient>,
        required_amount: u64,
    ) -> Result<()> {
        msg!("Checking balance sufficiency for vault: {}", ctx.accounts.vault_metadata.key());
        msg!("Required amount (encrypted): {}", required_amount);
        
        // Validate vault is initialized
        require!(
            ctx.accounts.vault_metadata.initialized,
            VaultError::VaultNotInitialized
        );
        
        // Validate vault is active
        require!(
            ctx.accounts.vault_data.is_active,
            VaultError::VaultNotActive
        );
        
        // Validate owner
        require!(
            ctx.accounts.owner.key() == ctx.accounts.vault_metadata.owner,
            VaultError::UnauthorizedAccess
        );
        
        // Load current vault state for MPC computation
        let current_vault = VaultAccount {
            encrypted_balance: ctx.accounts.vault_data.encrypted_balance,
            encrypted_total_deposits: ctx.accounts.vault_data.encrypted_total_deposits,
            encrypted_total_withdrawals: ctx.accounts.vault_data.encrypted_total_withdrawals,
            encrypted_tx_count: ctx.accounts.vault_data.encrypted_tx_count,
            owner: ctx.accounts.vault_data.owner,
            created_at: ctx.accounts.vault_data.created_at,
            is_active: ctx.accounts.vault_data.is_active,
        };
        
        // Create balance check inputs
        let check_inputs = BalanceCheckInputs {
            required_amount,
        };
        
        // Queue computation to Arcium MPC network
        // The MPC will perform: balance >= required_amount (encrypted comparison)
        arcium_mpc_sdk::queue_computation(
            &ctx.accounts.comp_def,
            &ctx.accounts.computation,
            &ctx.accounts.payer,
            &ctx.accounts.system_program,
            (current_vault, check_inputs),
        )?;
        
        msg!("Balance check computation queued successfully");
        Ok(())
    }

    /// Handle callback from balance check computation
    /// 
    /// This function:
    /// 1. Receives encrypted balance check result from MPC
    /// 2. Emits event with encrypted result
    /// 3. Does NOT modify vault state (read-only operation)
    pub fn check_balance_sufficient_callback(
        ctx: Context<CheckBalanceSufficientCallback>
    ) -> Result<()> {
        msg!("Processing check_balance_sufficient callback");
        
        // Validate vault is initialized
        require!(
            ctx.accounts.vault_metadata.initialized,
            VaultError::VaultNotInitialized
        );
        
        // Get encrypted result from MPC computation
        let check_result: BalanceCheckResult = arcium_mpc_sdk::get_computation_result(
            &ctx.accounts.computation,
        ).map_err(|_| VaultError::AbortedComputation)?;
        
        // Get current timestamp
        let clock = Clock::get()?;
        let timestamp = clock.unix_timestamp;
        
        // Emit event with encrypted result
        emit!(BalanceCheckEvent {
            vault: ctx.accounts.vault_metadata.key(),
            is_sufficient: check_result.is_sufficient,
            encrypted_balance: check_result.balance,
            timestamp,
        });
        
        msg!("Balance check completed successfully");
        msg!("Result emitted as event (encrypted)");
        
        Ok(())
    }

    // ============================================================================
    // WITHDRAW OPERATION - ENCRYPTED WITHDRAWAL WITH VALIDATION
    // ============================================================================

    /// Initialize computation definition for withdraw
    pub fn init_withdraw_comp_def(
        ctx: Context<InitWithdrawCompDef>
    ) -> Result<()> {
        msg!("Initializing withdraw computation definition");
        
        // Initialize computation definition for encrypted withdrawal
        arcium_mpc_sdk::init_comp_def::<(VaultAccount, WithdrawInputs), WithdrawResult>(
            &ctx.accounts.comp_def,
            &ctx.accounts.payer,
            &ctx.accounts.system_program,
        )?;
        
        msg!("Withdraw computation definition initialized");
        Ok(())
    }

    /// Queue encrypted withdrawal computation
    /// 
    /// This function:
    /// 1. Validates vault ownership and state
    /// 2. Loads current encrypted vault state
    /// 3. Creates encrypted withdrawal inputs
    /// 4. Queues computation to Arcium MPC network
    /// 5. MPC performs balance check and conditional withdrawal
    pub fn withdraw(
        ctx: Context<Withdraw>,
        amount: u64,
    ) -> Result<()> {
        msg!("Processing withdrawal for vault: {}", ctx.accounts.vault_metadata.key());
        msg!("Withdrawal amount (encrypted): {}", amount);
        
        // Validate withdrawal amount is greater than zero
        require!(
            amount > 0,
            VaultError::InvalidVaultState
        );
        
        // Validate vault is initialized
        require!(
            ctx.accounts.vault_metadata.initialized,
            VaultError::VaultNotInitialized
        );
        
        // Validate vault is active
        require!(
            ctx.accounts.vault_data.is_active,
            VaultError::VaultNotActive
        );
        
        // Validate owner
        require!(
            ctx.accounts.owner.key() == ctx.accounts.vault_metadata.owner,
            VaultError::UnauthorizedAccess
        );
        
        // Validate no computation is already queued
        require!(
            !ctx.accounts.vault_metadata.computation_queued,
            VaultError::ComputationQueued
        );
        
        // Load current vault state for MPC computation
        let current_vault = VaultAccount {
            encrypted_balance: ctx.accounts.vault_data.encrypted_balance,
            encrypted_total_deposits: ctx.accounts.vault_data.encrypted_total_deposits,
            encrypted_total_withdrawals: ctx.accounts.vault_data.encrypted_total_withdrawals,
            encrypted_tx_count: ctx.accounts.vault_data.encrypted_tx_count,
            owner: ctx.accounts.vault_data.owner,
            created_at: ctx.accounts.vault_data.created_at,
            is_active: ctx.accounts.vault_data.is_active,
        };
        
        // Create encrypted withdrawal inputs
        let withdraw_inputs = WithdrawInputs {
            amount,
        };
        
        // Queue computation to Arcium MPC network
        // The MPC will:
        // 1. Check if balance >= amount (encrypted)
        // 2. If sufficient: new_balance = balance - amount
        // 3. If insufficient: balance unchanged
        // 4. Return updated vault and success flag
        arcium_mpc_sdk::queue_computation(
            &ctx.accounts.comp_def,
            &ctx.accounts.computation,
            &ctx.accounts.payer,
            &ctx.accounts.system_program,
            (current_vault, withdraw_inputs),
        )?;
        
        // Update metadata to track computation
        let vault_metadata = &mut ctx.accounts.vault_metadata;
        vault_metadata.computation_queued = true;
        
        msg!("Withdrawal computation queued successfully");
        Ok(())
    }

    /// Handle callback from withdrawal computation
    /// 
    /// This function:
    /// 1. Receives encrypted withdrawal result from MPC
    /// 2. Updates vault if withdrawal was successful
    /// 3. Emits event with encrypted result
    /// 4. Handles failure case (insufficient balance)
    pub fn withdraw_callback(
        ctx: Context<WithdrawCallback>
    ) -> Result<()> {
        msg!("Processing withdraw callback");
        
        // Validate vault is still active
        require!(
            ctx.accounts.vault_data.is_active,
            VaultError::VaultNotActive
        );
        
        // Get encrypted result from MPC computation
        let withdraw_result: WithdrawResult = arcium_mpc_sdk::get_computation_result(
            &ctx.accounts.computation,
        ).map_err(|_| VaultError::AbortedComputation)?;
        
        // Get current timestamp
        let clock = Clock::get()?;
        let timestamp = clock.unix_timestamp;
        
        // Update vault data with new encrypted values
        let vault_data = &mut ctx.accounts.vault_data;
        
        // Always update vault state (even on failure, values unchanged)
        vault_data.encrypted_balance = withdraw_result.new_vault.encrypted_balance;
        vault_data.encrypted_total_withdrawals = withdraw_result.new_vault.encrypted_total_withdrawals;
        vault_data.encrypted_tx_count = withdraw_result.new_vault.encrypted_tx_count;
        
        // Update metadata
        let vault_metadata = &mut ctx.accounts.vault_metadata;
        vault_metadata.computation_queued = false;
        
        // Emit event with encrypted result
        emit!(WithdrawEvent {
            vault: ctx.accounts.vault_metadata.key(),
            success: withdraw_result.success,
            encrypted_new_balance: withdraw_result.new_vault.encrypted_balance,
            timestamp,
        });
        
        if withdraw_result.success {
            msg!("Withdrawal completed successfully");
            msg!("New encrypted balance stored");
        } else {
            msg!("Withdrawal failed: insufficient balance");
            msg!("Vault state unchanged (balance insufficient)");
            // Note: We don't return an error here because the MPC computation
            // succeeded, it just determined the balance was insufficient
        }
        
        Ok(())
    }

    // ============================================================================
    // TRANSFER OPERATION - ENCRYPTED VAULT-TO-VAULT TRANSFER
    // ============================================================================

    /// Initialize computation definition for transfer
    pub fn init_transfer_comp_def(
        ctx: Context<InitTransferCompDef>
    ) -> Result<()> {
        msg!("Initializing transfer computation definition");
        
        // Initialize computation definition for encrypted vault-to-vault transfer
        arcium_mpc_sdk::init_comp_def::<TransferInputs, TransferResult>(
            &ctx.accounts.comp_def,
            &ctx.accounts.payer,
            &ctx.accounts.system_program,
        )?;
        
        msg!("Transfer computation definition initialized");
        Ok(())
    }

    /// Queue encrypted vault-to-vault transfer computation
    /// 
    /// This function:
    /// 1. Validates both source and destination vaults exist and are active
    /// 2. Validates source vault ownership (must sign)
    /// 3. Loads both encrypted vault states
    /// 4. Creates transfer inputs with both vaults and amount
    /// 5. Queues computation to Arcium MPC network
    /// 6. MPC performs balance check and atomic transfer
    pub fn transfer(
        ctx: Context<Transfer>,
        amount: u64,
    ) -> Result<()> {
        msg!("Processing transfer between vaults");
        msg!("From vault: {}", ctx.accounts.from_vault_metadata.key());
        msg!("To vault: {}", ctx.accounts.to_vault_metadata.key());
        msg!("Transfer amount (encrypted): {}", amount);
        
        // Validate transfer amount is greater than zero
        require!(
            amount > 0,
            VaultError::InvalidVaultState
        );
        
        // Validate vaults are different (cannot transfer to self)
        require!(
            ctx.accounts.from_vault_metadata.key() != ctx.accounts.to_vault_metadata.key(),
            VaultError::SelfTransferNotAllowed
        );
        
        // Validate source vault is initialized
        require!(
            ctx.accounts.from_vault_metadata.initialized,
            VaultError::VaultNotInitialized
        );
        
        // Validate destination vault is initialized
        require!(
            ctx.accounts.to_vault_metadata.initialized,
            VaultError::VaultNotInitialized
        );
        
        // Validate source vault is active
        require!(
            ctx.accounts.from_vault_data.is_active,
            VaultError::VaultNotActive
        );
        
        // Validate destination vault is active
        require!(
            ctx.accounts.to_vault_data.is_active,
            VaultError::VaultNotActive
        );
        
        // Validate source vault owner
        require!(
            ctx.accounts.from_owner.key() == ctx.accounts.from_vault_metadata.owner,
            VaultError::UnauthorizedAccess
        );
        
        // Validate no computation is already queued on source vault
        require!(
            !ctx.accounts.from_vault_metadata.computation_queued,
            VaultError::ComputationQueued
        );
        
        // Validate vaults are different (cannot transfer to self)
        require!(
            ctx.accounts.from_vault_metadata.key() != ctx.accounts.to_vault_metadata.key(),
            VaultError::InvalidVaultState
        );
        
        // Load source vault state for MPC computation
        let from_vault = VaultAccount {
            encrypted_balance: ctx.accounts.from_vault_data.encrypted_balance,
            encrypted_total_deposits: ctx.accounts.from_vault_data.encrypted_total_deposits,
            encrypted_total_withdrawals: ctx.accounts.from_vault_data.encrypted_total_withdrawals,
            encrypted_tx_count: ctx.accounts.from_vault_data.encrypted_tx_count,
            owner: ctx.accounts.from_vault_data.owner,
            created_at: ctx.accounts.from_vault_data.created_at,
            is_active: ctx.accounts.from_vault_data.is_active,
        };
        
        // Load destination vault state for MPC computation
        let to_vault = VaultAccount {
            encrypted_balance: ctx.accounts.to_vault_data.encrypted_balance,
            encrypted_total_deposits: ctx.accounts.to_vault_data.encrypted_total_deposits,
            encrypted_total_withdrawals: ctx.accounts.to_vault_data.encrypted_total_withdrawals,
            encrypted_tx_count: ctx.accounts.to_vault_data.encrypted_tx_count,
            owner: ctx.accounts.to_vault_data.owner,
            created_at: ctx.accounts.to_vault_data.created_at,
            is_active: ctx.accounts.to_vault_data.is_active,
        };
        
        // Create encrypted transfer inputs
        let transfer_inputs = TransferInputs {
            from_vault,
            to_vault,
            amount,
        };
        
        // Queue computation to Arcium MPC network
        // The MPC will:
        // 1. Check if from_vault.balance >= amount (encrypted)
        // 2. If sufficient: from_balance -= amount, to_balance += amount
        // 3. If insufficient: both balances unchanged
        // 4. Return both updated vaults and success flag
        arcium_mpc_sdk::queue_computation(
            &ctx.accounts.comp_def,
            &ctx.accounts.computation,
            &ctx.accounts.payer,
            &ctx.accounts.system_program,
            transfer_inputs,
        )?;
        
        // Update source vault metadata to track computation
        let from_vault_metadata = &mut ctx.accounts.from_vault_metadata;
        from_vault_metadata.computation_queued = true;
        
        msg!("Transfer computation queued successfully");
        Ok(())
    }

    /// Handle callback from transfer computation
    /// 
    /// This function:
    /// 1. Receives encrypted transfer result from MPC
    /// 2. Updates both vaults if transfer was successful
    /// 3. Emits event with encrypted result
    /// 4. Handles failure case (insufficient balance)
    pub fn transfer_callback(
        ctx: Context<TransferCallback>,
        amount: u64,
    ) -> Result<()> {
        msg!("Processing transfer callback");
        
        // Validate both vaults are still active
        require!(
            ctx.accounts.from_vault_data.is_active,
            VaultError::VaultNotActive
        );
        require!(
            ctx.accounts.to_vault_data.is_active,
            VaultError::VaultNotActive
        );
        
        // Validate vaults are different
        require!(
            ctx.accounts.from_vault_metadata.key() != ctx.accounts.to_vault_metadata.key(),
            VaultError::SelfTransferNotAllowed
        );
        
        // Get encrypted result from MPC computation
        let transfer_result: TransferResult = arcium_mpc_sdk::get_computation_result(
            &ctx.accounts.computation,
        ).map_err(|_| VaultError::AbortedComputation)?;
        
        // Validate vault owners match
        require!(
            transfer_result.updated_from_vault.owner == ctx.accounts.from_vault_data.owner,
            VaultError::InvalidOwner
        );
        require!(
            transfer_result.updated_to_vault.owner == ctx.accounts.to_vault_data.owner,
            VaultError::InvalidOwner
        );
        
        // Get current timestamp
        let clock = Clock::get()?;
        let timestamp = clock.unix_timestamp;
        
        // Update vault data based on success status
        if transfer_result.success {
            // SUCCESS: Update both vaults with new encrypted balances
            
            // Update source vault
            let from_vault_data = &mut ctx.accounts.from_vault_data;
            from_vault_data.encrypted_balance = transfer_result.updated_from_vault.encrypted_balance;
            from_vault_data.encrypted_total_withdrawals = transfer_result.updated_from_vault.encrypted_total_withdrawals;
            from_vault_data.encrypted_tx_count = transfer_result.updated_from_vault.encrypted_tx_count;
            
            // Update destination vault
            let to_vault_data = &mut ctx.accounts.to_vault_data;
            to_vault_data.encrypted_balance = transfer_result.updated_to_vault.encrypted_balance;
            to_vault_data.encrypted_total_deposits = transfer_result.updated_to_vault.encrypted_total_deposits;
            to_vault_data.encrypted_tx_count = transfer_result.updated_to_vault.encrypted_tx_count;
            
            msg!("Transfer completed successfully");
            msg!("Both vaults updated with new encrypted balances");
        } else {
            // FAILURE: Don't update anything (balances unchanged)
            msg!("Transfer failed: insufficient balance in source vault");
            msg!("Both vaults unchanged (balance insufficient)");
            // Note: We don't return an error here because the MPC computation
            // succeeded, it just determined the balance was insufficient
        }
        
        // Update source vault metadata
        let from_vault_metadata = &mut ctx.accounts.from_vault_metadata;
        from_vault_metadata.computation_queued = false;
        
        // Emit event with encrypted result
        emit!(TransferEvent {
            from_vault: ctx.accounts.from_vault_metadata.key(),
            to_vault: ctx.accounts.to_vault_metadata.key(),
            encrypted_amount: amount,
            success: transfer_result.success,
            timestamp,
        });
        
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
// ACCOUNT STRUCTS - DEPOSIT OPERATION
// ============================================================================

#[derive(Accounts)]
pub struct InitDepositCompDef<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// CHECK: Computation definition account for deposit
    #[account(mut)]
    pub comp_def: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// The owner of the vault (must sign)
    pub owner: Signer<'info>,
    
    /// CHECK: Computation definition account
    pub comp_def: AccountInfo<'info>,
    
    /// CHECK: Computation account for this deposit
    #[account(mut)]
    pub computation: AccountInfo<'info>,
    
    /// Vault metadata PDA
    #[account(
        mut,
        seeds = [b"vault_metadata", owner.key().as_ref()],
        bump = vault_metadata.bump,
        constraint = vault_metadata.owner == owner.key() @ VaultError::UnauthorizedAccess
    )]
    pub vault_metadata: Account<'info, VaultMetadata>,
    
    /// Vault data account
    #[account(
        mut,
        seeds = [b"vault_data", owner.key().as_ref()],
        bump,
        constraint = vault_data.owner == owner.key().to_bytes() @ VaultError::UnauthorizedAccess
    )]
    pub vault_data: Account<'info, VaultData>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositCallback<'info> {
    /// CHECK: Computation account
    pub computation: AccountInfo<'info>,
    
    /// Vault metadata PDA
    #[account(
        mut,
        seeds = [b"vault_metadata", vault_metadata.owner.as_ref()],
        bump = vault_metadata.bump
    )]
    pub vault_metadata: Account<'info, VaultMetadata>,
    
    /// Vault data account to update
    #[account(
        mut,
        seeds = [b"vault_data", vault_metadata.owner.as_ref()],
        bump
    )]
    pub vault_data: Account<'info, VaultData>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// ============================================================================
// ACCOUNT STRUCTS - BALANCE CHECK OPERATION
// ============================================================================

#[derive(Accounts)]
pub struct InitCheckBalanceSufficientCompDef<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// CHECK: Computation definition account for balance check
    #[account(mut)]
    pub comp_def: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CheckBalanceSufficient<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// The owner of the vault (must sign)
    pub owner: Signer<'info>,
    
    /// CHECK: Computation definition account
    pub comp_def: AccountInfo<'info>,
    
    /// CHECK: Computation account for this balance check
    #[account(mut)]
    pub computation: AccountInfo<'info>,
    
    /// Vault metadata PDA
    #[account(
        seeds = [b"vault_metadata", owner.key().as_ref()],
        bump = vault_metadata.bump,
        constraint = vault_metadata.owner == owner.key() @ VaultError::UnauthorizedAccess
    )]
    pub vault_metadata: Account<'info, VaultMetadata>,
    
    /// Vault data account (read-only for balance check)
    #[account(
        seeds = [b"vault_data", owner.key().as_ref()],
        bump,
        constraint = vault_data.owner == owner.key().to_bytes() @ VaultError::UnauthorizedAccess
    )]
    pub vault_data: Account<'info, VaultData>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CheckBalanceSufficientCallback<'info> {
    /// CHECK: Computation account
    pub computation: AccountInfo<'info>,
    
    /// Vault metadata PDA (read-only)
    #[account(
        seeds = [b"vault_metadata", vault_metadata.owner.as_ref()],
        bump = vault_metadata.bump
    )]
    pub vault_metadata: Account<'info, VaultMetadata>,
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
    
    /// Encrypted total deposits
    pub encrypted_total_deposits: u64,
    
    /// Encrypted total withdrawals
    pub encrypted_total_withdrawals: u64,
    
    /// Encrypted transaction count
    pub encrypted_tx_count: u64,
    
    /// Owner public key
    pub owner: [u8; 32],
    
    /// Vault active status
    pub is_active: bool,
    
    /// Creation timestamp
    pub created_at: i64,
}

impl VaultData {
    pub const SPACE: usize = 8 + 8 + 8 + 8 + 32 + 1 + 8; // 4 u64s + [u8;32] + bool + i64
}

// ============================================================================
// ACCOUNT STRUCTS - WITHDRAW OPERATION
// ============================================================================

#[derive(Accounts)]
pub struct InitWithdrawCompDef<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// CHECK: Computation definition account for withdraw
    #[account(mut)]
    pub comp_def: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// The owner of the vault (must sign)
    pub owner: Signer<'info>,
    
    /// CHECK: Computation definition account
    pub comp_def: AccountInfo<'info>,
    
    /// CHECK: Computation account for this withdrawal
    #[account(mut)]
    pub computation: AccountInfo<'info>,
    
    /// Vault metadata PDA
    #[account(
        mut,
        seeds = [b"vault_metadata", owner.key().as_ref()],
        bump = vault_metadata.bump,
        constraint = vault_metadata.owner == owner.key() @ VaultError::UnauthorizedAccess,
        constraint = vault_metadata.initialized @ VaultError::VaultNotInitialized,
        constraint = !vault_metadata.computation_queued @ VaultError::ComputationQueued
    )]
    pub vault_metadata: Account<'info, VaultMetadata>,
    
    /// Vault data account
    #[account(
        mut,
        seeds = [b"vault_data", owner.key().as_ref()],
        bump,
        constraint = vault_data.owner == owner.key().to_bytes() @ VaultError::UnauthorizedAccess,
        constraint = vault_data.is_active @ VaultError::VaultNotActive
    )]
    pub vault_data: Account<'info, VaultData>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawCallback<'info> {
    /// CHECK: Computation account
    pub computation: AccountInfo<'info>,
    
    /// Vault metadata PDA
    #[account(
        mut,
        seeds = [b"vault_metadata", vault_metadata.owner.as_ref()],
        bump = vault_metadata.bump
    )]
    pub vault_metadata: Account<'info, VaultMetadata>,
    
    /// Vault data account to update
    #[account(
        mut,
        seeds = [b"vault_data", vault_metadata.owner.as_ref()],
        bump
    )]
    pub vault_data: Account<'info, VaultData>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// ============================================================================
// ACCOUNT STRUCTS - TRANSFER OPERATION
// ============================================================================

#[derive(Accounts)]
pub struct InitTransferCompDef<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// CHECK: Computation definition account for transfer
    #[account(mut)]
    pub comp_def: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// The owner of the source vault (must sign)
    pub from_owner: Signer<'info>,
    
    /// CHECK: Computation definition account
    pub comp_def: AccountInfo<'info>,
    
    /// CHECK: Computation account for this transfer
    #[account(mut)]
    pub computation: AccountInfo<'info>,
    
    /// Source vault metadata PDA
    #[account(
        mut,
        seeds = [b"vault_metadata", from_owner.key().as_ref()],
        bump = from_vault_metadata.bump,
        constraint = from_vault_metadata.owner == from_owner.key() @ VaultError::UnauthorizedAccess,
        constraint = from_vault_metadata.initialized @ VaultError::VaultNotInitialized,
        constraint = !from_vault_metadata.computation_queued @ VaultError::ComputationQueued
    )]
    pub from_vault_metadata: Account<'info, VaultMetadata>,
    
    /// Source vault data account
    #[account(
        seeds = [b"vault_data", from_owner.key().as_ref()],
        bump,
        constraint = from_vault_data.owner == from_owner.key().to_bytes() @ VaultError::UnauthorizedAccess,
        constraint = from_vault_data.is_active @ VaultError::VaultNotActive
    )]
    pub from_vault_data: Account<'info, VaultData>,
    
    /// Destination vault metadata PDA
    /// CHECK: We validate it exists and is initialized in the function
    #[account(
        seeds = [b"vault_metadata", to_vault_metadata.owner.as_ref()],
        bump = to_vault_metadata.bump,
        constraint = to_vault_metadata.initialized @ VaultError::VaultNotInitialized,
        constraint = from_vault_metadata.key() != to_vault_metadata.key() @ VaultError::InvalidVaultState
    )]
    pub to_vault_metadata: Account<'info, VaultMetadata>,
    
    /// Destination vault data account
    #[account(
        seeds = [b"vault_data", to_vault_metadata.owner.as_ref()],
        bump,
        constraint = to_vault_data.is_active @ VaultError::VaultNotActive
    )]
    pub to_vault_data: Account<'info, VaultData>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferCallback<'info> {
    /// CHECK: Computation account
    pub computation: AccountInfo<'info>,
    
    /// Source vault metadata PDA
    #[account(
        mut,
        seeds = [b"vault_metadata", from_vault_metadata.owner.as_ref()],
        bump = from_vault_metadata.bump
    )]
    pub from_vault_metadata: Account<'info, VaultMetadata>,
    
    /// Source vault data account to update
    #[account(
        mut,
        seeds = [b"vault_data", from_vault_metadata.owner.as_ref()],
        bump
    )]
    pub from_vault_data: Account<'info, VaultData>,
    
    /// Destination vault metadata PDA
    #[account(
        seeds = [b"vault_metadata", to_vault_metadata.owner.as_ref()],
        bump = to_vault_metadata.bump
    )]
    pub to_vault_metadata: Account<'info, VaultMetadata>,
    
    /// Destination vault data account to update
    #[account(
        mut,
        seeds = [b"vault_data", to_vault_metadata.owner.as_ref()],
        bump
    )]
    pub to_vault_data: Account<'info, VaultData>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// ============================================================================
// ERROR CODES
// ============================================================================

#[error_code]
pub enum VaultError {
    #[msg("Vault is not initialized")]
    VaultNotInitialized,
    
    #[msg("Vault is not active")]
    VaultNotActive,
    
    #[msg("Unauthorized access to vault")]
    UnauthorizedAccess,
    
    #[msg("Computation already queued")]
    ComputationQueued,
    
    #[msg("Invalid vault state")]
    InvalidVaultState,
    
    #[msg("Insufficient balance for operation")]
    InsufficientBalance,
    
    #[msg("Invalid vault owner")]
    InvalidOwner,
    
    #[msg("Computation aborted")]
    AbortedComputation,
    
    #[msg("Transfer to same vault not allowed")]
    SelfTransferNotAllowed,
}

// ============================================================================
// EVENTS
// ============================================================================

/// Event emitted when balance check is completed
#[event]
pub struct BalanceCheckEvent {
    /// Vault public key
    pub vault: Pubkey,
    
    /// Encrypted result: true if balance >= required_amount
    pub is_sufficient: bool,
    
    /// Current encrypted balance (still encrypted)
    pub encrypted_balance: u64,
    
    /// Timestamp of the check
    pub timestamp: i64,
}

/// Event emitted when withdrawal is processed
#[event]
pub struct WithdrawEvent {
    /// Vault public key
    pub vault: Pubkey,
    
    /// Whether withdrawal was successful (balance was sufficient)
    pub success: bool,
    
    /// New encrypted balance after withdrawal (or unchanged if failed)
    pub encrypted_new_balance: u64,
    
    /// Timestamp of the withdrawal
    pub timestamp: i64,
}

/// Event emitted when transfer is processed
#[event]
pub struct TransferEvent {
    /// Source vault public key
    pub from_vault: Pubkey,
    
    /// Destination vault public key
    pub to_vault: Pubkey,
    
    /// Encrypted transfer amount
    pub encrypted_amount: u64,
    
    /// Whether transfer was successful (source balance was sufficient)
    pub success: bool,
    
    /// Timestamp of the transfer
    pub timestamp: i64,
}
