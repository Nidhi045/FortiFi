import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/indian-bank/components/ui/card"
import { Badge } from "@/components/indian-bank/components/ui/badge"
import { CreditCard, Home, Car } from "lucide-react"

export function UpcomingEMIs() {
  const emiData = [
    {
      id: "emi1",
      type: "Home Loan",
      icon: Home,
      amount: "₹24,500",
      dueDate: "April 25, 2025",
      totalPaid: "₹7,35,000",
      totalAmount: "₹35,00,000",
      progress: 21,
      status: "upcoming",
      accountNumber: "HLOAN1234567",
    },
    {
      id: "emi2",
      type: "Car Loan",
      icon: Car,
      amount: "₹12,350",
      dueDate: "May 05, 2025",
      totalPaid: "₹3,70,500",
      totalAmount: "₹8,50,000",
      progress: 44,
      status: "upcoming",
      accountNumber: "CLOAN7654321",
    },
    {
      id: "emi3",
      type: "Personal Loan",
      icon: CreditCard,
      amount: "₹8,750",
      dueDate: "April 30, 2025",
      totalPaid: "₹87,500",
      totalAmount: "₹2,00,000",
      progress: 44,
      status: "upcoming",
      accountNumber: "PLOAN9876543",
    },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="bg-[#1C3E94] text-white rounded-t-lg">
        <CardTitle className="text-lg">Upcoming EMI Payments</CardTitle>
        <CardDescription className="text-gray-200">Your scheduled loan repayments</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y dark:divide-gray-800">
          {emiData.map((emi) => (
            <div key={emi.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="rounded-full p-2 bg-gray-100 dark:bg-gray-800">
                    <emi.icon className="h-5 w-5 text-[#1C3E94] dark:text-[#FFB100]" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{emi.type}</h3>
                      <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
                        Due {emi.dueDate}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Account: {emi.accountNumber}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="w-full max-w-[180px]">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{emi.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className="bg-[#1C3E94] h-2 rounded-full dark:bg-[#FFB100]"
                            style={{ width: `${emi.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{emi.amount}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Paid: {emi.totalPaid} / {emi.totalAmount}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {emiData.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No upcoming EMIs</p>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Auto-debit is enabled for all your EMIs</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
