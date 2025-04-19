"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, TrendingUp, TrendingDown, CreditCard, DollarSign, PieChart } from "lucide-react"

export function CreditMetrics() {
  const [timeRange, setTimeRange] = useState("month")
  const [cardType, setCardType] = useState("all")

  // Sample data for credit metrics - updated with dynamic values based on selections
  const metrics = {
    totalSpending: {
      day: {
        all: "₹12.5L",
        physical: "₹7.8L",
        virtual: "₹4.7L",
      },
      week: {
        all: "₹85.2L",
        physical: "₹52.8L",
        virtual: "₹32.4L",
      },
      month: {
        all: "₹3.6Cr",
        physical: "₹2.23Cr",
        virtual: "₹1.37Cr",
      },
      year: {
        all: "₹42.8Cr",
        physical: "₹26.5Cr",
        virtual: "₹16.3Cr",
      },
    },
    fraudPercentage: {
      day: {
        all: 0.8,
        physical: 1.2,
        virtual: 0.3,
      },
      week: {
        all: 1.2,
        physical: 1.5,
        virtual: 0.6,
      },
      month: {
        all: 0.9,
        physical: 1.1,
        virtual: 0.4,
      },
      year: {
        all: 1.1,
        physical: 1.3,
        virtual: 0.7,
      },
    },
    transactionVolume: {
      day: {
        all: 3245,
        physical: 2150,
        virtual: 1095,
      },
      week: {
        all: 22680,
        physical: 14950,
        virtual: 7730,
      },
      month: {
        all: 98450,
        physical: 64800,
        virtual: 33650,
      },
      year: {
        all: 1245000,
        physical: 820000,
        virtual: 425000,
      },
    },
    averageTransaction: {
      day: {
        all: "₹3,850",
        physical: "₹3,620",
        virtual: "₹4,290",
      },
      week: {
        all: "₹3,760",
        physical: "₹3,530",
        virtual: "₹4,190",
      },
      month: {
        all: "₹3,650",
        physical: "₹3,440",
        virtual: "₹4,070",
      },
      year: {
        all: "₹3,440",
        physical: "₹3,230",
        virtual: "₹3,830",
      },
    },
  }

  const riskCategories = [
    { name: "International Transactions", percentage: 3.2, fraudRate: 2.8, trend: "up" },
    { name: "Digital Goods", percentage: 18.5, fraudRate: 1.5, trend: "up" },
    { name: "Cryptocurrency", percentage: 4.2, fraudRate: 3.6, trend: "up" },
    { name: "Gaming & Gambling", percentage: 7.8, fraudRate: 1.9, trend: "down" },
    { name: "Travel & Hospitality", percentage: 12.3, fraudRate: 0.7, trend: "down" },
  ]

  const cardUsageData = [
    { type: "Physical Cards", percentage: 62, amount: "₹2.23Cr" },
    { type: "Virtual Cards", percentage: 38, amount: "₹1.37Cr" },
  ]

  // Get the current metric values based on selections
  const getCurrentMetric = (metricName: string) => {
    return metrics[metricName as keyof typeof metrics][timeRange as keyof typeof metrics.totalSpending][
      cardType as keyof typeof metrics.totalSpending.day
    ]
  }

  return (
    <Card suppressHydrationWarning>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Credit Card Metrics</CardTitle>
            <CardDescription>Aggregated card usage and fraud statistics across all customers</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>

            <Select value={cardType} onValueChange={setCardType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Card type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cards</SelectItem>
                <SelectItem value="physical">Physical Cards</SelectItem>
                <SelectItem value="virtual">Virtual Cards</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="risk">Risk Categories</TabsTrigger>
            <TabsTrigger value="cards">Card Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getCurrentMetric("totalSpending")}</div>
                  <p className="text-xs text-muted-foreground">
                    {cardType === "all"
                      ? "Across all cards and accounts"
                      : cardType === "physical"
                        ? "Physical cards only"
                        : "Virtual cards only"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fraud Percentage</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getCurrentMetric("fraudPercentage")}%</div>
                  <Progress
                    value={getCurrentMetric("fraudPercentage") as number}
                    max={5}
                    className="h-2 mt-2"
                    indicatorClassName="bg-amber-500"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Of total transaction volume</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(getCurrentMetric("transactionVolume") as number).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Total number of transactions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getCurrentMetric("averageTransaction")}</div>
                  <p className="text-xs text-muted-foreground">Per transaction amount</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <div className="rounded-md border">
              <div className="p-4">
                <h3 className="text-sm font-medium">Risky Transaction Categories</h3>
                <p className="text-xs text-muted-foreground mt-1">Categories with higher than average fraud rates</p>
              </div>

              <div className="p-4 pt-0 space-y-4">
                {riskCategories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{category.name}</span>
                        <Badge className="ml-2 bg-blue-500">{category.percentage}%</Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-amber-500 font-medium">{category.fraudRate}% fraud</span>
                        {category.trend === "up" ? (
                          <TrendingUp className="ml-1 h-4 w-4 text-rose-500" />
                        ) : (
                          <TrendingDown className="ml-1 h-4 w-4 text-emerald-500" />
                        )}
                      </div>
                    </div>
                    <Progress
                      value={category.fraudRate}
                      max={5}
                      className="h-1.5"
                      indicatorClassName={
                        category.fraudRate > 2
                          ? "bg-rose-500"
                          : category.fraudRate > 1
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cards" className="space-y-4">
            <div className="rounded-md border p-4">
              <h3 className="text-sm font-medium">Card Usage Distribution</h3>
              <div className="mt-4 space-y-4">
                {cardUsageData.map((card) => (
                  <div key={card.type} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{card.type}</span>
                      <span className="text-sm">
                        {card.amount} ({card.percentage}%)
                      </span>
                    </div>
                    <Progress
                      value={card.percentage}
                      className="h-2"
                      indicatorClassName={card.type === "Physical Cards" ? "bg-blue-500" : "bg-emerald-500"}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Physical Card Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active Cards:</span>
                    <span className="font-medium">12,450</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Transaction:</span>
                    <span className="font-medium">₹4,250</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fraud Rate:</span>
                    <span className="font-medium text-amber-500">0.8%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Virtual Card Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active Cards:</span>
                    <span className="font-medium">8,320</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Transaction:</span>
                    <span className="font-medium">₹2,850</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fraud Rate:</span>
                    <span className="font-medium text-emerald-500">0.3%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
