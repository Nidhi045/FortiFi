"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Shield, CheckCircle, XCircle, AlertTriangle, Key, Lock, MessageSquare, Users, FileText, Wallet } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast, useToast } from "@/hooks/use-toast"
import { BlockchainLogs } from "@/components/blockchain-logs"

declare global {
  interface Window {
    ethereum?: any
  }
}

interface ForumPost {
  id: string
  title: string
  content: string
  author: string
  date: string
  likes: number
}

const initialForumPosts: ForumPost[] = [
  {
    id: "post1",
    title: "New Synthetic Identity Fraud Pattern",
    author: "Axis Bank Security Team",
    date: "2025-04-01T10:30:00Z",
    content:
      "We've detected a new pattern of synthetic identity fraud where fraudsters are combining real PAN cards with fake Aadhaar details. The pattern involves creating accounts with minimal KYC and then gradually building credit history before maxing out credit lines.",
    likes: 24,
  },
  {
    id: "post2",
    title: "UPI Fraud Alert - QR Code Manipulation",
    author: "HDFC Fraud Prevention",
    date: "2025-04-03T14:15:00Z",
    content:
      "There's an increasing trend of QR code manipulation where fraudsters are overlaying legitimate merchant QR codes with their own. We've seen this particularly in high-traffic areas like railway stations and shopping malls. Customers should verify the merchant name before completing transactions.",
    likes: 32,
  },
  {
    id: "post3",
    title: "Card Skimming at ATMs in Mumbai",
    author: "SBI Security",
    date: "2025-04-05T09:45:00Z",
    content:
      "We've identified several ATMs in Mumbai with sophisticated skimming devices. These devices are nearly invisible and capture both card data and PIN. We recommend banks increase physical inspections of ATMs and customers to use contactless withdrawals where available.",
    likes: 18,
  },
]

export function IdentityVault() {
  const { toast } = useToast()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("security")
  const [newPost, setNewPost] = useState({ title: "", content: "" })
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(initialForumPosts)
  const [securityFeatures, setSecurityFeatures] = useState([
    {
      name: "Credential Encryption",
      enabled: true,
      description: "Your credentials are encrypted with AES-256 encryption",
    },
    {
      name: "Blockchain Verification",
      enabled: true,
      description: "Your identity is verified on the blockchain",
    },
    {
      name: "Dark Web Monitoring",
      enabled: false,
      description: "Continuous monitoring for your credentials on the dark web",
    },
    {
      name: "Biometric Authentication",
      enabled: true,
      description: "Your account is protected with biometric authentication",
    },
    {
      name: "Smart Contract Protection",
      enabled: false,
      description: "Automated smart contracts to protect your digital assets",
    },
  ])

  // Sample identity security data
  const securityScore = 85
  const lastScan = new Date().toISOString();

  // Sample forum posts

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            setWalletAddress(accounts[0])
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }
    }

    checkWalletConnection()
  }, [])

  // Connect to MetaMask wallet
  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to connect your wallet")
      return
    }

    try {
      setIsLoading(true)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setWalletAddress(accounts[0])
    } catch (error) {
      console.error("Error connecting wallet:", error)
      alert("Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }

  const handleScan = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Identity scan complete",
        description: "Your digital identity is secure. No compromised credentials found.",
      })
    }, 2500)
  }

  const handleToggleFeature = (index: number) => {
    const updatedFeatures = [...securityFeatures]
    updatedFeatures[index].enabled = !updatedFeatures[index].enabled
    setSecurityFeatures(updatedFeatures)

    toast({
      title: updatedFeatures[index].enabled ? "Feature enabled" : "Feature disabled",
      description: `${updatedFeatures[index].name} has been ${updatedFeatures[index].enabled ? "enabled" : "disabled"}.`,
    })
  }

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!walletAddress) {
      alert("Please connect your wallet first")
      return
    }

    try {
      setIsLoading(true)
      
      // In a real app, you would send this to your backend/blockchain
      // Here we're just simulating the process
      const newPattern: ForumPost = {
        id: Date.now().toString(),
        title: newPost.title,
        content: newPost.content,
        author: `User ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        date: new Date().toISOString(),
        likes: 0,
      }

      setForumPosts([newPattern, ...forumPosts])
      setNewPost({ title: "", content: "" })
      
      // Simulate ZKP processing delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert("Fraud pattern shared successfully with ZKP protection")
    } catch (error) {
      console.error("Error sharing pattern:", error)
      alert("Failed to share fraud pattern")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateKeys = () => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "New identity keys generated",
        description: "Your identity keys have been regenerated successfully.",
      })
    }, 2000)
  }

  const handleBackupIdentity = () => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Identity backup complete",
        description: "Your identity has been securely backed up to encrypted storage.",
      })
    }, 2000)
  }

  return (
    <Tabs suppressHydrationWarning value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="security">Identity Security</TabsTrigger>
        <TabsTrigger value="forum">Fraud Pattern Forum</TabsTrigger>
      </TabsList>

      <TabsContent value="security" className="space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Identity Security Score: {securityScore}%</h2>
          <Progress value={securityScore} className="w-full max-w-md" />
          <p suppressHydrationWarning className="text-sm text-muted-foreground">Last scan: {new Date(lastScan).toLocaleString("en-IN")}</p>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Security Features</h3>
          <div className="space-y-4">
            {securityFeatures.map((feature, index) => (
              <div key={feature.name} className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center">
                    {feature.enabled ? (
                      <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{feature.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
                <Button
                  variant={feature.enabled ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleToggleFeature(index)}
                >
                  {feature.enabled ? "Disable" : "Enable"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="forum" className="space-y-6">
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-medium">Fraud Pattern Repository</h3>
    <Button size="sm" onClick={handleConnectWallet}>
      <Wallet className="mr-2 h-4 w-4" />
      {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
    </Button>
  </div>

  <Card>
    <CardHeader>
      <CardTitle>Share a Fraud Pattern</CardTitle>
      <CardDescription>Share fraud patterns securely with other banks using Zero-Knowledge Proof</CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handlePostSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            placeholder="Fraud pattern title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="content"
            placeholder="Describe the fraud pattern in detail..."
            rows={4}
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            required
          />
          <p className="text-xs text-muted-foreground">
            All sensitive data will be automatically anonymized using ZKP before sharing.
          </p>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading || !walletAddress}>
            {isLoading ? "Sharing..." : "Share Pattern"}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>

  <div className="space-y-4">
    <h3 className="text-lg font-medium">Recent Fraud Patterns</h3>

    {forumPosts.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No fraud patterns shared yet</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Be the first to share a fraud pattern with the community.
        </p>
      </div>
    ) : (
      forumPosts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                  Posted by {post.author} • {new Date(post.date).toLocaleDateString("en-IN")}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="flex items-center">
                  <FileText className="mr-1 h-4 w-4" />
                  {post.likes}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{post.content}</p>
          </CardContent>
        </Card>
      ))
    )}
  </div>
</TabsContent>

      <TabsContent value="logs">
        <BlockchainLogs />
      </TabsContent>
    </Tabs>
  )
}
