'use client'

import { useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTradeStore, TradeFormSchema } from '@/lib/stores/trade-store'
import { ArciumClient } from '@/lib/arcium/client'
import type { TradeIntentPlain } from '@/lib/arcium/types'
import { useWallet } from '@solana/wallet-adapter-react'

export function TradeForm() {
  const { publicKey } = useWallet()
  const { values, setValues, submitting, setSubmitting, setLastJobId } = useTradeStore()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const disabled = useMemo(() => submitting || !publicKey, [submitting, publicKey])

  const onSubmit = useCallback(async () => {
    setError(null)
    setStatus(null)
    const parsed = TradeFormSchema.safeParse(values)
    if (!parsed.success) {
      setError('Invalid input: ' + parsed.error.errors.map((e) => e.message).join(', '))
      return
    }
    if (!publicKey) {
      setError('Connect wallet to submit a private trade intent')
      return
    }

    try {
      setSubmitting(true)
      const client = new ArciumClient()
      // For demo, derive a per-session key from wallet pubkey (NOT for production)
      const seed = new TextEncoder().encode(publicKey.toBase58()).slice(0, 32)
      const key = new Uint8Array(32)
      key.set(seed)
      await client.setEncryptionKey(key)

      const intent: TradeIntentPlain = {
        user: publicKey.toBase58(),
        tokenIn: values.tokenIn,
        tokenOut: values.tokenOut,
        amount: values.amount,
        maxSlippageBps: values.slippageBps,
        strategyType: values.privacyLevel === 'max' ? 2 : values.privacyLevel === 'high' ? 1 : 0,
        timestamp: Math.floor(Date.now() / 1000),
      }

      const encrypted = await client.encryptTradeIntent(intent)
      const submit = await client.submitToMPC(encrypted)
      setLastJobId(submit.jobId)
      setStatus(`Intent submitted. Job ID: ${submit.jobId}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }, [values, publicKey, setSubmitting, setLastJobId])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-muted-foreground">Token In (Mint)</label>
          <Input
            value={values.tokenIn}
            onChange={(e) => setValues({ tokenIn: e.target.value })}
            placeholder="So11111111111111111111111111111111111111112"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Token Out (Mint)</label>
          <Input
            value={values.tokenOut}
            onChange={(e) => setValues({ tokenOut: e.target.value })}
            placeholder="Es9vMFrzaCERz... (USDC)"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Amount</label>
          <Input value={values.amount} onChange={(e) => setValues({ amount: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Slippage (bps)</label>
          <Input
            type="number"
            value={values.slippageBps}
            onChange={(e) => setValues({ slippageBps: Number(e.target.value) })}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm text-muted-foreground">Privacy Level</label>
          <div className="flex gap-3 mt-2">
            {['standard', 'high', 'max'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setValues({ privacyLevel: lvl as 'standard' | 'high' | 'max' })}
                className={`px-3 py-1 rounded-md border ${values.privacyLevel === lvl ? 'bg-primary text-primary-foreground' : 'bg-transparent'}`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={onSubmit} disabled={disabled}>
          {submitting ? 'Submitting…' : 'Submit Private Intent'}
        </Button>
        {status && <span className="text-sm text-muted-foreground">{status}</span>}
      </div>
      {error && <div className="text-sm text-red-400">{error}</div>}
    </div>
  )
}
