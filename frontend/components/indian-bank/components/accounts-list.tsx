"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/indian-bank/components/ui/card"
import { Button } from "@/components/indian-bank/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/indian-bank/components/ui/tabs"
import { Eye, EyeOff, Download, ArrowRight } from "lucide-react"
import Link from "next/link"

export function AccountsList() {
  const [showBalances, setShowBalances] = useState<Record<string, boolean>>({})

  const accounts = [
    {
      id: "acc1",
      type: "Savings Account",
      number: "6789XXXX1234",
      fullNumber: "6789543211234",
      ifsc: "IDIB000C123",
      branch: "MG Road, Bangalore",
      balance: "₹1,25,000.00",
      lastUpdated: "April 19, 2025 at 09:15 AM",
      status: "active",
    },
    {
      id: "acc2",
      type: "Current Account",
      number: "9876XXXX5678",
      fullNumber: "9876543215678",
      ifsc: "IDIB000C123",
      branch: "MG Road, Bangalore",
      balance: "₹4,50,000.00",
      lastUpdated: "April 19, 2025 at 09:15 AM",
      status: "active",
    },
    {
      id: "acc3",
      type: "Fixed Deposit",
      number: "5432XXXX8765",
      fullNumber: "5432109878765",
      ifsc: "IDIB000C123",
      branch: "MG Road, Bangalore",
      balance: "₹5,00,000.00",
      maturityDate: "March 15, 2025",
      interestRate: "6.75%",
      lastUpdated: "April 15, 2025 at 10:30 AM",
      status: "active",
    },
  ]

  const toggleBalance = (accountId: string) => {
    setShowBalances((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }))
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-[#1C3E94] text-white">
        <TabsTrigger value="all">All Accounts</TabsTrigger>
        <TabsTrigger value="deposits">Deposits</TabsTrigger>
        <TabsTrigger value="loans">Loans</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <div className="grid gap-6">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader className="bg-[#1C3E94] text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{account.type}</CardTitle>
                  {account.status === "active" && (
                    <Button variant="outline" size="sm" className="bg-white text-[#1C3E94] hover:bg-gray-100">
                      <Download className="mr-2 h-4 w-4" /> Statement
                    </Button>
                  )}
                </div>
                <CardDescription className="text-gray-200">Account Number: {account.number}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">IFSC Code</h3>
                    <p className="mt-1 font-medium">{account.ifsc}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Branch</h3>
                    <p className="mt-1 font-medium">{account.branch}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-500">Available Balance</h3>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleBalance(account.id)}>
                      {showBalances[account.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showBalances[account.id] ? "Hide" : "Show"} balance</span>
                    </Button>
                  </div>
                  <p className="mt-1 text-xl font-semibold text-green-600">
                    {showBalances[account.id] ? account.balance : "₹XX,XXX.XX"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Last updated: {account.lastUpdated}</p>

                  {account.type === "Fixed Deposit" && (
                    <div className="mt-4 grid gap-2 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Maturity Date</h3>
                        <p className="mt-1 font-medium">{account.maturityDate}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Interest Rate</h3>
                        <p className="mt-1 font-medium">{account.interestRate}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 px-6 py-4">
                <div className="w-full flex justify-between items-center">
                  <Button variant="outline">View Details</Button>
                  <Button asChild className="bg-[#FFB100] text-[#1C3E94] hover:bg-[#ffa200]">
                    <Link href="/ib-netbanking/fund-transfer">
                      Transfer Funds <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="deposits">
        <Card>
          <CardHeader>
            <CardTitle>Fixed Deposits</CardTitle>
            <CardDescription>Your fixed deposit accounts</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6">
              <Card className="border-l-4 border-l-[#FFB100]">
                <CardContent className="p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Account Number</h3>
                      <p className="mt-1 font-medium">5432XXXX8765</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Principal Amount</h3>
                      <p className="mt-1 font-medium">₹5,00,000.00</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Interest Rate</h3>
                      <p className="mt-1 font-medium">6.75%</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Maturity Date</h3>
                      <p className="mt-1 font-medium">March 15, 2025</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 px-6 py-4">
            <Button className="ml-auto bg-[#FFB100] text-[#1C3E94] hover:bg-[#ffa200]">Open New Deposit</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="loans">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Loans</CardTitle>
            <CardDescription>Your loan accounts</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-6 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-gray-500"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">No Active Loans</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md">
                You don't have any active loan accounts. Explore our loan options to find one that suits your needs.
              </p>
              <Button className="mt-6 bg-[#FFB100] text-[#1C3E94] hover:bg-[#ffa200]">Explore Loan Options</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
