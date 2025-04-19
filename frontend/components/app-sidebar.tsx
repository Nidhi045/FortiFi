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

type MenuItem = {
  title: string
  icon: React.ElementType
  href: string
  badge?: string
}

export function AppSidebar() {
  const pathname = usePathname()

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
    // {
    //   title: "Transaction Sandbox",
    //   icon: Database,
    //   href: "/transaction-sandbox",
    // },
    // {
    //   title: "Web3 Identity Vault",
    //   icon: Key,
    //   href: "/identity-vault",
    // },
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
    // {
    //   title: "Risk Controls",
    //   icon: Sliders,
    //   href: "/risk-controls",
    // },
    {
      title: "Virtual Cards",
      icon: CardIcon,
      href: "/virtual-cards",
    },
    // {
    //   title: "Fraud Simulation",
    //   icon: Flask,
    //   href: "/fraud-simulation",
    // },
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

  return (
    <Sidebar suppressHydrationWarning>
      <SidebarHeader className="flex flex-col gap-4 py-4">
        <div className="flex items-center px-4">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Shield className="h-6 w-6 text-primary" />
            <span>Fortifi</span>
          </div>
          <div className="ml-auto flex items-center">
            <ModeToggle />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{isAdmin ? "Admin Portal" : "Main"}</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.badge && (
                  <Badge
                    variant="outline"
                    className="absolute right-1 top-1.5 bg-primary text-primary-foreground border-primary"
                  >
                    {item.badge}
                  </Badge>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {!isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Web3 Forum</SidebarGroupLabel>
            <SidebarMenu>
            {web3forumItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.badge && (
                  <Badge
                    variant="outline"
                    className="absolute right-1 top-1.5 bg-primary text-primary-foreground border-primary"
                  >
                    {item.badge}
                  </Badge>
                )}
              </SidebarMenuItem>
            ))}
            </SidebarMenu>
          </SidebarGroup>
          
        )}
        <SidebarSeparator />

        {!isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Awareness Training</SidebarGroupLabel>
            <SidebarMenu>
            {awarenessItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.badge && (
                  <Badge
                    variant="outline"
                    className="absolute right-1 top-1.5 bg-primary text-primary-foreground border-primary"
                  >
                    {item.badge}
                  </Badge>
                )}
              </SidebarMenuItem>
            ))}
            </SidebarMenu>
          </SidebarGroup>
          
        )}

<SidebarSeparator />

{!isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarMenu>
            {settingItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.badge && (
                  <Badge
                    variant="outline"
                    className="absolute right-1 top-1.5 bg-primary text-primary-foreground border-primary"
                  >
                    {item.badge}
                  </Badge>
                )}
              </SidebarMenuItem>
            ))}
            </SidebarMenu>
          </SidebarGroup>
          
        )}


        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>User Portal</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="User Dashboard">
                  <Link href="/dashboard">
                    <User className="h-5 w-5" />
                    <span>User Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
            <AvatarFallback>MS</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">Mahesh Singh</span>
            <span className="text-xs text-muted-foreground">maheshsingh@indianbank.com</span>
          </div>
        </div>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/logout">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
