import type { Metadata } from "next"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TwoFactorForm from "@/components/two-factor-form"
import { ModeToggle } from "@/components/mode-toggle"
import { Shield, Lock, Fingerprint } from "lucide-react"

export const metadata: Metadata = {
  title: "Two-Factor Authentication | Fortifi Secure Banking",
  description: "Verify your identity with two-factor authentication",
}

// Authentication Visualization Component
function AuthVisualization() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Watermark Grid */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(#00C3FF 1px, transparent 1px), linear-gradient(to right, #00C3FF 1px, transparent 1px)`,
        backgroundSize: `40px 40px`,
        animation: 'gridPan 20s linear infinite',
      }}></div>

      {/* Animated Authentication Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute border border-[#00C3FF]/20 rounded-full animate-pulse"
            style={{
              width: `${100 + i * 100}px`,
              height: `${100 + i * 100}px`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Security Icons */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-[#00C3FF]/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: 'float 6s infinite',
              animationDelay: `${i * 0.5}s`,
            }}
          >
            {i % 3 === 0 ? (
              <Shield className="h-8 w-8" />
            ) : i % 3 === 1 ? (
              <Lock className="h-8 w-8" />
            ) : (
              <Fingerprint className="h-8 w-8" />
            )}
          </div>
        ))}
      </div>

      {/* Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <Image
          src="/logo.png"
          alt="Fortifi Logo"
          width={200}
          height={200}
          className="animate-pulse-slow"
        />
      </div>
    </div>
  )
}

export default function TwoFactorPage() {
  return (
    <div suppressHydrationWarning className="fixed inset-0 flex items-center justify-center bg-[#010413] overflow-hidden">
      {/* Background Visualization */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00C3FF]/5 to-[#010413]" />
        <AuthVisualization />
      </div>

      {/* Theme Toggle */}
      <div className="absolute right-4 top-4 z-10">
        <ModeToggle />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md h-[500px] flex flex-col">
        <Card className="border-[#00C3FF]/20 shadow-lg backdrop-blur-sm bg-[#010413]/80 flex-1">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-[#00C3FF]/10 border border-[#00C3FF]/20">
                <Fingerprint className="h-8 w-8 text-[#00C3FF]" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-[#00C3FF] bg-clip-text text-transparent">
              Two-Factor Authentication
            </CardTitle>
            <CardDescription className="text-[#A0DFFF]">
              Enter the verification code sent to your device
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <TwoFactorForm />
          </CardContent>
        </Card>

        {/* Security Status */}
        <div className="flex items-center justify-center space-x-4 text-sm text-[#A0DFFF] mt-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Secure Connection</span>
          </div>
          <div className="h-4 w-px bg-[#00C3FF]/20" />
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-[#00C3FF]" />
            <span>Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  )
}

