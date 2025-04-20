import { DashboardLayout } from "@/components/indian-bank/components/dashboard-layout"
import { AccountSummaryCard } from "@/components/indian-bank/components/account-summary-card"
import { TransactionQuickSummary } from "@/components/indian-bank/components/transaction-quick-summary"
import { FraudAlertsPanel } from "@/components/indian-bank/components/fraud-alerts-panel"
import { AdminActionBanner } from "@/components/indian-bank/components/admin-action-banner"
import { AccountInsights } from "@/components/indian-bank/components/account-insights"
import { UpcomingEMIs } from "@/components/indian-bank/components/upcoming-emis"
import { PersonalMessages } from "@/components/indian-bank/components/personal-messages"
import { QuickShortcuts } from "@/components/indian-bank/components/quick-shortcuts"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

        <AdminActionBanner />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2">
            <AccountSummaryCard />
          </div>
          <div className="md:col-span-1">
            <FraudAlertsPanel />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <AccountInsights />
          </div>
          <div className="md:col-span-1">
            <PersonalMessages />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <QuickShortcuts />
          </div>
          <div className="md:col-span-2">
            <UpcomingEMIs />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          <TransactionQuickSummary />
        </div>
      </div>
    </DashboardLayout>
  )
}
