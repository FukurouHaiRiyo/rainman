import type React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "@/context/user-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Warehouse Management System",
  description: "A comprehensive warehouse management system",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <UserProvider>{children}</UserProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
