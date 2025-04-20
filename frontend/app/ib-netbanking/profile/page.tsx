import { DashboardLayout } from "@/components/indian-bank/components/dashboard-layout"
import { ProfileDetails } from "@/components/indian-bank/components/profile-details"

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <ProfileDetails />
      </div>
    </DashboardLayout>
  )
}
