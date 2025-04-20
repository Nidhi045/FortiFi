"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/indian-bank/components/ui/card"
import { Button } from "@/components/indian-bank/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useAccount } from "@/components/indian-bank/context/account-context"

export function AccountSummaryCard() {
  const [showBalance, setShowBalance] = useState(false)
  const [showAccountNumber, setShowAccountNumber] = useState(false)
  const { account, getBalance } = useAccount()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader className="bg-[#1C3E94] text-white rounded-t-lg">
        <CardTitle className="text-lg">Account Summary</CardTitle>
        <CardDescription className="text-gray-200">Your primary account details</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Account Number</h3>
              <div className="flex items-center mt-1">
                <p className="text-lg font-semibold">
                  {showAccountNumber ? account.fullAccountNumber : account.accountNumber}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-8 w-8 p-0"
                  onClick={() => setShowAccountNumber(!showAccountNumber)}
                >
                  {showAccountNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showAccountNumber ? "Hide" : "Show"} account number</span>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
              <p className="mt-1 text-lg font-semibold">{account.type}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">IFSC Code</h3>
              <p className="mt-1 text-lg font-semibold">{account.ifsc}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Available Balance</h3>
              <div className="flex items-center mt-1">
                <p className="text-lg font-semibold text-green-600">
                  {showBalance ? formatCurrency(getBalance()) : "₹XX,XXX.XX"}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-8 w-8 p-0"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showBalance ? "Hide" : "Show"} balance</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
            <p className="mt-1 text-sm text-gray-700">
              {new Date().toLocaleString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
