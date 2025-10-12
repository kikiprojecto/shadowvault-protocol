import { useMemo } from 'react'
import { Connection } from '@solana/web3.js'
import { AnchorProvider } from '@coral-xyz/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { getProgram } from './program'

export function useProgram() {
  const { connection } = useConnection()
  const wallet = useWallet()

  const program = useMemo(() => {
    if (!wallet || !wallet.publicKey || !wallet.signAllTransactions || !wallet.signTransaction) return null
    const anchorWallet: AnchorProvider['wallet'] = {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions.bind(wallet),
      signTransaction: wallet.signTransaction.bind(wallet),
    }
    return getProgram(connection as Connection, anchorWallet)
  }, [connection, wallet])

  return program
}

export function useVault(ownerPubkey?: string) {
  const program = useProgram()
  return { program, ownerPubkey }
}

export function useExecuteTrade() {
  const program = useProgram()
  return { program }
}
