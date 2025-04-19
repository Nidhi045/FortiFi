import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RiskManagementAssistant } from "@/components/risk-management-assistant"

export const metadata: Metadata = {
  title: "AI Risk Assistant | Secure Banking",
  description: "AI-powered assistant for fraud prevention and risk management",
}

export default function AIAssistantPage() {
  return (
    <div suppressHydrationWarning className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Fortifi Risk Assistant</h1>
        <p className="text-muted-foreground">
        AI-powered assistant to help bankers understand fraud patterns, compliance requirements, and risk
        mitigation strategies
        </p>
      </div>

      <div className="grid gap-6">
            <RiskManagementAssistant />
      </div>
    </div>
  )
}
