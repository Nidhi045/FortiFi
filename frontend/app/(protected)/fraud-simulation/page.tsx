"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FraudSimulator } from "@/components/fraud-simulator"
import { SimulationResults } from "@/components/simulation-results"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, HelpCircle, FileText, AlertCircle, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type SimulationHistoryItem = {
  id: string
  timestamp: string
  fraudType: string
  amount: number
  riskScore: number
  detectionStatus: "detected" | "suspicious" | "undetected"
}

export default function FraudSimulationClientPage() {
  const [simulationHistory, setSimulationHistory] = useState<SimulationHistoryItem[]>([])

  useEffect(() => {
    // Listen for new simulations
    const handleNewSimulation = (event: Event) => {
      const customEvent = event as CustomEvent

      // Wait for the simulation to be processed
      setTimeout(() => {
        // Generate a risk score based on the scenario
        const scenario = customEvent.detail
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

        // Add to history
        const newSimulation: SimulationHistoryItem = {
          id: scenario.id,
          timestamp: scenario.timestamp,
          fraudType: scenario.fraudType,
          amount: scenario.amount,
          riskScore,
          detectionStatus,
        }

        setSimulationHistory((prev) => [newSimulation, ...prev])
      }, 2000)
    }

    window.addEventListener("fraud-simulated", handleNewSimulation)

    return () => {
      window.removeEventListener("fraud-simulated", handleNewSimulation)
    }
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "detected":
        return <Badge className="bg-emerald-500">Detected</Badge>
      case "suspicious":
        return <Badge className="bg-amber-500">Suspicious</Badge>
      case "undetected":
        return <Badge className="bg-rose-500">Undetected</Badge>
      default:
        return null
    }
  }

  const formatFraudType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const handleExportResults = (format: 'csv' | 'json' = 'csv') => {
    if (simulationHistory.length === 0) {
      alert("No simulation results to export")
      return
    }
  
    try {
      let content: string
      let mimeType: string
      let fileName: string
  
      if (format === 'json') {
        // Prepare JSON export
        const exportData = simulationHistory.map(sim => ({
          id: sim.id,
          timestamp: sim.timestamp,
          formattedDate: new Date(sim.timestamp).toLocaleString('en-IN'),
          fraudType: formatFraudType(sim.fraudType),
          amount: sim.amount,
          formattedAmount: `₹${sim.amount.toLocaleString('en-IN')}`,
          riskScore: sim.riskScore,
          detectionStatus: sim.detectionStatus,
          analysis: getRiskAnalysis(sim.riskScore)
        }))
  
        content = JSON.stringify(exportData, null, 2)
        mimeType = 'application/json'
        fileName = `fraud-simulation-results-${new Date().toISOString().split('T')[0]}.json`
      } else {
        // Prepare CSV export
        const headers = [
          'Simulation ID',
          'Date & Time',
          'Fraud Type',
          'Amount (₹)',
          'Risk Score',
          'Detection Status',
          'Risk Analysis'
        ]
  
        const rows = simulationHistory.map(sim => [
          sim.id,
          new Date(sim.timestamp).toLocaleString('en-IN'),
          formatFraudType(sim.fraudType),
          sim.amount,
          sim.riskScore,
          sim.detectionStatus,
          getRiskAnalysis(sim.riskScore)
        ])
  
        // Convert to CSV string
        content = [
          headers.join(','),
          ...rows.map(row => row.join(','))
        ].join('\n')
  
        mimeType = 'text/csv'
        fileName = `fraud-simulation-results-${new Date().toISOString().split('T')[0]}.csv`
      }
  
      // Create download link
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert("Failed to export results. Please try again.")
    }
  }
  
  const handleGenerateReport = () => {
    if (simulationHistory.length === 0) {
      alert("No simulation history to generate report")
      return
    }
  
    try {
      // Calculate statistics
      const totalSimulations = simulationHistory.length
      const detectedCount = simulationHistory.filter(s => s.detectionStatus === 'detected').length
      const suspiciousCount = simulationHistory.filter(s => s.detectionStatus === 'suspicious').length
      const undetectedCount = simulationHistory.filter(s => s.detectionStatus === 'undetected').length
      
      const detectionRate = Math.round((detectedCount / totalSimulations) * 100)
      const averageRiskScore = Math.round(simulationHistory.reduce((sum, sim) => sum + sim.riskScore, 0) / totalSimulations)
      
      const mostCommonFraudType = getMostCommonFraudType()
      const highestRiskSimulation = getHighestRiskSimulation()
  
      // Create report content
      const reportContent = [
        `Fraud Simulation Analysis Report`,
        `Generated on: ${new Date().toLocaleString('en-IN')}`,
        `\n=== Summary ===`,
        `Total Simulations: ${totalSimulations}`,
        `Detection Rate: ${detectionRate}%`,
        `Average Risk Score: ${averageRiskScore}/100`,
        `Most Common Fraud Type: ${mostCommonFraudType}`,
        `\n=== Detection Performance ===`,
        `Detected: ${detectedCount} (${Math.round((detectedCount / totalSimulations) * 100)}%)`,
        `Suspicious: ${suspiciousCount} (${Math.round((suspiciousCount / totalSimulations) * 100)}%)`,
        `Undetected: ${undetectedCount} (${Math.round((undetectedCount / totalSimulations) * 100)}%)`,
        `\n=== Highest Risk Simulation ===`,
        `ID: ${highestRiskSimulation.id}`,
        `Type: ${formatFraudType(highestRiskSimulation.fraudType)}`,
        `Amount: ₹${highestRiskSimulation.amount.toLocaleString('en-IN')}`,
        `Risk Score: ${highestRiskSimulation.riskScore}/100`,
        `Status: ${highestRiskSimulation.detectionStatus}`,
        `\n=== Detailed Simulation History ===\n`,
        ...simulationHistory.map(sim => 
          `${new Date(sim.timestamp).toLocaleString('en-IN')} | ${formatFraudType(sim.fraudType)} | ₹${sim.amount.toLocaleString('en-IN')} | ${sim.riskScore}/100 | ${sim.detectionStatus}`
        )
      ].join('\n')
  
      // Create download link
      const blob = new Blob([reportContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fraud-simulation-report-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Report generation failed:', error)
      alert("Failed to generate report. Please try again.")
    }
  }
  
  // Helper functions
  const getRiskAnalysis = (score: number) => {
    if (score >= 80) return 'High Risk - Immediate action recommended'
    if (score >= 60) return 'Medium Risk - Requires review'
    if (score >= 40) return 'Low Risk - Monitor'
    return 'Very Low Risk - Likely legitimate'
  }
  
  const getMostCommonFraudType = () => {
    const typeCounts: Record<string, number> = {}
    simulationHistory.forEach(sim => {
      typeCounts[sim.fraudType] = (typeCounts[sim.fraudType] || 0) + 1
    })
    
    const mostCommon = Object.entries(typeCounts).reduce((max, entry) => 
      entry[1] > max[1] ? entry : max, ['', 0]
    )
    
    return formatFraudType(mostCommon[0])
  }
  
  const getHighestRiskSimulation = () => {
    return simulationHistory.reduce((max, sim) => 
      sim.riskScore > max.riskScore ? sim : max, 
      { riskScore: -1 } as SimulationHistoryItem
    )
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fraud Simulation Sandbox</h1>
          <p className="text-muted-foreground">Simulate fraud scenarios to understand how our detection systems work</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // In a real app, this would reset the simulation
              window.location.reload()
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Simulation
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportResults('csv')}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Fraud Scenario Simulator</CardTitle>
              <CardDescription>Create a simulated fraud scenario to test detection mechanisms</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                alert(
                  "Fraud Simulator Help: Use this tool to create simulated fraud scenarios with various parameters to see how they would be detected by our security systems.",
                )
              }}
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent>
            <FraudSimulator />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Simulation Results</CardTitle>
              <CardDescription>See how our fraud detection system responds to your scenario</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                alert(
                  "Simulation Results Help: This panel shows how our fraud detection systems would respond to the simulated scenario you've created.",
                )
              }}
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent>
            <SimulationResults />
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Simulation History</CardTitle>
            <CardDescription>Review your previous fraud simulation scenarios</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateReport}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </CardHeader>
        <CardContent>
          {simulationHistory.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Fraud Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {simulationHistory.map((simulation) => (
                    <TableRow key={simulation.id}>
                      <TableCell className="font-medium">
                        {new Date(simulation.timestamp).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>{formatFraudType(simulation.fraudType)}</TableCell>
                      <TableCell>₹{simulation.amount.toLocaleString("en-IN")}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {simulation.riskScore >= 75 ? (
                            <AlertCircle className="mr-1 h-4 w-4 text-emerald-500" />
                          ) : simulation.riskScore >= 50 ? (
                            <AlertTriangle className="mr-1 h-4 w-4 text-amber-500" />
                          ) : (
                            <AlertCircle className="mr-1 h-4 w-4 text-rose-500" />
                          )}
                          {simulation.riskScore}/100
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(simulation.detectionStatus)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            alert(`Viewing details for simulation ${simulation.id}...`)
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No previous simulations found. Run a simulation to see results here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
