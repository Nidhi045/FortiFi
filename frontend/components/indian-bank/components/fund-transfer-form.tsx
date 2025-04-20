"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/indian-bank/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/indian-bank/components/ui/tabs"
import { Button } from "@/components/indian-bank/components/ui/button"
import { Input } from "@/components/indian-bank/components/ui/input"
import { Label } from "@/components/indian-bank/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/indian-bank/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/indian-bank/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/indian-bank/components/ui/alert"
import { AlertCircle, ArrowRight, ShieldAlert } from "lucide-react"
import { useAccount } from "@/components/indian-bank/context/account-context"

export function FundTransferForm() {
  const [amount, setAmount] = useState("")
  const [remarks, setRemarks] = useState("")
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("")
  const [fromAccount, setFromAccount] = useState("")
  const [transferMode, setTransferMode] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showBlockedAlert, setShowBlockedAlert] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const { addTransaction, getBalance } = useAccount()

  const ownAccounts = [
    { id: "acc1", name: "Savings Account - 6789XXXX1234" },
    { id: "acc2", name: "Current Account - 9876XXXX5678" },
  ]

  const indianBankBeneficiaries = [
    { id: "ben1", name: "Priya Patel - 5678XXXX9012" },
    { id: "ben2", name: "Vikram Singh - 1234XXXX5678" },
  ]

  const otherBankBeneficiaries = [
    { id: "ben3", name: "Suresh Kumar - SBI - 8765XXXX4321" },
    { id: "ben4", name: "Anita Sharma - HDFC - 4321XXXX8765" },
  ]

  const handleTransfer = () => {
    // Simulate virtual card check - randomly decide if card is blocked for demo purposes
    const isVirtualCardBlocked = Math.random() > 0.7

    if (isVirtualCardBlocked) {
      setShowBlockedAlert(true)
      return
    }

    const transferAmount = parseFloat(amount)
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return
    }

    if (transferAmount > getBalance()) {
      // Show insufficient balance error
      return
    }

    setShowConfirmation(true)
  }

  const handleConfirmTransfer = () => {
    const transferAmount = parseFloat(amount)
    const beneficiary = [...indianBankBeneficiaries, ...otherBankBeneficiaries]
      .find(b => b.id === selectedBeneficiary)

    if (!beneficiary) return

    // Add the transaction
    addTransaction({
      description: `Transfer to ${beneficiary.name}`,
      amount: transferAmount,
      type: "debit",
    })

    setShowConfirmation(false)
    setShowSuccessDialog(true)
    setAmount("")
    setRemarks("")
    setSelectedBeneficiary("")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fund Transfer</CardTitle>
        <CardDescription>Transfer money to any bank account</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="own" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="own">Own Accounts</TabsTrigger>
            <TabsTrigger value="indian">Indian Bank</TabsTrigger>
            <TabsTrigger value="other">Other Banks</TabsTrigger>
          </TabsList>
          <TabsContent value="own">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromAccount">From Account</Label>
                <Select value={fromAccount} onValueChange={setFromAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {ownAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="toAccount">To Account</Label>
                <Select value={selectedBeneficiary} onValueChange={setSelectedBeneficiary}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {ownAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="indian">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromAccount">From Account</Label>
                <Select value={fromAccount} onValueChange={setFromAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {ownAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="beneficiary">Select Beneficiary</Label>
                <Select value={selectedBeneficiary} onValueChange={setSelectedBeneficiary}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select beneficiary" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianBankBeneficiaries.map((beneficiary) => (
                      <SelectItem key={beneficiary.id} value={beneficiary.id}>
                        {beneficiary.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="other">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromAccount">From Account</Label>
                <Select value={fromAccount} onValueChange={setFromAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {ownAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="beneficiary">Select Beneficiary</Label>
                <Select value={selectedBeneficiary} onValueChange={setSelectedBeneficiary}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select beneficiary" />
                  </SelectTrigger>
                  <SelectContent>
                    {otherBankBeneficiaries.map((beneficiary) => (
                      <SelectItem key={beneficiary.id} value={beneficiary.id}>
                        {beneficiary.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Input
              id="remarks"
              placeholder="Enter remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transferMode">Transfer Mode</Label>
            <Select value={transferMode} onValueChange={setTransferMode}>
              <SelectTrigger>
                <SelectValue placeholder="Select transfer mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleTransfer}>
          Transfer Now
        </Button>
      </CardFooter>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Transfer</DialogTitle>
            <DialogDescription>
              Please confirm the transfer details before proceeding.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Amount</p>
              <p className="text-lg font-semibold">{formatCurrency(parseFloat(amount))}</p>
            </div>
            <div>
              <p className="text-sm font-medium">To</p>
              <p className="text-lg font-semibold">
                {[...indianBankBeneficiaries, ...otherBankBeneficiaries]
                  .find(b => b.id === selectedBeneficiary)?.name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Remarks</p>
              <p className="text-lg font-semibold">{remarks || "No remarks"}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmTransfer}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Successful</DialogTitle>
            <DialogDescription>
              Your money has been transferred successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Transaction ID</p>
              <p className="text-lg font-semibold">TXN{Date.now().toString().slice(-8)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Amount</p>
              <p className="text-lg font-semibold">{formatCurrency(parseFloat(amount))}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showBlockedAlert && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Transaction Blocked</AlertTitle>
          <AlertDescription>
            Your virtual card has been blocked. Please contact customer support.
          </AlertDescription>
        </Alert>
      )}
    </Card>
  )
}
