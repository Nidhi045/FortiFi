"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/indian-bank/components/ui/card"
import { Button } from "@/components/indian-bank/components/ui/button"
import { Badge } from "@/components/indian-bank/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/indian-bank/components/ui/dialog"
import { Laptop, Smartphone, User, Eye, EyeOff } from "lucide-react"

export function ProfileDetails() {
  const [showPersonalInfo, setShowPersonalInfo] = useState(false)
  const [showChangeDialog, setShowChangeDialog] = useState(false)

  const profileData = {
    name: "Rahul Sharma",
    dob: "XX/XX/1985",
    fullDob: "15/06/1985",
    email: "rahul.******@example.com",
    fullEmail: "rahul.sharma@example.com",
    mobile: "+91 98XXX XX210",
    fullMobile: "+91 98765 43210",
    address: "XXX, XXXXXX, Bangalore, Karnataka",
    fullAddress: "23 MG Road, Bangalore, Karnataka",
    pan: "XXXXX1234X",
    fullPan: "ABCPK1234X",
    aadhar: "XXXX XXXX 5678",
    fullAadhar: "1234 5678 5678",
    customerSince: "June 15, 2023",
    status: "Verified Customer",
  }

  const linkedDevices = [
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

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="bg-[#1C3E94] text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Personal Details</CardTitle>
            <Badge className="bg-[#FFB100] text-[#1C3E94] hover:bg-[#FFB100]">{profileData.status}</Badge>
          </div>
          <CardDescription className="text-gray-200">Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowPersonalInfo(!showPersonalInfo)}
              >
                {showPersonalInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPersonalInfo ? "Hide" : "Show"} personal information</span>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                <p className="mt-1 font-medium">{profileData.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                <p className="mt-1 font-medium">{showPersonalInfo ? profileData.fullDob : profileData.dob}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                <p className="mt-1 font-medium">{showPersonalInfo ? profileData.fullEmail : profileData.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Mobile Number</h3>
                <p className="mt-1 font-medium">{showPersonalInfo ? profileData.fullMobile : profileData.mobile}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="mt-1 font-medium">{showPersonalInfo ? profileData.fullAddress : profileData.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">PAN</h3>
                <p className="mt-1 font-medium">{showPersonalInfo ? profileData.fullPan : profileData.pan}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Aadhar</h3>
                <p className="mt-1 font-medium">{showPersonalInfo ? profileData.fullAadhar : profileData.aadhar}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Customer Since</h3>
              <p className="mt-1 font-medium">{profileData.customerSince}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 px-6 py-4">
          <Button
            className="w-full bg-[#FFB100] text-[#1C3E94] hover:bg-[#ffa200]"
            onClick={() => setShowChangeDialog(true)}
          >
            Request Profile Change
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="bg-[#1C3E94] text-white rounded-t-lg">
          <CardTitle className="text-lg">Linked Devices</CardTitle>
          <CardDescription className="text-gray-200">Devices currently linked to your account</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {linkedDevices.map((device) => (
              <div key={device.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-gray-100">
                    {device.type === "mobile" ? (
                      <Smartphone className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Laptop className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-sm text-gray-500">Last used: {device.lastUsed}</p>
                    <p className="text-sm text-gray-500">Location: {device.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 px-6 py-4 text-sm text-gray-500">
          <div className="w-full text-center">
            <User className="inline-block h-4 w-4 mr-1" />
            <span>Only you can view and manage your linked devices</span>
          </div>
        </CardFooter>
      </Card>

      {/* Profile Change Request Dialog */}
      <Dialog open={showChangeDialog} onOpenChange={setShowChangeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Profile Change</DialogTitle>
            <DialogDescription>
              To update your profile information, please visit your nearest Indian Bank branch with valid ID proof.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              For security reasons, profile changes cannot be made online. Please visit any Indian Bank branch with
              your:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm text-gray-500">
              <li>Original Aadhar Card</li>
              <li>PAN Card</li>
              <li>One recent passport-sized photograph</li>
            </ul>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowChangeDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
