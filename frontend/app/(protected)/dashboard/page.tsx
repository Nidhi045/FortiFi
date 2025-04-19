import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RecentTransactions } from "@/components/recent-transactions"
import { FraudAlerts } from "@/components/fraud-alerts"
import { FraudScoreCard } from "@/components/fraud-score-card"
import { ThreatMap } from "@/components/threat-map"
import { CreditMetrics } from "@/components/credit-metrics"
import { UserDetails } from "@/components/user-details"
import { RiskManagementAssistant } from "@/components/risk-management-assistant"
import { AlertCircle, CreditCard, Shield, ArrowRight, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Dashboard | Secure Banking",
  description: "Your secure banking dashboard with fraud prevention insights",
}

export default function DashboardPage() {
  // Define variables for dynamic values
  const dashboardData = {
    fraudAlerts: {
      count: 5,
      highPriority: 2,
    },
    totalUsers: {
      count: 1245,
      weeklyIncrease: 12,
    },
    virtualCards: {
      count: 842,
      totalLimit: "₹12.5L",
    },
  };

  return (
    <div suppressHydrationWarning className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Fortifi Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor account security, fraud alerts, and transaction risk in real-time
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FraudScoreCard />

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fraud Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.fraudAlerts.count}</div>
            <p className="text-xs text-amber-500">
              {dashboardData.fraudAlerts.highPriority} high priority alerts
            </p>
          </CardContent>
          <CardFooter className="p-2">
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/transactions?filter=alerts">
                View Alerts <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalUsers.count}</div>
            <p className="text-xs text-emerald-500">
              +{dashboardData.totalUsers.weeklyIncrease} this week
            </p>
          </CardContent>
          <CardFooter className="p-2">
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/manage/users">
                <Users className="mr-1 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Virtual Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.virtualCards.count}</div>
            <p className="text-xs text-emerald-500">
              {dashboardData.virtualCards.totalLimit} total limit
            </p>
          </CardContent>
          <CardFooter className="p-2">
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/virtual-cards">
                <CreditCard className="mr-1 h-4 w-4" />
                Manage Cards
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Transaction history with fraud risk assessment</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/transactions">View All</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/transaction-sandbox">Test Transaction</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <RecentTransactions />
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Fraud Alerts</CardTitle>
                  <CardDescription>Recent suspicious activities detected</CardDescription>
                </CardHeader>
                <CardContent>
                  <FraudAlerts />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Global Threat Map</CardTitle>
                <CardDescription>Live visualization of fraud attempts and security threats</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] p-0">
                <ThreatMap />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <CreditMetrics />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UserDetails userId={""} />z
        </TabsContent>

        <TabsContent value="assistant">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Management Assistant</CardTitle>
                <CardDescription>AI-powered assistance for fraud risk management</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <RiskManagementAssistant />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}