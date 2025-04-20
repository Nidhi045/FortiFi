import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/indian-bank/components/ui/card"
import { Badge } from "@/components/indian-bank/components/ui/badge"
import { MessageSquare, Star, Calendar } from "lucide-react"

export function PersonalMessages() {
  const messages = [
    {
      id: "msg1",
      title: "Account Manager Message",
      content:
        "Dear Rahul, I hope this message finds you well. I'm Priya Sharma, your new Relationship Manager. I'd be happy to discuss your financial goals and how we can help you achieve them.",
      sender: "Priya Sharma",
      role: "Relationship Manager",
      date: "April 18, 2025",
      priority: "high",
      read: false,
    },
    {
      id: "msg2",
      title: "Investment Opportunity",
      content:
        "Based on your profile, we have a new tax-saving investment opportunity that might interest you. Schedule a meeting to learn more.",
      sender: "Investment Team",
      date: "April 15, 2025",
      priority: "medium",
      read: true,
    },
    {
      id: "msg3",
      title: "Branch Holiday Notice",
      content:
        "Please note that our Andheri branch will be closed on April 22, 2025 for a public holiday. Internet banking services will remain available.",
      sender: "Branch Manager",
      date: "April 12, 2025",
      priority: "low",
      read: true,
    },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="bg-[#1C3E94] text-white rounded-t-lg">
        <CardTitle className="text-lg">Personal Messages</CardTitle>
        <CardDescription className="text-gray-200">Communications from your bank</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y dark:divide-gray-800">
          {messages.map((message) => (
            <div key={message.id} className={`p-4 ${!message.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}>
              <div className="flex items-start gap-3">
                <div
                  className={`rounded-full p-2 ${
                    message.priority === "high"
                      ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      : message.priority === "medium"
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium flex items-center">
                      {message.title}
                      {message.priority === "high" && <Star className="ml-1 h-3 w-3 text-amber-500 fill-amber-500" />}
                    </h3>
                    {!message.read && (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{message.content}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">{message.sender}</span>
                    {message.role && <span className="mx-1">•</span>}
                    {message.role && <span>{message.role}</span>}
                    <span className="mx-1">•</span>
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{message.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 text-center">
          <button className="text-sm font-medium text-[#1C3E94] dark:text-[#FFB100]">View All Messages</button>
        </div>
      </CardContent>
    </Card>
  )
}
