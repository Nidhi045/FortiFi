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

export function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate login validation
    setTimeout(() => {
      if (username && password) {
        router.push("/ib-netbanking/dashboard")
      } else {
        setError("Please enter both Customer ID and Password")
      }
      setLoading(false)
    }, 1500)
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
              <Label htmlFor="username">Customer ID</Label>
              <Input
                id="username"
                placeholder="Enter your Customer ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
        <div className="text-xs">Last system update: April 15, 2025 | Version 3.2.1</div>
      </CardFooter>
    </Card>
  )
}
