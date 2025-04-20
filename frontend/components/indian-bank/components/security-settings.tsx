"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/indian-bank/components/ui/card"
import { Button } from "@/components/indian-bank/components/ui/button"
import { Input } from "@/components/indian-bank/components/ui/input"
import { Label } from "@/components/indian-bank/components/ui/label"
import { Switch } from "@/components/indian-bank/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/indian-bank/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/indian-bank/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/indian-bank/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/indian-bank/components/ui/alert"
import { AlertCircle, CreditCard, LogOut, Shield, Smartphone } from "lucide-react"

export function SecuritySettings() {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [showRemoveDeviceDialog, setShowRemoveDeviceDialog] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)


  const securityLogs = [
    {
      id: "log1",
      date: new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: new Date().toLocaleString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      activity: "Login",
      details: "Login from Bangalore, Karnataka",
      ip: "103.156.XX.XX",
      device: "iPhone 13",
    },
    {
      id: "log2",
      date: "April 18, 2025",
      time: "06:30 PM",
      activity: "Login",
      details: "Login from Mumbai, Maharashtra",
      ip: "103.156.XX.XX",
      device: "MacBook Pro",
    },
    {
      id: "log3",
      date: "April 17, 2025",
      time: "03:45 PM",
      activity: "Virtual Card",
      details: "Virtual card blocked by admin",
      ip: "103.156.XX.XX",
      device: "iPhone 13",
    },
    {
      id: "log4",
      date: "April 15, 2025",
      time: "11:20 AM",
      activity: "Admin Flag",
      details: "Transaction flagged for verification",
      ip: "103.156.XX.XX",
      device: "System",
    },
    {
      id: "log5",
      date: "April 10, 2025",
      time: "02:30 PM",
      activity: "Password",
      details: "Password changed successfully",
      ip: "103.156.XX.XX",
      device: "MacBook Pro",
    },
  ]

  const devices = [
    {
      id: "dev1",
      name: "iPhone 13",
      type: "mobile",
      lastUsed: "April 19, 2025 at 09:15 AM",
      location: "Bangalore, Karnataka",
    },
    {
      id: "dev2",
      name: "MacBook Pro",
      type: "laptop",
      lastUsed: "April 18, 2025 at 06:30 PM",
      location: "Bangalore, Karnataka",
    },
  ]

  const handleChangePassword = () => {
    setPasswordError("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return
    }

    // Password validation passed, show success dialog
    setShowPasswordDialog(true)

    // Reset form
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleRemoveDevice = (deviceId: string) => {
    setSelectedDevice(deviceId)
    setShowRemoveDeviceDialog(true)
  }

  const confirmRemoveDevice = () => {
    // In a real app, this would call an API to remove the device
    setShowRemoveDeviceDialog(false)
    alert("Device removed successfully")
  }

  return (
    <div className="grid gap-6">
      <Tabs defaultValue="password" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#1C3E94] text-white">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="logs">Security Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Login Password</CardTitle>
              <CardDescription>Update your login password for enhanced security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {passwordError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Password Requirements</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-1 text-sm">
                    <li>Minimum 8 characters</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one number</li>
                    <li>At least one special character</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto bg-[#FFB100] text-[#1C3E94] hover:bg-[#ffa200]" onClick={handleChangePassword}>
                Change Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Manage Trusted Devices</CardTitle>
              <CardDescription>Control which devices can access your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {devices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full p-2 bg-gray-100">
                        {device.type === "mobile" ? (
                          <Smartphone className="h-5 w-5 text-gray-600" />
                        ) : (
                          <Shield className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-gray-500">Last used: {device.lastUsed}</p>
                        <p className="text-sm text-gray-500">Location: {device.location}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveDevice(device.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                  <Label htmlFor="notifications">Enable Login Notifications</Label>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Receive notifications when your account is accessed from a new device or location
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                variant="outline"
                onClick={() => setShowLogoutDialog(true)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out all sessions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Security Log</CardTitle>
              <CardDescription>Recent security-related activities on your account</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Device</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      className={log.activity === "Admin Flag" || log.activity === "Virtual Card" ? "bg-red-50" : ""}
                    >
                      <TableCell>
                        {log.date}
                        <br />
                        <span className="text-xs text-gray-500">{log.time}</span>
                      </TableCell>
                      <TableCell>
                        {log.activity === "Login" ? (
                          <div className="flex items-center">
                            <Shield className="mr-2 h-4 w-4 text-green-600" />
                            {log.activity}
                          </div>
                        ) : log.activity === "Virtual Card" ? (
                          <div className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4 text-red-600" />
                            {log.activity}
                          </div>
                        ) : log.activity === "Admin Flag" ? (
                          <div className="flex items-center">
                            <AlertCircle className="mr-2 h-4 w-4 text-red-600" />
                            {log.activity}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Shield className="mr-2 h-4 w-4 text-blue-600" />
                            {log.activity}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{log.details}</TableCell>
                      <TableCell>{log.ip}</TableCell>
                      <TableCell>{log.device}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password Changed Successfully</DialogTitle>
            <DialogDescription>Your password has been updated.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert className="border-green-300 bg-green-50">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">
                Your password has been changed successfully. You will be required to login again with your new password.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPasswordDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout All Sessions Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Out All Sessions</DialogTitle>
            <DialogDescription>Are you sure you want to log out of all devices?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                This will log you out from all devices including your current session. You will need to log in again.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                setShowLogoutDialog(false)
                alert("You have been logged out from all devices. Please log in again.")
                window.location.href = "/"
              }}
            >
              Log Out All Sessions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Device Dialog */}
      <Dialog open={showRemoveDeviceDialog} onOpenChange={setShowRemoveDeviceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Device</DialogTitle>
            <DialogDescription>Are you sure you want to remove this device?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This device will no longer be able to access your account without re-authentication. This action cannot
                be undone.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemoveDeviceDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={confirmRemoveDevice}>
              Remove Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
