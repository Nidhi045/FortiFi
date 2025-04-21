import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/indian-bank/components/ui/card"
import { Badge } from "@/components/indian-bank/components/ui/badge"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

export function TransactionQuickSummary() {
  const transactions = [
    {
      id: 1,
      description: "UPI Payment to Priya Patel",
      amount: "₹2,500.00",
      date: "April 19, 2025",
      time: "09:15 AM",
      type: "debit",
    },
    {
      id: 2,
      description: "Salary Credit - TechSolutions India Pvt Ltd",
      amount: "₹45,000.00",
      date: "April 15, 2025",
      time: "10:30 AM",
      type: "credit",
    },
    {
      id: 3,
      description: "ATM Withdrawal - Andheri Branch",
      amount: "₹10,000.00",
      date: "April 12, 2025",
      time: "03:45 PM",
      type: "debit",
    },
    {
      id: 4,
      description: "Electricity Bill - Tata Power",
      amount: "₹1,450.00",
      date: "April 10, 2025",
      time: "11:20 AM",
      type: "debit",
    },
    {
      id: 5,
      description: "UPI Payment from Vikram Singh",
      amount: "₹5,000.00",
      date: "April 05, 2025",
      time: "02:30 PM",
      type: "credit",
    },
  ]

  return (
    <Card>
      <CardHeader className="bg-[#1C3E94] text-white rounded-t-lg">
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
        <CardDescription className="text-gray-200">Your last 5 transactions</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <div className={`rounded-full p-2 ${transaction.type === "credit" ? "bg-green-100" : "bg-red-100"}`}>
                  {transaction.type === "credit" ? (
                    <ArrowDownLeft className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {transaction.date} • {transaction.time}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "credit" ? "+" : "-"}
                  {transaction.amount}
                </p>
                <Badge variant={transaction.type === "credit" ? "outline" : "secondary"} className="mt-1">
                  {transaction.type === "credit" ? "Received" : "Paid"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
