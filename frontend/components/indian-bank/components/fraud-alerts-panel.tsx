import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/indian-bank/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/indian-bank/components/ui/alert"
import { ShieldAlert, AlertTriangle } from "lucide-react"

export function FraudAlertsPanel() {
  return (
    <Card className="h-full">
      <CardHeader className="bg-[#1C3E94] text-white rounded-t-lg">
        <CardTitle className="text-lg">Security Alerts</CardTitle>
        <CardDescription className="text-gray-200">Important security information</CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <Alert variant="default" className="border-amber-300 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Login Information</AlertTitle>
          <AlertDescription className="text-amber-700">
            Last login was from Chennai on Chrome/Windows at {new Date().toLocaleString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })} on {new Date().toLocaleString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}.
          </AlertDescription>
        </Alert>

        <Alert variant="destructive" className="border-red-300 bg-red-50">
          <ShieldAlert className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Virtual Card Alert</AlertTitle>
          <AlertDescription className="text-red-700">
            Your last generated virtual card ending with 4567 was blocked due to suspected fraud on April 17, 2025.
          </AlertDescription>
        </Alert>

        <div className="mt-4 pt-4 border-t text-sm text-gray-500">
          <p>For any security concerns, please contact our 24/7 helpline at 1800-425-1809 immediately.</p>
        </div>
      </CardContent>
    </Card>
  )
}
