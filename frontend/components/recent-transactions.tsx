"use client"

import { useState } from "react"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Download,
  Flag,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"

// Sample transaction data - updated with 2025 dates
const allTransactions = {
  U12345: [
    {
      id: "T12345",
      date: "2025-04-01",
      description: "Online Purchase - Amazon",
      amount: -12050,
      type: "debit",
      category: "Shopping",
      riskScore: "low",
    },
    {
      id: "T12346",
      date: "2025-04-02",
      description: "Salary Deposit",
      amount: 350000,
      type: "credit",
      category: "Income",
      riskScore: "low",
    },
    {
      id: "T12347",
      date: "2025-04-03",
      description: "ATM Withdrawal",
      amount: -20000,
      type: "debit",
      category: "Cash",
      riskScore: "low",
    },
    {
      id: "T12348",
      date: "2025-04-03",
      description: "International Transfer",
      amount: -150000,
      type: "debit",
      category: "Transfer",
      riskScore: "medium",
    },
    {
      id: "T12349",
      date: "2025-04-04",
      description: "Unknown Merchant",
      amount: -8999,
      type: "debit",
      category: "Other",
      riskScore: "high",
    },
    {
      id: "T12350",
      date: "2025-04-05",
      description: "Grocery Store",
      amount: -6530,
      type: "debit",
      category: "Groceries",
      riskScore: "low",
    },
    {
      id: "T12351",
      date: "2025-04-06",
      description: "Online Subscription",
      amount: -1499,
      type: "debit",
      category: "Entertainment",
      riskScore: "low",
    },
    {
      id: "T12352",
      date: "2025-04-07",
      description: "Gas Station",
      amount: -4500,
      type: "debit",
      category: "Transportation",
      riskScore: "low",
    },
    {
      id: "T12353",
      date: "2025-04-08",
      description: "Restaurant Payment",
      amount: -7850,
      type: "debit",
      category: "Dining",
      riskScore: "low",
    },
    {
      id: "T12354",
      date: "2025-04-09",
      description: "Unusual Online Purchase",
      amount: -29999,
      type: "debit",
      category: "Shopping",
      riskScore: "medium",
    },
  ],
  U67890: [
    {
      id: "T23456",
      date: "2025-04-01",
      description: "Grocery Shopping",
      amount: -5200,
      type: "debit",
      category: "Groceries",
      riskScore: "low",
    },
    {
      id: "T23457",
      date: "2025-04-02",
      description: "Salary Credit",
      amount: 65000,
      type: "credit",
      category: "Income",
      riskScore: "low",
    },
    {
      id: "T23458",
      date: "2025-04-03",
      description: "Mobile Recharge",
      amount: -999,
      type: "debit",
      category: "Utilities",
      riskScore: "low",
    },
    {
      id: "T23459",
      date: "2025-04-04",
      description: "Online Shopping",
      amount: -3499,
      type: "debit",
      category: "Shopping",
      riskScore: "low",
    },
    {
      id: "T23460",
      date: "2025-04-05",
      description: "Restaurant Bill",
      amount: -2500,
      type: "debit",
      category: "Dining",
      riskScore: "low",
    },
    {
      id: "T23461",
      date: "2025-04-06",
      description: "Cab Fare",
      amount: -450,
      type: "debit",
      category: "Transportation",
      riskScore: "low",
    },
    {
      id: "T23462",
      date: "2025-04-07",
      description: "Movie Tickets",
      amount: -1200,
      type: "debit",
      category: "Entertainment",
      riskScore: "low",
    },
    {
      id: "T23463",
      date: "2025-04-08",
      description: "Unusual Foreign Transaction",
      amount: -250000,
      type: "debit",
      category: "Travel",
      riskScore: "high",
    },
  ],
  all: [
    {
      id: "T12345",
      userId: "U12345",
      userName: "Rahul Sharma",
      date: "2025-04-01",
      description: "Online Purchase - Amazon",
      amount: -12050,
      type: "debit",
      category: "Shopping",
      riskScore: "low",
    },
    {
      id: "T12346",
      userId: "U12345",
      userName: "Rahul Sharma",
      date: "2025-04-02",
      description: "Salary Deposit",
      amount: 350000,
      type: "credit",
      category: "Income",
      riskScore: "low",
    },
    {
      id: "T23458",
      userId: "U67890",
      userName: "Priya Patel",
      date: "2025-04-03",
      description: "Mobile Recharge",
      amount: -999,
      type: "debit",
      category: "Utilities",
      riskScore: "low",
    },
    {
      id: "T12349",
      userId: "U12345",
      userName: "Rahul Sharma",
      date: "2025-04-04",
      description: "Unknown Merchant",
      amount: -8999,
      type: "debit",
      category: "Other",
      riskScore: "high",
    },
    {
      id: "T23463",
      userId: "U67890",
      userName: "Priya Patel",
      date: "2025-04-08",
      description: "Unusual Foreign Transaction",
      amount: -250000,
      type: "debit",
      category: "Travel",
      riskScore: "high",
    },
    {
      id: "T34567",
      userId: "U24680",
      userName: "Amit Kumar",
      date: "2025-04-10",
      description: "Property Purchase Down Payment",
      amount: -1500000,
      type: "debit",
      category: "Real Estate",
      riskScore: "medium",
    },
    {
      id: "T34568",
      userId: "U13579",
      userName: "Neha Singh",
      date: "2025-04-11",
      description: "Business Investment",
      amount: -750000,
      type: "debit",
      category: "Investment",
      riskScore: "medium",
    },
    {
      id: "T34569",
      userId: "U24680",
      userName: "Amit Kumar",
      date: "2025-04-12",
      description: "Vehicle Purchase",
      amount: -650000,
      type: "debit",
      category: "Automotive",
      riskScore: "low",
    },
    {
      id: "T34570",
      userId: "U12345",
      userName: "Rahul Sharma",
      date: "2025-04-15",
      description: "International Wire Transfer",
      amount: -450000,
      type: "debit",
      category: "Transfer",
      riskScore: "high",
    },
  ],
}

