import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/indian-bank/components/ui/card"
import { Button } from "@/components/indian-bank/components/ui/button"
import { CreditCard, Banknote, Receipt, Shield, Gift, Landmark, Smartphone, FileText, ArrowRight } from "lucide-react"

export function ServicesGrid() {
  const services = [
    {
      id: "s1",
      title: "Debit Card Services",
      description: "Manage your debit cards, set limits, and enable/disable features",
      icon: CreditCard,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "s2",
      title: "Cheque Services",
      description: "Request cheque book, stop payment, and view status",
      icon: Receipt,
      color: "bg-green-100 text-green-600",
    },
    {
      id: "s3",
      title: "Fixed Deposits",
      description: "Open new FD, view existing deposits, and calculate returns",
      icon: Landmark,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "s4",
      title: "Bill Payments",
      description: "Pay utility bills, recharges, and other payments",
      icon: Banknote,
      color: "bg-amber-100 text-amber-600",
    },
    {
      id: "s5",
      title: "Insurance",
      description: "Explore and manage insurance policies",
      icon: Shield,
      color: "bg-red-100 text-red-600",
    },
    {
      id: "s6",
      title: "Mutual Funds",
      description: "Invest in mutual funds and track your investments",
      icon: Gift,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      id: "s7",
      title: "Mobile Banking",
      description: "Manage mobile banking settings and preferences",
      icon: Smartphone,
      color: "bg-teal-100 text-teal-600",
    },
    {
      id: "s8",
      title: "Statement Services",
      description: "Generate account statements and tax certificates",
      icon: FileText,
      color: "bg-gray-100 text-gray-600",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Card key={service.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className={`rounded-full p-2 ${service.color}`}>
                <service.icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{service.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">{service.description}</CardDescription>
          </CardContent>
          <CardFooter className="bg-gray-50 px-6 py-3">
            <Button variant="ghost" className="ml-auto text-[#1C3E94] hover:bg-[#1C3E94]/10 p-0">
              Explore <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
