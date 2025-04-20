"use client"

import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  ArrowUpDown,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  UserPlus,
  ChevronDown,
} from "lucide-react"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"

// Sample user data
const usersData = [
  {
    id: "U12345",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    riskScore: 82,
    kycStatus: "verified",
    lastActivity: "2025-04-17T14:32:00",
    accountType: "Premium",
    location: "Bangalore, India",
  },
  {
    id: "U67890",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 87654 32109",
    riskScore: 65,
    kycStatus: "verified",
    lastActivity: "2025-04-16T09:15:00",
    accountType: "Standard",
    location: "Mumbai, India",
  },
  {
    id: "U24680",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    phone: "+91 76543 21098",
    riskScore: 91,
    kycStatus: "verified",
    lastActivity: "2025-04-18T11:45:00",
    accountType: "Premium",
    location: "Delhi, India",
  },
  {
    id: "U13579",
    name: "Neha Singh",
    email: "neha.singh@example.com",
    phone: "+91 65432 10987",
    riskScore: 43,
    kycStatus: "pending",
    lastActivity: "2025-04-15T16:20:00",
    accountType: "Standard",
    location: "Chennai, India",
  },
  {
    id: "U97531",
    name: "Vikram Reddy",
    email: "vikram.reddy@example.com",
    phone: "+91 54321 09876",
    riskScore: 78,
    kycStatus: "verified",
    lastActivity: "2025-04-17T10:05:00",
    accountType: "Premium",
    location: "Hyderabad, India",
  },
  {
    id: "U86420",
    name: "Ananya Gupta",
    email: "ananya.gupta@example.com",
    phone: "+91 43210 98765",
    riskScore: 58,
    kycStatus: "verified",
    lastActivity: "2025-04-16T13:50:00",
    accountType: "Standard",
    location: "Kolkata, India",
  },
  {
    id: "U75319",
    name: "Rajesh Verma",
    email: "rajesh.verma@example.com",
    phone: "+91 32109 87654",
    riskScore: 35,
    kycStatus: "blocked",
    lastActivity: "2025-04-14T08:30:00",
    accountType: "Standard",
    location: "Pune, India",
  },
  {
    id: "U64208",
    name: "Meera Joshi",
    email: "meera.joshi@example.com",
    phone: "+91 21098 76543",
    riskScore: 88,
    kycStatus: "verified",
    lastActivity: "2025-04-18T09:25:00",
    accountType: "Premium",
    location: "Ahmedabad, India",
  },
]