// Add large transactions to the "all" array
const largeTransactions = allTransactions.all.filter((tx) => Math.abs(tx.amount) >= 100000)

type TransactionHistoryProps = {
  userId?: string
  showAll?: boolean
  showLargeOnly?: boolean
}

export function RecentTransactions({ userId = "all", showAll = false, showLargeOnly = true }: TransactionHistoryProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [reportedTransactions, setReportedTransactions] = useState<Set<string>>(new Set())
  const [date, setDate] = useState<Date | undefined>(undefined)

  // Get transactions based on userId and showLargeOnly flag
  let transactions =
    userId === "all" ? allTransactions.all : allTransactions[userId as keyof typeof allTransactions] || []

  // Filter for large transactions if showLargeOnly is true
  if (showLargeOnly && userId === "all") {
    transactions = largeTransactions
  }

  const filteredTransactions = transactions
    .filter(
      (transaction) =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (userId === "all" &&
          "userName" in transaction &&
          (transaction as any).userName.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .filter((transaction) => riskFilter === "all" || transaction.riskScore === riskFilter)
    .filter((transaction) => typeFilter === "all" || transaction.type === typeFilter)
    .filter(
      (transaction) => categoryFilter === "all" || transaction.category.toLowerCase() === categoryFilter.toLowerCase(),
    )
    .filter((transaction) => !date || new Date(transaction.date).toDateString() === date.toDateString())

    const handleReportFraud = (id: string) => {
      // Add the transaction ID to the reported set
      setReportedTransactions(prev => new Set(prev).add(id));
      
      // Show toast
      toast({
        title: "Fraud report submitted",
        description: `Transaction ${id} has been flagged for investigation.`,
        variant: "destructive", // Optional: makes the toast stand out
      });
    }

  function convertToCSV(data: any[]) {
    if (data.length === 0) return '';
  
    // Extract headers
    const headers = Object.keys(data[0]);
    
    // Process each row
    const rows = data.map(row => {
      return headers.map(header => {
        // Escape quotes and wrap in quotes if the value contains commas or quotes
        let value = row[header] === undefined || row[header] === null ? '' : row[header];
        if (typeof value === 'string') {
          value = value.replace(/"/g, '""');
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            value = `"${value}"`;
          }
        }
        return value;
      }).join(',');
    });
  
    // Combine headers and rows
    return [headers.join(','), ...rows].join('\n');
  }
  
  function downloadCSV(csvString: string, filename: string) {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleExport = () => {
    // Prepare data for CSV export
    const exportData = filteredTransactions.map(tx => ({
      ID: tx.id,
      Date: new Date(tx.date).toLocaleDateString(),
      Description: tx.description,
      Category: tx.category,
      Type: tx.type,
      Amount: (tx.amount / 100).toFixed(2),
      Risk: tx.riskScore,
      ...(userId === "all" && {
        "User ID": (tx as any).userId || "",
        "User Name": (tx as any).userName || ""
      })
    }));
  
    const csvString = convertToCSV(exportData);
    const filename = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    
    downloadCSV(csvString, filename);
  
    toast({
      title: "Export successful",
      description: "Your transaction history has been exported to CSV.",
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("")
    setRiskFilter("all")
    setTypeFilter("all")
    setCategoryFilter("all")
    setDate(undefined)
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
          >
            <CheckCircle className="mr-1 h-3 w-3" /> Safe
          </Badge>
        )
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800"
          >
            <AlertTriangle className="mr-1 h-3 w-3" /> Suspicious
          </Badge>
        )
      case "high":
        return (
          <Badge
            variant="outline"
            className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800"
          >
            <AlertCircle className="mr-1 h-3 w-3" /> High Risk
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div suppressHydrationWarning className="space-y-4">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risks</SelectItem>
              <SelectItem value="low">Safe</SelectItem>
              <SelectItem value="medium">Suspicious</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="debit">Debit</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
              <SelectItem value="dining">Dining</SelectItem>
              <SelectItem value="groceries">Groceries</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="transportation">Transportation</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="real estate">Real Estate</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
              <SelectItem value="automotive">Automotive</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[130px] pl-3 text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {date ? date.toLocaleDateString() : "Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">{filteredTransactions.length} transactions found</div>
        <div className="flex space-x-2">
          {(searchTerm || riskFilter !== "all" || typeFilter !== "all" || categoryFilter !== "all" || date) && (
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-1 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {userId === "all" && <TableHead>User</TableHead>}
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className={reportedTransactions.has(transaction.id) ? "bg-rose-50 dark:bg-rose-950/50" : ""}>
                {userId === "all" && (
                  <TableCell>{"userName" in transaction ? (transaction as any).userName : "Unknown"}</TableCell>
                )}
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {new Date(transaction.date).toLocaleDateString()}
                    {reportedTransactions.has(transaction.id) && (
                      <Badge variant="destructive" className="text-xs">
                        Reported
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell className={transaction.type === "credit" ? "text-emerald-500" : ""}>
                  <div className="flex items-center">
                    {transaction.type === "credit" ? (
                      <ArrowDownLeft className="mr-1 h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                    )}
                    ₹{Math.abs(transaction.amount / 100).toFixed(2)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getRiskBadge(transaction.riskScore)}
                    {reportedTransactions.has(transaction.id) && (
                      <AlertCircle className="h-4 w-4 text-rose-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleReportFraud(transaction.id)}
                    title="Report Fraud"
                    disabled={reportedTransactions.has(transaction.id)}
                  >
                    <Flag className={`h-4 w-4 ${reportedTransactions.has(transaction.id) ? "text-rose-500 fill-rose-500" : ""}`} />
                  </Button>
                </TableCell>
              </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={userId === "all" ? 7 : 6} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
