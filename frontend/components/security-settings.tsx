"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export function SecuritySettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    twoFactor: true,
    transactionShadowing: false,
    behavioralMonitoring: true,
    timeLockedTransactions: false,
    virtualCards: true,
    loginNotifications: true,
    highRiskAlerts: true,
    deviceManagement: false,
  })

  const handleToggle = (setting: string) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting as keyof typeof settings],
    })

    toast({
      title: "Setting updated",
      description: `${setting.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} has been ${!settings[setting as keyof typeof settings] ? "enabled" : "disabled"}.`,
    })
  }

  return (
    <div suppressHydrationWarning className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="twoFactor" className="text-sm font-medium">
                Two-Factor Authentication
              </label>
              <p className="text-sm text-muted-foreground">Require a verification code when logging in</p>
            </div>
            <Switch id="twoFactor" checked={settings.twoFactor} onCheckedChange={() => handleToggle("twoFactor")} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="loginNotifications" className="text-sm font-medium">
                Login Notifications
              </label>
              <p className="text-sm text-muted-foreground">Receive notifications for new login attempts</p>
            </div>
            <Switch
              id="loginNotifications"
              checked={settings.loginNotifications}
              onCheckedChange={() => handleToggle("loginNotifications")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="deviceManagement" className="text-sm font-medium">
                Device Management
              </label>
              <p className="text-sm text-muted-foreground">Approve new devices before allowing login</p>
            </div>
            <Switch
              id="deviceManagement"
              checked={settings.deviceManagement}
              onCheckedChange={() => handleToggle("deviceManagement")}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Transaction Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="transactionShadowing" className="text-sm font-medium">
                Transaction Shadowing
              </label>
              <p className="text-sm text-muted-foreground">Monitor transactions in real-time for suspicious patterns</p>
            </div>
            <Switch
              id="transactionShadowing"
              checked={settings.transactionShadowing}
              onCheckedChange={() => handleToggle("transactionShadowing")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="behavioralMonitoring" className="text-sm font-medium">
                Behavioral Monitoring
              </label>
              <p className="text-sm text-muted-foreground">Analyze account behavior to detect unusual activities</p>
            </div>
            <Switch
              id="behavioralMonitoring"
              checked={settings.behavioralMonitoring}
              onCheckedChange={() => handleToggle("behavioralMonitoring")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="timeLockedTransactions" className="text-sm font-medium">
                Time-locked Transactions
              </label>
              <p className="text-sm text-muted-foreground">Add a delay to high-risk transactions for verification</p>
            </div>
            <Switch
              id="timeLockedTransactions"
              checked={settings.timeLockedTransactions}
              onCheckedChange={() => handleToggle("timeLockedTransactions")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="virtualCards" className="text-sm font-medium">
                Virtual Cards
              </label>
              <p className="text-sm text-muted-foreground">Generate one-time use cards for online purchases</p>
            </div>
            <Switch
              id="virtualCards"
              checked={settings.virtualCards}
              onCheckedChange={() => handleToggle("virtualCards")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="highRiskAlerts" className="text-sm font-medium">
                High-Risk Transaction Alerts
              </label>
              <p className="text-sm text-muted-foreground">Get notified about potentially fraudulent transactions</p>
            </div>
            <Switch
              id="highRiskAlerts"
              checked={settings.highRiskAlerts}
              onCheckedChange={() => handleToggle("highRiskAlerts")}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Account Security</h3>
        <div className="space-y-4">
          <div>
            <Button variant="outline">Change Password</Button>
          </div>
          <div>
            <Button variant="outline">Reset Two-Factor Authentication</Button>
          </div>
          <div>
            <Button variant="outline">Manage Trusted Devices</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

