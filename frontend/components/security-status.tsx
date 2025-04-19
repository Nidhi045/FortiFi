"use client"

import { Shield, CheckCircle, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function SecurityStatus() {
  // Sample security features data
  const securityFeatures = [
    {
      name: "Two-Factor Authentication",
      enabled: true,
      description: "Extra security layer requiring a second verification step.",
    },
    {
      name: "Transaction Shadowing",
      enabled: false,
      description: "Monitors transactions in real-time for suspicious patterns.",
    },
    {
      name: "Behavioral Monitoring",
      enabled: true,
      description: "Analyzes account behavior to detect unusual activities.",
    },
    {
      name: "Time-locked Transactions",
      enabled: false,
      description: "Adds a delay to high-risk transactions for verification.",
    },
    {
      name: "Virtual Cards",
      enabled: true,
      description: "One-time use cards for online purchases.",
    },
  ]

  // Calculate security score
  const enabledFeatures = securityFeatures.filter((feature) => feature.enabled).length
  const securityScore = Math.round((enabledFeatures / securityFeatures.length) * 100)

  return (
    <div suppressHydrationWarning className="space-y-6">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Security Score: {securityScore}%</h2>
        <Progress value={securityScore} className="w-full max-w-md" />
        <p className="text-sm text-muted-foreground">
          {securityScore >= 80
            ? "Your account has strong security measures in place."
            : securityScore >= 50
              ? "Your account security is moderate. Consider enabling more features."
              : "Your account security needs improvement. Enable more security features."}
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Security Features</h3>
        <div className="space-y-4">
          {securityFeatures.map((feature) => (
            <div key={feature.name} className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center">
                  {feature.enabled ? (
                    <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">{feature.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
              <Button variant={feature.enabled ? "outline" : "default"} size="sm">
                {feature.enabled ? "Disable" : "Enable"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recent Security Events</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Successful login from New York, USA</span>
            <span className="text-muted-foreground">Today, 10:24 AM</span>
          </div>
          <div className="flex justify-between">
            <span>Password changed</span>
            <span className="text-muted-foreground">Mar 28, 2023</span>
          </div>
          <div className="flex justify-between">
            <span>Two-factor authentication enabled</span>
            <span className="text-muted-foreground">Mar 25, 2023</span>
          </div>
        </div>
      </div>
    </div>
  )
}

