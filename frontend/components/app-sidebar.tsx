"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home,
  Shield,
  LogOut,
  AlertTriangle,
  User,
  Database,
  Key,
  History,
  Sliders,
  CreditCardIcon as CardIcon,
  Users,
  FlaskRoundIcon as Flask,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

type MenuItem = {
  title: string
  icon: React.ElementType
  href: string
  badge?: string
}

export function AppSidebar() {
  const pathname = usePathname()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Skip sidebar on auth pages
  if (pathname === "/login" || pathname === "/2fa" || pathname === "/logout") {
    return null
  }

  const isAdmin = pathname.startsWith("/admin")

  const userMenuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Manage Users",
      icon: Users,
      href: "/manage/users",
    },
    {
      title: "Transactions & History",
      icon: History,
      href: "/transactions",
    },
    {
      title: "Virtual Cards",
      icon: CardIcon,
      href: "/virtual-cards",
    },
    {
      title: "AI Assistant",
      icon: MessageSquare,
      href: "/ai-assistant",
      badge: "New",
    },
  ]

  const web3forumItems: MenuItem[] = [
    {
      title: "Web3 Identity Vault",
      icon: Key,
      href: "/identity-vault",
    }
  ]

  const settingItems: MenuItem[] = [
    {
      title: "Risk Controls",
      icon: Sliders,
      href: "/risk-controls",
    },
    {
      title: "Account Profile",
      icon: User,
      href: "/profile",
    }
  ]
  
  const awarenessItems: MenuItem[] = [
    {
      title: "Transaction Sandbox",
      icon: Database,
      href: "/transaction-sandbox",
    },
    {
      title: "Fraud Simulation",
      icon: Flask,
      href: "/fraud-simulation",
    },
  ]

  const adminMenuItems: MenuItem[] = [
    {
      title: "Admin Dashboard",
      icon: Home,
      href: "/admin/dashboard",
    },
    {
      title: "Fraud Cases",
      icon: AlertTriangle,
      href: "/admin/fraud-cases",
    },
    {
      title: "User Management",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Security Settings",
      icon: Shield,
      href: "/admin/security",
    },
    {
      title: "Analytics",
      icon: Database,
      href: "/admin/analytics",
    },
  ]  

  const menuItems = isAdmin ? adminMenuItems : userMenuItems

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Sidebar 
      suppressHydrationWarning
      className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${isSidebarCollapsed ? "w-20" : "w-70"}`}
    >
      {/* Enhanced Background Textures */}
      <div className="absolute inset-0 z-0">
        {/* Zigzag Lines */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L20 20 L40 0 L60 20 L80 0 L100 20 L100 100 L80 80 L60 100 L40 80 L20 100 L0 80 Z' fill='%2300C3FF'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
        }}></div>
        
        {/* White Dots Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='white'/%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px',
        }}></div>

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10"></div>
      </div>

      <SidebarHeader suppressHydrationWarning className="flex flex-col gap-2 py-3 relative z-10 border-b border-primary/10">
        <div className="flex items-center px-3">
          <div className="flex items-center gap-2 font-semibold text-xl">
            {!isSidebarCollapsed ? (
              <>
                <img src="/logo.png" alt="Fortifi" className="h-12 w-12" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#A0DFFF] animate-fadeIn delay-300 drop-shadow-lg">Fortifi</span>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSidebarToggle}
              className="text-primary/70 hover:text-primary hover:bg-primary/10 h-8 w-8"
            >
              {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            {!isSidebarCollapsed && <ModeToggle />}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent suppressHydrationWarning className="relative z-10 overflow-y-auto">
        <div className="flex flex-col h-[calc(100vh-12rem)]">
          <SidebarGroup>
            <SidebarGroupLabel suppressHydrationWarning className="text-sm px-3 py-1">
              {!isSidebarCollapsed && (isAdmin ? "Admin Portal" : "Main")}
            </SidebarGroupLabel>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href} suppressHydrationWarning className="relative py-1">
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href} 
                    tooltip={item.title}
                    className={`transition-all hover:bg-primary/10 p-2 ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className={`${isSidebarCollapsed ? 'h-10 w-10' : 'h-8 w-8'} transition-transform ${pathname === item.href ? 'text-primary' : 'text-primary/80'}`} />
                      {!isSidebarCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && !isSidebarCollapsed && (
                    <Badge
                      variant="outline"
                      className="absolute right-2 top-2 bg-primary text-primary-foreground border-primary text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {pathname === item.href && (
                    <div className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-primary"></div>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarSeparator className="border-primary/10 my-1" />

          {!isAdmin && (
            <>
              <SidebarGroup>
                <SidebarGroupLabel suppressHydrationWarning className="text-sm px-3 py-1">{!isSidebarCollapsed && "Web3 Forum"}</SidebarGroupLabel>
                <SidebarMenu>
                  {web3forumItems.map((item) => (
                    <SidebarMenuItem key={item.href} suppressHydrationWarning className="relative py-1">
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.href} 
                        tooltip={item.title}
                        className={`transition-all hover:bg-primary/10 p-2 ${isSidebarCollapsed ? 'justify-center' : ''}`}
                      >
                        <Link href={item.href} className="flex items-center gap-2">
                          <item.icon className={`${isSidebarCollapsed ? 'h-10 w-10' : 'h-8 w-8'} transition-transform ${pathname === item.href ? 'text-primary' : 'text-primary/80'}`} />
                          {!isSidebarCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>

              <SidebarSeparator className="border-primary/10 my-1" />

              <SidebarGroup>
                <SidebarGroupLabel suppressHydrationWarning className="text-sm px-3 py-1">{!isSidebarCollapsed && "Awareness Training"}</SidebarGroupLabel>
                <SidebarMenu>
                  {awarenessItems.map((item) => (
                    <SidebarMenuItem key={item.href} suppressHydrationWarning className="relative py-1">
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.href} 
                        tooltip={item.title}
                        className={`transition-all hover:bg-primary/10 p-2 ${isSidebarCollapsed ? 'justify-center' : ''}`}
                      >
                        <Link href={item.href} className="flex items-center gap-2">
                          <item.icon className={`${isSidebarCollapsed ? 'h-10 w-10' : 'h-8 w-8'} transition-transform ${pathname === item.href ? 'text-primary' : 'text-primary/80'}`} />
                          {!isSidebarCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>

              <SidebarSeparator className="border-primary/10 my-1" />

              <SidebarGroup>
                <SidebarGroupLabel suppressHydrationWarning className="text-sm px-3 py-1">{!isSidebarCollapsed && "Settings"}</SidebarGroupLabel>
                <SidebarMenu>
                  {settingItems.map((item) => (
                    <SidebarMenuItem key={item.href} suppressHydrationWarning className="relative py-1">
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.href} 
                        tooltip={item.title}
                        className={`transition-all hover:bg-primary/10 p-2 ${isSidebarCollapsed ? 'justify-center' : ''}`}
                      >
                        <Link href={item.href} className="flex items-center gap-2">
                          <item.icon className={`${isSidebarCollapsed ? 'h-10 w-10' : 'h-8 w-8'} transition-transform ${pathname === item.href ? 'text-primary' : 'text-primary/80'}`} />
                          {!isSidebarCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </>
          )}
        </div>
      </SidebarContent>

      <SidebarFooter suppressHydrationWarning className="p-3 relative z-10 border-t border-primary/10">
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">Vidhya K</span>
              <span className="text-xs text-muted-foreground">vidhyak@indianbank.co.in</span>
            </div>
          </div>
        )}
        <Button 
          variant="outline" 
          className={`${isSidebarCollapsed ? "justify-center p-2" : "w-full justify-start py-2"} border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all text-sm`} 
          asChild
        >
          <Link href="/logout">
            <LogOut className={`${isSidebarCollapsed ? "h-5 w-5" : "mr-2 h-5 w-5"}`} />
            {!isSidebarCollapsed && "Logout"}
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
