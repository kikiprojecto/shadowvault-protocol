import { decryptData, encryptData, importAesKey, KeyMaterial } from './encryption'
import type { ArciumJobStatus, ArciumSubmitResponse, EncryptedResult, EncryptedTradeIntent, ExecutionResultPlain, TradeIntentPlain } from './types'

export class ArciumClient {
  private readonly apiUrl: string
  private readonly projectId: string
  private readonly apiKey: string
  private key?: KeyMaterial

  constructor(params?: { apiUrl?: string; projectId?: string; apiKey?: string }) {
    this.apiUrl = params?.apiUrl ?? process.env.ARCIUM_API_URL ?? ''
    this.projectId = params?.projectId ?? process.env.ARCIUM_PROJECT_ID ?? ''
    this.apiKey = params?.apiKey ?? process.env.ARCIUM_API_KEY ?? ''

    if (!this.apiUrl) throw new Error('ARCIUM_API_URL is required')
    if (!this.projectId) throw new Error('ARCIUM_PROJECT_ID is required')
    if (!this.apiKey) throw new Error('ARCIUM_API_KEY is required')
  }

  async setEncryptionKey(rawKey32: Uint8Array | ArrayBuffer): Promise<void> {
    this.key = await importAesKey(rawKey32)
  }

  async encryptTradeIntent(intent: TradeIntentPlain): Promise<EncryptedTradeIntent> {
    if (!this.key) throw new Error('ArciumClient key not set. Call setEncryptionKey() first.')
    const aad = new TextEncoder().encode('shadowvault:v1:intent')
    const { ciphertext, nonce } = await encryptData(this.key, intent, aad)
    return {
      ciphertext,
      nonce,
      aad,
      schema: 'shadowvault.trade_intent.v1',
      createdAt: Date.now(),
      raw: intent,
    }
  }

  async submitToMPC(payload: EncryptedTradeIntent): Promise<ArciumSubmitResponse> {
    const res = await fetch(`${this.apiUrl}/v1/jobs`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-project-id': this.projectId,
        'authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        schema: payload.schema,
        ciphertext: Array.from(payload.ciphertext),
        nonce: Array.from(payload.nonce),
        aad: payload.aad ? Array.from(payload.aad) : undefined,
      }),
    })

    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      throw new Error(`Arcium submit failed: ${res.status} ${txt}`)
    }

    const json = (await res.json()) as ArciumSubmitResponse
    return json
  }

  async retrieveResult(jobId: string): Promise<EncryptedResult | null> {
    const res = await fetch(`${this.apiUrl}/v1/jobs/${jobId}`, {
      headers: {
        'x-project-id': this.projectId,
        'authorization': `Bearer ${this.apiKey}`,
      },
    })

    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      throw new Error(`Arcium job fetch failed: ${res.status} ${txt}`)
    }

    const json = (await res.json()) as ArciumJobStatus<ExecutionResultPlain>
    if (json.status !== 'completed' || !json.result) return null

    return json.result as EncryptedResult
  }

  async decryptResult(result: EncryptedResult): Promise<ExecutionResultPlain> {
    if (!this.key) throw new Error('ArciumClient key not set. Call setEncryptionKey() first.')
    const aad = result.aad
    const plain = await decryptData<ExecutionResultPlain>(this.key, result.ciphertext, result.nonce, aad)
    return plain
  }
}
