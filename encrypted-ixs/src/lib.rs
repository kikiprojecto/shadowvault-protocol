use arcis_imports::*;

#[encrypted]
mod circuits {
    use arcis_imports::*;

    // Data Structures
    pub struct InputValues {
        v1: u8,
        v2: u8,
    }

    pub struct VaultAccount {
        balance: u64,
        owner: [u8; 32],
        is_active: bool,
        created_at: i64,
    }

    pub struct VaultInitInputs {
        initial_balance: u64,
        owner_pubkey: [u8; 32],
    }

    pub struct DepositInputs {
        amount: u64,
    }

    pub struct WithdrawInputs {
        amount: u64,
    }

    pub struct BalanceCheckInputs {
        required_amount: u64,
    }

    pub struct BalanceCheckResult {
        is_sufficient: bool,
        balance: u64,
    }

    pub struct WithdrawResult {
        new_vault: VaultAccount,
        success: bool,
    }

    pub struct TransferInputs {
        from_vault: VaultAccount,
        to_vault: VaultAccount,
        amount: u64,
    }

    pub struct TransferResult {
        updated_from_vault: VaultAccount,
        updated_to_vault: VaultAccount,
        success: bool,
    }

    // Encrypted Instructions
    #[instruction]
    pub fn add_together(input_ctxt: Enc<Shared, InputValues>) -> Enc<Shared, u16> {
        let input = input_ctxt.to_arcis();
        let sum = input.v1 as u16 + input.v2 as u16;
        input_ctxt.owner.from_arcis(sum)
    }

    #[instruction]
    pub fn initialize_vault(input_ctxt: Enc<Shared, VaultInitInputs>) -> Enc<Shared, VaultAccount> {
        let input = input_ctxt.to_arcis();
        let vault = VaultAccount {
            balance: input.initial_balance,
            owner: input.owner_pubkey,
            is_active: true,
            created_at: 0,
        };
        input_ctxt.owner.from_arcis(vault)
    }

    #[instruction]
    pub fn deposit(
        vault_ctxt: Enc<Shared, VaultAccount>,
        deposit_ctxt: Enc<Shared, DepositInputs>
    ) -> Enc<Shared, VaultAccount> {
        let vault = vault_ctxt.to_arcis();
        let deposit = deposit_ctxt.to_arcis();
        let updated_vault = VaultAccount {
            balance: vault.balance + deposit.amount,
            owner: vault.owner,
            is_active: vault.is_active,
            created_at: vault.created_at,
        };
        vault_ctxt.owner.from_arcis(updated_vault)
    }

    #[instruction]
    pub fn check_balance_sufficient(
        vault_ctxt: Enc<Shared, VaultAccount>,
        check_ctxt: Enc<Shared, BalanceCheckInputs>
    ) -> Enc<Shared, BalanceCheckResult> {
        let vault = vault_ctxt.to_arcis();
        let check = check_ctxt.to_arcis();
        let result = BalanceCheckResult {
            is_sufficient: vault.balance >= check.required_amount,
            balance: vault.balance,
        };
        vault_ctxt.owner.from_arcis(result)
    }

    #[instruction]
    pub fn withdraw(
        vault_ctxt: Enc<Shared, VaultAccount>,
        withdraw_ctxt: Enc<Shared, WithdrawInputs>
    ) -> Enc<Shared, WithdrawResult> {
        let vault = vault_ctxt.to_arcis();
        let withdraw = withdraw_ctxt.to_arcis();
        let sufficient = vault.balance >= withdraw.amount;
        let new_vault = VaultAccount {
            balance: if sufficient { vault.balance - withdraw.amount } else { vault.balance },
            owner: vault.owner,
            is_active: vault.is_active,
            created_at: vault.created_at,
        };
        let result = WithdrawResult { new_vault, success: sufficient };
        vault_ctxt.owner.from_arcis(result)
    }

    #[instruction]
    pub fn transfer(input_ctxt: Enc<Shared, TransferInputs>) -> Enc<Shared, TransferResult> {
        let input = input_ctxt.to_arcis();
        let sufficient = input.from_vault.balance >= input.amount;
        let (updated_from, updated_to) = if sufficient {
            (
                VaultAccount {
                    balance: input.from_vault.balance - input.amount,
                    owner: input.from_vault.owner,
                    is_active: input.from_vault.is_active,
                    created_at: input.from_vault.created_at,
                },
                VaultAccount {
                    balance: input.to_vault.balance + input.amount,
                    owner: input.to_vault.owner,
                    is_active: input.to_vault.is_active,
                    created_at: input.to_vault.created_at,
                }
            )
        } else {
            (input.from_vault, input.to_vault)
        };
        let result = TransferResult {
            updated_from_vault: updated_from,
            updated_to_vault: updated_to,
            success: sufficient,
        };
        input_ctxt.owner.from_arcis(result)
    }
}
