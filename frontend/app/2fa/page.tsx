import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TwoFactorForm from "@/components/two-factor-form"
import { ModeToggle } from "@/components/mode-toggle"

export const metadata: Metadata = {
  title: "Two-Factor Authentication | Secure Banking",
  description: "Verify your identity with two-factor authentication",
}

export default function TwoFactorPage() {
  return (
    <div suppressHydrationWarning className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <ModeToggle />
      </div>
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
          <CardDescription>Enter the verification code sent to your device</CardDescription>
        </CardHeader>
        <CardContent>
          <TwoFactorForm />
        </CardContent>
      </Card>
    </div>
  )
}

