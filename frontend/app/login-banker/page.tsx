import type { Metadata } from "next"
import Image from "next/image"
import LoginForm from "@/components/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { Shield, Lock, Network, Activity } from "lucide-react"

export const metadata: Metadata = {
  title: "Login | Fortifi Secure Banking",
  description: "Secure login to your Fortifi banking account",
}

// Cybersecurity Visualization Component
function CybersecurityVisualization() {
  return (
    <div className="relative w-full h-full">
      {/* Base Grid */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(#00C3FF 1px, transparent 1px), linear-gradient(to right, #00C3FF 1px, transparent 1px)`,
        backgroundSize: `40px 40px`,
        animation: 'gridPan 20s linear infinite',
      }}></div>

      {/* Animated Nodes */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#00C3FF] animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Connection Lines */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#00C3FF]/30 to-transparent"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 100}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: 'pulse 2s infinite',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>


    </div>
  )
}

export default function LoginPage() {
  return (
    <div suppressHydrationWarning className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left Panel - Cybersecurity Visualization */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00C3FF]/20 to-[#010413] opacity-90" />
          <CybersecurityVisualization />
        </div>
        
        {/* Logo and Brand */}
        <div className="relative z-20 flex items-center space-x-3">
          <Image 
            src="/logo.png" 
            alt="Fortifi Logo" 
            width={100} 
            height={100}
            className="rounded-lg"
          />
          <span className="text-5xl font-bold bg-gradient-to-r from-white to-[#00C3FF] bg-clip-text text-transparent">
            Fortifi
          </span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">"The most secure banking platform with advanced fraud detection and prevention."</p>
            <footer className="text-sm text-white font-sbold bg-gradient-to-r from-white to-[#00C3FF] bg-clip-text text-transparent">Fortifi Team</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="absolute right-4 top-4 md:right-8 md:top-8">
          <ModeToggle />
        </div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your secure account
            </p>
          </div>
          <Card className="border-[#00C3FF]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Secure Login</CardTitle>
              <CardDescription className="text-[#00C3FF]">
                Your security is our priority
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

