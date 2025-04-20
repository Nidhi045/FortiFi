"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/indian-bank/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/indian-bank/components/ui/tabs"
import { Button } from "@/components/indian-bank/components/ui/button"
import { Badge } from "@/components/indian-bank/components/ui/badge"
import { Input } from "@/components/indian-bank/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/indian-bank/components/ui/select"
import { AlertCircle, CreditCard, ShieldAlert, Bell, Check, Clock, Search, Trash2, Filter } from "lucide-react"

export function NotificationCenter() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all")

  const allNotifications = [
    {
      id: 1,
      title: "Virtual Card Used",
      message: "Your virtual card ending with 4567 was used on Flipkart for ₹1,200.",
      time: "April 19, 2025 at 10:15 AM",
      icon: CreditCard,
      type: "info",
      read: false,
      category: "transaction",
    },
    {
      id: 2,
      title: "Admin Flagged Transaction",
      message: "Your transaction of ₹15,000 to Suresh Patel was flagged for security verification.",
      time: "April 19, 2025 at 09:30 AM",
      icon: AlertCircle,
      type: "danger",
      read: false,
      category: "security",
    },
    {
      id: 3,
      title: "Login Alert",
      message: "Last login from Delhi using Chrome browser at 3:45 PM.",
      time: "April 18, 2025 at 03:45 PM",
      icon: ShieldAlert,
      type: "warning",
      read: true,
      category: "security",
    },
    {
      id: 4,
      title: "KYC Update Required",
      message: "Your KYC documents will expire in 15 days. Please update them.",
      time: "April 17, 2025 at 11:20 AM",
      icon: Clock,
      type: "warning",
      read: true,
      category: "account",
    },
    {
      id: 5,
      title: "EMI Payment Success",
      message: "Your home loan EMI of ₹24,500 was successfully paid.",
      time: "April 15, 2025 at 08:00 AM",
      icon: Check,
      type: "success",
      read: true,
      category: "transaction",
    },
    {
      id: 6,
      title: "Fixed Deposit Maturity",
      message: "Your FD of ₹1,00,000 will mature in 7 days. Consider renewal options.",
      time: "April 14, 2025 at 09:15 AM",
      icon: Clock,
      type: "info",
      read: true,
      category: "account",
    },
    {
      id: 7,
      title: "New Offer Available",
      message: "You're pre-approved for a personal loan of up to ₹5,00,000 at 10.5% interest rate.",
      time: "April 12, 2025 at 02:30 PM",
      icon: Bell,
      type: "info",
      read: true,
      category: "offer",
    },
    {
      id: 8,
      title: "Debit Card Transaction",
      message: "Your debit card ending with 8901 was used for ATM withdrawal of ₹10,000.",
      time: "April 10, 2025 at 04:45 PM",
      icon: CreditCard,
      type: "info",
      read: true,
      category: "transaction",
    },
    {
      id: 9,
      title: "Password Changed",
      message: "Your NetBanking password was changed successfully.",
      time: "April 05, 2025 at 11:30 AM",
      icon: ShieldAlert,
      type: "success",
      read: true,
      category: "security",
    },
    {
      id: 10,
      title: "Statement Generated",
      message: "Your account statement for March 2025 is now available for download.",
      time: "April 01, 2025 at 09:00 AM",
      icon: Bell,
      type: "info",
      read: true,
      category: "account",
    },
  ]

  const [notifications, setNotifications] = useState(allNotifications)

  const filterNotifications = () => {
    return notifications.filter((notification) => {
      // Filter by tab
      if (activeTab === "all") {
        // Continue with other filters
      } else if (activeTab === "unread") {
        if (notification.read) return false
      } else if (activeTab === "security") {
        if (notification.category !== "security") return false
      } else if (activeTab === "transactions") {
        if (notification.category !== "transaction") return false
      } else if (activeTab === "account") {
        if (notification.category !== "account") return false
      }

      // Filter by search term
      if (
        searchTerm &&
        !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // Filter by date
      if (dateFilter !== "all") {
        const notifDate = new Date(notification.time.split(" at ")[0])
        const today = new Date()

        if (dateFilter === "today") {
          if (notifDate.toDateString() !== today.toDateString()) return false
        } else if (dateFilter === "week") {
          const weekAgo = new Date()
          weekAgo.setDate(today.getDate() - 7)
          if (notifDate < weekAgo) return false
        } else if (dateFilter === "month") {
          const monthAgo = new Date()
          monthAgo.setMonth(today.getMonth() - 1)
          if (notifDate < monthAgo) return false
        }
      }

      return true
    })
  }

  const filteredNotifications = filterNotifications()

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-[#1C3E94] text-white py-4 px-6 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notification Center
          {unreadCount > 0 && (
            <Badge className="ml-2 bg-[#FFB100] text-[#1C3E94] hover:bg-[#FFB100]">{unreadCount} unread</Badge>
          )}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-black font-semibold border-white hover:bg-white/20 hover:text-yellow-500"
            onClick={markAllAsRead}
          >
            Mark all read
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-black font-semibold border-white hover:bg-white/20 hover:text-yellow-500"
            onClick={clearAllNotifications}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search notifications..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="m-0">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {searchTerm || dateFilter !== "all" || activeTab !== "all"
                    ? "Try changing your filters to see more results."
                    : "You're all caught up!"}
                </p>
              </div>
            ) : (
              <ul className="divide-y">
                {filteredNotifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 ${!notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`flex-shrink-0 rounded-full p-2 ${
                          notification.type === "danger"
                            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            : notification.type === "warning"
                              ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                              : notification.type === "success"
                                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        <notification.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-base font-medium text-gray-900 dark:text-gray-100 flex items-center">
                              {notification.title}
                              {!notification.read && (
                                <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                              )}
                            </p>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{notification.time}</p>
                          </div>
                          <div className="flex space-x-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark as read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
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
