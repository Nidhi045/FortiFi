import { DashboardLayout } from "@/components/indian-bank/components/dashboard-layout"
import { NotificationCenter } from "@/components/indian-bank/components/notification-center"

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Notification Center</h1>
        <NotificationCenter />
      </div>
    </DashboardLayout>
  )
}
