"use client"

import { useState } from "react"
import {
  CreditCard,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ShieldCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Filter,
  RefreshCw,
  SnowflakeIcon,
  Download,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"

type VirtualCard = {
  id: string
  userId?: string
  userName?: string
  last4: string
  expiryDate: string
  cvv: string
  status: "active" | "expired" | "used" | "pending" | "blocked" | "deleted"
  createdAt: string
  spendLimit: number
  usedAmount: number
  merchant?: string
  approvalStatus?: "approved" | "pending" | "rejected"
  frozen?: boolean
}

export function VirtualCardsList() {
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"user" | "banker">("banker")
  const [statusFilter, setStatusFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [showDeletedCards, setShowDeletedCards] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    action: string
    cardId: string
    title: string
    description: string
  }>({
    open: false,
    action: "",
    cardId: "",
    title: "",
    description: "",
  })

  // Sample user cards - updated with 2025 dates and Indian Rupees
  const [userCardsState, setUserCardsState] = useState<VirtualCard[]>([
    {
      id: "vc-1001",
      last4: "4582",
      expiryDate: "04/25",
      cvv: "123",
      status: "active",
      createdAt: "2025-04-01T10:30:00Z",
      spendLimit: 50000,
      usedAmount: 0,
    },
    {
      id: "vc-1002",
      last4: "7291",
      expiryDate: "04/25",
      cvv: "456",
      status: "active",
      createdAt: "2025-04-02T14:15:00Z",
      spendLimit: 20000,
      usedAmount: 0,
      merchant: "Flipkart",
    },
    {
      id: "vc-1003",
      last4: "3845",
      expiryDate: "03/25",
      cvv: "789",
      status: "used",
      createdAt: "2025-03-25T09:45:00Z",
      spendLimit: 15000,
      usedAmount: 14999,
      merchant: "Hotstar",
    },
  ])

  // Sample banker view cards (all users) - updated with 2025 dates and Indian names/amounts
  const [bankerCardsState, setBankerCardsState] = useState<VirtualCard[]>([
    ...userCardsState.map((card) => ({ ...card, userId: "U12345", userName: "Rahul Sharma" })),
    {
      id: "vc-2001",
      userId: "U67890",
      userName: "Priya Patel",
      last4: "6214",
      expiryDate: "05/25",
      cvv: "321",
      status: "active",
      createdAt: "2025-04-03T11:20:00Z",
      spendLimit: 100000,
      usedAmount: 25000,
      merchant: "Flipkart",
    },
    {
      id: "vc-2002",
      userId: "U67890",
      userName: "Priya Patel",
      last4: "9087",
      expiryDate: "05/25",
      cvv: "654",
      status: "blocked",
      createdAt: "2025-04-01T09:15:00Z",
      spendLimit: 50000,
      usedAmount: 0,
    },
    {
      id: "vc-3001",
      userId: "U24680",
      userName: "Amit Kumar",
      last4: "1234",
      expiryDate: "06/25",
      cvv: "987",
      status: "pending",
      createdAt: "2025-04-05T16:45:00Z",
      spendLimit: 200000,
      usedAmount: 0,
      approvalStatus: "pending",
    },
    {
      id: "vc-3002",
      userId: "U13579",
      userName: "Neha Singh",
      last4: "5678",
      expiryDate: "06/25",
      cvv: "456",
      status: "pending",
      createdAt: "2025-04-06T14:30:00Z",
      spendLimit: 300000,
      usedAmount: 0,
      approvalStatus: "pending",
    },
  ])

  // Deleted cards history
  const [deletedCards, setDeletedCards] = useState<VirtualCard[]>([
    {
      id: "vc-4001",
      userId: "U12345",
      userName: "Rahul Sharma",
      last4: "9012",
      expiryDate: "02/25",
      cvv: "789",
      status: "deleted",
      createdAt: "2025-02-15T08:30:00Z",
      spendLimit: 25000,
      usedAmount: 0,
    },
    {
      id: "vc-4002",
      userId: "U67890",
      userName: "Priya Patel",
      last4: "3456",
      expiryDate: "01/25",
      cvv: "321",
      status: "deleted",
      createdAt: "2025-01-20T13:45:00Z",
      spendLimit: 75000,
      usedAmount: 15000,
    },
  ])

  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({})

  const toggleShowDetails = (id: string) => {
    setShowDetails({
      ...showDetails,
      [id]: !showDetails[id],
    })
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard.`,
    })
  }

  const openConfirmDialog = (action: string, cardId: string, title: string, description: string) => {
    setConfirmDialog({
      open: true,
      action,
      cardId,
      title,
      description,
    })
  }

  const closeConfirmDialog = () => {
    setConfirmDialog({
      ...confirmDialog,
      open: false,
    })
  }

  const handleDelete = (id: string) => {
    openConfirmDialog(
      "delete",
      id,
      "Delete Virtual Card",
      "Are you sure you want to delete this virtual card? This action cannot be undone.",
    )
  }

  const handleExport = (format: 'csv' | 'json' = 'csv') => {
    // Get the cards to export based on current filters
    const cardsToExport = filteredCards;
  
    if (cardsToExport.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no cards matching your current filters to export.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      let content: string;
      let mimeType: string;
      let fileName: string;
  
      if (format === 'json') {
        // Prepare JSON export
        const exportData = cardsToExport.map(card => ({
          id: card.id,
          cardNumber: `•••• ${card.last4}`,
          expiryDate: card.expiryDate,
          status: card.status,
          frozen: card.frozen || false,
          spendLimit: card.spendLimit,
          usedAmount: card.usedAmount,
          merchant: card.merchant || '',
          createdAt: card.createdAt,
          ...(viewMode === 'banker' && {
            userId: card.userId,
            userName: card.userName
          })
        }));
  
        content = JSON.stringify(exportData, null, 2);
        mimeType = 'application/json';
        fileName = `virtual-cards-export-${new Date().toISOString().split('T')[0]}.json`;
      } else {
        // Prepare CSV export
        const headers = [
          'Card ID',
          'Card Number',
          'Expiry Date',
          'Status',
          'Frozen',
          'Spend Limit (₹)',
          'Used Amount (₹)',
          'Remaining (₹)',
          'Merchant',
          'Created At',
          ...(viewMode === 'banker' ? ['User ID', 'User Name'] : [])
        ];
  
        const rows = cardsToExport.map(card => [
          card.id,
          `"•••• ${card.last4}"`,
          card.expiryDate,
          card.status,
          card.frozen ? 'Yes' : 'No',
          card.spendLimit,
          card.usedAmount,
          card.spendLimit - card.usedAmount,
          card.merchant || '',
          new Date(card.createdAt).toLocaleString('en-IN'),
          ...(viewMode === 'banker' ? [card.userId, card.userName] : [])
        ]);
  
        // Convert to CSV string
        content = [
          headers.join(','),
          ...rows.map(row => row.join(','))
        ].join('\n');
  
        mimeType = 'text/csv';
        fileName = `virtual-cards-export-${new Date().toISOString().split('T')[0]}.csv`;
      }
  
      // Create download link
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  
      toast({
        title: "Export successful",
        description: `Your virtual cards data has been exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export failed",
        description: "An error occurred while exporting the data.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (id: string) => {
    // Find the card to delete
    const cardToDelete =
      viewMode === "user"
        ? userCardsState.find((card) => card.id === id)
        : bankerCardsState.find((card) => card.id === id)

    if (cardToDelete) {
      // Add to deleted cards
      const updatedCard = { ...cardToDelete, status: "deleted" as const }
      setDeletedCards([updatedCard, ...deletedCards])

      // Remove from active cards
      if (viewMode === "user") {
        setUserCardsState(userCardsState.filter((card) => card.id !== id))
        // Also remove from banker cards if it exists there
        setBankerCardsState(bankerCardsState.filter((card) => card.id !== id))
      } else {
        setBankerCardsState(bankerCardsState.filter((card) => card.id !== id))
        // Also remove from user cards if it belongs to the current user
        setUserCardsState(userCardsState.filter((card) => card.id !== id))
      }
    }

    toast({
      title: "Virtual card deleted",
      description: "The virtual card has been deleted successfully.",
    })

    closeConfirmDialog()
  }

  const handleApprove = (id: string) => {
    openConfirmDialog(
      "approve",
      id,
      "Approve Virtual Card",
      "Are you sure you want to approve this virtual card request?",
    )
  }

  const confirmApprove = (id: string) => {
    setBankerCardsState(
      bankerCardsState.map((card) =>
        card.id === id ? { ...card, status: "active", approvalStatus: "approved" } : card,
      ),
    )

    toast({
      title: "Virtual card approved",
      description: "The virtual card request has been approved.",
    })

    closeConfirmDialog()
  }

  const handleReject = (id: string) => {
    openConfirmDialog("reject", id, "Reject Virtual Card", "Are you sure you want to reject this virtual card request?")
  }

  const confirmReject = (id: string) => {
    setBankerCardsState(
      bankerCardsState.map((card) =>
        card.id === id ? { ...card, status: "blocked", approvalStatus: "rejected" } : card,
      ),
    )

    toast({
      title: "Virtual card rejected",
      description: "The virtual card request has been rejected.",
    })

    closeConfirmDialog()
  }

  const handleBlock = (id: string) => {
    openConfirmDialog(
      "block",
      id,
      "Block Virtual Card",
      "Are you sure you want to block this virtual card? This will prevent any further transactions.",
    )
  }

  const confirmBlock = (id: string) => {
    if (viewMode === "user") {
      setUserCardsState(userCardsState.map((card) => (card.id === id ? { ...card, status: "blocked" } : card)))
      // Also update in banker cards
      setBankerCardsState(bankerCardsState.map((card) => (card.id === id ? { ...card, status: "blocked" } : card)))
    } else {
      setBankerCardsState(bankerCardsState.map((card) => (card.id === id ? { ...card, status: "blocked" } : card)))
      // Also update in user cards if it belongs to the current user
      setUserCardsState(userCardsState.map((card) => (card.id === id ? { ...card, status: "blocked" } : card)))
    }

    toast({
      title: "Virtual card blocked",
      description: "The virtual card has been blocked successfully.",
    })

    closeConfirmDialog()
  }

  const handleFreezeCard = (id: string) => {
    openConfirmDialog(
      "freeze",
      id,
      "Freeze Virtual Card",
      "Are you sure you want to freeze this virtual card? You can unfreeze it later.",
    )
  }

  const confirmFreezeCard = (id: string) => {
    if (viewMode === "user") {
      setUserCardsState(userCardsState.map((card) => (card.id === id ? { ...card, frozen: !card.frozen } : card)))
      // Also update in banker cards
      setBankerCardsState(bankerCardsState.map((card) => (card.id === id ? { ...card, frozen: !card.frozen } : card)))
    } else {
      setBankerCardsState(bankerCardsState.map((card) => (card.id === id ? { ...card, frozen: !card.frozen } : card)))
      // Also update in user cards if it belongs to the current user
      setUserCardsState(userCardsState.map((card) => (card.id === id ? { ...card, frozen: !card.frozen } : card)))
    }

    // Find the card to see if it's being frozen or unfrozen
    const card =
      viewMode === "user"
        ? userCardsState.find((card) => card.id === id)
        : bankerCardsState.find((card) => card.id === id)

    const isFrozen = card?.frozen

    toast({
      title: isFrozen ? "Virtual card unfrozen" : "Virtual card frozen",
      description: isFrozen
        ? "The virtual card has been unfrozen and is now active."
        : "The virtual card has been frozen successfully.",
    })

    closeConfirmDialog()
  }

  const getStatusBadge = (status: string, frozen?: boolean) => {
    if (frozen) {
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800"
        >
          <SnowflakeIcon className="mr-1 h-3 w-3" /> Frozen
        </Badge>
      )
    }

    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600">
            <CheckCircle className="mr-1 h-3 w-3" /> Active
          </Badge>
        )
      case "expired":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800"
          >
            <Clock className="mr-1 h-3 w-3" /> Expired
          </Badge>
        )
      case "used":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800"
          >
            <CheckCircle className="mr-1 h-3 w-3" /> Used
          </Badge>
        )
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800"
          >
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
      case "blocked":
        return (
          <Badge
            variant="outline"
            className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800"
          >
            <AlertCircle className="mr-1 h-3 w-3" /> Blocked
          </Badge>
        )
      case "deleted":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800"
          >
            <Trash2 className="mr-1 h-3 w-3" /> Deleted
          </Badge>
        )
      default:
        return null
    }
  }

  // Filter cards based on view mode and filters
  const cards = viewMode === "user" ? userCardsState : bankerCardsState
  const allCards = showDeletedCards ? [...cards, ...deletedCards] : cards

  const filteredCards = allCards
    .filter((card) => statusFilter === "all" || card.status === statusFilter)
    .filter((card) => userFilter === "all" || card.userId === userFilter)

  // Get unique users for filter
  const users = Array.from(new Set(bankerCardsState.map((card) => card.userId))).map((userId) => {
    const card = bankerCardsState.find((c) => c.userId === userId)
    return {
      id: userId,
      name: card?.userName || "Unknown",
    }
  })

  // Pending approval requests
  const pendingRequests = bankerCardsState.filter((card) => card.status === "pending")

  // Calculate statistics
  const totalActiveCards = bankerCardsState.filter((card) => card.status === "active").length
  const totalSpendLimit = bankerCardsState.reduce(
    (sum, card) => sum + (card.status === "active" ? card.spendLimit : 0),
    0,
  )
  const totalUsedAmount = bankerCardsState.reduce((sum, card) => sum + card.usedAmount, 0)
  const utilizationRate = totalSpendLimit > 0 ? (totalUsedAmount / totalSpendLimit) * 100 : 0

  // Handle confirm action
  const handleConfirmAction = () => {
    switch (confirmDialog.action) {
      case "delete":
        confirmDelete(confirmDialog.cardId)
        break
      case "approve":
        confirmApprove(confirmDialog.cardId)
        break
      case "reject":
        confirmReject(confirmDialog.cardId)
        break
      case "block":
        confirmBlock(confirmDialog.cardId)
        break
      case "freeze":
        confirmFreezeCard(confirmDialog.cardId)
        break
      default:
        closeConfirmDialog()
    }
  }

  return (
    <div className="space-y-6">
      {viewMode === "banker" && (
        <>
          <Tabs defaultValue="cards" className="space-y-4">
            <TabsList className="w-full flex-wrap">
              <TabsTrigger value="cards" className="flex-1">
                All Cards
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex-1">
                Pending Approvals
                {pendingRequests.length > 0 && <Badge className="ml-2 bg-amber-500">{pendingRequests.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex-1">
                Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cards" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 w-1/2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    {showDeletedCards && <SelectItem value="deleted">Deleted</SelectItem>}
                  </SelectContent>
                </Select>

                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id as string}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 w-1/2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStatusFilter("all")
                    setUserFilter("all")
                    toast({
                      title: "Filters reset",
                      description: "All filters have been reset to default values.",
                    })
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExport('csv')}>
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('json')}>
                      Export as JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

              {filteredCards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <CreditCard className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No virtual cards found</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md">
                    No virtual cards match your current filter criteria.
                  </p>
                </div>
              ) : (
                filteredCards.map((card) => (
                  <div key={card.id} className="rounded-lg border p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${
                            card.status === "deleted"
                              ? "bg-gray-200 dark:bg-gray-800"
                              : card.frozen
                                ? "bg-blue-100 dark:bg-blue-900"
                                : "bg-primary/10"
                          }`}
                        >
                          <CreditCard
                            className={`h-6 w-6 ${
                              card.status === "deleted"
                                ? "text-gray-500"
                                : card.frozen
                                  ? "text-blue-500"
                                  : "text-primary"
                            }`}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium">•••• {card.last4}</h3>
                            {card.merchant && (
                              <span className="ml-2 text-sm text-muted-foreground">({card.merchant})</span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                            <span>Expires: {card.expiryDate}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>Limit: ₹{card.spendLimit.toLocaleString("en-IN")}</span>
                            {viewMode === "banker" && card.userName && (
                              <>
                                <span className="hidden sm:inline">•</span>
                                <span className="flex items-center">
                                  <User className="mr-1 h-3 w-3" />
                                  {card.userName}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center mt-4 md:mt-0">
                        <div className="mr-2">{getStatusBadge(card.status, card.frozen)}</div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleShowDetails(card.id)}
                            title={showDetails[card.id] ? "Hide Details" : "Show Details"}
                          >
                            {showDetails[card.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          {viewMode === "banker" && card.status === "active" && !card.frozen && (
                            <Button variant="ghost" size="icon" onClick={() => handleBlock(card.id)} title="Block Card">
                              <AlertCircle className="h-4 w-4 text-rose-500" />
                            </Button>
                          )}
                          {card.status !== "deleted" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(card.id)}
                              title="Delete Card"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {showDetails[card.id] && (
                      <div className="mt-4 rounded-md bg-muted p-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <div className="text-sm font-medium">Card Number</div>
                            <div className="mt-1 flex items-center">
                              <div className="font-mono">4532 •••• •••• {card.last4}</div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-2 h-6 w-6"
                                onClick={() => handleCopy(`4532********${card.last4}`, "Card number")}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">CVV</div>
                            <div className="mt-1 flex items-center">
                              <div className="font-mono">{card.cvv}</div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-2 h-6 w-6"
                                onClick={() => handleCopy(card.cvv, "CVV")}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Created</div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {new Date(card.createdAt).toLocaleString("en-IN")}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Security</div>
                            <div className="mt-1 flex items-center text-sm text-emerald-500">
                              <ShieldCheck className="mr-1 h-4 w-4" />
                              One-time use protection
                            </div>
                          </div>
                        </div>

                        {card.status === "used" && (
                          <div className="mt-4 rounded-md bg-blue-50 p-3 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-start">
                              <CheckCircle className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <div className="ml-3">
                                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Card Used</h4>
                                <div className="mt-1 text-xs text-blue-700 dark:text-blue-400">
                                  <p>
                                    This card was used for a transaction of ₹{card.usedAmount.toLocaleString("en-IN")}{" "}
                                    and is no longer active.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {card.status === "deleted" && (
                          <div className="mt-4 rounded-md bg-gray-50 p-3 dark:bg-gray-950/30 border border-gray-200 dark:border-gray-800">
                            <div className="flex items-start">
                              <Trash2 className="mt-0.5 h-4 w-4 text-gray-600 dark:text-gray-400" />
                              <div className="ml-3">
                                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-300">Card Deleted</h4>
                                <div className="mt-1 text-xs text-gray-700 dark:text-gray-400">
                                  <p>This card has been deleted and cannot be used for transactions.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {card.status === "pending" && viewMode === "banker" && (
                          <div className="mt-4 flex flex-wrap justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleReject(card.id)}>
                              Reject
                            </Button>
                            <Button size="sm" onClick={() => handleApprove(card.id)}>
                              Approve
                            </Button>
                          </div>
                        )}

                        {card.status === "active" && (
                          <div className="mt-4 flex flex-wrap justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleFreezeCard(card.id)}>
                              {card.frozen ? "Unfreeze Card" : "Freeze Card"}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                handleCopy(`4532********${card.last4}|${card.expiryDate}|${card.cvv}`, "Card details")
                                toast({
                                  title: "Card details copied",
                                  description: "All card details have been copied to your clipboard.",
                                })
                              }}
                            >
                              Copy Details
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Clock className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No pending requests</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md">
                    There are no virtual card requests waiting for approval.
                  </p>
                </div>
              ) : (
                pendingRequests.map((card) => (
                  <div key={card.id} className="rounded-lg border p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                          <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium">New Card Request</h3>
                            <Badge className="ml-2 bg-amber-500">Pending</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                            <span>Requested: {new Date(card.createdAt).toLocaleDateString("en-IN")}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>Limit: ₹{card.spendLimit.toLocaleString("en-IN")}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center">
                              <User className="mr-1 h-3 w-3" />
                              {card.userName}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center mt-4 md:mt-0 space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleReject(card.id)}>
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => handleApprove(card.id)}>
                          Approve
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 rounded-md bg-muted p-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <div className="text-sm font-medium">Request Details</div>
                          <div className="mt-1 space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Card Type:</span>
                              <span>Virtual Debit Card</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Spend Limit:</span>
                              <span>₹{card.spendLimit.toLocaleString("en-IN")}</span>
                            </div>
                            {card.merchant && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Merchant Lock:</span>
                                <span>{card.merchant}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">User Information</div>
                          <div className="mt-1 space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Name:</span>
                              <span>{card.userName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">User ID:</span>
                              <span>{card.userId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Request Date:</span>
                              <span>{new Date(card.createdAt).toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            alert("A request for more information has been sent to their registered mail address.")
                          }}
                        >
                          Request More Info
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleReject(card.id)}>
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => handleApprove(card.id)}>
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Active Cards</div>
                  <div className="mt-2 text-2xl font-bold">{totalActiveCards}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Across all users</div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Total Spend Limit</div>
                  <div className="mt-2 text-2xl font-bold">₹{totalSpendLimit.toLocaleString("en-IN")}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Available for transactions</div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Total Used Amount</div>
                  <div className="mt-2 text-2xl font-bold">₹{totalUsedAmount.toLocaleString("en-IN")}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Spent across all cards</div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Utilization Rate</div>
                  <div className="mt-2 text-2xl font-bold">{utilizationRate.toFixed(1)}%</div>
                  <div className="mt-1">
                    <Progress value={utilizationRate} className="h-1" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-4">Card Status Distribution</h3>
                <div className="space-y-4">
                  {["active", "pending", "used", "blocked", "expired", "deleted"].map((status) => {
                    const count = [...bankerCardsState, ...deletedCards].filter((card) => card.status === status).length
                    const percentage = (count / (bankerCardsState.length + deletedCards.length)) * 100

                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium capitalize">{status}</span>
                          <span className="text-sm">
                            {count} cards ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress
                          value={percentage}
                          className="h-2"
                          indicatorClassName={
                            status === "active"
                              ? "bg-emerald-500"
                              : status === "pending"
                                ? "bg-amber-500"
                                : status === "used"
                                  ? "bg-blue-500"
                                  : status === "blocked"
                                    ? "bg-rose-500"
                                    : status === "deleted"
                                      ? "bg-gray-500"
                                      : "bg-gray-500"
                          }
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {viewMode === "user" && (
        <>
          {cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <CreditCard className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No virtual cards</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                You haven't created any virtual cards yet. Create a virtual card for secure one-time use online
                transactions.
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  toast({
                    title: "Creating new card",
                    description: "Redirecting to create a new virtual card.",
                  })
                  // In a real app, this would navigate to the new card page
                }}
              >
                Create Virtual Card
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeletedCards(!showDeletedCards)}
                  className={showDeletedCards ? "bg-muted" : ""}
                >
                  {showDeletedCards ? "Hide Deleted Cards" : "Show Deleted Cards"}
                </Button>
                <Select value={viewMode} onValueChange={(value) => setViewMode(value as "user" | "banker")}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="View mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User View</SelectItem>
                    <SelectItem value="banker">Banker View</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredCards.map((card) => (
                <div key={card.id} className="rounded-lg border p-4 mt-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${
                          card.status === "deleted"
                            ? "bg-gray-200 dark:bg-gray-800"
                            : card.frozen
                              ? "bg-blue-100 dark:bg-blue-900"
                              : "bg-primary/10"
                        }`}
                      >
                        <CreditCard
                          className={`h-6 w-6 ${
                            card.status === "deleted" ? "text-gray-500" : card.frozen ? "text-blue-500" : "text-primary"
                          }`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium">•••• {card.last4}</h3>
                          {card.merchant && (
                            <span className="ml-2 text-sm text-muted-foreground">({card.merchant})</span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                          <span>Expires: {card.expiryDate}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>Limit: ₹{card.spendLimit.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center mt-4 md:mt-0">
                      {getStatusBadge(card.status, card.frozen)}
                      <div className="ml-4 flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleShowDetails(card.id)}
                          title={showDetails[card.id] ? "Hide Details" : "Show Details"}
                        >
                          {showDetails[card.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        {card.status !== "deleted" && (
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(card.id)} title="Delete Card">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {showDetails[card.id] && (
                    <div className="mt-4 rounded-md bg-muted p-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <div className="text-sm font-medium">Card Number</div>
                          <div className="mt-1 flex items-center">
                            <div className="font-mono">4532 •••• •••• {card.last4}</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2 h-6 w-6"
                              onClick={() => handleCopy(`4532********${card.last4}`, "Card number")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">CVV</div>
                          <div className="mt-1 flex items-center">
                            <div className="font-mono">{card.cvv}</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2 h-6 w-6"
                              onClick={() => handleCopy(card.cvv, "CVV")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Created</div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {new Date(card.createdAt).toLocaleString("en-IN")}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Security</div>
                          <div className="mt-1 flex items-center text-sm text-emerald-500">
                            <ShieldCheck className="mr-1 h-4 w-4" />
                            One-time use protection
                          </div>
                        </div>
                      </div>

                      {card.status === "used" && (
                        <div className="mt-4 rounded-md bg-blue-50 p-3 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start">
                            <CheckCircle className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Card Used</h4>
                              <div className="mt-1 text-xs text-blue-700 dark:text-blue-400">
                                <p>
                                  This card was used for a transaction of ₹{card.usedAmount.toLocaleString("en-IN")} and
                                  is no longer active.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {card.status === "deleted" && (
                        <div className="mt-4 rounded-md bg-gray-50 p-3 dark:bg-gray-950/30 border border-gray-200 dark:border-gray-800">
                          <div className="flex items-start">
                            <Trash2 className="mt-0.5 h-4 w-4 text-gray-600 dark:text-gray-400" />
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-300">Card Deleted</h4>
                              <div className="mt-1 text-xs text-gray-700 dark:text-gray-400">
                                <p>This card has been deleted and cannot be used for transactions.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {card.status === "active" && (
                        <div className="mt-4 flex flex-wrap justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleFreezeCard(card.id)}>
                            {card.frozen ? "Unfreeze Card" : "Freeze Card"}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              handleCopy(`4532********${card.last4}|${card.expiryDate}|${card.cvv}`, "Card details")
                              toast({
                                title: "Card details copied",
                                description: "All card details have been copied to your clipboard.",
                              })
                            }}
                          >
                            Copy Details
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          <div className="rounded-md border p-4 bg-muted/50 mt-6">
            <div className="flex items-start">
              <AlertCircle className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div className="ml-3">
                <h4 className="text-sm font-medium">About Virtual Cards</h4>
                <div className="mt-1 text-sm text-muted-foreground">
                  <p>
                    Virtual cards are one-time use payment cards that protect your real card details. They are
                    automatically destroyed after use, preventing merchants from storing or reusing your payment
                    information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={closeConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button variant="outline" onClick={closeConfirmDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              variant={
                confirmDialog.action === "delete" ||
                confirmDialog.action === "reject" ||
                confirmDialog.action === "block"
                  ? "destructive"
                  : "default"
              }
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
