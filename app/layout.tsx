import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { Toaster } from "@/components/ui/toaster"

import Footer from "@/components/Footer";
import Header from "@/components/Header/page";
import { Providers } from "./provider"
import { FirebaseAuthProvider } from "@/context/firebase-auth-context"

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
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}`}>
          {userId ? (
            <>
              <FirebaseAuthProvider>
                {children}
                <Toaster />
              </FirebaseAuthProvider>
            </>
          ): (
            <>
              <Header />
              <FirebaseAuthProvider>
                {children}
              </FirebaseAuthProvider>
              <Toaster />
              <Footer />
            </>
          )}
        </body>
      </html>
    </ClerkProvider>
  )
}
