"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Clock, ExternalLink, Filter, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

type BlockchainLog = {
  id: string
  timestamp: string
  type: "credential_leak" | "account_compromise" | "fraud_attempt"
  source: string
  affectedUsers: number
  status: "active" | "resolved"
  txHash: string
}

export function BlockchainLogs() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<BlockchainLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = () => {
    setLoading(true)

    // Simulate API call to fetch blockchain logs
    setTimeout(() => {
      const sampleLogs: BlockchainLog[] = [
        {
          id: "BL-1001",
          timestamp: "2023-04-03T14:25:30Z",
          type: "credential_leak",
          source: "DarkWeb Forum",
          affectedUsers: 15420,
          status: "active",
          txHash: "0x7f9e8d2a3b5c6f1e0d4c3b2a1f0e9d8c7b6a5f4e",
        },
        {
          id: "BL-1002",
          timestamp: "2023-04-02T09:12:45Z",
          type: "account_compromise",
          source: "Phishing Campaign",
          affectedUsers: 342,
          status: "active",
          txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
        },
        {
          id: "BL-1003",
          timestamp: "2023-04-01T18:37:12Z",
          type: "fraud_attempt",
          source: "Malware Distribution",
          affectedUsers: 1205,
          status: "resolved",
          txHash: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
        },
        {
          id: "BL-1004",
          timestamp: "2023-03-30T11:05:22Z",
          type: "credential_leak",
          source: "Data Breach - FinTech Corp",
          affectedUsers: 50280,
          status: "resolved",
          txHash: "0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d",
        },
        {
          id: "BL-1005",
          timestamp: "2023-03-28T07:42:18Z",
          type: "account_compromise",
          source: "SIM Swapping Attack",
          affectedUsers: 87,
          status: "resolved",
          txHash: "0x5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e",
        },
      ]

      setLogs(sampleLogs)
      setLoading(false)
    }, 1500)
  }

  const handleRefresh = () => {
    fetchLogs()
    toast({
      title: "Refreshing blockchain logs",
      description: "Fetching the latest security logs from the blockchain.",
    })
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "credential_leak":
        return "Credential Leak"
      case "account_compromise":
        return "Account Compromise"
      case "fraud_attempt":
        return "Fraud Attempt"
      default:
        return type
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "credential_leak":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800"
          >
            Credential Leak
          </Badge>
        )
      case "account_compromise":
        return (
          <Badge
            variant="outline"
            className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800"
          >
            Account Compromise
          </Badge>
        )
      case "fraud_attempt":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800"
          >
            Fraud Attempt
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-rose-500 hover:bg-rose-600">Active</Badge>
      case "resolved":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Resolved</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div suppressHydrationWarning className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          Last updated: {new Date().toLocaleString()}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-1 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Affected Users</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Transaction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={7} className="h-12">
                    <div className="flex items-center space-x-4">
                      <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
                      <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                      <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
                      <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                      <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
                      <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
                      <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.id}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{getTypeBadge(log.type)}</TableCell>
                  <TableCell>{log.source}</TableCell>
                  <TableCell>{log.affectedUsers.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell>
                    <Button variant="link" size="sm" className="p-0 h-auto text-xs" asChild>
                      <a href={`https://etherscan.io/tx/${log.txHash}`} target="_blank" rel="noopener noreferrer">
                        {log.txHash.substring(0, 10)}...
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No blockchain logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-md border p-4 bg-muted/50">
        <div className="flex items-start">
          <AlertCircle className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div className="ml-3">
            <h4 className="text-sm font-medium">About Blockchain Security Logs</h4>
            <div className="mt-1 text-sm text-muted-foreground">
              <p>
                These logs represent security incidents recorded on the blockchain by our network of financial
                institutions. All data is anonymized and securely stored using smart contracts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

