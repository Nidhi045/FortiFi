"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function NewVirtualCardForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [cardSettings, setCardSettings] = useState({
    spendLimit: 500,
    expiryDays: 30,
    merchantLock: false,
    merchantName: "",
    singleUse: true,
    categoryRestriction: false,
    category: "all",
    geoRestriction: false,
    country: "US",
  })

  const handleSpendLimitChange = (value: number[]) => {
    setCardSettings({ ...cardSettings, spendLimit: value[0] })
  }

  const handleExpiryDaysChange = (value: number[]) => {
    setCardSettings({ ...cardSettings, expiryDays: value[0] })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardSettings({ ...cardSettings, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setCardSettings({ ...cardSettings, [name]: value })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setCardSettings({ ...cardSettings, [name]: checked })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      toast({
        title: "Virtual card created",
        description: "Your new virtual card has been generated successfully.",
      })

      router.push("/virtual-cards")
    }, 2000)
  }

  return (
    <form suppressHydrationWarning onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="spendLimit">Spending Limit (USD)</Label>
          <div className="pt-5 pb-2">
            <Slider
              id="spendLimit"
              min={50}
              max={5000}
              step={50}
              value={[cardSettings.spendLimit]}
              onValueChange={handleSpendLimitChange}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span>$50</span>
            <span className="font-medium">${cardSettings.spendLimit.toLocaleString()}</span>
            <span>$5,000</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiryDays">Expiration Period (Days)</Label>
          <div className="pt-5 pb-2">
            <Slider
              id="expiryDays"
              min={1}
              max={90}
              step={1}
              value={[cardSettings.expiryDays]}
              onValueChange={handleExpiryDaysChange}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span>1 day</span>
            <span className="font-medium">{cardSettings.expiryDays} days</span>
            <span>90 days</span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Security Options</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="singleUse">Single-Use Card</Label>
            <p className="text-sm text-muted-foreground">Card will be automatically destroyed after first use</p>
          </div>
          <Switch
            id="singleUse"
            checked={cardSettings.singleUse}
            onCheckedChange={(checked) => handleSwitchChange("singleUse", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="merchantLock">Merchant Lock</Label>
            <p className="text-sm text-muted-foreground">Restrict card to a specific merchant</p>
          </div>
          <Switch
            id="merchantLock"
            checked={cardSettings.merchantLock}
            onCheckedChange={(checked) => handleSwitchChange("merchantLock", checked)}
          />
        </div>

        {cardSettings.merchantLock && (
          <div className="space-y-2 pl-6 border-l-2 border-muted">
            <Label htmlFor="merchantName">Merchant Name</Label>
            <Input
              id="merchantName"
              name="merchantName"
              placeholder="Enter merchant name"
              value={cardSettings.merchantName}
              onChange={handleInputChange}
              required={cardSettings.merchantLock}
            />
            <p className="text-xs text-muted-foreground">Card will only work with this specific merchant</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="categoryRestriction">Category Restriction</Label>
            <p className="text-sm text-muted-foreground">Restrict card to specific merchant categories</p>
          </div>
          <Switch
            id="categoryRestriction"
            checked={cardSettings.categoryRestriction}
            onCheckedChange={(checked) => handleSwitchChange("categoryRestriction", checked)}
          />
        </div>

        {cardSettings.categoryRestriction && (
          <div className="space-y-2 pl-6 border-l-2 border-muted">
            <Label htmlFor="category">Merchant Category</Label>
            <Select value={cardSettings.category} onValueChange={(value) => handleSelectChange("category", value)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="dining">Dining</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="services">Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="geoRestriction">Geographic Restriction</Label>
            <p className="text-sm text-muted-foreground">Restrict card to specific countries</p>
          </div>
          <Switch
            id="geoRestriction"
            checked={cardSettings.geoRestriction}
            onCheckedChange={(checked) => handleSwitchChange("geoRestriction", checked)}
          />
        </div>

        {cardSettings.geoRestriction && (
          <div className="space-y-2 pl-6 border-l-2 border-muted">
            <Label htmlFor="country">Country</Label>
            <Select value={cardSettings.country} onValueChange={(value) => handleSelectChange("country", value)}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
                <SelectItem value="EU">European Union</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => router.push("/virtual-cards")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Virtual Card"}
        </Button>
      </div>
    </form>
  )
}

