import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SecurityStatus } from "@/components/security-status"
import { SecuritySettings } from "@/components/security-settings"

export const metadata: Metadata = {
  title: "Security | Secure Banking",
  description: "Manage your security settings",
}

export default function SecurityPage() {
  return (
    <div suppressHydrationWarning className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Security</h1>
        <p className="text-muted-foreground">
          Manage your security settings and preferences to keep your account safe.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="logs">Security Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
              <CardDescription>Your account security overview and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <SecurityStatus />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure your security preferences and features</CardDescription>
            </CardHeader>
            <CardContent>
              <SecuritySettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Security Logs</CardTitle>
              <CardDescription>Review your recent security-related activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-2 text-left font-medium">Event</th>
                        <th className="px-4 py-2 text-left font-medium">IP Address</th>
                        <th className="px-4 py-2 text-left font-medium">Location</th>
                        <th className="px-4 py-2 text-left font-medium">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2">Successful login</td>
                        <td className="px-4 py-2">192.168.1.1</td>
                        <td className="px-4 py-2">New York, USA</td>
                        <td className="px-4 py-2">Apr 3, 2023 10:24 AM</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">Failed login attempt</td>
                        <td className="px-4 py-2">45.123.45.67</td>
                        <td className="px-4 py-2">Berlin, Germany</td>
                        <td className="px-4 py-2">Apr 2, 2023 3:15 PM</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">Password changed</td>
                        <td className="px-4 py-2">192.168.1.1</td>
                        <td className="px-4 py-2">New York, USA</td>
                        <td className="px-4 py-2">Mar 28, 2023 2:30 PM</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">Two-factor authentication enabled</td>
                        <td className="px-4 py-2">192.168.1.1</td>
                        <td className="px-4 py-2">New York, USA</td>
                        <td className="px-4 py-2">Mar 25, 2023 11:45 AM</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Account created</td>
                        <td className="px-4 py-2">192.168.1.1</td>
                        <td className="px-4 py-2">New York, USA</td>
                        <td className="px-4 py-2">Mar 20, 2023 9:00 AM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

