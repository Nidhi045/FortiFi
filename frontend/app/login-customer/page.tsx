"use client"

import { LoginForm } from "@/components/indian-bank/components/login-form"
import Image from "next/image"
import { useEffect } from "react"
import { useTheme } from "next-themes"

export default function LoginCustomerPage() {
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    // Force light theme for login page
    setTheme('light')
  }, [setTheme])

  return (
    <main className="w-full flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1C3E94] to-[#0c2052] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="relative h-16 w-64">
            <Image src="/indian-bank-logo.png" alt="Indian Bank Logo" fill className="object-contain" priority />
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
