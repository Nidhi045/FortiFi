import { DashboardLayout } from "@/components/indian-bank/components/dashboard-layout"
import { FundTransferForm } from "@/components/indian-bank/components/fund-transfer-form"

export default function FundTransferPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Fund Transfer</h1>
        <FundTransferForm />
      </div>
    </DashboardLayout>
  )
}
