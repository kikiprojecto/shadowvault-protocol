import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function StrategiesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategy Builder</CardTitle>
        <CardDescription>Define encrypted parameters. Only you can decrypt them.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">Coming soon: encrypted strategy composer.</div>
      </CardContent>
    </Card>
  )
}
