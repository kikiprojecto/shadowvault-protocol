import { create } from 'zustand'
import { z } from 'zod'

export const TradeFormSchema = z.object({
  tokenIn: z.string().min(32),
  tokenOut: z.string().min(32),
  amount: z.string().regex(/^\d+$/), // u64 as decimal string
  slippageBps: z.number().int().min(0).max(1000),
  privacyLevel: z.enum(['standard', 'high', 'max']),
})
export type TradeFormValues = z.infer<typeof TradeFormSchema>

interface TradeState {
  values: TradeFormValues
  setValues: (v: Partial<TradeFormValues>) => void
  submitting: boolean
  setSubmitting: (b: boolean) => void
  lastJobId?: string
  setLastJobId: (id?: string) => void
}

export const useTradeStore = create<TradeState>((set) => ({
  values: {
    tokenIn: '',
    tokenOut: '',
    amount: '0',
    slippageBps: 50,
    privacyLevel: 'standard',
  },
  setValues: (v) => set((s) => ({ values: { ...s.values, ...v } })),
  submitting: false,
  setSubmitting: (b) => set({ submitting: b }),
  lastJobId: undefined,
  setLastJobId: (id) => set({ lastJobId: id }),
}))
