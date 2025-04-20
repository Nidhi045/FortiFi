import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserDetails } from "@/components/user-details"
import { ArrowLeft, Shield, AlertTriangle, Ban, LockKeyhole, UserCog, FileText, Bell } from "lucide-react"

export const metadata: Metadata = {
  title: "User Details | Secure Banking",
  description: "Detailed user information and risk analysis",
}

// Sample user data - in a real app, this would come from a database
const users = {
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
  },
}

interface PageProps {
  params: {
    id: string
  }
}

export default async function UserDetailsPage({ params }: PageProps) {
  const { id: userId } = await params;
  const user = users[userId as keyof typeof users]

  if (!user) {
    notFound()
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

  const getKycStatusBadge = (status: string) => {
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

  return (
    <div suppressHydrationWarning className="space-y-6 w-full">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/manage/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
        </div>
        <p className="text-muted-foreground">Detailed information and risk analysis for {user.name}</p>
      </div>
      <div>
      <Card className="w-full">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Personal and account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`/placeholder.svg?height=64&width=64&text=${user.name.charAt(0)}`} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{user.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                <div className="mt-1 flex items-center gap-2">
                  {getKycStatusBadge(user.kycStatus)}
                  {getRiskBadge(user.riskScore)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{user.phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Address:</span>
                <span className="font-medium text-right">{user.address}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account Type:</span>
                <span className="font-medium">{user.accountType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Activity:</span>
                <span className="font-medium">{formatDate(user.lastActivity)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Joined:</span>
                <span className="font-medium">{new Date(user.joinDate).toLocaleDateString("en-IN")}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Linked Accounts</h4>
              {user.accounts.map((account) => (
                <div key={account.id} className="rounded-md border p-3">
                  <div className="flex justify-between">
                    <div className="font-medium">{account.type}</div>
                    <Badge variant="outline">{account.currency}</Badge>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{account.number}</div>
                  <div className="mt-2 text-right font-bold">₹{account.balance.toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col space-y-2">
              {user.riskScore < 60 && (
                <Button variant="destructive">
                  <Ban className="mr-2 h-4 w-4" />
                  Block Account
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
<div className="p-3"></div>
        <Card className="w-full">
          <Tabs defaultValue="details">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Analysis</CardTitle>
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>Detailed analysis of user's financial activities and risk profile</CardDescription>
            </CardHeader>

            <TabsContent value="details" className="p-6 pt-0">
              <UserDetails userId={userId} />
            </TabsContent>

            <TabsContent value="risk" className="space-y-6 p-6 pt-0">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Risk Score Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.riskScore}</div>
                    <div
                      className={`text-xs ${
                        user.riskScore >= 80
                          ? "text-emerald-500"
                          : user.riskScore >= 60
                            ? "text-amber-500"
                            : "text-rose-500"
                      } font-medium mt-1`}
                    >
                      {user.riskScore >= 80 ? "Low Risk" : user.riskScore >= 60 ? "Medium Risk" : "High Risk"}
                    </div>
                    <Progress
                      value={user.riskScore}
                      className="h-2 mt-2"
                      indicatorClassName={
                        user.riskScore >= 80 ? "bg-emerald-500" : user.riskScore >= 60 ? "bg-amber-500" : "bg-rose-500"
                      }
                    />

                    <div className="mt-6 space-y-4">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Transaction Pattern</span>
                          <span className="font-medium">{user.riskScore >= 70 ? "Normal" : "Suspicious"}</span>
                        </div>
                        <Progress
                          value={user.riskScore >= 70 ? 85 : 40}
                          className="h-1.5 mt-1"
                          indicatorClassName={user.riskScore >= 70 ? "bg-emerald-500" : "bg-rose-500"}
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Location Consistency</span>
                          <span className="font-medium">{user.riskScore >= 60 ? "Consistent" : "Varied"}</span>
                        </div>
                        <Progress
                          value={user.riskScore >= 60 ? 90 : 55}
                          className="h-1.5 mt-1"
                          indicatorClassName={user.riskScore >= 60 ? "bg-emerald-500" : "bg-amber-500"}
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Account Age</span>
                          <span className="font-medium">
                            {new Date(user.joinDate) < new Date("2023-01-01") ? "Established" : "New"}
                          </span>
                        </div>
                        <Progress
                          value={new Date(user.joinDate) < new Date("2023-01-01") ? 95 : 60}
                          className="h-1.5 mt-1"
                          indicatorClassName={
                            new Date(user.joinDate) < new Date("2023-01-01") ? "bg-emerald-500" : "bg-amber-500"
                          }
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm">
                          <span>KYC Verification</span>
                          <span className="font-medium">
                            {user.kycStatus === "verified" ? "Complete" : "Incomplete"}
                          </span>
                        </div>
                        <Progress
                          value={user.kycStatus === "verified" ? 100 : 50}
                          className="h-1.5 mt-1"
                          indicatorClassName={user.kycStatus === "verified" ? "bg-emerald-500" : "bg-amber-500"}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Security Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.riskScore < 60 && (
                        <>
                          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 dark:border-rose-800 dark:bg-rose-950">
                            <div className="flex items-start">
                              <AlertTriangle className="mt-0.5 h-5 w-5 text-rose-500" />
                              <div className="ml-3">
                                <h4 className="text-sm font-medium text-rose-700 dark:text-rose-400">
                                  High Risk Account
                                </h4>
                                <p className="mt-1 text-xs text-rose-600 dark:text-rose-300">
                                  This account has been flagged for suspicious activity. Consider implementing
                                  additional verification steps.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Recommended Actions</h4>
                            <ul className="space-y-1">
                              <li className="text-sm flex items-start">
                                <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-rose-500" />
                                <span>Require additional identity verification</span>
                              </li>
                              <li className="text-sm flex items-start">
                                <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-rose-500" />
                                <span>Implement transaction limits</span>
                              </li>
                              <li className="text-sm flex items-start">
                                <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-rose-500" />
                                <span>Enable enhanced monitoring</span>
                              </li>
                              <li className="text-sm flex items-start">
                                <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-rose-500" />
                                <span>Schedule a security review call</span>
                              </li>
                            </ul>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-4">
                            <Button size="sm">
                              <LockKeyhole className="mr-2 h-4 w-4" />
                              Apply Restrictions
                            </Button>
                            <Button variant="outline" size="sm">
                              <Shield className="mr-2 h-4 w-4" />
                              Review Transactions
                            </Button>
                          </div>
                        </>
                      )}

                      {user.riskScore >= 60 && user.riskScore < 80 && (
                        <>
                          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
                            <div className="flex items-start">
                              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                              <div className="ml-3">
                                <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400">
                                  Medium Risk Account
                                </h4>
                                <p className="mt-1 text-xs text-amber-600 dark:text-amber-300">
                                  This account has some risk factors that should be monitored. Consider implementing
                                  preventive measures.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Recommended Actions</h4>
                            <ul className="space-y-1">
                              <li className="text-sm flex items-start">
                                <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-amber-500" />
                                <span>Enable two-factor authentication</span>
                              </li>
                              <li className="text-sm flex items-start">
                                <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-amber-500" />
                                <span>Review recent transactions</span>
                              </li>
                              <li className="text-sm flex items-start">
                                <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-amber-500" />
                                <span>Verify contact information</span>
                              </li>
                            </ul>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-4">
                            <Button size="sm">
                              <Shield className="mr-2 h-4 w-4" />
                              Enable 2FA
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              Review Activity
                            </Button>
                          </div>
                        </>
                      )}

                      {user.riskScore >= 80 && (
                        <>
                          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950">
                            <div className="flex items-start">
                              <Shield className="mt-0.5 h-5 w-5 text-emerald-500" />
                              <div className="ml-3">
                                <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                                  Low Risk Account
                                </h4>
                                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-300">
                                  This account has a good security profile. Continue standard monitoring procedures.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Recommended Actions</h4>
                            <ul className="space-y-1">
                              <li className="text-sm flex items-start">
                                <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-emerald-500" />
                                <span>Maintain regular security reviews</span>
                              </li>
                              <li className="text-sm flex items-start">
                                <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-emerald-500" />
                                <span>Offer premium security features</span>
                              </li>
                              <li className="text-sm flex items-start">
                                <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-emerald-500" />
                                <span>Consider for trusted customer program</span>
                              </li>
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

      </div>

      <div className="grid gap-6 md:grid-cols-3">

        
      </div>
    </div>
  )
}
