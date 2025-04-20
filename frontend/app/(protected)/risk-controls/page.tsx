"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RiskControls } from "@/components/risk-controls"
import { SecurityRecommendations } from "@/components/security-recommendations"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, HelpCircle, Save, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import jsPDF from "jspdf";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function RiskControlsClientPage() {
  const { toast } = useToast()
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [showHelpDialog, setShowHelpDialog] = useState(false)

  const handleSaveChanges = () => {
    toast({
      title: "Settings saved",
      description: "All risk control settings have been saved successfully.",
    })
  }

  const handleResetSettings = () => {
    setShowResetDialog(true)
  }

  const confirmResetSettings = () => {
    setShowResetDialog(false)
    toast({
      title: "Settings reset",
      description: "All risk control settings have been reset to default values.",
    })
    // In a real app, this would reset the settings
    window.location.reload()
  }

  const handleShowHelp = () => {
    setShowHelpDialog(true)
  }

  const handleExportRecommendations = () => {
    const recommendations = [
      "Enable Two-Factor Authentication for all users.",
      "Set transaction limits for high-risk accounts.",
      "Enable IP-based restrictions for sensitive operations.",
      "Monitor login attempts from unrecognized devices.",
      "Regularly review and update security policies.",
    ];
  
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text("Security Recommendations", 10, 10);
  
    doc.setFontSize(12);
    recommendations.forEach((recommendation, index) => {
      doc.text(`${index + 1}. ${recommendation}`, 10, 20 + index * 10);
    });
  
    doc.save("security_recommendations.pdf");
  
    toast({
      title: "Recommendations exported",
      description: "Security recommendations have been exported as PDF.",
    });
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk-Based Transaction Controls</h1>
          <p className="text-muted-foreground">
            Customize your security settings and transaction controls based on risk level
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleResetSettings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Settings
          </Button>
          <Button variant="default" size="sm" onClick={handleSaveChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2 w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Transaction Security Controls</CardTitle>
              <CardDescription>Configure how transactions are handled based on risk assessment</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleShowHelp}>
              <HelpCircle className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent>
            <RiskControls />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Security Recommendations</CardTitle>
              <CardDescription>Personalized recommendations to enhance your account security</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportRecommendations}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <SecurityRecommendations />
          </CardContent>
        </Card>
      </div>

      {/* Reset Settings Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Settings</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset all risk control settings to their default values?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <p className="text-sm text-amber-800">
                  This action cannot be undone. All your custom settings will be lost.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmResetSettings}>
              Reset All Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Security Controls Help</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm">
              Configure how the system handles transactions based on their risk level. Enable or disable security
              features and set thresholds for different security measures.
            </p>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Security Controls</h4>
              <p className="text-sm text-muted-foreground">
                Enable or disable various security features like Dynamic Spend Control, Transaction Time-Lock, and
                Multi-Factor Authentication for large payments.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Transaction Limits</h4>
              <p className="text-sm text-muted-foreground">
                Set daily transaction limits, single transaction limits, and thresholds for additional security
                measures.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Advanced Settings</h4>
              <p className="text-sm text-muted-foreground">
                Configure advanced security options like blocking high-risk countries and merchants, and set your risk
                tolerance profile.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHelpDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
