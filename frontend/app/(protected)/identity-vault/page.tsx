import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IdentityVault } from "@/components/identity-vault"
import { CredentialChecker } from "@/components/credential-checker"
import { BlockchainLogs } from "@/components/blockchain-logs"

export const metadata: Metadata = {
  title: "Web3 Identity Vault | Secure Banking",
  description: "Check for compromised credentials and secure your digital identity",
}

export default function IdentityVaultPage() {
  return (
    <div suppressHydrationWarning className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Web3 Identity Vault</h1>
        <p className="text-muted-foreground">Secure your digital identity and check for compromised credentials</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Identity Security Status</CardTitle>
            <CardDescription>Your digital identity protection status and security measures</CardDescription>
          </CardHeader>
          <CardContent>
            <IdentityVault />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credential Checker</CardTitle>
            <CardDescription>Check if your user's credentials have been compromised in data breaches</CardDescription>
          </CardHeader>
          <CardContent>
            <CredentialChecker />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blockchain Security Logs</CardTitle>
          <CardDescription>Live Web3 blockchain logs of flagged stolen credentials across banks</CardDescription>
        </CardHeader>
        <CardContent>
          <BlockchainLogs />
        </CardContent>
      </Card>
    </div>
  )
}

