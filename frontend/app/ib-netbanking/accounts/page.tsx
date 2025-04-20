import { DashboardLayout } from "@/components/indian-bank/components/dashboard-layout"
import { AccountsList } from "@/components/indian-bank/components/accounts-list"

export default function AccountsPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
        <AccountsList />
      </div>
    </DashboardLayout>
  )
}
