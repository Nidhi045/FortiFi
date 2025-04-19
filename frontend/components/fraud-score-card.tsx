"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, User } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FraudScoreCard() {
  const [score, setScore] = useState(0)
  const [riskLevel, setRiskLevel] = useState("Calculating...")
  const [riskColor, setRiskColor] = useState("text-muted-foreground")
  const [viewMode, setViewMode] = useState<"total" | "user">("total")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  // Sample user data for banker view
  const users = [
    { id: "U12345", name: "Rahul Sharma", score: 82 },
    { id: "U67890", name: "Priya Patel", score: 65 },
    { id: "U24680", name: "Amit Kumar", score: 91 },
    { id: "U13579", name: "Neha Singh", score: 43 },
  ]

  useEffect(() => {
    // Simulate loading the fraud score
    const timer = setTimeout(() => {
      let fraudScore

      if (viewMode === "user" && selectedUser) {
        const user = users.find((u) => u.id === selectedUser)
        fraudScore = user ? user.score : 87
      } else {
        fraudScore = 87
      }

      setScore(fraudScore)

      if (fraudScore >= 80) {
        setRiskLevel("Low Risk")
        setRiskColor("text-emerald-500")
      } else if (fraudScore >= 60) {
        setRiskLevel("Moderate Risk")
        setRiskColor("text-amber-500")
      } else {
        setRiskLevel("High Risk")
        setRiskColor("text-rose-500")
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [viewMode, selectedUser])

  const handleUserChange = (userId: string) => {
    setSelectedUser(userId)
    setScore(0)
    setRiskLevel("Calculating...")
    setRiskColor("text-muted-foreground")
  }

  return (
    <Card suppressHydrationWarning>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <Shield className="mr-2 h-4 w-4 text-primary" />
            Fraud Risk Score
          </CardTitle>

          <Select value={viewMode} onValueChange={(value) => setViewMode(value as "total" | "user")}>
            <SelectTrigger className="h-7 w-[120px]">
              <SelectValue placeholder="View mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total">Bank-wide</SelectItem>
              <SelectItem value="user">Per User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "user" && (
          <div className="mb-4">
            <Select value={selectedUser || ""} onValueChange={handleUserChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="text-2xl font-bold">{score}</div>
        <div className={`text-xs ${riskColor} font-medium mt-1`}>{riskLevel}</div>
        <Progress
          value={score}
          className="h-2 mt-2"
          indicatorClassName={score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-rose-500"}
        />
        <p className="text-xs text-muted-foreground mt-2">
          {viewMode === "total"
            ? "AI-powered risk assessment based on all transaction patterns"
            : "AI-powered risk assessment based on user's transaction patterns"}
        </p>
      </CardContent>

      {viewMode === "user" && selectedUser && (
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={`/manage/users/${selectedUser}`}>
              <User className="mr-2 h-4 w-4" />
              View User Details
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
