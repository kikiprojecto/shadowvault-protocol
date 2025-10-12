import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'ShadowVault Protocol - Privacy-First DeFi on Solana',
  description: 'Submit encrypted trade intents. Routing computed privately by Arcium MPC. Execute on-chain without revealing strategies. Prevent MEV, front-running, and strategy leaks.',
  keywords: ['DeFi', 'Solana', 'Privacy', 'Arcium', 'MPC', 'MEV Protection', 'Encrypted Trading'],
  authors: [{ name: 'ShadowVault Team' }],
  openGraph: {
    title: 'ShadowVault Protocol - Privacy-First DeFi on Solana',
    description: 'Privacy-first institutional DeFi aggregator powered by Arcium MPC',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShadowVault Protocol',
    description: 'Privacy-first institutional DeFi on Solana',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#7c3aed',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  )
}
