import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionSimulator } from "@/components/transaction-simulator"
import { FraudAnalysis } from "@/components/fraud-analysis"

export const metadata: Metadata = {
  title: "Transaction Sandbox | Secure Banking",
  description: "Test and analyze transactions for fraud risk",
}

export default function TransactionSandboxPage() {
  return (
    <div suppressHydrationWarning className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Transaction Sandbox</h1>
        <p className="text-muted-foreground">Simulate and test transactions to understand fraud detection mechanisms</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Simulator</CardTitle>
            <CardDescription>Create a test transaction to analyze fraud risk</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionSimulator />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fraud Analysis</CardTitle>
            <CardDescription>AI-powered risk assessment and fraud detection insights</CardDescription>
          </CardHeader>
          <CardContent>
            <FraudAnalysis />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

