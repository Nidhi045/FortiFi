import { DashboardLayout } from "@/components/indian-bank/components/dashboard-layout"
import { VirtualCardsManager } from "@/components/indian-bank/components/virtual-cards-manager"

export default function VirtualCardsPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Virtual Cards</h1>
        <VirtualCardsManager />
      </div>
    </DashboardLayout>
  )
}
