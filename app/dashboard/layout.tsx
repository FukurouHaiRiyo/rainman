import React from "react"
import { auth } from "@clerk/nextjs/server"
import { useUserRole } from "@/context/user-context"
import { redirect } from "next/navigation"
import { Sidebar1 } from "@/components/dashboard/sidebar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  const { role, isLoading } = useUserRole()

  // If not signed in, redirect to sign-in page
  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="flex h-screen">
      {role !== 'guest' ? (<Sidebar1 />): (null)}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