export default function UsersPageClient() {
  const [users, setUsers] = useState(usersData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const getRiskBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-emerald-500 hover:bg-emerald-600">Low Risk ({score})</Badge>
    } else if (score >= 60) {
      return <Badge className="bg-amber-500 hover:bg-amber-600">Medium Risk ({score})</Badge>
    } else {
      return <Badge className="bg-rose-500 hover:bg-rose-600">High Risk ({score})</Badge>
    }
  }

  const getKycStatusBadge = (status: string) => {
    if (status === "verified") {
      return (
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800 flex items-center gap-1"
        >
          <CheckCircle2 className="h-3 w-3" />
          Verified
        </Badge>
      )
    } else if (status === "pending") {
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800 flex items-center gap-1"
        >
          <AlertTriangle className="h-3 w-3" />
          Pending
        </Badge>
      )
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800 flex items-center gap-1"
        >
          <XCircle className="h-3 w-3" />
          Blocked
        </Badge>
      )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (value: string) => {
    setStatusFilter(value)
  }

  const handleSortRisk = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const handleGenerateReport = () => {
    // In a real implementation, you would generate a PDF here
    // For this example, we'll create a CSV report similar to the export but with more risk analysis
    
    try {
      const reportData = filteredUsers.map(user => ({
        id: user.id,
        name: user.name,
        riskScore: user.riskScore,
        riskLevel: user.riskScore >= 80 ? "Low" : user.riskScore >= 60 ? "Medium" : "High",
        kycStatus: user.kycStatus,
        accountType: user.accountType,
        lastActivity: new Date(user.lastActivity).toLocaleString('en-IN'),
        recommendedAction: user.riskScore < 60 ? "Review Immediately" : 
                         user.riskScore < 80 ? "Monitor Closely" : "Normal Monitoring"
      }));
  
      // Create CSV content
      const headers = [
        'User ID',
        'Name',
        'Risk Score',
        'Risk Level',
        'KYC Status',
        'Account Type',
        'Last Activity',
        'Recommended Action'
      ];
  
      const rows = reportData.map(user => [
        user.id,
        `"${user.name}"`,
        user.riskScore,
        user.riskLevel,
        user.kycStatus,
        user.accountType,
        `"${user.lastActivity}"`,
        user.recommendedAction
      ]);
  
      const content = [
        "Bank User Risk Assessment Report",
        `Generated on: ${new Date().toLocaleString('en-IN')}`,
        `Total Users: ${filteredUsers.length}`,
        `High Risk: ${filteredUsers.filter(u => u.riskScore < 60).length}`,
        `Medium Risk: ${filteredUsers.filter(u => u.riskScore >= 60 && u.riskScore < 80).length}`,
        `Low Risk: ${filteredUsers.filter(u => u.riskScore >= 80).length}`,
        "",
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
  
      // Create download link
      const blob = new Blob([content], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-risk-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Report generation failed:', error);
      alert("Report generation failed. Please try again.");
    }
  };

  const handleExportUsers = (format: 'csv' | 'json' = 'csv') => {
    // Get the users to export based on current filters
    const usersToExport = filteredUsers;
  
    if (usersToExport.length === 0) {
      alert("No users to export matching current filters");
      return;
    }
  
    try {
      let content: string;
      let mimeType: string;
      let fileName: string;
  
      if (format === 'json') {
        // Prepare JSON export
        const exportData = usersToExport.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          riskScore: user.riskScore,
          riskLevel: user.riskScore >= 80 ? "Low" : user.riskScore >= 60 ? "Medium" : "High",
          kycStatus: user.kycStatus,
          accountType: user.accountType,
          location: user.location,
          lastActivity: user.lastActivity
        }));
  
        content = JSON.stringify(exportData, null, 2);
        mimeType = 'application/json';
        fileName = `users-export-${new Date().toISOString().split('T')[0]}.json`;
      } else {
        // Prepare CSV export
        const headers = [
          'User ID',
          'Name',
          'Email',
          'Phone',
          'Risk Score',
          'Risk Level',
          'KYC Status',
          'Account Type',
          'Location',
          'Last Activity'
        ];
  
        const rows = usersToExport.map(user => [
          user.id,
          `"${user.name}"`,
          user.email,
          user.phone,
          user.riskScore,
          user.riskScore >= 80 ? "Low" : user.riskScore >= 60 ? "Medium" : "High",
          user.kycStatus,
          user.accountType,
          `"${user.location}"`,
          new Date(user.lastActivity).toLocaleString('en-IN')
        ]);
  
        // Convert to CSV string
        content = [
          headers.join(','),
          ...rows.map(row => row.join(','))
        ].join('\n');
  
        mimeType = 'text/csv';
        fileName = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
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
    } catch (error) {
      console.error('Export failed:', error);
      alert("Export failed. Please try again.");
    }
  };

  const filteredUsers = users
    .filter((user) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.id.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
    .filter((user) => {
      // Status filter
      if (statusFilter === "all") return true
      if (statusFilter === "high-risk") return user.riskScore < 60
      if (statusFilter === "medium-risk") return user.riskScore >= 60 && user.riskScore < 80
      if (statusFilter === "low-risk") return user.riskScore >= 80
      if (statusFilter === "pending-kyc") return user.kycStatus === "pending"
      if (statusFilter === "blocked") return user.kycStatus === "blocked"
      return true
    })
    .sort((a, b) => {
      // Sort by risk score
      if (sortOrder === "asc") {
        return a.riskScore - b.riskScore
      } else {
        return b.riskScore - a.riskScore
      }
    })

  return (
    <div suppressHydrationWarning className="space-y-6 w-full">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          View and manage all bank users, monitor risk scores, and review account details
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="w-full sm:w-[300px] pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Export Users
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => handleExportUsers('csv')}>
        Export as CSV
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleExportUsers('json')}>
        Export as JSON
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
          <Select value={statusFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="high-risk">High Risk</SelectItem>
              <SelectItem value="medium-risk">Medium Risk</SelectItem>
              <SelectItem value="low-risk">Low Risk</SelectItem>
              <SelectItem value="pending-kyc">Pending KYC</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleGenerateReport}>
            <Shield className="mr-2 h-4 w-4" />
            Risk Report
          </Button>
        </div>
      </div>

      <Card className="w-full">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">User</TableHead>
                  <TableHead className="hidden md:table-cell">Account Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={handleSortRisk}>
                      Risk Score
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">KYC Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={`/placeholder.svg?height=36&width=36&text=${user.name.charAt(0)}`}
                              alt={user.name}
                            />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.accountType}</TableCell>
                      <TableCell className="hidden lg:table-cell">{user.location}</TableCell>
                      <TableCell>{getRiskBadge(user.riskScore)}</TableCell>
                      <TableCell className="hidden md:table-cell">{getKycStatusBadge(user.kycStatus)}</TableCell>
                      <TableCell className="hidden lg:table-cell">{formatDate(user.lastActivity)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/manage/users/${user.id}`}>View Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No users found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
      </Card>
    </div>
  )
}
