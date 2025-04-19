"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // In a real app, this would call an API to invalidate the session
    const redirectTimer = setTimeout(() => {
      router.push("/login")
    }, 5000)

    return () => clearTimeout(redirectTimer)
  }, [router])

  return (
    <div suppressHydrationWarning className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Shield className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Logged Out Successfully</CardTitle>
          <CardDescription>You have been securely logged out of your account</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            You will be redirected to the login page in a few seconds...
          </p>
          <Button onClick={() => router.push("/login")} className="w-full">
            Login Again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

