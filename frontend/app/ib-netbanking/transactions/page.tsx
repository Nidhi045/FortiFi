import { DashboardLayout } from "@/components/indian-bank/components/dashboard-layout"
import { TransactionsTable } from "@/components/indian-bank/components/transactions-table"

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <TransactionsTable />
      </div>
    </DashboardLayout>
  )
}
