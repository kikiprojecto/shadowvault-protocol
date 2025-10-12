import assert from 'node:assert'
import { web3, AnchorProvider, Program, BN, setProvider, workspace } from '@coral-xyz/anchor'
import { Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'

// Types are derived at runtime from IDL via Anchor workspace after build.
// For TS strictness, we declare a minimal interface for instruction args we use.
type ShadowVaultProgram = Program<any>

// Mock test runner functions for TypeScript (actual implementation provided by Anchor test)
declare global {
  function describe(name: string, fn: () => void): void
  function it(name: string, fn: () => Promise<void>): void
  function before(fn: () => Promise<void>): void
}

describe('shadowvault', () => {
  const provider = AnchorProvider.env()
  setProvider(provider)

  // Program is available when `anchor test` compiles it.
  let program: ShadowVaultProgram

  const user = Keypair.generate()
  const owner = Keypair.generate()
  let vaultPda: PublicKey
  let intentPda: PublicKey

  const strategyHash = new Uint8Array(32).fill(7) // placeholder hash bytes

  before(async () => {
    program = workspace.shadowvault as ShadowVaultProgram

    // Airdrop SOL to user and owner for fees
    for (const kp of [user, owner]) {
      const sig = await provider.connection.requestAirdrop(kp.publicKey, 2 * LAMPORTS_PER_SOL)
      await provider.connection.confirmTransaction(sig, 'confirmed')
    }

    // Derive PDAs
    const [vault] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), owner.publicKey.toBuffer()],
      program.programId
    )
    vaultPda = vault
  })

  it('initialize_vault', async () => {
    const tx = await (program.methods as any)
      .initializeVault(Array.from(strategyHash))
      .accounts({
        payer: provider.wallet.publicKey,
        owner: owner.publicKey,
        vault: vaultPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([owner]) // owner must sign
      .rpc()

    assert.ok(tx)
    const vaultAcct = await (program.account as any).vaultAccount.fetch(vaultPda)
    assert.equal(vaultAcct.owner.toBase58(), owner.publicKey.toBase58())
    assert.equal(vaultAcct.tvl.toNumber(), 0)
  })

  it('submit_trade_intent', async () => {
    const tokenIn = Keypair.generate().publicKey
    const tokenOut = Keypair.generate().publicKey
    const amount = new BN(1000)
    const maxSlippageBps = 50
    const strategyType = 1

    const [intent] = PublicKey.findProgramAddressSync(
      [Buffer.from('intent'), user.publicKey.toBuffer(), vaultPda.toBuffer()],
      program.programId
    )
    intentPda = intent

    const tx = await (program.methods as any)
      .submitTradeIntent(tokenIn, tokenOut, amount, maxSlippageBps, strategyType)
      .accounts({
        user: user.publicKey,
        vault: vaultPda,
        intent: intentPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc()

    assert.ok(tx)
    const intentAcct = await (program.account as any).tradeIntent.fetch(intentPda)
    assert.equal(intentAcct.amount.toNumber(), amount.toNumber())
    assert.equal(intentAcct.strategyType, strategyType)
  })
})
