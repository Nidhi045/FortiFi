"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, AlertTriangle, Info, ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type TransactionData = {
  id: string
  amount: number
  merchant: string
  category: string
  country: string
  useNewDevice: boolean
  useVPN: boolean
  timestamp: string
}

type RiskFactor = {
  name: string
  description: string
  impact: "high" | "medium" | "low"
  score: number
}

export function FraudAnalysis() {
  const [transaction, setTransaction] = useState<TransactionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [riskScore, setRiskScore] = useState(0)
  const [riskLevel, setRiskLevel] = useState("")
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([])

  useEffect(() => {
    const handleTransactionSimulated = (event: Event) => {
      const customEvent = event as CustomEvent<TransactionData>
      setTransaction(customEvent.detail)
      setLoading(true)

      // Simulate AI analysis
      setTimeout(() => {
        analyzeTransaction(customEvent.detail)
        setLoading(false)
      }, 2000)
    }

    window.addEventListener("transaction-simulated", handleTransactionSimulated)

    return () => {
      window.removeEventListener("transaction-simulated", handleTransactionSimulated)
    }
  }, [])

  const analyzeTransaction = (data: TransactionData) => {
    // Calculate risk factors based on transaction data
    const factors: RiskFactor[] = []
    let totalRisk = 0

    // Amount factor
    if (data.amount > 500000) {
      factors.push({
        name: "High Transaction Amount",
        description: "Transactions over ₹5,00,000 have higher fraud risk",
        impact: "high",
        score: 30,
      })
      totalRisk += 30
    } else if (data.amount > 100000) {
      factors.push({
        name: "Medium Transaction Amount",
        description: "Transactions over ₹1,00,000 have moderate fraud risk",
        impact: "medium",
        score: 15,
      })
      totalRisk += 15
    }

    // Category factor
    if (data.category === "gambling" || data.category === "crypto") {
      factors.push({
        name: "High-Risk Category",
        description: `${data.category} transactions have higher fraud rates`,
        impact: "high",
        score: 25,
      })
      totalRisk += 25
    }

    // Country factor
    if (data.country === "RU" || data.country === "NG") {
      factors.push({
        name: "High-Risk Country",
        description: "Transaction from a region with elevated fraud rates",
        impact: "high",
        score: 30,
      })
      totalRisk += 30
    } else if (data.country !== "IN") {
      factors.push({
        name: "International Transaction",
        description: "Cross-border transactions have increased risk",
        impact: "medium",
        score: 15,
      })
      totalRisk += 15
    }

    // Device factor
    if (data.useNewDevice) {
      factors.push({
        name: "New Device",
        description: "Transaction from an unrecognized device",
        impact: "medium",
        score: 20,
      })
      totalRisk += 20
    }

    // VPN factor
    if (data.useVPN) {
      factors.push({
        name: "VPN/Proxy Detected",
        description: "Transaction routed through VPN or proxy",
        impact: "high",
        score: 25,
      })
      totalRisk += 25
    }

    // If no risk factors, add a positive one
    if (factors.length === 0) {
      factors.push({
        name: "Normal Transaction Pattern",
        description: "This transaction matches your typical behavior",
        impact: "low",
        score: 0,
      })
    }

    // Calculate final risk score (0-100)
    const finalScore = Math.min(100, totalRisk)
    setRiskScore(100 - finalScore)

    // Set risk level
    if (finalScore >= 50) {
      setRiskLevel("high")
    } else if (finalScore >= 25) {
      setRiskLevel("medium")
    } else {
      setRiskLevel("low")
    }

    setRiskFactors(factors)
  }

  const getRiskBadge = () => {
    switch (riskLevel) {
      case "low":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600">
            <CheckCircle className="mr-1 h-3 w-3" /> Low Risk
          </Badge>
        )
      case "medium":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <AlertTriangle className="mr-1 h-3 w-3" /> Medium Risk
          </Badge>
        )
      case "high":
        return (
          <Badge className="bg-rose-500 hover:bg-rose-600">
            <AlertCircle className="mr-1 h-3 w-3" /> High Risk
          </Badge>
        )
      default:
        return null
    }
  }

  if (!transaction) {
    return (
      <div suppressHydrationWarning className="flex flex-col items-center justify-center h-[400px] text-center">
        <Info className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Transaction to Analyze</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Use the Transaction Simulator to create a test transaction and see AI-powered fraud detection in action.
        </p>
      </div>
    )
  }

  return (
    <div suppressHydrationWarning className="space-y-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[400px] text-center">
          <div className="animate-pulse mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/20"></div>
          </div>
          <h3 className="text-lg font-medium">Analyzing Transaction</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Our AI is analyzing this transaction for fraud patterns...
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Transaction {transaction.id}</h3>
              <p className="text-sm text-muted-foreground">{new Date(transaction.timestamp).toLocaleString()}</p>
            </div>
            {getRiskBadge()}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Risk Score</span>
              <span
                className={
                  riskLevel === "low" ? "text-emerald-500" : riskLevel === "medium" ? "text-amber-500" : "text-rose-500"
                }
              >
                {riskScore}/100
              </span>
            </div>
            <Progress
              value={riskScore}
              className="h-2"
              indicatorClassName={
                riskLevel === "low" ? "bg-emerald-500" : riskLevel === "medium" ? "bg-amber-500" : "bg-rose-500"
              }
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Transaction Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Amount:</div>
              <div>₹{transaction.amount.toLocaleString("en-IN")}</div>

              <div className="text-muted-foreground">Merchant:</div>
              <div>{transaction.merchant || "Unknown Merchant"}</div>

              <div className="text-muted-foreground">Category:</div>
              <div className="capitalize">{transaction.category}</div>

              <div className="text-muted-foreground">Country:</div>
              <div>{transaction.country}</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Risk Analysis</h4>

            {riskFactors.map((factor, index) => (
              <div key={index} className="rounded-md border p-3">
                <div className="flex items-start">
                  {factor.impact === "high" ? (
                    <AlertCircle className="mt-0.5 h-4 w-4 text-rose-500 shrink-0" />
                  ) : factor.impact === "medium" ? (
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500 shrink-0" />
                  ) : (
                    <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                  )}
                  <div className="ml-3">
                    <h5 className="text-sm font-medium">{factor.name}</h5>
                    <p className="text-xs text-muted-foreground mt-1">{factor.description}</p>
                    {factor.score > 0 && (
                      <p className="text-xs mt-1">
                        Impact:{" "}
                        <span
                          className={
                            factor.impact === "high"
                              ? "text-rose-500"
                              : factor.impact === "medium"
                              ? "text-amber-500"
                              : "text-emerald-500"
                          }
                        >
                          +{factor.score} risk points
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}