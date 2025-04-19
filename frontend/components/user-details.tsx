"use client"

import { useState } from "react"
import Link from "next/link"
import { TrendingUp, AlertTriangle, DollarSign, FileText, Shield, LockKeyhole, Ban } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionHistory } from "@/components/transaction-history"

type UserAccount = {
  id: string
  type: string
  number: string
  balance: number
  currency: string
}

type UserLoan = {
  id: string
  type: string
  amount: number
  status: string
  interestRate: number
  term: number
  monthlyPayment: number
  remainingAmount: number
}

type SpendingTrend = {
  month: string
  amount: number
}

type UnusualPattern = {
  description: string
  amount: number
  category: string
  date: string
}

type Eligibility = {
  creditScore: number
  maxLoanAmount: number
  recommendedProducts: string[]
  reasons: string[]
}

type User = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  kycStatus: "verified" | "pending" | "blocked"
  riskScore: number
  accountType: string
  location: string
  lastActivity: string
  joinDate: string
  accounts: UserAccount[]
  spendingBehavior?: {
    monthlyAverage: number
    trends: SpendingTrend[]
    topCategories: string[]
    unusualPatterns: UnusualPattern[]
  }
  eligibility?: Eligibility
  loans?: UserLoan[]
}



export function UserDetails({ userId }: { userId: string }) {
  // Sample user data
  const users: Record<string, User> = {
    U12345: {
      id: "U12345",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      address: "123 MG Road, Bangalore, Karnataka",
      kycStatus: "verified",
      riskScore: 82,
      accountType: "Premium",
      location: "Bangalore, India",
      lastActivity: "2025-04-17T14:32:00",
      joinDate: "2023-06-15",
      accounts: [
        {
          id: "ACC001",
          type: "Savings",
          number: "XXXX-XXXX-1234",
          balance: 125000,
          currency: "INR",
        },
        {
          id: "ACC002",
          type: "Current",
          number: "XXXX-XXXX-5678",
          balance: 450000,
          currency: "INR",
        },
      ],
      spendingBehavior: {
        monthlyAverage: 45000,
        trends: [
          { month: "Jan", amount: 38000 },
          { month: "Feb", amount: 42000 },
          { month: "Mar", amount: 51000 },
          { month: "Apr", amount: 49000 },
        ],
        topCategories: ["Shopping", "Dining", "Travel", "Entertainment"],
        unusualPatterns: [
          {
            description: "Large electronics purchase",
            amount: 75000,
            category: "Shopping",
            date: "2025-04-10",
          },
        ],
      },
      eligibility: {
        creditScore: 780,
        maxLoanAmount: 2000000,
        recommendedProducts: ["Home Loan", "Personal Loan", "Credit Card"],
        reasons: [
          "Good credit history",
          "Stable income source",
          "Low debt-to-income ratio",
        ],
      },
      loans: [
        {
          id: "LN001",
          type: "Personal Loan",
          amount: 500000,
          status: "active",
          interestRate: 10.5,
          term: 36,
          monthlyPayment: 16200,
          remainingAmount: 320000,
        },
      ],
    },
    U67890: {
      id: "U67890",
      name: "Priya Patel",
      email: "priya.patel@example.com",
      phone: "+91 87654 32109",
      address: "456 Park Street, Mumbai, Maharashtra",
      kycStatus: "verified",
      riskScore: 65,
      accountType: "Standard",
      location: "Mumbai, India",
      lastActivity: "2025-04-16T09:15:00",
      joinDate: "2023-09-22",
      accounts: [
        {
          id: "ACC003",
          type: "Savings",
          number: "XXXX-XXXX-9012",
          balance: 75000,
          currency: "INR",
        },
      ],
      spendingBehavior: {
        monthlyAverage: 28000,
        trends: [
          { month: "Jan", amount: 25000 },
          { month: "Feb", amount: 27000 },
          { month: "Mar", amount: 31000 },
          { month: "Apr", amount: 29000 },
        ],
        topCategories: ["Groceries", "Utilities", "Transport"],
        unusualPatterns: [],
      },
      eligibility: {
        creditScore: 680,
        maxLoanAmount: 800000,
        recommendedProducts: ["Personal Loan", "Credit Card"],
        reasons: [
          "Moderate credit history",
          "Limited credit utilization",
        ],
      },
      loans: [],
    },
    U24680: {
      id: "U24680",
      name: "Amit Kumar",
      email: "amit.kumar@example.com",
      phone: "+91 76543 21098",
      address: "789 Connaught Place, Delhi",
      kycStatus: "verified",
      riskScore: 91,
      accountType: "Premium",
      location: "Delhi, India",
      lastActivity: "2025-04-18T11:45:00",
      joinDate: "2022-11-05",
      accounts: [
        {
          id: "ACC004",
          type: "Savings",
          number: "XXXX-XXXX-3456",
          balance: 320000,
          currency: "INR",
        },
        {
          id: "ACC005",
          type: "Current",
          number: "XXXX-XXXX-7890",
          balance: 780000,
          currency: "INR",
        },
      ],
      spendingBehavior: {
        monthlyAverage: 65000,
        trends: [
          { month: "Jan", amount: 58000 },
          { month: "Feb", amount: 62000 },
          { month: "Mar", amount: 71000 },
          { month: "Apr", amount: 69000 },
        ],
        topCategories: ["Investments", "Travel", "Dining"],
        unusualPatterns: [],
      },
      eligibility: {
        creditScore: 820,
        maxLoanAmount: 3000000,
        recommendedProducts: ["Home Loan", "Investment Loan", "Premium Credit Card"],
        reasons: [
          "Excellent credit history",
          "High income",
          "Substantial assets",
        ],
      },
      loans: [
        {
          id: "LN002",
          type: "Home Loan",
          amount: 2500000,
          status: "active",
          interestRate: 8.75,
          term: 240,
          monthlyPayment: 22200,
          remainingAmount: 2100000,
        },
      ],
    },
    U13579: {
      id: "U13579",
      name: "Neha Singh",
      email: "neha.singh@example.com",
      phone: "+91 65432 10987",
      address: "321 Anna Salai, Chennai, Tamil Nadu",
      kycStatus: "pending",
      riskScore: 43,
      accountType: "Standard",
      location: "Chennai, India",
      lastActivity: "2025-04-15T16:20:00",
      joinDate: "2024-01-18",
      accounts: [
        {
          id: "ACC006",
          type: "Savings",
          number: "XXXX-XXXX-2468",
          balance: 45000,
          currency: "INR",
        },
      ],
      spendingBehavior: {
        monthlyAverage: 18000,
        trends: [
          { month: "Jan", amount: 15000 },
          { month: "Feb", amount: 17000 },
          { month: "Mar", amount: 19000 },
          { month: "Apr", amount: 21000 },
        ],
        topCategories: ["Rent", "Utilities", "Groceries"],
        unusualPatterns: [
          {
            description: "Unusual cash withdrawal",
            amount: 30000,
            category: "Cash",
            date: "2025-04-05",
          },
        ],
      },
      eligibility: {
        creditScore: 580,
        maxLoanAmount: 300000,
        recommendedProducts: ["Secured Credit Card"],
        reasons: [
          "Limited credit history",
          "High debt-to-income ratio",
        ],
      },
      loans: [],
    },
  }

  const user = users[userId]

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="rounded-full bg-muted p-3 mb-2">
          <AlertTriangle className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium">User Not Found</h3>
        <p className="text-xs text-muted-foreground mt-1">The requested user could not be found</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getRiskBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-emerald-500 hover:bg-emerald-600">Low Risk ({score})</Badge>
    } else if (score >= 60) {
      return <Badge className="bg-amber-500 hover:bg-amber-600">Medium Risk ({score})</Badge>
    } else {
      return <Badge className="bg-rose-500 hover:bg-rose-600">High Risk ({score})</Badge>
    }
  }

  const getKycStatusBadge = (status: "verified" | "pending" | "blocked") => {
    if (status === "verified") {
      return (
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
        >
          KYC Verified
        </Badge>
      )
    } else if (status === "pending") {
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800"
        >
          KYC Pending
        </Badge>
      )
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800"
        >
          KYC Blocked
        </Badge>
      )
    }
  }

  return (
    <div suppressHydrationWarning className="space-y-6">
        <Card className="w-full">
          <Tabs defaultValue="transactions">
            <CardHeader>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="spending">Spending</TabsTrigger>
                  <TabsTrigger value="loans">Loans</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>

            <TabsContent value="transactions" className="space-y-4 p-6 pt-0">
                <TransactionHistory userId={user.id} />
            </TabsContent>

            <TabsContent value="spending" className="space-y-6 p-6 pt-0">
              {user.spendingBehavior && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Average Spending</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">₹{user.spendingBehavior.monthlyAverage.toLocaleString()}</div>
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium">Monthly Trends</h4>
                          <div className="space-y-2">
                            {user.spendingBehavior.trends.map((trend, index) => (
                              <div key={index} className="flex items-center">
                                <div className="w-12 text-sm">{trend.month}</div>
                                <div className="flex-1">
                                  <div className="h-2 w-full rounded-full bg-muted">
                                    <div
                                      className="h-2 rounded-full bg-primary"
                                      style={{
                                        width: `${(trend.amount / Math.max(...(user.spendingBehavior?.trends || []).map((t) => t.amount))) * 100}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="w-20 text-right text-sm">₹{trend.amount.toLocaleString()}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Top Spending Categories</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {user.spendingBehavior.topCategories.map((category, index) => (
                            <div key={index} className="flex items-center">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <TrendingUp className="h-4 w-4 text-primary" />
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium">{category}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Unusual Spending Patterns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {user.spendingBehavior.unusualPatterns.length > 0 ? (
                        <div className="space-y-4">
                          {user.spendingBehavior.unusualPatterns.map((pattern, index) => (
                            <div key={index} className="rounded-md border p-3">
                              <div className="flex items-start">
                                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                                <div className="ml-3">
                                  <div className="flex items-center">
                                    <h4 className="text-sm font-medium">{pattern.description}</h4>
                                    <Badge className="ml-2 bg-amber-500">Unusual</Badge>
                                  </div>
                                  <div className="mt-1 text-sm">
                                    <p>
                                      ₹{pattern.amount.toLocaleString()} spent on {pattern.category} on{" "}
                                      {new Date(pattern.date).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="mt-2">
                                    <Button variant="outline" size="sm">
                                      Investigate
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No unusual spending patterns detected</p>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="loans" className="space-y-6 p-6 pt-0">
              {user.eligibility && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Loan Eligibility</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between">
                            <span className="text-sm">Credit Score</span>
                            <span className="font-medium">{user.eligibility.creditScore}</span>
                          </div>
                          <Progress
                            value={(user.eligibility.creditScore / 900) * 100}
                            className={`h-2 mt-1 ${
                              user.eligibility.creditScore >= 750
                                ? "[&>div]:bg-emerald-500"
                                : user.eligibility.creditScore >= 650
                                  ? "[&>div]:bg-amber-500"
                                  : "[&>div]:bg-rose-500"
                            }`}
                          />
                        </div>

                        <div>
                          <div className="text-sm font-medium">Max Loan Amount</div>
                          <div className="text-2xl font-bold mt-1">
                            ₹{user.eligibility.maxLoanAmount.toLocaleString()}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium">Recommended Products</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {user.eligibility.recommendedProducts.map((product, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800"
                              >
                                {product}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium">Eligibility Factors</div>
                          <ul className="mt-2 space-y-1">
                            {user.eligibility.reasons.map((reason, index) => (
                              <li key={index} className="text-sm flex items-start">
                                <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {user.loans && user.loans.length > 0 ? (
                        <div className="space-y-4">
                          {user.loans.map((loan) => (
                            <div key={loan.id} className="rounded-md border p-3">
                              <div className="flex justify-between">
                                <div className="font-medium">{loan.type}</div>
                                <Badge className={loan.status === "active" ? "bg-emerald-500" : "bg-amber-500"}>
                                  {loan.status}
                                </Badge>
                              </div>
                              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Amount:</span>
                                  <span className="ml-1 font-medium">₹{loan.amount.toLocaleString()}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Interest:</span>
                                  <span className="ml-1 font-medium">{loan.interestRate}%</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Term:</span>
                                  <span className="ml-1 font-medium">{loan.term} months</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Monthly:</span>
                                  <span className="ml-1 font-medium">₹{loan.monthlyPayment.toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="mt-3">
                                <div className="flex justify-between text-sm">
                                  <span>Remaining Balance</span>
                                  <span>₹{loan.remainingAmount.toLocaleString()}</span>
                                </div>
                                <Progress
                                  value={((loan.amount - loan.remainingAmount) / loan.amount) * 100}
                                  className="h-2 mt-1"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <div className="rounded-full bg-muted p-3 mb-2">
                            <FileText className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <h3 className="text-sm font-medium">No Active Loans</h3>
                          <p className="text-xs text-muted-foreground mt-1">This user doesn't have any active loans</p>
                          <Button size="sm" className="mt-4">
                            Offer Loan
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="flex justify-end">
                <Button>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Create Loan Offer
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
    </div>
  )
}