import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { UserProvider } from "@/components/contexts/user-context"
import ReactQueryProvider from "./providers/QueryClientProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Expense Tracker Dashboard",
  description: "Track and manage your expenses efficiently",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
         <ReactQueryProvider>
              <UserProvider>
                {children}
              </UserProvider>
          </ReactQueryProvider>
      </body>
    </html>
  )
}
