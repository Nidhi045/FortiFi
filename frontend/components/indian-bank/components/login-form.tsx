"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/indian-bank/components/ui/button"
import { Input } from "@/components/indian-bank/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/indian-bank/components/ui/card"
import { Label } from "@/components/indian-bank/components/ui/label"
import { AlertCircle, Lock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/indian-bank/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { realAccountData, phantomAccountData } from "@/lib/account-data"

export function LoginForm() {
  const router = useRouter()
  const { setAuthState } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Check credentials
    if (email === "rahulsharma@gmail.com") {
      if (password === "Rah2005!@#") {
        // Real account login
        setAuthState({
          isAuthenticated: true,
          accountType: "real",
          accountDetails: realAccountData.accountDetails
        })
        router.push("/ib-netbanking/dashboard")
      } else if (password === "Simpsonsiitm") {
        // Phantom account login - using same dashboard but with different data
        setAuthState({
          isAuthenticated: true,
          accountType: "phantom",
          accountDetails: phantomAccountData.accountDetails
        })
        router.push("/ib-netbanking/dashboard") // Same route as real account
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } else {
      setError("Invalid credentials. Please try again.")
    }

    setLoading(false)
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-[#1C3E94] text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">NetBanking Login</CardTitle>
        <CardDescription className="text-gray-200">Secure access to your Indian Bank account</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email ID</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="bg-[#FFB100] text-[#1C3E94] hover:bg-[#ffa200] font-medium"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Login Securely"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center text-sm text-gray-500">
        <div className="flex items-center mb-2">
          <Lock className="h-4 w-4 mr-1" />
          <span>256-bit encrypted connection</span>
        </div>
        <div className="text-xs">Last system update: {new Date().toLocaleDateString('en-IN')} | Version 3.2.1</div>
      </CardFooter>
    </Card>
  )
}
