"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/indian-bank/components/ui/card"
import { AlertCircle, CreditCard, ShieldAlert, Bell, Check, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/indian-bank/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/indian-bank/components/ui/tabs"
import { Badge } from "@/components/indian-bank/components/ui/badge"
import Link from "next/link"

interface NotificationSystemProps {
  onClose: () => void
}

export function NotificationSystem({ onClose }: NotificationSystemProps) {
  const [activeTab, setActiveTab] = useState("all")

  const notifications = [
    {
      id: 1,
      title: "Virtual Card Used",
      message: "Your virtual card ending with 4567 was used on Flipkart for ₹1,200.",
      time: "10 minutes ago",
      icon: CreditCard,
      type: "info",
      read: false,
    },
    {
      id: 2,
      title: "Admin Flagged Transaction",
      message: "Your transaction of ₹15,000 to Suresh Patel was flagged for security verification.",
      time: "2 hours ago",
      icon: AlertCircle,
      type: "danger",
      read: false,
    },
    {
      id: 3,
      title: "Login Alert",
      message: "Last login from Delhi using Chrome browser at 3:45 PM.",
      time: "April 18, 2025",
      icon: ShieldAlert,
      type: "warning",
      read: true,
    },
    {
      id: 4,
      title: "KYC Update Required",
      message: "Your KYC documents will expire in 15 days. Please update them.",
      time: "April 17, 2025",
      icon: Clock,
      type: "warning",
      read: true,
    },
    {
      id: 5,
      title: "EMI Payment Success",
      message: "Your home loan EMI of ₹24,500 was successfully paid.",
      time: "April 15, 2025",
      icon: Check,
      type: "success",
      read: true,
    },
  ]

  const [notificationState, setNotificationState] = useState(notifications)

  const filteredNotifications = notificationState.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    if (activeTab === "alerts") return notification.type === "danger" || notification.type === "warning"
    return true
  })

  const markAsRead = (id: number) => {
    setNotificationState((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotificationState((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const unreadCount = notificationState.filter((n) => !n.read).length

  return (
    <Card className="absolute right-0 top-12 w-96 shadow-lg z-50" onClick={(e) => e.stopPropagation()}>
      <CardHeader className="bg-[#1C3E94] text-white py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
          {unreadCount > 0 && (
            <Badge className="ml-2 bg-[#FFB100] text-[#1C3E94] hover:bg-[#FFB100]">{unreadCount} new</Badge>
          )}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-white hover:bg-white/20"
            onClick={markAllAsRead}
          >
            Mark all read
          </Button>
          <Link href="/ib-netbanking/notifications" onClick={onClose}>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-white hover:bg-white/20">
              <ExternalLink className="h-3 w-3 mr-1" />
              View all
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-[70vh] overflow-y-auto">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="m-0">
            {filteredNotifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
            ) : (
              <ul className="divide-y">
                {filteredNotifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-800 ${!notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`flex-shrink-0 rounded-full p-1.5 ${
                          notification.type === "danger"
                            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            : notification.type === "warning"
                              ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                              : notification.type === "success"
                                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        <notification.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.title}</p>
                          {!notification.read && (
                            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{notification.message}</p>
                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
