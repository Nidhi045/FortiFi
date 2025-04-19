"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VirtualCardsList } from "@/components/virtual-cards-list"
import { PlusCircle, CreditCard, Filter, Download, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function VirtualCardsClientPage() {
  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Virtual Cards</h1>
        <p className="text-muted-foreground">Manage and monitor virtual cards across all users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto max-w-sm">
          <Input type="search" placeholder="Search cards..." className="w-full sm:w-[300px] pl-8" />
          <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button
              variant="outline"
              onClick={() => {
                window.location.reload()
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter cards" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cards</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/virtual-cards/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Virtual Card
            </Link>
          </Button>
          <Button
              variant="outline"
              onClick={() => {
                alert("Exporting virtual cards data...")
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
        </div>
      </div>
          <VirtualCardsList />
    </div>
  )
}
