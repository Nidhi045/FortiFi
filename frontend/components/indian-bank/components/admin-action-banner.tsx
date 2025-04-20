import { Alert, AlertDescription, AlertTitle } from "@/components/indian-bank/components/ui/alert"
import { ShieldAlert } from "lucide-react"

export function AdminActionBanner() {
  return (
    <Alert variant="destructive" className="border-red-300 bg-red-50">
      <ShieldAlert className="h-5 w-5 text-red-600" />
      <AlertTitle className="text-red-800 text-lg">Admin Action Required</AlertTitle>
      <AlertDescription className="text-red-700">
        An admin has flagged suspicious activity; your recent transaction of ₹25,000 to Merchant ID 45678 was stopped
        for security verification. Please contact our customer support at 1800-425-1809 for assistance.
      </AlertDescription>
    </Alert>
  )
}
