"use client"

import { useState } from "react"
import { CheckCircle, AlertTriangle, ArrowRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

type Recommendation = {
  id: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  implemented: boolean
}

export function SecurityRecommendations() {
  const { toast } = useToast()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: "rec1",
      title: "Enable Transaction Time-Lock",
      description: "Add a delay to high-risk transactions for additional verification.",
      impact: "high",
      implemented: false,
    },
    {
      id: "rec2",
      title: "Block High-Risk Countries",
      description: "Automatically block transactions from countries with high fraud rates.",
      impact: "medium",
      implemented: false,
    },
    {
      id: "rec3",
      title: "Lower Single Transaction Limit",
      description: "Reduce your single transaction limit to reduce potential fraud impact.",
      impact: "medium",
      implemented: false,
    },
    {
      id: "rec4",
      title: "Enable Dark Web Monitoring",
      description: "Monitor the dark web for your credentials to prevent identity theft.",
      impact: "high",
      implemented: false,
    },
    {
      id: "rec5",
      title: "Set Up Transaction Notifications",
      description: "Receive real-time notifications for all transactions.",
      impact: "low",
      implemented: true,
    },
  ])

  const securityScore = Math.round(
    (recommendations.filter((rec) => rec.implemented).length / recommendations.length) * 100,
  )

  const handleImplement = (id: string) => {
    setRecommendations(recommendations.map((rec) => (rec.id === id ? { ...rec, implemented: true } : rec)))

    const recommendation = recommendations.find((rec) => rec.id === id)

    toast({
      title: "Recommendation implemented",
      description: `${recommendation?.title} has been successfully implemented.`,
    })
  }

  return (
    <div suppressHydrationWarning className="space-y-6">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Security Score: {securityScore}%</h2>
        <Progress value={securityScore} className="w-full max-w-md" />
        <p className="text-sm text-muted-foreground">
          {securityScore < 50
            ? "Your account security needs improvement."
            : securityScore < 80
              ? "Your account security is moderate."
              : "Your account has strong security measures."}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personalized Recommendations</h3>

        {recommendations.filter((rec) => !rec.implemented).length === 0 ? (
          <div className="rounded-md border p-4 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
            <div className="flex items-start">
              <CheckCircle className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                  All recommendations implemented
                </h4>
                <div className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                  <p>Great job! You've implemented all security recommendations.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations
              .filter((rec) => !rec.implemented)
              .map((recommendation) => (
                <div key={recommendation.id} className="rounded-md border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <AlertTriangle
                        className={`mt-0.5 h-5 w-5 ${
                          recommendation.impact === "high"
                            ? "text-rose-500"
                            : recommendation.impact === "medium"
                              ? "text-amber-500"
                              : "text-blue-500"
                        }`}
                      />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium">
                          {recommendation.title}
                          {recommendation.impact === "high" && (
                            <span className="ml-2 text-xs font-normal text-rose-500">High Impact</span>
                          )}
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground">{recommendation.description}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleImplement(recommendation.id)}
                      className={recommendation.impact === "high" ? "bg-rose-500 hover:bg-rose-600" : ""}
                    >
                      Implement
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Implemented Measures</h3>

          {recommendations.filter((rec) => rec.implemented).length === 0 ? (
            <p className="text-sm text-muted-foreground">No security measures have been implemented yet.</p>
          ) : (
            <div className="space-y-2">
              {recommendations
                .filter((rec) => rec.implemented)
                .map((recommendation) => (
                  <div key={recommendation.id} className="rounded-md border p-3 bg-muted/30">
                    <div className="flex items-start">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-500" />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium">{recommendation.title}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">{recommendation.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

