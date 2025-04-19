"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export function FraudSimulator() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [scenario, setScenario] = useState({
    fraudType: "card_theft",
    amount: 1000,
    location: "foreign",
    deviceType: "new",
    timeOfDay: "night",
    transactionVelocity: 3,
    useProxy: true,
    bypassVerification: false,
  })

  const handleAmountChange = (value: number[]) => {
    setScenario({ ...scenario, amount: value[0] })
  }

  const handleVelocityChange = (value: number[]) => {
    setScenario({ ...scenario, transactionVelocity: value[0] })
  }

  const handleSelectChange = (name: string, value: string) => {
    setScenario({ ...scenario, [name]: value })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setScenario({ ...scenario, [name]: checked })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // Dispatch event for simulation results component
      const event = new CustomEvent("fraud-simulated", {
        detail: {
          ...scenario,
          timestamp: new Date().toISOString(),
          id: `SIM-${Math.floor(Math.random() * 1000000)}`,
        },
      })
      window.dispatchEvent(event)

      toast({
        title: "Fraud scenario simulated",
        description: "Your fraud scenario has been processed for analysis.",
      })
    }, 1500)
  }

  return (
    <form  suppressHydrationWarning onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fraudType">Fraud Type</Label>
        <Select value={scenario.fraudType} onValueChange={(value) => handleSelectChange("fraudType", value)}>
          <SelectTrigger id="fraudType">
            <SelectValue placeholder="Select fraud type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="card_theft">Stolen Card</SelectItem>
            <SelectItem value="identity_theft">Identity Theft</SelectItem>
            <SelectItem value="account_takeover">Account Takeover</SelectItem>
            <SelectItem value="synthetic_identity">Synthetic Identity</SelectItem>
            <SelectItem value="card_testing">Card Testing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Transaction Amount (USD)</Label>
        <div className="pt-5 pb-2">
          <Slider
            id="amount"
            min={100}
            max={10000}
            step={100}
            value={[scenario.amount]}
            onValueChange={handleAmountChange}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span>$100</span>
          <span className="font-medium">${scenario.amount.toFixed(2)}</span>
          <span>$10,000</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Transaction Location</Label>
          <Select value={scenario.location} onValueChange={(value) => handleSelectChange("location", value)}>
            <SelectTrigger id="location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="domestic">Domestic (Normal)</SelectItem>
              <SelectItem value="foreign">Foreign Country</SelectItem>
              <SelectItem value="high_risk">High-Risk Country</SelectItem>
              <SelectItem value="unusual">Unusual Location</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deviceType">Device Type</Label>
          <Select value={scenario.deviceType} onValueChange={(value) => handleSelectChange("deviceType", value)}>
            <SelectTrigger id="deviceType">
              <SelectValue placeholder="Select device" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="known">Known Device</SelectItem>
              <SelectItem value="new">New Device</SelectItem>
              <SelectItem value="multiple">Multiple Devices</SelectItem>
              <SelectItem value="emulator">Emulator/Virtual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timeOfDay">Time of Transaction</Label>
          <Select value={scenario.timeOfDay} onValueChange={(value) => handleSelectChange("timeOfDay", value)}>
            <SelectTrigger id="timeOfDay">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal Hours</SelectItem>
              <SelectItem value="night">Late Night</SelectItem>
              <SelectItem value="unusual">Unusual Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionVelocity">Transaction Velocity</Label>
          <div className="pt-5 pb-2">
            <Slider
              id="transactionVelocity"
              min={1}
              max={10}
              step={1}
              value={[scenario.transactionVelocity]}
              onValueChange={handleVelocityChange}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span>Normal</span>
            <span className="font-medium">{scenario.transactionVelocity} tx/hour</span>
            <span>Suspicious</span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Advanced Fraud Techniques</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="useProxy">Use VPN/Proxy</Label>
            <p className="text-sm text-muted-foreground">Simulate transaction through a proxy or VPN</p>
          </div>
          <Switch
            id="useProxy"
            checked={scenario.useProxy}
            onCheckedChange={(checked) => handleSwitchChange("useProxy", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="bypassVerification">Bypass Verification</Label>
            <p className="text-sm text-muted-foreground">Attempt to bypass standard verification steps</p>
          </div>
          <Switch
            id="bypassVerification"
            checked={scenario.bypassVerification}
            onCheckedChange={(checked) => handleSwitchChange("bypassVerification", checked)}
          />
        </div>
      </div>

      <div className="pt-2 space-x-2 flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setScenario({
              fraudType: "card_theft",
              amount: 1000,
              location: "foreign",
              deviceType: "new",
              timeOfDay: "night",
              transactionVelocity: 3,
              useProxy: true,
              bypassVerification: false,
            })
          }
        >
          Reset
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Simulating..." : "Run Simulation"}
        </Button>
      </div>
    </form>
  )
}

