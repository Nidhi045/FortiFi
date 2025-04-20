"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/indian-bank/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/indian-bank/components/ui/tabs"
import { Progress } from "@/components/indian-bank/components/ui/progress"
import { InfoIcon, TrendingUp, Wallet, Calendar, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/indian-bank/components/ui/tooltip"

export function AccountInsights() {
  const [activeTab, setActiveTab] = useState("summary")

  const accountData = {
    savings: {
      balance: "₹1,24,567.89",
      interestEarned: "₹1,245.50",
      interestRate: "3.5%",
      lastTransaction: "April 19, 2025",
    },
    current: {
      balance: "₹2,45,678.90",
      interestEarned: "₹0.00",
      interestRate: "0%",
      lastTransaction: "April 18, 2025",
    },
    fd: {
      totalValue: "₹5,00,000.00",
      interestEarned: "₹8,750.00",
      interestRate: "6.75%",
      maturityDate: "March 15, 2025",
    },
    rd: {
      totalValue: "₹60,000.00",
      interestEarned: "₹1,350.00",
      interestRate: "5.4%",
      maturityDate: "December 10, 2025",
      monthlyContribution: "₹5,000.00",
    },
    totalInterestEarned: "₹11,345.50",
    accountHealthScore: 85,
  }

  return (
    <Card className="h-full">
      <CardHeader className="bg-[#1C3E94] text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Account Insights</CardTitle>
            <CardDescription className="text-gray-200">Detailed view of your accounts</CardDescription>
          </div>
          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                    <span className="text-sm font-medium mr-2">Health Score: {accountData.accountHealthScore}/100</span>
                    <HelpCircle className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="w-80">
                  <div className="space-y-2">
                    <p className="font-medium">Account Health Score</p>
                    <p className="text-sm">
                      This score reflects the overall health of your banking relationship based on:
                    </p>
                    <ul className="text-sm list-disc pl-4 space-y-1">
                      <li>Regular transactions and deposits</li>
                      <li>Maintaining minimum balance</li>
                      <li>Timely loan repayments</li>
                      <li>Active usage of bank services</li>
                      <li>Up-to-date KYC documentation</li>
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
            <TabsTrigger value="interest">Interest</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Wallet className="h-5 w-5 mr-2 text-[#1C3E94] dark:text-[#FFB100]" />
                  <h3 className="font-medium">Total Balance</h3>
                </div>
                <p className="text-2xl font-bold">₹9,30,246.79</p>
                <p className="text-sm text-gray-500 mt-1">Across all accounts</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  <h3 className="font-medium">Interest Earned (YTD)</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">{accountData.totalInterestEarned}</p>
                <p className="text-sm text-gray-500 mt-1">Financial year 2024-25</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Account Distribution</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Savings Account</span>
                    <span>{accountData.savings.balance}</span>
                  </div>
                  <Progress value={13} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Current Account</span>
                    <span>{accountData.current.balance}</span>
                  </div>
                  <Progress value={26} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Fixed Deposits</span>
                    <span>{accountData.fd.totalValue}</span>
                  </div>
                  <Progress value={54} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Recurring Deposits</span>
                    <span>{accountData.rd.totalValue}</span>
                  </div>
                  <Progress value={7} className="h-2" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="savings" className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Savings Account</h3>
                <p className="text-2xl font-bold mt-1">{accountData.savings.balance}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Current Account</h3>
                <p className="text-2xl font-bold mt-1">{accountData.current.balance}</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
              <h3 className="font-medium">Account Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Interest Rate (Savings)</p>
                  <p className="font-medium">{accountData.savings.interestRate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Interest Earned (YTD)</p>
                  <p className="font-medium">{accountData.savings.interestEarned}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Transaction</p>
                  <p className="font-medium">{accountData.savings.lastTransaction}</p>
                </div>
                <div>
                  <p className="text-gray-500">Minimum Balance Required</p>
                  <p className="font-medium">₹5,000.00</p>
                </div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Upgrade to Premium Savings Account to earn additional 0.5% interest. Contact your branch for details.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="deposits" className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 mr-2 text-[#1C3E94] dark:text-[#FFB100]" />
                  <h3 className="font-medium">Fixed Deposits</h3>
                </div>
                <p className="text-2xl font-bold">{accountData.fd.totalValue}</p>
                <p className="text-sm text-gray-500 mt-1">Matures on {accountData.fd.maturityDate}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 mr-2 text-[#1C3E94] dark:text-[#FFB100]" />
                  <h3 className="font-medium">Recurring Deposits</h3>
                </div>
                <p className="text-2xl font-bold">{accountData.rd.totalValue}</p>
                <p className="text-sm text-gray-500 mt-1">Monthly: {accountData.rd.monthlyContribution}</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
              <h3 className="font-medium">Deposit Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">FD Interest Rate</p>
                  <p className="font-medium">{accountData.fd.interestRate}</p>
                </div>
                <div>
                  <p className="text-gray-500">FD Interest Earned</p>
                  <p className="font-medium">{accountData.fd.interestEarned}</p>
                </div>
                <div>
                  <p className="text-gray-500">RD Interest Rate</p>
                  <p className="font-medium">{accountData.rd.interestRate}</p>
                </div>
                <div>
                  <p className="text-gray-500">RD Interest Earned</p>
                  <p className="font-medium">{accountData.rd.interestEarned}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                <p className="text-sm text-green-600 dark:text-green-400">
                  Special FD rate of 7.25% available for senior citizens.
                </p>
              </div>
              <button className="text-sm font-medium text-[#1C3E94] dark:text-[#FFB100]">Learn more</button>
            </div>
          </TabsContent>

          <TabsContent value="interest" className="p-4 space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Interest Earned (Year to Date)</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Savings Account</span>
                    <span>{accountData.savings.interestEarned}</span>
                  </div>
                  <Progress value={11} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Fixed Deposits</span>
                    <span>{accountData.fd.interestEarned}</span>
                  </div>
                  <Progress value={77} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Recurring Deposits</span>
                    <span>{accountData.rd.interestEarned}</span>
                  </div>
                  <Progress value={12} className="h-2" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">Total Interest Earned</span>
                  <span className="font-bold text-green-600">{accountData.totalInterestEarned}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
              <h3 className="font-medium">Interest Rates</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Savings Account</p>
                  <p className="font-medium">{accountData.savings.interestRate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Current Account</p>
                  <p className="font-medium">{accountData.current.interestRate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fixed Deposit</p>
                  <p className="font-medium">{accountData.fd.interestRate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Recurring Deposit</p>
                  <p className="font-medium">{accountData.rd.interestRate}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <InfoIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0" />
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Interest rates are subject to change as per RBI guidelines. Last updated on April 15, 2025.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
