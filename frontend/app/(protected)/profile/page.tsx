"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Shield,
  Bell,
  Key,
  Lock,
  CreditCard,
  Calendar,
  CheckCircle,
  AlertTriangle,
  FileText,
  Save,
  LogOut,
  Smartphone,
  Mail,
  Building,
  Copy,
  Check,
  Download,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function BankerProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "Vidhya K",
    email: "vidhyak@indianbank.co.in",
    phone: "+91 98765 43210",
    designation: "Personal Banker",
    branch: "Kotturpuram",
    employeeId: "EMP-2025-1234",
    department: "Fraud Prevention",
    joiningDate: "2020-05-15",
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    biometricLogin: true,
    loginNotifications: true,
    transactionAlerts: true,
    deviceManagement: false,
    activityLogging: true,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    securityAlerts: true,
    systemUpdates: true,
    fraudAlerts: true,
    loginSMS: true,
    highRiskSMS: true,
    dashboardAlerts: true,
    transactionUpdates: true,
    systemNotifications: true,
  })

  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [generatedApiKey, setGeneratedApiKey] = useState("")
  const [copied, setCopied] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggleSetting = (setting: string) => {
    setSecuritySettings((prev) => {
      const newSettings = { ...prev, [setting]: !prev[setting as keyof typeof prev] }

      toast({
        title: !prev[setting as keyof typeof prev] ? "Setting enabled" : "Setting disabled",
        description: `${setting.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} has been ${
          !prev[setting as keyof typeof prev] ? "enabled" : "disabled"
        }.`,
      })

      return newSettings
    })
  }

  const handleToggleNotification = (setting: string) => {
    setNotificationSettings((prev) => {
      const newSettings = { ...prev, [setting]: !prev[setting as keyof typeof prev] }

      toast({
        title: !prev[setting as keyof typeof prev] ? "Notification enabled" : "Notification disabled",
        description: `${setting.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} has been ${
          !prev[setting as keyof typeof prev] ? "enabled" : "disabled"
        }.`,
      })

      return newSettings
    })
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const handleChangePassword = () => {
    setShowPasswordDialog(true)
  }

  const handlePasswordChange = () => {
    setShowPasswordDialog(false)
    toast({
      title: "Password change requested",
      description: "A password reset link has been sent to your email address.",
    })
  }

  const handleLogoutAllDevices = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogoutAllDevices = () => {
    setShowLogoutDialog(false)
    toast({
      title: "Logged out from all devices",
      description: "You have been successfully logged out from all devices.",
    })
  }

  const handleExportActivity = () => {
    const activityData = [
      { date: "Today, 10:24 AM", location: "Mumbai, India", device: "Chrome on Windows", ip: "103.25.XX.XX" },
      { date: "Yesterday, 6:42 PM", location: "Mumbai, India", device: "Safari on iPhone", ip: "103.25.XX.XX" },
      { date: "Yesterday, 9:18 AM", location: "Mumbai, India", device: "Chrome on Windows", ip: "103.25.XX.XX" },
      { date: "19 Apr 2025, 11:32 AM", location: "Mumbai, India", device: "Chrome on Windows", ip: "103.25.XX.XX" },
    ];
  
    const csvContent = [
      ["Date", "Location", "Device", "IP Address"],
      ...activityData.map((item) => [item.date, item.location, item.device, item.ip]),
    ]
      .map((row) => row.join(","))
      .join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "activity_log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    toast({
      title: "Activity log exported",
      description: "Your activity log has been exported to CSV format.",
    });
  };

  const handleSaveNotificationPreferences = () => {
    alert("Your notification preferences have been updated successfully.")
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Banker Profile</h1>
        <p className="text-muted-foreground">Manage your profile, security settings, and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="activity">
            <FileText className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal and professional details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96&text=VM" alt={formData.name} />
                    <AvatarFallback>VM</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-lg font-medium">{formData.name}</h3>
                    <p className="text-sm text-muted-foreground">{formData.designation}</p>
                  </div>
                  <Badge className="bg-primary">{formData.department}</Badge>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Employee ID:</span>
                    <span className="font-medium">{formData.employeeId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Branch:</span>
                    <span className="font-medium">{formData.branch}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Joining Date:</span>
                    <span className="font-medium">{new Date(formData.joiningDate).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>

                <div className="rounded-md bg-muted p-3">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <h4 className="text-sm font-medium">Security Status</h4>
                      <p className="text-xs text-muted-foreground">Your account is secure</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress value={92} className="h-1.5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>Manage your account information</CardDescription>
                </div>
                <Button variant={isEditing ? "ghost" : "outline"} onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Input
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Contact Information</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-xs text-muted-foreground">{formData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-xs text-muted-foreground">{formData.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Work Information</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <Building className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Branch</p>
                        <p className="text-xs text-muted-foreground">{formData.branch}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Joined</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(formData.joiningDate).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                {isEditing && (
                  <Button onClick={handleSaveProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and authentication methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Authentication</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Key className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Require a verification code when logging in from new devices
                      </p>
                    </div>
                    <Switch
                      id="twoFactorAuth"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={() => handleToggleSetting("twoFactorAuth")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Smartphone className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="biometricLogin">Biometric Login</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Allow login using fingerprint or face recognition on supported devices
                      </p>
                    </div>
                    <Switch
                      id="biometricLogin"
                      checked={securitySettings.biometricLogin}
                      onCheckedChange={() => handleToggleSetting("biometricLogin")}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notifications & Alerts</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="loginNotifications">Login Notifications</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when your account is accessed from a new device
                      </p>
                    </div>
                    <Switch
                      id="loginNotifications"
                      checked={securitySettings.loginNotifications}
                      onCheckedChange={() => handleToggleSetting("loginNotifications")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="transactionAlerts">Transaction Alerts</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts for high-risk transactions and approvals
                      </p>
                    </div>
                    <Switch
                      id="transactionAlerts"
                      checked={securitySettings.transactionAlerts}
                      onCheckedChange={() => handleToggleSetting("transactionAlerts")}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Advanced Security</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Smartphone className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="deviceManagement">Device Management</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">Manage and restrict access from specific devices</p>
                    </div>
                    <Switch
                      id="deviceManagement"
                      checked={securitySettings.deviceManagement}
                      onCheckedChange={() => handleToggleSetting("deviceManagement")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="activityLogging">Activity Logging</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">Keep detailed logs of all account activities</p>
                    </div>
                    <Switch
                      id="activityLogging"
                      checked={securitySettings.activityLogging}
                      onCheckedChange={() => handleToggleSetting("activityLogging")}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-medium">Security Actions</h4>
                <div className="grid gap-3 sm:grid-cols-1">
                  <Button variant="outline" onClick={handleChangePassword}>
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="sm:col-span-2" onClick={handleLogoutAllDevices}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out From All Devices
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
              <CardDescription>Overview of your account security status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Overall Security</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-md border p-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-emerald-500" />
                      <div>
                        <p className="text-sm font-medium">Password Strength</p>
                        <p className="text-xs text-muted-foreground">Strong password</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-emerald-500" />
                      <div>
                        <p className="text-sm font-medium">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">Enabled</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-emerald-500" />
                      <div>
                        <p className="text-sm font-medium">Recent Activity</p>
                        <p className="text-xs text-muted-foreground">No suspicious activity</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                      <div>
                        <p className="text-sm font-medium">Device Management</p>
                        <p className="text-xs text-muted-foreground">Not configured</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="securityAlerts">Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for security-related events
                      </p>
                    </div>
                    <Switch
                      id="securityAlerts"
                      checked={notificationSettings.securityAlerts}
                      onCheckedChange={() => handleToggleNotification("securityAlerts")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="systemUpdates">System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about system updates and maintenance
                      </p>
                    </div>
                    <Switch
                      id="systemUpdates"
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={() => handleToggleNotification("systemUpdates")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="fraudAlerts">Fraud Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about potential fraud activities
                      </p>
                    </div>
                    <Switch
                      id="fraudAlerts"
                      checked={notificationSettings.fraudAlerts}
                      onCheckedChange={() => handleToggleNotification("fraudAlerts")}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">SMS Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="loginSMS">Login Attempts</Label>
                      <p className="text-sm text-muted-foreground">Receive SMS notifications for login attempts</p>
                    </div>
                    <Switch
                      id="loginSMS"
                      checked={notificationSettings.loginSMS}
                      onCheckedChange={() => handleToggleNotification("loginSMS")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="highRiskSMS">High-Risk Transactions</Label>
                      <p className="text-sm text-muted-foreground">Receive SMS for high-risk transaction approvals</p>
                    </div>
                    <Switch
                      id="highRiskSMS"
                      checked={notificationSettings.highRiskSMS}
                      onCheckedChange={() => handleToggleNotification("highRiskSMS")}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">In-App Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dashboardAlerts">Dashboard Alerts</Label>
                      <p className="text-sm text-muted-foreground">Show alerts and notifications on your dashboard</p>
                    </div>
                    <Switch
                      id="dashboardAlerts"
                      checked={notificationSettings.dashboardAlerts}
                      onCheckedChange={() => handleToggleNotification("dashboardAlerts")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="transactionUpdates">Transaction Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive in-app notifications for transaction status changes
                      </p>
                    </div>
                    <Switch
                      id="transactionUpdates"
                      checked={notificationSettings.transactionUpdates}
                      onCheckedChange={() => handleToggleNotification("transactionUpdates")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="systemNotifications">System Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive system-related notifications and announcements
                      </p>
                    </div>
                    <Switch
                      id="systemNotifications"
                      checked={notificationSettings.systemNotifications}
                      onCheckedChange={() => handleToggleNotification("systemNotifications")}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveNotificationPreferences}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Account Activity</CardTitle>
                <CardDescription>Recent activity and login history</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportActivity}>
                <Download className="mr-2 h-4 w-4" />
                Export Activity
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="p-4 border-b">
                    <h4 className="font-medium">Recent Login Activity</h4>
                  </div>
                  <div className="p-0">
                    <div className="divide-y">
                      <div className="flex items-center justify-between p-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Mumbai, India</p>
                          <p className="text-xs text-muted-foreground">Chrome on Windows • IP: 103.25.XX.XX</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">Today, 10:24 AM</p>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 mt-1">
                            Current Session
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Mumbai, India</p>
                          <p className="text-xs text-muted-foreground">Safari on iPhone • IP: 103.25.XX.XX</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">Yesterday, 6:42 PM</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Mumbai, India</p>
                          <p className="text-xs text-muted-foreground">Chrome on Windows • IP: 103.25.XX.XX</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">Yesterday, 9:18 AM</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Mumbai, India</p>
                          <p className="text-xs text-muted-foreground">Chrome on Windows • IP: 103.25.XX.XX</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">19 Apr 2025, 11:32 AM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border">
                  <div className="p-4 border-b">
                    <h4 className="font-medium">Account Activity</h4>
                  </div>
                  <div className="p-0">
                    <div className="divide-y">
                      <div className="flex items-center justify-between p-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Password Changed</p>
                          <p className="text-xs text-muted-foreground">Security setting updated</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">15 Apr 2025, 3:45 PM</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Two-Factor Authentication Enabled</p>
                          <p className="text-xs text-muted-foreground">Security setting updated</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">10 Apr 2025, 11:20 AM</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Profile Information Updated</p>
                          <p className="text-xs text-muted-foreground">Account details changed</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">5 Apr 2025, 2:15 PM</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">New Device Authorized</p>
                          <p className="text-xs text-muted-foreground">iPhone 15 Pro added to trusted devices</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">1 Apr 2025, 9:30 AM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>We'll send a password reset link to your registered email address.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              For security reasons, password changes require email verification. A reset link will be sent to:
            </p>
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-medium">{formData.email}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordChange}>Send Reset Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout All Devices Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Out From All Devices</DialogTitle>
            <DialogDescription>
              This will terminate all active sessions on all devices. You'll need to log in again on each device.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <p className="text-sm text-amber-800">
                  This action cannot be undone. All devices currently logged into your account will be immediately
                  signed out.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmLogoutAllDevices}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out All Devices
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
