import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionHistory } from "@/components/transaction-history"

export const metadata: Metadata = {
  title: "Transactions & History | Secure Banking",
  description: "View and manage your transaction history and fraud alerts",
}

export default function TransactionsPage() {
  return (
    <div suppressHydrationWarning className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Transactions & Fraud History</h1>
        <p className="text-muted-foreground">
          View, search, and manage all your transactions with fraud risk assessment
        </p>
      </div>
          <TransactionHistory />
    </div>
  )
}

