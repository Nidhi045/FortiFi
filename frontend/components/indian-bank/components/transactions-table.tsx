"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/indian-bank/components/ui/card"
import { Button } from "@/components/indian-bank/components/ui/button"
import { Badge } from "@/components/indian-bank/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/indian-bank/components/ui/table"
import { ArrowDownToLine, ArrowUpFromLine, Download } from "lucide-react"

export function TransactionsTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const transactions = [
    {
      id: "tx1",
      date: "April 19, 2025",
      description: "UPI Payment to Priya Patel",
      amount: "₹2,500.00",
      type: "debit",
      status: "completed",
    },
    {
      id: "tx2",
      date: "April 15, 2025",
      description: "Salary Credit - TechSolutions India Pvt Ltd",
      amount: "₹45,000.00",
      type: "credit",
      status: "completed",
    },
    {
      id: "tx3",
      date: "April 12, 2025",
      description: "ATM Withdrawal - Andheri Branch",
      amount: "₹10,000.00",
      type: "debit",
      status: "completed",
    },
    {
      id: "tx4",
      date: "April 10, 2025",
      description: "Electricity Bill - Tata Power",
      amount: "₹1,450.00",
      type: "debit",
      status: "completed",
    },
    {
      id: "tx5",
      date: "April 05, 2025",
      description: "UPI Payment from Vikram Singh",
      amount: "₹5,000.00",
      type: "credit",
      status: "completed",
    },
    {
      id: "tx6",
      date: "April 02, 2025",
      description: "Online Shopping - Flipkart",
      amount: "₹3,299.00",
      type: "debit",
      status: "blocked",
      reason: "Suspected Fraud",
    },
    {
      id: "tx7",
      date: "March 28, 2025",
      description: "Mobile Recharge - Jio",
      amount: "₹599.00",
      type: "debit",
      status: "completed",
    },
    {
      id: "tx8",
      date: "March 25, 2025",
      description: "Dividend Credit - Reliance Industries",
      amount: "₹1,200.00",
      type: "credit",
      status: "completed",
    },
  ]

  const handleDownloadStatement = () => {
    alert("Statement download initiated. Your statement will be available shortly.")
  }

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader className="bg-[#1C3E94] text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Transaction History</CardTitle>
            <CardDescription className="text-gray-200">View and download your transaction history</CardDescription>
          </div>
          <Button
            variant="outline"
            className="bg-white text-[#1C3E94] hover:bg-gray-100"
            onClick={handleDownloadStatement}
          >
            <Download className="mr-2 h-4 w-4" /> Download Statement
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full p-2 pl-3 pr-10 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              )}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className={transaction.status === "blocked" ? "bg-red-50" : ""}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
                      {transaction.type === "credit" ? "+" : "-"}
                      {transaction.amount}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {transaction.type === "credit" ? (
                          <ArrowDownToLine className="mr-2 h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUpFromLine className="mr-2 h-4 w-4 text-red-600" />
                        )}
                        {transaction.type === "credit" ? "Credit" : "Debit"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {transaction.status === "completed" ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Completed
                        </Badge>
                      ) : transaction.status === "blocked" ? (
                        <Badge variant="destructive">Blocked - {transaction.reason}</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-500 hover:bg-gray-100">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No transactions found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
