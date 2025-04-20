"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Wallet, Eye, EyeOff, Fingerprint, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export default function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to authenticate
      // For demo purposes, we'll just simulate a successful login
      if (email && password) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        router.push("/2fa")
      } else {
        toast({
          variant: "destructive",
          title: "Invalid credentials",
          description: "Please enter both email and password.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletLogin = () => {
    toast({
      title: "Web3 Wallet",
      description: "Connecting to wallet...",
    })
    // In a real app, this would connect to a Web3 wallet
    setTimeout(() => {
      router.push("/2fa")
    }, 1500)
  }

  return (
    <form suppressHydrationWarning onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 bg-background/50 backdrop-blur-sm border-[#00C3FF]/20 focus:border-[#00C3FF] focus:ring-[#00C3FF]/20"
            />
            <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#00C3FF]" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Link href="#" className="text-sm text-[#00C3FF] hover:text-[#00C3FF]/80 transition-colors">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 bg-background/50 backdrop-blur-sm border-[#00C3FF]/20 focus:border-[#00C3FF] focus:ring-[#00C3FF]/20"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#00C3FF]" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00C3FF] hover:text-[#00C3FF]/80"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#00C3FF] hover:bg-[#00C3FF]/90 text-white font-medium transition-colors" 
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span>Authenticating...</span>
          </div>
        ) : (
          "Continue"
        )}
      </Button>

      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div> */}

      {/* <Button
        type="button"
        variant="outline"
        className="w-full border-[#00C3FF]/20 hover:border-[#00C3FF] hover:bg-[#00C3FF]/5 transition-colors"
        onClick={handleWalletLogin}
      >
        <Wallet className="mr-2 h-4 w-4 text-[#00C3FF]" />
        Web3 Wallet
      </Button> */}
    </form>
  )
}

