"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

export function TransactionSimulator() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [transaction, setTransaction] = useState({
    amount: 100,
    merchant: "",
    category: "retail",
    country: "US",
    useNewDevice: false,
    useVPN: false,
  })

  const handleAmountChange = (value: number[]) => {
    setTransaction({ ...transaction, amount: value[0] })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTransaction({ ...transaction, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setTransaction({ ...transaction, [name]: value })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setTransaction({ ...transaction, [name]: checked })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // Dispatch event for fraud analysis component
      const event = new CustomEvent("transaction-simulated", {
        detail: {
          ...transaction,
          timestamp: new Date().toISOString(),
          id: `SIM-${Math.floor(Math.random() * 1000000)}`,
        },
      })
      window.dispatchEvent(event)

      toast({
        title: "Transaction simulated",
        description: "Your test transaction has been processed for analysis.",
      })
    }, 1500)
  }

  return (
    <form suppressHydrationWarning onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Transaction Amount (USD)</Label>
        <div className="pt-5 pb-2">
          <Slider
            id="amount"
            min={10}
            max={10000}
            step={10}
            value={[transaction.amount]}
            onValueChange={handleAmountChange}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span>${transaction.amount.toFixed(2)}</span>
          <span className="text-muted-foreground">{transaction.amount >= 1000 ? "High Value" : "Standard"}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="merchant">Merchant Name</Label>
        <Input
          id="merchant"
          name="merchant"
          placeholder="Enter merchant name"
          value={transaction.merchant}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={transaction.category} onValueChange={(value) => handleSelectChange("category", value)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="dining">Dining</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="gambling">Gambling</SelectItem>
              <SelectItem value="crypto">Cryptocurrency</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select value={transaction.country} onValueChange={(value) => handleSelectChange("country", value)}>
            <SelectTrigger id="country">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
              <SelectItem value="RU">Russia</SelectItem>
              <SelectItem value="CN">China</SelectItem>
              <SelectItem value="NG">Nigeria</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="useNewDevice">Simulate New Device</Label>
            <p className="text-sm text-muted-foreground">Test transaction from an unrecognized device</p>
          </div>
          <Switch
            id="useNewDevice"
            checked={transaction.useNewDevice}
            onCheckedChange={(checked) => handleSwitchChange("useNewDevice", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="useVPN">Simulate VPN/Proxy</Label>
            <p className="text-sm text-muted-foreground">Test transaction through a VPN or proxy</p>
          </div>
          <Switch
            id="useVPN"
            checked={transaction.useVPN}
            onCheckedChange={(checked) => handleSwitchChange("useVPN", checked)}
          />
        </div>
      </div>

      <div className="pt-2 space-x-2 flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setTransaction({
              amount: 100,
              merchant: "",
              category: "retail",
              country: "US",
              useNewDevice: false,
              useVPN: false,
            })
          }
        >
          Reset
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Simulating..." : "Simulate Transaction"}
        </Button>
      </div>
    </form>
  )
}

