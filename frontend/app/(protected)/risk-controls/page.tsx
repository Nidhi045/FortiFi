"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RiskControls } from "@/components/risk-controls"
import { SecurityRecommendations } from "@/components/security-recommendations"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, HelpCircle, Save } from "lucide-react"

export default function RiskControlsClientPage() {
  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk-Based Transaction Controls</h1>
          <p className="text-muted-foreground">
            Customize your security settings and transaction controls based on risk level
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // In a real app, this would reset settings
              window.location.reload()
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Settings
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              alert("Saving all risk control settings...")
            }}
          >
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2 w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Transaction Security Controls</CardTitle>
              <CardDescription>Configure how transactions are handled based on risk assessment</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                alert(
                  "Transaction Security Controls Help: Configure how the system handles transactions based on their risk level. Enable or disable security features and set thresholds for different security measures.",
                )
              }}
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent>
            <RiskControls />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Security Recommendations</CardTitle>
              <CardDescription>Personalized recommendations to enhance your account security</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                alert("Exporting security recommendations as PDF...")
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <SecurityRecommendations />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
