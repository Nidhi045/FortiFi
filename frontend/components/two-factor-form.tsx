"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function TwoFactorForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus the first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    // Take only the last character if multiple are pasted
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "Please enter all 6 digits of the verification code.",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would verify the OTP with an API
      // For demo purposes, we'll just simulate a successful verification
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Any code is accepted in this demo
      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "The code you entered is incorrect. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = () => {
    setTimeLeft(60)
    toast({
      title: "Code resent",
      description: "A new verification code has been sent to your device.",
    })
  }

  return (
    <form suppressHydrationWarning onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-center space-x-2">
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-12 w-12 text-center text-lg"
            autoComplete="one-time-code"
          />
        ))}
      </div>

      <div className="text-center text-sm">
        {timeLeft > 0 ? (
          <p className="text-muted-foreground">Resend code in {timeLeft} seconds</p>
        ) : (
          <Button type="button" variant="link" className="p-0 h-auto" onClick={handleResendCode}>
            Resend code
          </Button>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify"}
      </Button>

      <div className="text-center">
        <Button variant="link" className="p-0 h-auto text-sm">
          Use backup code
        </Button>
      </div>
    </form>
  )
}

