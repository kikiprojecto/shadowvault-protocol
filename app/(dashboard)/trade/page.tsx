import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TradeForm } from '@/components/trade/TradeForm'

export default function TradePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Private Trade Execution</CardTitle>
      </CardHeader>
      <CardContent>
        <TradeForm />
      </CardContent>
    </Card>
  )
}
