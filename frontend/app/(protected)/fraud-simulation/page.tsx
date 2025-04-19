"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FraudSimulator } from "@/components/fraud-simulator"
import { SimulationResults } from "@/components/simulation-results"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, HelpCircle, FileText } from "lucide-react"


export default function FraudSimulationClientPage() {
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
            onClick={() => {
              // In a real app, this would download results
              alert("Exporting fraud simulation results...")
            }}
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
            onClick={() => {
              alert("Generating comprehensive report of all simulation history...")
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No previous simulations found. Run a simulation to see results here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
