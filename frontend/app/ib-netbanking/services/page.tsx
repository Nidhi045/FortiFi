import { DashboardLayout } from "@/components/indian-bank/components/dashboard-layout"
import { ServicesGrid } from "@/components/indian-bank/components/services-grid"

export default function ServicesPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Services</h1>
        <ServicesGrid />
      </div>
    </DashboardLayout>
  )
}
