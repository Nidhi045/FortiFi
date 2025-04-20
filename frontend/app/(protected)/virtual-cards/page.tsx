"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VirtualCardsList } from "@/components/virtual-cards-list"
import { PlusCircle, CreditCard, Filter, Download, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function VirtualCardsClientPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleRefresh = () => {
    toast({
      title: "Data refreshed",
      description: "Virtual cards data has been refreshed.",
    })
    // In a real app, this would fetch fresh data
    window.location.reload()
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Virtual Cards</h1>
        <p className="text-muted-foreground">Manage virtual cards for secure online transactions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto max-w-sm">
          <Input
            type="search"
            placeholder="Search cards..."
            className="w-full sm:w-[300px] pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
          <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-center items-center">
        <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          <Button asChild>
            <Link href="/virtual-cards/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Virtual Card
            </Link>
          </Button>
        </div>
      </div>
          <VirtualCardsList />
    </div>
  )
}
