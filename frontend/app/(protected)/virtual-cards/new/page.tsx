import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NewVirtualCardForm } from "@/components/new-virtual-card-form"

export const metadata: Metadata = {
  title: "Create Virtual Card | Secure Banking",
  description: "Generate a new one-time use virtual card for secure transactions",
}

export default function NewVirtualCardPage() {
  return (
    <div suppressHydrationWarning className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create Virtual Card</h1>
        <p className="text-muted-foreground">Generate a new one-time use virtual card for secure online transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Virtual Card</CardTitle>
          <CardDescription>Configure your virtual card settings and security options</CardDescription>
        </CardHeader>
        <CardContent>
          <NewVirtualCardForm />
        </CardContent>
      </Card>
    </div>
  )
}

