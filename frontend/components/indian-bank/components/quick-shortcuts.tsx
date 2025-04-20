import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/indian-bank/components/ui/card"
import { Button } from "@/components/indian-bank/components/ui/button"
import { ArrowRight, CreditCard, Receipt, FileText, Smartphone, Gift } from "lucide-react"
import Link from "next/link"

export function QuickShortcuts() {
  const shortcuts = [
    {
      id: "s1",
      title: "Fund Transfer",
      icon: ArrowRight,
      href: "/ib-netbanking/fund-transfer",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      id: "s2",
      title: "Pay Bills",
      icon: Receipt,
      href: "/ib-netbanking/services",
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      id: "s3",
      title: "Mobile Recharge",
      icon: Smartphone,
      href: "/ib-netbanking/services",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      id: "s4",
      title: "Virtual Card",
      icon: CreditCard,
      href: "/ib-netbanking/virtual-cards",
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    },
    {
      id: "s5",
      title: "Statement",
      icon: FileText,
      href: "/ib-netbanking/transactions",
      color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    },
    {
      id: "s6",
      title: "Rewards",
      icon: Gift,
      href: "/ib-netbanking/services",
      color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="bg-[#1C3E94] text-white rounded-t-lg">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription className="text-gray-200">Frequently used services</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {shortcuts.map((shortcut) => (
            <Button
              key={shortcut.id}
              variant="outline"
              className="h-auto flex-col items-center justify-center py-4 px-2 gap-2 border-dashed hover:bg-gray-50 dark:hover:bg-gray-800"
              asChild
            >
              <Link href={shortcut.href}>
                <div className={`rounded-full p-2 ${shortcut.color}`}>
                  <shortcut.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium">{shortcut.title}</span>
              </Link>
            </Button>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t dark:border-gray-800">
          <Button
            variant="ghost"
            className="w-full justify-between text-[#1C3E94] hover:text-[#1C3E94] hover:bg-blue-50 dark:text-[#FFB100] dark:hover:text-[#FFB100] dark:hover:bg-blue-900/20"
          >
            <Link href="/ib-netbanking/services">
            <span>Customize shortcuts</span>
            <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
