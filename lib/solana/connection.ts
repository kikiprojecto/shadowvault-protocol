import { Connection, clusterApiUrl, Commitment } from '@solana/web3.js'

export type Cluster = 'testnet' | 'devnet' | 'mainnet-beta'

export function getRpcUrl(): string {
  const env = process.env.NEXT_PUBLIC_RPC_URL
  const cluster = (process.env.NEXT_PUBLIC_CLUSTER as Cluster | undefined) ?? 'testnet'
  return env && env.length > 0 ? env : clusterApiUrl(cluster)
}

export function getConnection(commitment: Commitment = 'confirmed'): Connection {
  const url = getRpcUrl()
  return new Connection(url, commitment)
}
