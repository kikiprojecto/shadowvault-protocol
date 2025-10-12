import { ReactNode } from 'react'
import Link from 'next/link'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container h-16 flex items-center justify-between">
          <nav className="flex gap-4 text-sm">
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/trade">Trade</Link>
            <Link href="/strategies">Strategies</Link>
          </nav>
          <WalletMultiButton />
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  )
}
