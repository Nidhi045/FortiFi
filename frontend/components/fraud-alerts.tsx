"use client"

import { useState } from "react"
import { AlertCircle, AlertTriangle, ExternalLink, Filter, MapPin, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample fraud alerts data - updated with 2025 dates
const allAlerts = [
  {
    id: "A1001",
    userId: "U12345",
    userName: "Rahul Sharma",
    date: "2025-04-04",
    title: "Suspicious Login Attempt",
    description: "Unusual login detected from a new location (Berlin, Germany).",
    severity: "high",
    region: "International",
    type: "Authentication",
  },
  {
    id: "A1002",
    userId: "U12345",
    userName: "Rahul Sharma",
    date: "2025-04-03",
    title: "Unusual Transaction Pattern",
    description: "Multiple small transactions followed by a large withdrawal.",
    severity: "medium",
    region: "Domestic",
    type: "Transaction",
  },
  {
    id: "A1003",
    userId: "U67890",
    userName: "Priya Patel",
    date: "2025-04-08",
    title: "Foreign Transaction Alert",
    description: "Unusual transaction from Thailand while user is in India.",
    severity: "high",
    region: "International",
    type: "Transaction",
  },
  {
    id: "A1004",
    userId: "U24680",
    userName: "Amit Kumar",
    date: "2025-04-07",
    title: "Device Fingerprint Mismatch",
    description: "Login attempt with matching credentials but unusual device fingerprint.",
    severity: "medium",
    region: "Domestic",
    type: "Authentication",
  },
  {
    id: "A1005",
    userId: "U13579",
    userName: "Neha Singh",
    date: "2025-04-06",
    title: "Velocity Check Failed",
    description: "Too many transactions in a short time period.",
    severity: "high",
    region: "Domestic",
    type: "Transaction",
  },
  {
    id: "A1006",
    userId: "U24680",
    userName: "Amit Kumar",
    date: "2025-04-12",
    title: "Large Transaction Without History",
    description: "Unusually large transaction with no similar history pattern.",
    severity: "high",
    region: "Domestic",
    type: "Transaction",
  },
  {
    id: "A1007",
    userId: "U67890",
    userName: "Priya Patel",
    date: "2025-04-10",
    title: "Account Takeover Attempt",
    description: "Multiple password reset attempts from unrecognized device.",
    severity: "high",
    region: "Domestic",
    type: "Authentication",
  },
]

type FraudAlertsProps = {
  userId?: string
}

export function FraudAlerts({ userId }: FraudAlertsProps) {
  const [viewMode, setViewMode] = useState<"individual" | "aggregated">(userId ? "individual" : "aggregated")
  const [regionFilter, setRegionFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")

  // Filter alerts based on userId if provided
  const alerts = userId ? allAlerts.filter((alert) => alert.userId === userId) : allAlerts

  // Apply additional filters
  const filteredAlerts = alerts
    .filter((alert) => regionFilter === "all" || alert.region.toLowerCase() === regionFilter.toLowerCase())
    .filter((alert) => typeFilter === "all" || alert.type.toLowerCase() === typeFilter.toLowerCase())
    .filter((alert) => severityFilter === "all" || alert.severity.toLowerCase() === severityFilter.toLowerCase())

  // Group alerts by region for aggregated view
  const alertsByRegion = filteredAlerts.reduce(
    (acc, alert) => {
      if (!acc[alert.region]) {
        acc[alert.region] = []
      }
      acc[alert.region].push(alert)
      return acc
    },
    {} as Record<string, typeof filteredAlerts>,
  )

  // Group alerts by type for aggregated view
  const alertsByType = filteredAlerts.reduce(
    (acc, alert) => {
      if (!acc[alert.type]) {
        acc[alert.type] = []
      }
      acc[alert.type].push(alert)
      return acc
    },
    {} as Record<string, typeof filteredAlerts>,
  )

  return (
    <div suppressHydrationWarning className="space-y-4">
      {!userId && (
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h3 className="text-lg font-medium">Fraud Alerts</h3>
            <p className="text-sm text-muted-foreground">
              {viewMode === "individual" ? "Individual alerts across all users" : "Aggregated alerts by category"}
            </p>
          </div>
          <div className="flex space-x-2">
            <Select value={viewMode} onValueChange={(value) => setViewMode(value as "individual" | "aggregated")}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="View mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="aggregated">Aggregated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {viewMode === "aggregated" ? (
        <Tabs suppressHydrationWarning defaultValue="region" className="space-y-4">
          <TabsList>
            <TabsTrigger value="region">By Region</TabsTrigger>
            <TabsTrigger value="type">By Type</TabsTrigger>
            <TabsTrigger value="severity">By Severity</TabsTrigger>
          </TabsList>

          <TabsContent value="region" className="space-y-4">
            {Object.entries(alertsByRegion).map(([region, regionAlerts]) => (
              <div key={region} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                    <h4 className="text-lg font-medium">{region}</h4>
                  </div>
                  <Badge>{regionAlerts.length} alerts</Badge>
                </div>

                <div className="mt-4 space-y-3">
                  {regionAlerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-start">
                      {alert.severity === "high" ? (
                        <AlertCircle className="mt-0.5 h-4 w-4 text-rose-600 dark:text-rose-400" />
                      ) : (
                        <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400" />
                      )}
                      <div className="ml-2">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{alert.title}</span>
                          <span className="ml-2 text-xs text-muted-foreground">({alert.userName})</span>
                        </div>
                        <p suppressHydrationWarning className="text-xs text-muted-foreground">{new Date(alert.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}

                  {regionAlerts.length > 3 && (
                    <Button variant="link" size="sm" className="p-0 h-auto">
                      View {regionAlerts.length - 3} more alerts
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="type" className="space-y-4">
            {Object.entries(alertsByType).map(([type, typeAlerts]) => (
              <div key={type} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium">{type} Alerts</h4>
                  <Badge>{typeAlerts.length} alerts</Badge>
                </div>

                <div className="mt-4 space-y-3">
                  {typeAlerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-start">
                      {alert.severity === "high" ? (
                        <AlertCircle className="mt-0.5 h-4 w-4 text-rose-600 dark:text-rose-400" />
                      ) : (
                        <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400" />
                      )}
                      <div className="ml-2">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{alert.title}</span>
                          <span className="ml-2 text-xs text-muted-foreground">({alert.userName})</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{new Date(alert.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}

                  {typeAlerts.length > 3 && (
                    <Button variant="link" size="sm" className="p-0 h-auto">
                      View {typeAlerts.length - 3} more alerts
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="severity" className="space-y-4">
            <div className="rounded-lg border p-4 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-rose-800 dark:text-rose-300">High Severity</h4>
                <Badge className="bg-rose-500">
                  {filteredAlerts.filter((a) => a.severity === "high").length} alerts
                </Badge>
              </div>

              <div className="mt-4 space-y-3">
                {filteredAlerts
                  .filter((a) => a.severity === "high")
                  .slice(0, 3)
                  .map((alert) => (
                    <div key={alert.id} className="flex items-start">
                      <AlertCircle className="mt-0.5 h-4 w-4 text-rose-600 dark:text-rose-400" />
                      <div className="ml-2">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{alert.title}</span>
                          <span className="ml-2 text-xs text-muted-foreground">({alert.userName})</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{new Date(alert.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-lg border p-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-amber-800 dark:text-amber-300">Medium Severity</h4>
                <Badge className="bg-amber-500">
                  {filteredAlerts.filter((a) => a.severity === "medium").length} alerts
                </Badge>
              </div>

              <div className="mt-4 space-y-3">
                {filteredAlerts
                  .filter((a) => a.severity === "medium")
                  .slice(0, 3)
                  .map((alert) => (
                    <div key={alert.id} className="flex items-start">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <div className="ml-2">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{alert.title}</span>
                          <span className="ml-2 text-xs text-muted-foreground">({alert.userName})</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{new Date(alert.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <>
          {!userId && (
            <div className="flex flex-wrap gap-2 mb-4">
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="domestic">Domestic</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="authentication">Authentication</SelectItem>
                  <SelectItem value="transaction">Transaction</SelectItem>
                </SelectContent>
              </Select>

              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg border p-4 ${
                  alert.severity === "high"
                    ? "border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/50"
                    : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50"
                }`}
              >
                <div className="flex items-start">
                  {alert.severity === "high" ? (
                    <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600 dark:text-rose-400" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
                  )}
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-sm font-medium ${
                          alert.severity === "high"
                            ? "text-rose-800 dark:text-rose-300"
                            : "text-amber-800 dark:text-amber-300"
                        }`}
                      >
                        {alert.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={
                          alert.severity === "high"
                            ? "border-rose-300 bg-rose-100 text-rose-800 dark:border-rose-700 dark:bg-rose-900 dark:text-rose-300"
                            : "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-700 dark:bg-amber-900 dark:text-amber-300"
                        }
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <div
                      className={`mt-1 text-sm ${
                        alert.severity === "high"
                          ? "text-rose-700 dark:text-rose-400"
                          : "text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      <p>{alert.description}</p>
                      <div className="mt-1 flex items-center text-xs space-x-2">
                        {!userId && (
                          <div className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            <span>{alert.userName}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>{new Date(alert.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          <span>{alert.region}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Button
                        size="sm"
                        className={
                          alert.severity === "high"
                            ? "border-rose-300 bg-rose-100 text-rose-800 hover:bg-rose-200 dark:border-rose-700 dark:bg-rose-900 dark:text-rose-300 dark:hover:bg-rose-800"
                            : "border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-900 dark:text-amber-300 dark:hover:bg-amber-800"
                        }
                      >
                        Review Alert
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>No fraud alerts at this time.</p>
            </div>
          )}
        </>
      )}

      <Link href="/transactions?filter=alerts">
        <Button variant="outline" size="sm" className="w-full">
          <ExternalLink className="mr-2 h-4 w-4" />
          View All Alerts
        </Button>
      </Link>
    </div>
  )
}
