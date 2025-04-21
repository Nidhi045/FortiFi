"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/indian-bank/components/ui/card"
import { Button } from "@/components/indian-bank/components/ui/button"
import { Badge } from "@/components/indian-bank/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/indian-bank/components/ui/alert"
import { Eye, EyeOff, Clock, ShieldAlert, Plus, CreditCard, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/indian-bank/components/ui/dialog"

type VirtualCard = {
  id: string;
  cardNumber: string;
  fullCardNumber: string;
  expiryDate: string;
  cvv: string;
  fullCvv: string;
  status: "active" | "expired" | "blocked" | "pending";
  expiresIn: string;
  createdOn: string;
  reason?: string;
};

export function VirtualCardsManager() {
  const [showCardDetails, setShowCardDetails] = useState<Record<string, boolean>>({})
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [showManageDialog, setShowManageDialog] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [virtualCards, setVirtualCards] = useState<VirtualCard[]>([
    {
      id: "vc-1",
      cardNumber: "4567 XXXX XXXX 7890",
      fullCardNumber: "4567 8901 2345 7890",
      expiryDate: "19/04/2026",
      cvv: "XXX",
      fullCvv: "123",
      status: "active",
      expiresIn: "12:34",
      createdOn: "April 19, 2025",
    },
    {
      id: "vc-2",
      cardNumber: "5678 XXXX XXXX 8901",
      fullCardNumber: "5678 9012 3456 8901",
      expiryDate: "18/04/2026",
      cvv: "XXX",
      fullCvv: "456",
      status: "expired",
      expiresIn: "00:00",
      createdOn: "April 10, 2025",
    },
    {
      id: "vc-3",
      cardNumber: "6789 XXXX XXXX 9012",
      fullCardNumber: "6789 0123 4567 9012",
      expiryDate: "17/07/2025",
      cvv: "XXX",
      fullCvv: "789",
      status: "blocked",
      expiresIn: "Blocked",
      reason: "Blocked due to suspicious use on flagged domain",
      createdOn: "April 15, 2025",
    },
  ])

  const toggleCardDetails = (cardId: string) => {
    setShowCardDetails((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }))
  }

  const handleGenerateCard = () => {
    setShowGenerateDialog(true)
  }

  const handleManageCard = (cardId: string) => {
    setSelectedCard(cardId)
    setShowManageDialog(true)
  }

  const handleConfirmGenerate = () => {
    setIsGenerating(true);
    setShowGenerateDialog(false);
    const pendingCard: VirtualCard = {
      id: `vc-${Date.now()}`,
      cardNumber: "XXXX XXXX XXXX XXXX",
      fullCardNumber: "XXXX XXXX XXXX XXXX",
      expiryDate: "--/--/----",
      cvv: "XXX",
      fullCvv: "XXX",
      status: "pending",
      expiresIn: "--:--",
      createdOn: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      reason: "Your card is being generated. This may take a few moments."
    };
    setVirtualCards(prev => [pendingCard, ...prev]);
    setTimeout(() => {
      setVirtualCards(prev => {
        const newCards = [...prev];
        const generatedCard: VirtualCard = {
          id: `vc-${Math.floor(1000 + Math.random() * 9000)}`,
          cardNumber: `${Math.floor(1000 + Math.random() * 9000)} XXXX XXXX ${Math.floor(1000 + Math.random() * 9000)}`,
          fullCardNumber: `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB').split('/').join('/'),
          cvv: "XXX",
          fullCvv: `${Math.floor(100 + Math.random() * 900)}`,
          status: "active",
          expiresIn: "23:59",
          createdOn: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        };
        const pendingIndex = newCards.findIndex(card => card.status === "pending");
        if (pendingIndex !== -1) {
          newCards[pendingIndex] = generatedCard;
        }
        
        return newCards;
      });
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Virtual Cards</h2>
        <Button 
          className="bg-[#FFB100] text-[#1C3E94] hover:bg-[#ffa200]" 
          onClick={handleGenerateCard}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Generate New Card
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {virtualCards.map((card) => (
          <Card
            key={card.id}
            className={`overflow-hidden ${
              card.status === "blocked"
                ? "border-red-300"
                : card.status === "expired"
                  ? "border-gray-300"
                  : card.status === "pending"
                    ? "border-amber-300"
                    : "border-green-300"
            }`}
          >
            <CardHeader
              className={`pb-2 ${
                card.status === "blocked" 
                  ? "bg-red-50" 
                  : card.status === "expired" 
                    ? "bg-gray-50" 
                    : card.status === "pending"
                      ? "bg-amber-50"
                      : "bg-green-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Virtual Card
                </CardTitle>
                <Badge
                  className={`${
                    card.status === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : card.status === "expired"
                        ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        : card.status === "pending"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                  }`}
                >
                  {card.status === "active" 
                    ? "Active" 
                    : card.status === "expired" 
                      ? "Expired" 
                      : card.status === "pending"
                        ? "Generating..."
                        : "Blocked"}
                </Badge>
              </div>
              <CardDescription>Created on {card.createdOn}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Card Number</div>
                  <div className="flex items-center">
                    <div className="text-lg font-mono">
                      {showCardDetails[card.id] ? card.fullCardNumber : card.cardNumber}
                    </div>
                    {card.status !== "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-8 w-8 p-0"
                        onClick={() => toggleCardDetails(card.id)}
                        disabled={card.status !== "active"}
                      >
                        {showCardDetails[card.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showCardDetails[card.id] ? "Hide" : "Show"} card details</span>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Expiry Date</div>
                    <div className="font-mono">{card.expiryDate}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">CVV</div>
                    <div className="font-mono">{showCardDetails[card.id] ? card.fullCvv : card.cvv}</div>
                  </div>
                </div>

                {card.status === "active" && (
                  <div className="mt-4 flex items-center text-amber-600">
                    <Clock className="mr-2 h-4 w-4" />
                    <span className="text-sm font-medium">Expires in {card.expiresIn}</span>
                  </div>
                )}

                {card.status === "pending" && (
                  <Alert className="mt-4 border-amber-300 bg-amber-50">
                    <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                    <AlertTitle className="text-amber-800">Card Generation in Progress</AlertTitle>
                    <AlertDescription className="text-amber-700">{card.reason}</AlertDescription>
                  </Alert>
                )}

                {card.status === "blocked" && (
                  <Alert variant="destructive" className="mt-4 border-red-300 bg-red-50">
                    <ShieldAlert className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">Card Blocked</AlertTitle>
                    <AlertDescription className="text-red-700">{card.reason}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-4">
              {card.status === "active" ? (
                <Button variant="outline" className="w-full" onClick={() => handleManageCard(card.id)}>
                  Manage Card
                </Button>
              ) : card.status === "blocked" ? (
                <Button className="w-full bg-[#FFB100] text-[#1C3E94] hover:bg-[#ffa200]" disabled>
                  Request New Card (Disabled for 30 mins)
                </Button>
              ) : card.status === "pending" ? (
                <Button className="w-full bg-[#FFB100] text-[#1C3E94] hover:bg-[#ffa200]" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </Button>
              ) : (
                <Button className="w-full bg-[#FFB100] text-[#1C3E94] hover:bg-[#ffa200]" onClick={handleGenerateCard}>
                  Generate New Card
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Generate Card Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New Virtual Card</DialogTitle>
            <DialogDescription>
              This will create a new one-time use virtual card for secure online transactions.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Card Type</label>
                <select className="w-full p-2 mt-1 border rounded-md">
                  <option>One-time use</option>
                  <option>24-hour validity</option>
                  <option>7-day validity</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Transaction Limit</label>
                <select className="w-full p-2 mt-1 border rounded-md" defaultValue="₹25,000">
                  <option>₹10,000</option>
                  <option>₹25,000</option>
                  <option>₹50,000</option>
                  <option>₹1,00,000</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Purpose (Optional)</label>
                <input type="text" className="w-full p-2 mt-1 border rounded-md" placeholder="e.g., Online Shopping" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-[#1C3E94] hover:bg-[#152d6e]" onClick={handleConfirmGenerate}>
              Generate Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Card Dialog */}
      <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Virtual Card</DialogTitle>
            <DialogDescription>Control settings for your virtual card</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Enable International Transactions</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1C3E94]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Enable Online Transactions</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1C3E94]"></div>
                </label>
              </div>
              <div>
                <label className="text-sm font-medium">Transaction Limit</label>
                <select className="w-full p-2 mt-1 border rounded-md" defaultValue="₹25,000">
                  <option value="₹10,000">₹10,000</option>
                  <option value="₹25,000">₹25,000</option>
                  <option value="₹50,000">₹50,000</option>
                  <option value="₹1,00,000">₹1,00,000</option>
                </select>
              </div>
              <div className="pt-4 border-t mt-4">
                <Button variant="destructive" className="w-full">
                  Block Card
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManageDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#1C3E94] hover:bg-[#152d6e]"
              onClick={() => {
                alert("Card settings updated successfully!")
                setShowManageDialog(false)
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}