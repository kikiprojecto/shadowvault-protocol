// Fixed test file for Solana Playground
// Copy this into your anchor.test.ts file

describe("shadowvault", () => {
  it("Initialize vault", async () => {
    // Generate a random encrypted strategy hash
    const encryptedStrategyHash = Array.from(new Uint8Array(32).fill(1));

    // Derive vault PDA
    const [vaultPDA] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("vault"), pg.wallet.publicKey.toBuffer()],
      pg.PROGRAM_ID
    );

    try {
      // Call initializeVault (not initialize!)
      const txHash = await pg.program.methods
        .initializeVault(encryptedStrategyHash)
        .accounts({
          payer: pg.wallet.publicKey,
          owner: pg.wallet.publicKey,
          vault: vaultPDA,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

      // Fetch the created account
      const vaultAccount = await pg.program.account.vaultAccount.fetch(vaultPDA);

      console.log("Vault initialized!");
      console.log("Owner:", vaultAccount.owner.toString());
      console.log("TVL:", vaultAccount.totalValueLocked.toString());
      console.log("Is Paused:", vaultAccount.isPaused);

      // Verify the vault was created correctly
      assert.equal(
        vaultAccount.owner.toString(),
        pg.wallet.publicKey.toString()
      );
      assert.equal(vaultAccount.totalValueLocked.toString(), "0");
      assert.equal(vaultAccount.isPaused, false);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  });
});
