"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, CreditCard, Shield, HelpCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

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

export function UserSupportAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your virtual assistant. How can I help you with your banking needs today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestedQueries: SuggestedQuery[] = [
    {
      text: "How do I create a virtual card?",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      text: "What security features are available?",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      text: "How to report suspicious activity?",
      icon: <HelpCircle className="h-4 w-4" />,
    },
    {
      text: "Update my contact information",
      icon: <User className="h-4 w-4" />,
    },
  ]

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
      if (input.toLowerCase().includes("virtual card") || input.toLowerCase().includes("create card")) {
        response = `To create a virtual card:

1. Go to the "Virtual Cards" section in your dashboard
2. Click on "New Virtual Card"
3. Set your spending limit and expiration date
4. Choose security options like merchant restrictions
5. Submit your request for approval

Your virtual card will be created after banker approval, usually within 1 business day. Would you like me to guide you through any specific step?`
      } else if (input.toLowerCase().includes("security") || input.toLowerCase().includes("protect")) {
        response = `We offer several security features to protect your account:

• Two-factor authentication for all logins
• Transaction monitoring with real-time alerts
• Virtual cards for safer online shopping
• Biometric authentication options
• Location-based transaction verification
• Spending limits and merchant restrictions

Would you like to learn more about any specific security feature?`
      } else if (input.toLowerCase().includes("suspicious") || input.toLowerCase().includes("fraud")) {
        response = `If you notice suspicious activity:

1. Immediately report it through the "Report Fraud" option in your transaction history
2. Call our 24/7 fraud hotline at 1800-XXX-XXXX
3. Temporarily freeze your cards from the dashboard

Our fraud team will investigate and contact you within 24 hours. Would you like me to help you report a specific suspicious transaction?`
      } else if (
        input.toLowerCase().includes("contact") ||
        input.toLowerCase().includes("information") ||
        input.toLowerCase().includes("update")
      ) {
        response = `To update your contact information:

1. Go to "Profile Settings" in your account
2. Select "Personal Information"
3. Update your phone number, email, or address
4. Verify the changes with an OTP sent to your registered mobile

Note: Some changes may require additional verification for security purposes. Can I help you with anything else?`
      } else {
        response = `Thank you for your question about "${input}". I'd be happy to help with that. Could you please provide a bit more detail so I can give you the most accurate information?`
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleSuggestedQuery = (query: string) => {
    setInput(query)
  }

  return (
    <div suppressHydrationWarning className="flex flex-col h-[500px] rounded-lg border">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">Customer Support Assistant</h3>
        </div>
        <Badge variant="outline">AI Powered</Badge>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
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
                      message.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
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
            placeholder="Type your question here..."
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

