"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, Lock, Fingerprint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // In a real app, this would call an API to invalidate the session
    const redirectTimer = setTimeout(() => {
      router.push("/")
    }, 5000)

    return () => clearTimeout(redirectTimer)
  }, [router])

  return (
    <div suppressHydrationWarning className="min-h-screen w-full bg-[#010413] text-[#E0E0E0] relative overflow-hidden flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(#00C3FF 1px, transparent 1px), linear-gradient(to right, #00C3FF 1px, transparent 1px)`,
          backgroundSize: `40px 40px`,
          animation: 'gridPan 20s linear infinite',
        }}></div>

        {/* Pulsing Circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-[#00C3FF]/20 rounded-full animate-pulse-slow"
              style={{
                width: `${100 + i * 100}px`,
                height: `${100 + i * 100}px`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0">
          <Shield className="absolute top-1/4 left-1/4 h-8 w-8 text-[#00C3FF]/20 animate-float" />
          <Lock className="absolute top-1/3 right-1/4 h-8 w-8 text-[#00C3FF]/20 animate-float delay-1000" />
          <Fingerprint className="absolute bottom-1/4 left-1/3 h-8 w-8 text-[#00C3FF]/20 animate-float delay-2000" />
        </div>

        {/* Subtle Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00C3FF]/5 to-transparent opacity-20"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <Card className="bg-[#010413]/40 border border-[#00C3FF]/20 backdrop-blur-xl shadow-xl">
          <CardHeader className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#00C3FF]/10 blur-md animate-pulse-slow"></div>
                <Image src="/logo.png" alt="Fortifi Logo" width={90} height={90} className="relative z-10" />
              </div>
            </div>

            

            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#A0DFFF]">
              Logged Out Successfully
            </CardTitle>
            <CardDescription className="text-[#A0DFFF]">
              Your session has been securely terminated
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center">
            <p className="mb-6 text-sm text-[#A0DFFF] font-mono">
              <span className="text-white/70">$</span> session terminated --exit
            </p>

            

            <p className="mb-4 text-sm text-[#A0DFFF]">
              You will be redirected to the home page in a few seconds...
            </p>

            <Button 
              onClick={() => router.push("/")} 
              className="w-full bg-[#00C3FF] text-[#010413] hover:bg-white font-bold transition-colors group"
            >
              Return Home <span className="ml-2 font-mono opacity-50 group-hover:opacity-100 transition-opacity">[→]</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

