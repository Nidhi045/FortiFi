import { DashboardLayout } from "@/components/indian-bank/components/dashboard-layout"
import { SecuritySettings } from "@/components/indian-bank/components/security-settings"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings & Security</h1>
        <SecuritySettings />
      </div>
    </DashboardLayout>
  )
}
