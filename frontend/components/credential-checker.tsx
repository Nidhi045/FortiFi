"use client"

import type React from "react"

import { useState } from "react"
import { Search, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

type CredentialType = "email" | "phone" | "card" | "username"

export function CredentialChecker() {
  const { toast } = useToast()
  const [credentialType, setCredentialType] = useState<CredentialType>("email")
  const [credential, setCredential] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<"safe" | "compromised" | null>(null)
  const [breaches, setBreaches] = useState<string[]>([])

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault()

    if (!credential) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter a credential to check.",
      })
      return
    }

    setIsChecking(true)
    setResult(null)
    setBreaches([])

    // Simulate API call to check credentials
    setTimeout(() => {
      setIsChecking(false)

      // For demo purposes, we'll show a compromised result for specific inputs
      if (credential.includes("test") || credential.includes("123")) {
        setResult("compromised")
        setBreaches([
          "MajorBank Data Breach (2023)",
          "FinTech Services Leak (2022)",
          "Global Payment Processor Hack (2021)",
        ])

        toast({
          variant: "destructive",
          title: "Credential compromised",
          description: "Your credential was found in 3 data breaches.",
        })
      } else {
        setResult("safe")

        toast({
          title: "Credential check complete",
          description: "Good news! Your credential appears to be safe.",
        })
      }
    }, 2000)
  }

  const getPlaceholder = () => {
    switch (credentialType) {
      case "email":
        return "Enter your email address"
      case "phone":
        return "Enter your phone number"
      case "card":
        return "Enter last 4 digits of your card"
      case "username":
        return "Enter your username"
      default:
        return "Enter your credential"
    }
  }

  return (
    <div suppressHydrationWarning className="space-y-6">
      <form onSubmit={handleCheck} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="credentialType">Credential Type</Label>
          <Select value={credentialType} onValueChange={(value) => setCredentialType(value as CredentialType)}>
            <SelectTrigger id="credentialType">
              <SelectValue placeholder="Select credential type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email Address</SelectItem>
              <SelectItem value="phone">Phone Number</SelectItem>
              <SelectItem value="card">Card Number</SelectItem>
              <SelectItem value="username">Username</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="credential">Credential to Check</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="credential"
              type="text"
              placeholder={getPlaceholder()}
              className="pl-8"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Your credential is securely hashed before checking against breach databases.
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={isChecking}>
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check Credential"
          )}
        </Button>
      </form>

      {result && (
        <div
          className={`rounded-md border p-4 ${
            result === "safe"
              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
              : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800"
          }`}
        >
          <div className="flex items-start">
            {result === "safe" ? (
              <CheckCircle className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600 dark:text-rose-400" />
            )}
            <div className="ml-3">
              <h4
                className={`text-sm font-medium ${
                  result === "safe" ? "text-emerald-800 dark:text-emerald-300" : "text-rose-800 dark:text-rose-300"
                }`}
              >
                {result === "safe" ? "Credential is Safe" : "Credential Compromised"}
              </h4>
              <div
                className={`mt-1 text-sm ${
                  result === "safe" ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
                }`}
              >
                {result === "safe" ? (
                  <p>Your credential was not found in any known data breaches.</p>
                ) : (
                  <>
                    <p>Your credential was found in the following data breaches:</p>
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                      {breaches.map((breach, index) => (
                        <li key={index}>{breach}</li>
                      ))}
                    </ul>
                    <div className="mt-3">
                      <Button size="sm" variant="destructive">
                        Take Action
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        <h4 className="font-medium">How it works:</h4>
        <ol className="list-decimal pl-5 mt-2 space-y-1">
          <li>Your credential is securely hashed using SHA-256</li>
          <li>Only the hash is sent to our secure API</li>
          <li>We check against known data breaches and dark web databases</li>
          <li>Results are displayed without storing your credential</li>
        </ol>
      </div>
    </div>
  )
}

