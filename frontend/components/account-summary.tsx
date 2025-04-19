"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownRight, DollarSign, Users } from "lucide-react"

export function AccountSummary() {
  const [timeRange, setTimeRange] = useState("week")

  // Sample data - in a real app, this would come from an API
  const summaryData = {
    week: {
      totalTransactions: 12458,
      transactionVolume: "₹4.2Cr",
      activeUsers: 842,
      fraudAttempts: 28,
      fraudPrevented: "₹12.5L",
      avgTransactionSize: "₹33,712",
      transactionTrend: 5.2,
      userTrend: 2.8,
    },
    month: {
      totalTransactions: 52845,
      transactionVolume: "₹18.7Cr",
      activeUsers: 1245,
      fraudAttempts: 124,
      fraudPrevented: "₹48.2L",
      avgTransactionSize: "₹35,387",
      transactionTrend: 12.4,
      userTrend: 8.5,
    },
    quarter: {
      totalTransactions: 156932,
      transactionVolume: "₹54.3Cr",
      activeUsers: 1532,
      fraudAttempts: 342,
      fraudPrevented: "₹1.2Cr",
      avgTransactionSize: "₹34,601",
      transactionTrend: 18.7,
      userTrend: 15.2,
    },
  }

  const data = summaryData[timeRange as keyof typeof summaryData]

  return (
    <div suppressHydrationWarning className="space-y-4">
      <div className="flex justify-end">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Past Week</SelectItem>
            <SelectItem value="month">Past Month</SelectItem>
            <SelectItem value="quarter">Past Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{data.totalTransactions.toLocaleString()}</p>
              </div>
              <div
                className={`flex items-center text-xs ${data.transactionTrend > 0 ? "text-emerald-500" : "text-rose-500"}`}
              >
                {data.transactionTrend > 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {Math.abs(data.transactionTrend)}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Volume: {data.transactionVolume}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{data.activeUsers.toLocaleString()}</p>
              </div>
              <div className={`flex items-center text-xs ${data.userTrend > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                {data.userTrend > 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {Math.abs(data.userTrend)}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Avg. Transaction: {data.avgTransactionSize}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Fraud Attempts</p>
                <p className="text-2xl font-bold">{data.fraudAttempts}</p>
              </div>
              <div className="flex items-center text-xs text-amber-500">
                <DollarSign className="h-3 w-3 mr-1" />
                {data.fraudPrevented}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Prevented Amount: {data.fraudPrevented}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">New Users</p>
                <p className="text-2xl font-bold">{Math.round(data.activeUsers * 0.12)}</p>
              </div>
              <div className="flex items-center text-xs text-emerald-500">
                <Users className="h-3 w-3 mr-1" />
                {Math.round((data.activeUsers * 0.12) / (timeRange === "week" ? 7 : timeRange === "month" ? 30 : 90))}{" "}
                per day
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Conversion Rate: 4.8%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
