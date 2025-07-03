"use client"

import * as React from "react"

type UserContextType = {
  username: string
  setUsername: (name: string) => void
}

const UserContext = React.createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = React.useState<string>(() => {
    // Beim ersten Rendern prüfen, ob ein Name im localStorage gespeichert ist
    if (typeof window !== "undefined") {
      return localStorage.getItem("username") || "NAME"
    }
    return "NAME"
  })

  // Username im localStorage speichern, wenn er sich ändert
  React.useEffect(() => {
    localStorage.setItem("username", username)
  }, [username])

  return <UserContext.Provider value={{ username, setUsername }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
