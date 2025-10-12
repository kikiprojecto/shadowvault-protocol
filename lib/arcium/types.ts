export type HexString = `0x${string}`

export interface EncryptedPayload<T = unknown> {
  ciphertext: Uint8Array
  nonce: Uint8Array
  aad?: Uint8Array
  schema: string
  createdAt: number
  raw?: T
}

export type EncryptedTradeIntent = EncryptedPayload<TradeIntentPlain>

export type EncryptedResult = EncryptedPayload<ExecutionResultPlain>

export interface TradeIntentPlain {
  user: string
  tokenIn: string
  tokenOut: string
  amount: string // u64 as string
  maxSlippageBps: number
  strategyType: number
  timestamp: number
}

export interface ExecutionResultPlain {
  intentPubkey: string
  executedAmount: string
  receivedAmount: string
  success: boolean
  timestamp: number
}

export interface ArciumSubmitResponse {
  jobId: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
}

export interface ArciumJobStatus<T> {
  jobId: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  result?: EncryptedPayload<T>
  error?: string
}
