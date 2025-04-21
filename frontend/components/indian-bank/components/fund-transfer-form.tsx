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

export function FundTransferForm() {
  const [amount, setAmount] = useState("")
  const [remarks, setRemarks] = useState("")
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("")
  const [fromAccount, setFromAccount] = useState("")
  const [transferMode, setTransferMode] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showBlockedAlert, setShowBlockedAlert] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

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
    } else {
      setShowConfirmation(true)
    }
  }

  const handleConfirmTransfer = () => {
    setShowConfirmation(false)
    // Show success message after a brief delay
    setTimeout(() => {
      setShowSuccessDialog(true)
    }, 1000)
  }

  return (
    <>
      <Tabs defaultValue="own" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#1C3E94] text-white">
          <TabsTrigger value="own">Own Account</TabsTrigger>
          <TabsTrigger value="indian">Indian Bank</TabsTrigger>
          <TabsTrigger value="other">Other Bank</TabsTrigger>
        </TabsList>

        <TabsContent value="own">
          <Card>
            <CardHeader>
              <CardTitle>Transfer to Own Account</CardTitle>
              <CardDescription>Move funds between your Indian Bank accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from-account">From Account</Label>
                <Select onValueChange={setFromAccount}>
                  <SelectTrigger id="from-account">
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
                <Label htmlFor="to-account">To Account</Label>
                <Select onValueChange={setSelectedBeneficiary}>
                  <SelectTrigger id="to-account">
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
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks (Optional)</Label>
                <Input
                  id="remarks"
                  placeholder="Add remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="ml-auto bg-[#FFB100] text-[#1C3E94] hover:bg-[#ffa200]"
                onClick={handleTransfer}
                disabled={!selectedBeneficiary || !amount || !fromAccount}
              >
                Transfer Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="indian">
          <Card>
            <CardHeader>
              <CardTitle>Transfer to Indian Bank Account</CardTitle>
              <CardDescription>Send money to other Indian Bank accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from-account-ib">From Account</Label>
                <Select onValueChange={setFromAccount}>
                  <SelectTrigger id="from-account-ib">
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
                <Label htmlFor="to-account-ib">To Beneficiary</Label>
                <Select onValueChange={setSelectedBeneficiary}>
                  <SelectTrigger id="to-account-ib">
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

              <div className="space-y-2">
                <Label htmlFor="amount-ib">Amount (₹)</Label>
                <Input
                  id="amount-ib"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks-ib">Remarks (Optional)</Label>
                <Input
                  id="remarks-ib"
                  placeholder="Add remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="ml-auto bg-[#FFB100] text-[#1C3E94] hover:bg-[#ffa200]"
                onClick={handleTransfer}
                disabled={!selectedBeneficiary || !amount || !fromAccount}
              >
                Transfer Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="other">
          <Card>
            <CardHeader>
              <CardTitle>Transfer to Other Bank</CardTitle>
              <CardDescription>Send money via NEFT/RTGS/IMPS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transfer-mode">Transfer Mode</Label>
                <Select onValueChange={setTransferMode}>
                  <SelectTrigger id="transfer-mode">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neft">NEFT</SelectItem>
                    <SelectItem value="rtgs">RTGS</SelectItem>
                    <SelectItem value="imps">IMPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="from-account-ob">From Account</Label>
                <Select onValueChange={setFromAccount}>
                  <SelectTrigger id="from-account-ob">
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
                <Label htmlFor="to-account-ob">To Beneficiary</Label>
                <Select onValueChange={setSelectedBeneficiary}>
                  <SelectTrigger id="to-account-ob">
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

              <div className="space-y-2">
                <Label htmlFor="amount-ob">Amount (₹)</Label>
                <Input
                  id="amount-ob"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks-ob">Remarks (Optional)</Label>
                <Input
                  id="remarks-ob"
                  placeholder="Add remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="ml-auto bg-[#FFB100] text-[#1C3E94] hover:bg-[#ffa200]"
                onClick={handleTransfer}
                disabled={!selectedBeneficiary || !amount || !fromAccount || !transferMode}
              >
                Transfer Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Transfer</DialogTitle>
            <DialogDescription>Please review the transfer details before proceeding.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Amount:</div>
              <div>₹{amount}</div>
              <div className="font-medium">To:</div>
              <div>{selectedBeneficiary ? "Selected Beneficiary" : "Not selected"}</div>
              <div className="font-medium">Remarks:</div>
              <div>{remarks || "None"}</div>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Please verify all details. This transaction cannot be reversed once confirmed.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button className="bg-[#1C3E94] hover:bg-[#152d6e]" onClick={handleConfirmTransfer}>
              Confirm Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blocked Virtual Card Alert */}
      <Dialog open={showBlockedAlert} onOpenChange={setShowBlockedAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Transfer Blocked</DialogTitle>
            <DialogDescription>Your transfer cannot be processed at this time.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Virtual Card Blocked</AlertTitle>
              <AlertDescription>
                Your virtual card has been blocked due to suspicious activity. For security reasons, fund transfers are
                temporarily disabled.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-gray-500">
              Please contact our customer support at 1800-425-1809 for assistance or visit your nearest Indian Bank
              branch.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowBlockedAlert(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600">Transfer Successful</DialogTitle>
            <DialogDescription>Your fund transfer has been processed successfully.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert className="border-green-300 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">
                Your transfer of ₹{amount} has been completed. A confirmation SMS and email have been sent to your
                registered contact details.
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-2 gap-2 text-sm mt-4">
              <div className="font-medium">Transaction ID:</div>
              <div>TXN{Math.floor(Math.random() * 10000000000)}</div>
              <div className="font-medium">Date & Time:</div>
              <div>{new Date().toLocaleString("en-IN")}</div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                setAmount("")
                setRemarks("")
                setSelectedBeneficiary("")
                setFromAccount("")
                setTransferMode("")
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
