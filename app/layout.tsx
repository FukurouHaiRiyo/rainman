import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { auth } from "@clerk/nextjs/server"
import { Toaster } from "@/components/ui/toaster"

import Footer from "@/components/Footer";
import Header from "@/components/Header/page";
import "../styles/index.css";
import { Providers } from "./provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Warehouse Management System",
  description: "A comprehensive warehouse management system",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {userId ? (
            <Providers>
              {children}
              <Toaster />

            </Providers>
          ): (
            <Providers>
              <Header />
              {children}
              <Toaster />
              <Footer />
            </Providers>
          )}
        </body>
      </html>
    </ClerkProvider>
  )
}
