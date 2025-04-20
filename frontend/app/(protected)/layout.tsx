import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider suppressHydrationWarning>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="p-8 w-full">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  )
}
