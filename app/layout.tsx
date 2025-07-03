import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { UserProvider } from "@/contexts/user-context"
import { DreamDataProvider } from "@/contexts/dream-data-context"

export const metadata: Metadata = {
  title: "Traum Dashboard",
  description: "Ein Dashboard zur Analyse deiner Träume",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-background text-foreground">
        <UserProvider>
          <DreamDataProvider>{children}</DreamDataProvider>
        </UserProvider>
      </body>
    </html>
  )
}
