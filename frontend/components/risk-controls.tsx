"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export function RiskControls() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    dynamicSpendControl: true,
    transactionTimeLock: false,
    multiFactorLargePayments: true,
    locationBasedApproval: true,
    deviceVerification: true,
    aiRiskScoring: true,
    blockHighRiskCountries: false,
    blockHighRiskMerchants: true,
  })

  const [limits, setLimits] = useState({
    dailyLimit: 2000,
    singleTransactionLimit: 1000,
    timeLockThreshold: 5000,
    mfaThreshold: 500,
  })

  const [riskProfile, setRiskProfile] = useState("balanced")

  const handleToggle = (setting: string) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting as keyof typeof settings],
    })

    toast({
      title: "Setting updated",
      description: `${setting.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} has been ${!settings[setting as keyof typeof settings] ? "enabled" : "disabled"}.`,
    })
  }

  const handleLimitChange = (name: string, value: number[]) => {
    setLimits({
      ...limits,
      [name]: value[0],
    })

    toast({
      title: "Limit updated",
      description: `${name.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} has been set to ₹${value[0].toLocaleString("en-IN")}.`,
    })
  }

  const handleSaveChanges = () => {
    toast({
      title: "Settings saved",
      description: "Your risk control settings have been updated successfully.",
    })
  }

  const handleSetRiskProfile = (profile: string) => {
    setRiskProfile(profile)

    // Update settings based on profile
    if (profile === "standard") {
      setSettings({
        ...settings,
        transactionTimeLock: false,
        blockHighRiskCountries: false,
        deviceVerification: false,
      })
      setLimits({
        ...limits,
        dailyLimit: 5000,
        singleTransactionLimit: 2000,
      })
    } else if (profile === "balanced") {
      setSettings({
        ...settings,
        transactionTimeLock: false,
        blockHighRiskCountries: false,
        deviceVerification: true,
      })
      setLimits({
        ...limits,
        dailyLimit: 2000,
        singleTransactionLimit: 1000,
      })
    } else if (profile === "highSecurity") {
      setSettings({
        ...settings,
        transactionTimeLock: true,
        blockHighRiskCountries: true,
        deviceVerification: true,
      })
      setLimits({
        ...limits,
        dailyLimit: 1000,
        singleTransactionLimit: 500,
      })
    }

    toast({
      title: "Risk profile updated",
      description: `Your risk profile has been set to ${profile.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}.`,
    })
  }

  return (
    <Tabs defaultValue="controls" className="space-y-4">
      <TabsList>
        <TabsTrigger value="controls">Security Controls</TabsTrigger>
        <TabsTrigger value="limits">Transaction Limits</TabsTrigger>
        <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="controls" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="dynamicSpendControl" className="text-base font-medium">
                Dynamic Spend Control
              </label>
              <p className="text-sm text-muted-foreground">
                Automatically adjust spending limits based on your fraud risk score
              </p>
            </div>
            <Switch
              id="dynamicSpendControl"
              checked={settings.dynamicSpendControl}
              onCheckedChange={() => handleToggle("dynamicSpendControl")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="transactionTimeLock" className="text-base font-medium">
                Transaction Time-Lock
              </label>
              <p className="text-sm text-muted-foreground">
                Add a delay to high-risk transactions for additional verification
              </p>
            </div>
            <Switch
              id="transactionTimeLock"
              checked={settings.transactionTimeLock}
              onCheckedChange={() => handleToggle("transactionTimeLock")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="multiFactorLargePayments" className="text-base font-medium">
                Multi-Factor for Large Payments
              </label>
              <p className="text-sm text-muted-foreground">
                Require additional authentication for transactions above threshold
              </p>
            </div>
            <Switch
              id="multiFactorLargePayments"
              checked={settings.multiFactorLargePayments}
              onCheckedChange={() => handleToggle("multiFactorLargePayments")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="locationBasedApproval" className="text-base font-medium">
                Location-Based Approval
              </label>
              <p className="text-sm text-muted-foreground">
                Verify transactions based on your typical geographic locations
              </p>
            </div>
            <Switch
              id="locationBasedApproval"
              checked={settings.locationBasedApproval}
              onCheckedChange={() => handleToggle("locationBasedApproval")}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="deviceVerification" className="text-base font-medium">
                Device Verification
              </label>
              <p className="text-sm text-muted-foreground">Verify new devices before allowing transactions</p>
            </div>
            <Switch
              id="deviceVerification"
              checked={settings.deviceVerification}
              onCheckedChange={() => handleToggle("deviceVerification")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="aiRiskScoring" className="text-base font-medium">
                AI Risk Scoring
              </label>
              <p className="text-sm text-muted-foreground">
                Use AI to analyze transaction patterns and detect anomalies
              </p>
            </div>
            <Switch
              id="aiRiskScoring"
              checked={settings.aiRiskScoring}
              onCheckedChange={() => handleToggle("aiRiskScoring")}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="limits" className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="dailyLimit" className="text-base font-medium">
              Daily Transaction Limit
            </label>
            <div className="pt-5 pb-2">
              <Slider
                id="dailyLimit"
                min={10000}
                max={200000}
                step={5000}
                value={[limits.dailyLimit]}
                onValueChange={(value) => handleLimitChange("dailyLimit", value)}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>₹10,000</span>
              <span className="font-medium">₹{limits.dailyLimit.toLocaleString("en-IN")}</span>
              <span>₹2,00,000</span>
            </div>
            <p className="text-sm text-muted-foreground">Maximum amount that can be spent in a 24-hour period</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="singleTransactionLimit" className="text-base font-medium">
              Single Transaction Limit
            </label>
            <div className="pt-5 pb-2">
              <Slider
                id="singleTransactionLimit"
                min={5000}
                max={100000}
                step={5000}
                value={[limits.singleTransactionLimit]}
                onValueChange={(value) => handleLimitChange("singleTransactionLimit", value)}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>₹5,000</span>
              <span className="font-medium">₹{limits.singleTransactionLimit.toLocaleString("en-IN")}</span>
              <span>₹1,00,000</span>
            </div>
            <p className="text-sm text-muted-foreground">Maximum amount for a single transaction</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="timeLockThreshold" className="text-base font-medium">
              Time-Lock Threshold
            </label>
            <div className="pt-5 pb-2">
              <Slider
                id="timeLockThreshold"
                min={25000}
                max={500000}
                step={25000}
                value={[limits.timeLockThreshold]}
                onValueChange={(value) => handleLimitChange("timeLockThreshold", value)}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>₹25,000</span>
              <span className="font-medium">₹{limits.timeLockThreshold.toLocaleString("en-IN")}</span>
              <span>₹5,00,000</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transactions above this amount will be time-locked for review
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="mfaThreshold" className="text-base font-medium">
              Multi-Factor Authentication Threshold
            </label>
            <div className="pt-5 pb-2">
              <Slider
                id="mfaThreshold"
                min={5000}
                max={50000}
                step={5000}
                value={[limits.mfaThreshold]}
                onValueChange={(value) => handleLimitChange("mfaThreshold", value)}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>₹5,000</span>
              <span className="font-medium">₹{limits.mfaThreshold.toLocaleString("en-IN")}</span>
              <span>₹50,000</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transactions above this amount will require additional authentication
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="blockHighRiskCountries" className="text-base font-medium">
                Block High-Risk Countries
              </label>
              <p className="text-sm text-muted-foreground">
                Automatically block transactions from countries with high fraud rates
              </p>
            </div>
            <Switch
              id="blockHighRiskCountries"
              checked={settings.blockHighRiskCountries}
              onCheckedChange={() => handleToggle("blockHighRiskCountries")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="blockHighRiskMerchants" className="text-base font-medium">
                Block High-Risk Merchants
              </label>
              <p className="text-sm text-muted-foreground">
                Block transactions with merchants known for fraudulent activity
              </p>
            </div>
            <Switch
              id="blockHighRiskMerchants"
              checked={settings.blockHighRiskMerchants}
              onCheckedChange={() => handleToggle("blockHighRiskMerchants")}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-base font-medium">Risk Tolerance Profile</h3>
          <p className="text-sm text-muted-foreground">
            Choose your preferred balance between security and convenience
          </p>
          <div className="flex space-x-2 pt-2">
            <Button
              variant={riskProfile === "standard" ? "default" : "outline"}
              className="flex-1"
              onClick={() => handleSetRiskProfile("standard")}
            >
              Standard
            </Button>
            <Button
              variant={riskProfile === "balanced" ? "default" : "outline"}
              className="flex-1"
              onClick={() => handleSetRiskProfile("balanced")}
            >
              Balanced
            </Button>
            <Button
              variant={riskProfile === "highSecurity" ? "default" : "outline"}
              className="flex-1"
              onClick={() => handleSetRiskProfile("highSecurity")}
            >
              High Security
            </Button>
          </div>
        </div>
      </TabsContent>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            // Reset to defaults
            setSettings({
              dynamicSpendControl: true,
              transactionTimeLock: false,
              multiFactorLargePayments: true,
              locationBasedApproval: true,
              deviceVerification: true,
              aiRiskScoring: true,
              blockHighRiskCountries: false,
              blockHighRiskMerchants: true,
            })
            setLimits({
              dailyLimit: 2000,
              singleTransactionLimit: 1000,
              timeLockThreshold: 5000,
              mfaThreshold: 500,
            })
            setRiskProfile("balanced")

            toast({
              title: "Settings reset",
              description: "Your risk control settings have been reset to default values.",
            })
          }}
        >
          Reset to Defaults
        </Button>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>
    </Tabs>
  )
}
