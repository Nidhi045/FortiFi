"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface Transaction {
  id: number
  description: string
  amount: number
  date: string
  time: string
  type: "credit" | "debit"
}

interface Account {
  accountNumber: string
  fullAccountNumber: string
  type: string
  ifsc: string
  balance: number
  transactions: Transaction[]
}

interface AccountContextType {
  account: Account
  addTransaction: (transaction: Omit<Transaction, "id" | "date" | "time">) => void
  getBalance: () => number
  getRecentTransactions: (limit?: number) => Transaction[]
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

const initialAccount: Account = {
  accountNumber: "6789XXXX1234",
  fullAccountNumber: "6789543211234",
  type: "Savings Account",
  ifsc: "IDIB000C123",
  balance: 124567.89,
  transactions: [
    {
      id: 1,
      description: "UPI Payment to Priya Patel",
      amount: 2500.00,
      date: "April 19, 2025",
      time: "09:15 AM",
      type: "debit",
    },
    {
      id: 2,
      description: "Salary Credit - TechSolutions India Pvt Ltd",
      amount: 45000.00,
      date: "April 15, 2025",
      time: "10:30 AM",
      type: "credit",
    },
    {
      id: 3,
      description: "ATM Withdrawal - Andheri Branch",
      amount: 10000.00,
      date: "April 12, 2025",
      time: "03:45 PM",
      type: "debit",
    },
    {
      id: 4,
      description: "Electricity Bill - Tata Power",
      amount: 1450.00,
      date: "April 10, 2025",
      time: "11:20 AM",
      type: "debit",
    },
    {
      id: 5,
      description: "UPI Payment from Vikram Singh",
      amount: 5000.00,
      date: "April 05, 2025",
      time: "02:30 PM",
      type: "credit",
    },
  ],
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account>(initialAccount)

  const addTransaction = (transaction: Omit<Transaction, "id" | "date" | "time">) => {
    const now = new Date()
    const newTransaction: Transaction = {
      ...transaction,
      id: account.transactions.length + 1,
      date: now.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    }

    const newBalance = transaction.type === "credit" 
      ? account.balance + transaction.amount 
      : account.balance - transaction.amount

    setAccount(prev => ({
      ...prev,
      balance: newBalance,
      transactions: [newTransaction, ...prev.transactions],
    }))
  }

  const getBalance = () => account.balance

  const getRecentTransactions = (limit: number = 5) => 
    account.transactions.slice(0, limit)

  return (
    <AccountContext.Provider value={{ account, addTransaction, getBalance, getRecentTransactions }}>
      {children}
    </AccountContext.Provider>
  )
}

export function useAccount() {
  const context = useContext(AccountContext)
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider")
  }
  return context
} 