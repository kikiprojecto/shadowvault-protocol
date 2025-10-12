import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PortfolioPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Encrypted Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Balance is computed privately via Arcium MPC and only decrypted client-side.
          </p>
          <div className="mt-4 text-2xl">•••••</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            <li>Trade 1 — Encrypted</li>
            <li>Trade 2 — Encrypted</li>
            <li>Trade 3 — Encrypted</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
