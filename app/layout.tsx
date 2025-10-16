import './globals.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { WalletContextProvider } from '../components/WalletProvider'

export const metadata: Metadata = {
  title: 'ShadowVault Protocol - Privacy-First Vault System',
  description: 'Encrypted vault system powered by Arcium MPC. Deposit, withdraw, and transfer funds with complete privacy on Solana.',
  keywords: ['DeFi', 'Solana', 'Privacy', 'Arcium', 'MPC', 'Encrypted Vaults', 'Private Transactions'],
  authors: [{ name: 'ShadowVault Team' }],
  openGraph: {
    title: 'ShadowVault Protocol - Privacy-First Vault System',
    description: 'Encrypted vault system powered by Arcium MPC on Solana',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShadowVault Protocol',
    description: 'Privacy-first encrypted vaults on Solana',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#7c3aed',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="antialiased bg-gray-950 text-white">
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  )
}
