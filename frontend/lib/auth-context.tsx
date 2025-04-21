"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

export interface AccountDetails {
  accountNumber: string
  accountType: string
  ifscCode: string
  balance: string
  lastLogin: string
  name: string
}

export interface AuthState {
  isAuthenticated: boolean
  accountType: 'real' | 'phantom' | null
  accountDetails: AccountDetails | null
}

interface AuthContextType {
  authState: AuthState
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
}

const defaultState: AuthState = {
  isAuthenticated: false,
  accountType: null,
  accountDetails: null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(defaultState)

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  )
} 