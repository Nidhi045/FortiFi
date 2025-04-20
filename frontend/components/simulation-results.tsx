"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle, Clock, Shield, AlertTriangle, Eye, Lock, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type SimulationResult = {
  id: string
  timestamp: string
  fraudType: string
  amount: number
  location: string
  deviceType: string
  timeOfDay: string
  transactionVelocity: number
  useProxy: boolean
  bypassVerification: boolean
  riskScore: number
  detectionStatus: "detected" | "suspicious" | "undetected"
  detectionTime: number
  securityMeasures: {
    name: string
    triggered: boolean
    effectiveness: number
  }[]
  timeline: {
    time: number
    event: string
    description: string
  }[]
}

export function SimulationResults() {
  const { toast } = useToast()
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleSimulation = (event: Event) => {
      const customEvent = event as CustomEvent
      setLoading(true)

      // Simulate processing time
      setTimeout(() => {
        const scenario = customEvent.detail

        // Generate a risk score based on the scenario
        let riskScore = 50 // Base score

        // Adjust based on fraud type
        if (scenario.fraudType === "card_theft") riskScore += 15
        if (scenario.fraudType === "identity_theft") riskScore += 20
        if (scenario.fraudType === "account_takeover") riskScore += 25
        if (scenario.fraudType === "synthetic_identity") riskScore += 15
        if (scenario.fraudType === "card_testing") riskScore += 10

        // Adjust based on location
        if (scenario.location === "foreign") riskScore += 15
        if (scenario.location === "high_risk") riskScore += 25
        if (scenario.location === "unusual") riskScore += 10

        // Adjust based on device
        if (scenario.deviceType === "new") riskScore += 10
        if (scenario.deviceType === "multiple") riskScore += 15
        if (scenario.deviceType === "emulator") riskScore += 20

        // Adjust based on time
        if (scenario.timeOfDay === "night") riskScore += 10
        if (scenario.timeOfDay === "unusual") riskScore += 15

        // Adjust based on velocity
        riskScore += scenario.transactionVelocity * 3

        // Adjust based on proxy and verification
        if (scenario.useProxy) riskScore += 15
        if (scenario.bypassVerification) riskScore += 20

        // Cap at 100
        riskScore = Math.min(riskScore, 100)

        // Determine detection status
        let detectionStatus: "detected" | "suspicious" | "undetected" = "undetected"
        if (riskScore >= 75) {
          detectionStatus = "detected"
        } else if (riskScore >= 50) {
          detectionStatus = "suspicious"
        }

        // Generate detection time (faster for higher risk scores)
        const detectionTime = Math.max(100, 1000 - riskScore * 8)

        // Generate security measures
        const securityMeasures = [
          {
            name: "AI Risk Scoring",
            triggered: riskScore >= 50,
            effectiveness: Math.min(95, 40 + riskScore / 2),
          },
          {
            name: "Behavioral Analysis",
            triggered: scenario.transactionVelocity > 3 || scenario.timeOfDay !== "normal",
            effectiveness: Math.min(90, 30 + scenario.transactionVelocity * 10),
          },
          {
            name: "Location Verification",
            triggered: scenario.location !== "domestic",
            effectiveness: scenario.location === "high_risk" ? 85 : 70,
          },
          {
            name: "Device Fingerprinting",
            triggered: scenario.deviceType !== "known",
            effectiveness: scenario.deviceType === "emulator" ? 90 : 75,
          },
          {
            name: "Multi-Factor Authentication",
            triggered: riskScore >= 60,
            effectiveness: 95,
          },
        ]

        // Generate timeline
        const timeline = [
          {
            time: 0,
            event: "Transaction Initiated",
            description: `₹${scenario.amount.toLocaleString("en-IN")} transaction attempt initiated`,
          },
          {
            time: 100,
            event: "Initial Screening",
            description: "Basic transaction parameters analyzed",
          },
          {
            time: 300,
            event: "Risk Assessment",
            description: `AI risk scoring assigned score of ${riskScore}`,
          },
        ]

        // Add security measure events
        let currentTime = 400
        securityMeasures.forEach((measure) => {
          if (measure.triggered) {
            currentTime += Math.floor(Math.random() * 200) + 100
            timeline.push({
              time: currentTime,
              event: `${measure.name} Activated`,
              description: `${measure.name} triggered with ${measure.effectiveness}% effectiveness`,
            })
          }
        })

        // Add final decision
        timeline.push({
          time: detectionTime,
          event:
            detectionStatus === "detected"
              ? "Fraud Detected"
              : detectionStatus === "suspicious"
                ? "Suspicious Activity Flagged"
                : "Transaction Processed",
          description:
            detectionStatus === "detected"
              ? "Transaction blocked due to high fraud risk"
              : detectionStatus === "suspicious"
                ? "Additional verification requested"
                : "Transaction completed successfully",
        })

        // Set the result
        setResult({
          id: scenario.id,
          timestamp: scenario.timestamp,
          fraudType: scenario.fraudType,
          amount: scenario.amount,
          location: scenario.location,
          deviceType: scenario.deviceType,
          timeOfDay: scenario.timeOfDay,
          transactionVelocity: scenario.transactionVelocity,
          useProxy: scenario.useProxy,
          bypassVerification: scenario.bypassVerification,
          riskScore,
          detectionStatus,
          detectionTime,
          securityMeasures,
          timeline,
        })

        setLoading(false)
      }, 1500)
    }

    window.addEventListener("fraud-simulated", handleSimulation)

    return () => {
      window.removeEventListener("fraud-simulated", handleSimulation)
    }
  }, [])


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "detected":
        return (
          <Badge className="bg-emerald-500">
            <CheckCircle className="mr-1 h-3 w-3" /> Detected
          </Badge>
        )
      case "suspicious":
        return (
          <Badge className="bg-amber-500">
            <AlertTriangle className="mr-1 h-3 w-3" /> Suspicious
          </Badge>
        )
      case "undetected":
        return (
          <Badge className="bg-rose-500">
            <AlertCircle className="mr-1 h-3 w-3" /> Undetected
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div suppressHydrationWarning className="flex flex-col items-center justify-center space-y-4 py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Analyzing fraud scenario...</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div suppressHydrationWarning className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
        <Shield className="h-12 w-12 text-muted-foreground" />
        <div>
          <p className="font-medium">No simulation results</p>
          <p className="text-sm text-muted-foreground">Run a fraud simulation to see results here</p>
        </div>
      </div>
    )
  }

  return (
    <Tabs suppressHydrationWarning defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="fraudster">Fraudster View</TabsTrigger>
        <TabsTrigger value="details">Technical Details</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium">Fraud Detection Result</h3>
              {getStatusBadge(result.detectionStatus)}
            </div>
            <div className="text-sm text-muted-foreground">ID: {result.id.substring(0, 8)}</div>
          </div>
          <p className="text-sm text-muted-foreground">
            {result.detectionStatus === "detected"
              ? "Fraud was successfully detected and blocked."
              : result.detectionStatus === "suspicious"
                ? "Suspicious activity was flagged for additional verification."
                : "Fraud was not detected. Transaction would proceed normally."}
          </p>
        </div>

        <div className="rounded-md border p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium">Risk Score</div>
              <div className="text-2xl font-bold">{result.riskScore}/100</div>
            </div>
            <div className="space-y-1 text-right">
              <div className="text-sm font-medium">Detection Time</div>
              <div className="text-2xl font-bold">{(result.detectionTime / 1000).toFixed(2)}s</div>
            </div>
          </div>
          <Progress
            value={result.riskScore}
            className="h-2"
            indicatorClassName={
              result.riskScore >= 75 ? "bg-emerald-500" : result.riskScore >= 50 ? "bg-amber-500" : "bg-rose-500"
            }
          />
          <div className="mt-1 flex justify-between text-xs">
            <span>Low Risk</span>
            <span>Medium Risk</span>
            <span>High Risk</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Security Measures</h4>
          <div className="space-y-3">
            {result.securityMeasures.map((measure) => (
              <div key={measure.name} className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center">
                  {measure.triggered ? (
                    <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                  ) : (
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{measure.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">
                    {measure.triggered ? `${measure.effectiveness}% effective` : "Not triggered"}
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      measure.triggered
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {measure.triggered ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="fraudster" className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Fraudster Perspective</h3>
            <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
              <Eye className="mr-1 h-3 w-3" /> Fraud Attempt Timeline
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            This view shows how the fraud attempt would be experienced from the fraudster's perspective
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-md border">
            <div className="p-4 border-b">
              <h4 className="font-medium">Fraud Attempt Timeline</h4>
            </div>
            <div className="p-4 space-y-4">
              {result.timeline.map((event, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      {(event.time / 1000).toFixed(1)}s
                    </div>
                    {index < result.timeline.length - 1 && <div className="h-full w-px bg-border" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="font-medium">{event.event}</div>
                    <div className="text-sm text-muted-foreground">{event.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Fraudster Experience</h4>
              <div className="space-y-4">
                <div className="rounded-md border p-3 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Transaction Status</div>
                    <Badge
                      className={
                        result.detectionStatus === "detected"
                          ? "bg-rose-500"
                          : result.detectionStatus === "suspicious"
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                      }
                    >
                      {result.detectionStatus === "detected"
                        ? "Declined"
                        : result.detectionStatus === "suspicious"
                          ? "Pending Verification"
                          : "Approved"}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {result.detectionStatus === "detected"
                      ? "Transaction was declined due to security concerns. Please contact your bank."
                      : result.detectionStatus === "suspicious"
                        ? "Additional verification required. Please check your registered mobile for OTP."
                        : "Transaction was approved and processed successfully."}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Security Measures Encountered</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {result.securityMeasures
                      .filter((measure) => measure.triggered)
                      .map((measure) => (
                        <div key={measure.name} className="flex items-center rounded-md border p-2">
                          <Lock className="mr-2 h-4 w-4 text-primary" />
                          <span className="text-sm">{measure.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h4 className="font-medium">Fraud Prevention Effectiveness</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Effectiveness</span>
                <span className="font-medium">
                  {result.detectionStatus === "detected"
                    ? "High"
                    : result.detectionStatus === "suspicious"
                      ? "Medium"
                      : "Low"}
                </span>
              </div>
              <Progress
                value={result.detectionStatus === "detected" ? 90 : result.detectionStatus === "suspicious" ? 60 : 30}
                className="h-2"
                indicatorClassName={
                  result.detectionStatus === "detected"
                    ? "bg-emerald-500"
                    : result.detectionStatus === "suspicious"
                      ? "bg-amber-500"
                      : "bg-rose-500"
                }
              />
            </div>

            <div className="rounded-md border p-4 bg-muted/50">
              <h5 className="font-medium mb-2">Insights for Fraudsters</h5>
              <p className="text-sm text-muted-foreground">
                {result.detectionStatus === "detected"
                  ? "This fraud attempt was quickly detected by multiple security systems. The combination of unusual location, device, and transaction pattern triggered immediate blocks."
                  : result.detectionStatus === "suspicious"
                    ? "This attempt raised suspicion but wasn't immediately blocked. The security systems required additional verification, which would likely prevent successful fraud."
                    : "This attempt would likely succeed as it didn't trigger enough security measures. The transaction pattern appeared legitimate enough to bypass automated detection."}
              </p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="details" className="space-y-4">
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-medium">Technical Details</h3>
          <p className="text-sm text-muted-foreground">Detailed technical information about the fraud simulation</p>
        </div>

        <Separator />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium mb-2">Scenario Parameters</h4>
            <div className="space-y-2 rounded-md border p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fraud Type:</span>
                <span className="font-medium capitalize">{result.fraudType.replace(/_/g, " ")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">₹{result.amount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium capitalize">{result.location.replace(/_/g, " ")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Device Type:</span>
                <span className="font-medium capitalize">{result.deviceType.replace(/_/g, " ")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time of Day:</span>
                <span className="font-medium capitalize">{result.timeOfDay.replace(/_/g, " ")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction Velocity:</span>
                <span className="font-medium">{result.transactionVelocity} tx/hour</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Using Proxy/VPN:</span>
                <span className="font-medium">{result.useProxy ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bypass Verification:</span>
                <span className="font-medium">{result.bypassVerification ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Detection Metrics</h4>
            <div className="space-y-2 rounded-md border p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Risk Score:</span>
                <span className="font-medium">{result.riskScore}/100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Detection Status:</span>
                <span className="font-medium capitalize">{result.detectionStatus}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Detection Time:</span>
                <span className="font-medium">{(result.detectionTime / 1000).toFixed(2)} seconds</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Security Measures Triggered:</span>
                <span className="font-medium">
                  {result.securityMeasures.filter((m) => m.triggered).length} of {result.securityMeasures.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average Effectiveness:</span>
                <span className="font-medium">
                  {result.securityMeasures.filter((m) => m.triggered).length > 0
                    ? (
                        result.securityMeasures
                          .filter((m) => m.triggered)
                          .reduce((sum, m) => sum + m.effectiveness, 0) /
                        result.securityMeasures.filter((m) => m.triggered).length
                      ).toFixed(1)
                    : "N/A"}
                  %
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Timestamp:</span>
                <span className="font-medium">{new Date(result.timestamp).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Security Measure Details</h4>
          <div className="space-y-3">
            {result.securityMeasures.map((measure) => (
              <div key={measure.name} className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{measure.name}</div>
                  <Badge
                    variant="outline"
                    className={
                      measure.triggered
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {measure.triggered ? "Triggered" : "Not Triggered"}
                  </Badge>
                </div>
                {measure.triggered && (
                  <div className="mt-2">
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Effectiveness:</span>
                      <span>{measure.effectiveness}%</span>
                    </div>
                    <Progress value={measure.effectiveness} className="h-1.5" />
                  </div>
                )}
                <div className="mt-2 text-sm text-muted-foreground">
                  {measure.name === "AI Risk Scoring"
                    ? "Uses machine learning to analyze transaction patterns and assign a risk score."
                    : measure.name === "Behavioral Analysis"
                      ? "Analyzes user behavior patterns to identify anomalies."
                      : measure.name === "Location Verification"
                        ? "Verifies if the transaction location matches the user's typical locations."
                        : measure.name === "Device Fingerprinting"
                          ? "Identifies and verifies the device used for the transaction."
                          : "Requires additional authentication for high-risk transactions."}
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
