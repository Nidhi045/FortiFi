"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, AlertTriangle, Shield, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

type SuggestedQuery = {
  text: string
  icon?: React.ReactNode
}

export function RiskManagementAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello, I'm your Fraud Risk Management Assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const suggestedQueries: SuggestedQuery[] = [
    {
      text: "Explain this flagged transaction",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      text: "Compliance requirements for high-risk transactions",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      text: "Recommended actions for suspicious login",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      text: "How to handle a customer dispute",
      icon: <MessageSquare className="h-4 w-4" />,
    },
  ]
  
  // Sample fraud case for context
  const fraudCase = {
    id: "FC-12345",
    customer: "Rahul Sharma",
    date: "2023-04-05",
    amount: "₹25,000",
    type: "Suspicious Transaction",
    risk: "High",
    details: "Multiple transactions from different locations within short time period",
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim()) return
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    
    // Simulate AI response
    setTimeout(() => {
      let response = ""
      
      // Simple pattern matching for demo purposes
      if (input.toLowerCase().includes("explain") && input.toLowerCase().includes("transaction")) {
        response = `This transaction was flagged because it matches several fraud patterns:
        
1. The transaction amount (₹25,000) is significantly higher than the customer's usual spending pattern
2. The transaction occurred from a location (Mumbai) that is different from the customer's usual location (Delhi)
3. There were multiple transactions within a short time period from different devices
        
I recommend reviewing the customer's recent activity and contacting them to verify if they authorized this transaction.`
      } else if (input.toLowerCase().includes("compliance") || input.toLowerCase().includes("requirements")) {
        response = `For high-risk transactions, the following compliance requirements apply:
        
1. Enhanced Due Diligence (EDD) as per RBI guidelines
2. Transaction verification through additional authentication factors
3. Documentation of risk assessment and decision rationale
4. Filing of Suspicious Transaction Report (STR) if fraud is confirmed
5. Customer notification as per DPDPD regulations
        
Would you like me to provide more details on any specific requirement?`
      } else if (input.toLowerCase().includes("suspicious") && input.toLowerCase().includes("login")) {
        response = `For suspicious logins, I recommend the following actions:
        
1. Temporarily lock the account to prevent unauthorized access
2. Send an immediate notification to the customer via registered mobile and email
3. Request verification through an alternative channel
4. Review recent account activity for any unauthorized transactions
5. Reset security credentials after verification
        
Would you like me to help draft a customer notification message?`
      } else if (input.toLowerCase().includes("dispute")) {
        response = `To handle a customer dispute effectively:
        
1. Document the customer's complaint in detail
2. Verify transaction details and check for any fraud indicators
3. Initiate chargeback process if applicable
4. Provide provisional credit while investigation is pending (as per RBI guidelines)
5. Communicate resolution timeline to the customer
6. Update the case with investigation findings
        
I can help you create a dispute resolution workflow if needed.`
      } else {
        response = `I understand you're asking about "${input}". To provide the most accurate guidance, could you please provide more details about the specific fraud case or risk management scenario you're dealing with?`
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }
  
  const handleSuggestedQuery = (query: string) => {
    setInput(query)
  }
  
  return (
    <div suppressHydrationWarning className="flex flex-col h-[600px] rounded-lg border">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">Fraud Risk Management Assistant</h3>
        </div>
        <Badge variant="outline">AI Powered</Badge>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div className="flex max-w-[80%]">
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === "assistant"
                            ? "bg-muted text-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <div className="whitespace-pre-line text-sm">{message.content}</div>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%]">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="rounded-lg p-3 bg-muted text-foreground">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150"></div>
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-300"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            {suggestedQueries.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {suggestedQueries.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => handleSuggestedQuery(query.text)}
                  >
                    {query.icon}
                    <span className="ml-1">{query.text}</span>
                  </Button>
                ))}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 