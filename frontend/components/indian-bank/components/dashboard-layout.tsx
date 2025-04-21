"use client"

import React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  LayoutDashboard,
  CreditCard,
  ArrowRightLeft,
  CreditCardIcon as VirtualCardIcon,
  ClipboardList,
  Settings,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  Briefcase,
  ChevronRight,
  Sun,
  Moon,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/indian-bank/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/indian-bank/components/ui/avatar"
import { NotificationSystem } from "@/components/indian-bank/components/notification-system"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/indian-bank/components/ui/tooltip"
import { useTheme } from "next-themes"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/indian-bank/components/ui/breadcrumb"
import { useAuth } from "@/lib/auth-context"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { authState, setAuthState } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)
  const [helpOpen, setHelpOpen] = useState(false)

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authState.isAuthenticated) {
      router.push("/login-customer")
      return
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [authState.isAuthenticated, router])

  const formatTime = () => {
    return currentTime.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  const formatDate = () => {
    return currentTime.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      accountType: null,
      accountDetails: null
    })
    router.push("/login-customer")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navItems = [
    { name: "Dashboard", href: "/ib-netbanking/dashboard", icon: LayoutDashboard },
    { name: "Accounts", href: "/ib-netbanking/accounts", icon: CreditCard },
    { name: "Fund Transfer", href: "/ib-netbanking/fund-transfer", icon: ArrowRightLeft },
    { name: "Virtual Cards", href: "/ib-netbanking/virtual-cards", icon: VirtualCardIcon },
    { name: "Transactions", href: "/ib-netbanking/transactions", icon: ClipboardList },
    { name: "Services", href: "/ib-netbanking/services", icon: Briefcase },
    { name: "Profile", href: "/ib-netbanking/profile", icon: User },
    { name: "Settings", href: "/ib-netbanking/settings", icon: Settings },
  ]

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = () => {
    if (!pathname || pathname === "/") return []

    const segments = pathname.split("/").filter(Boolean)

    return segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`
      return {
        href,
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      }
    })
  }

  const breadcrumbs = generateBreadcrumbs()

  // If not authenticated, don't render anything
  if (!authState.isAuthenticated) {
    return null
  }

  return (
    <div className="w-full flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-[#1C3E94] px-4 text-white">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden text-white hover:bg-[#2a4ca3]"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/ib-netbanking/dashboard" className="flex items-center">
            <div className="relative h-8 w-32 md:w-40">
              <Image src="/indian-bank-logo.png" alt="Indian Bank Logo" fill className="object-contain" priority />
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          
          <div className="hidden md:block">
            <span className="text-l  text-white">Welcome, <span className="text-l font-bold text-yellow-500">{authState.accountDetails?.name || "User"}</span></span>
          </div>

          <div className="hidden md:block text-right">
            <div suppressHydrationWarning className="text-sm font-medium">{formatTime()}</div>
            <div className="text-xs opacity-80">{formatDate()}</div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-[#2a4ca3]" onClick={toggleTheme}>
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle {theme === "dark" ? "Light" : "Dark"} Mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-[#2a4ca3]"
                  onClick={() => setHelpOpen(!helpOpen)}
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & Support</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-[#2a4ca3]"
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen)
                      setNotificationCount(0)
                    }}
                  >
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FFB100] text-xs text-[#1C3E94] font-bold">
                        {notificationCount}
                      </span>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {notificationsOpen && <NotificationSystem onClose={() => setNotificationsOpen(false)} />}
          </div>
          <Avatar className="h-8 w-8 border-2 border-white/20">
            <AvatarImage src="/profile-picture.jpg" alt="Rajesh Kumar" />
            <AvatarFallback className="bg-[#FFB100] text-[#1C3E94]">RK</AvatarFallback>
          </Avatar>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-[#2a4ca3]" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Log out</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-64 flex-col border-r bg-white dark:bg-gray-900 dark:border-gray-800 pt-16 transition-transform md:relative md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="absolute right-4 top-4 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-1 p-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#FFB100] hover:text-[#1C3E94] transition-colors",
                      pathname === item.href
                        ? "bg-[#1C3E94] text-white dark:bg-[#FFB100] dark:text-[#1C3E94]"
                        : "text-gray-700 dark:text-gray-300",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto p-4 border-t dark:border-gray-800">
              <Button
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                variant="ghost"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </nav>
        </aside>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Breadcrumb */}
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b dark:border-gray-800">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/ib-netbanking/dashboard">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                {breadcrumbs.map((breadcrumb, index) => (
                  <React.Fragment key={breadcrumb.href}>
                    <BreadcrumbItem>
                      {
                        <span className="font-medium">{breadcrumb.label}</span>
                      }
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && (
                      <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6">{children}</main>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 p-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p>© 2025 Indian Bank. All rights reserved.</p>
                </div>
                <div className="flex space-x-6">
                  <Link href="#" className="hover:text-[#1C3E94] dark:hover:text-[#FFB100]">
                    Terms of Service
                  </Link>
                  <Link href="#" className="hover:text-[#1C3E94] dark:hover:text-[#FFB100]">
                    Privacy Policy
                  </Link>
                  <Link href="#" className="hover:text-[#1C3E94] dark:hover:text-[#FFB100]">
                    Contact Us
                  </Link>
                  <Link href="#" className="hover:text-[#1C3E94] dark:hover:text-[#FFB100]">
                    Security
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Help Dialog */}
      {helpOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setHelpOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Help & Support</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Customer Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">24/7 Helpline: 1800-425-1809</p>
              </div>
              <div>
                <h3 className="font-medium">Email Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">customer.care@indianbank.co.in</p>
              </div>
              <div>
                <h3 className="font-medium">Report an Issue</h3>
                <textarea
                  className="w-full mt-2 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  rows={3}
                  placeholder="Describe your issue..."
                ></textarea>
                <Button className="mt-2 bg-[#1C3E94] hover:bg-[#152d6e] dark:bg-[#FFB100] dark:text-[#1C3E94] dark:hover:bg-[#ffa200]">
                  Submit
                </Button>
              </div>
            </div>
            <Button className="mt-4 w-full" variant="outline" onClick={() => setHelpOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
