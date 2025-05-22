"use client"

import { useEffect, useState } from "react"
import { useFirebaseData } from "@/app/lib/firebase"

export default function StatsOverview() {
  const { data: stats } = useFirebaseData("weeklyStats")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // This would be replaced with actual chart rendering using a library like recharts
  // For now, we'll create a simple visual representation
  return (
    <div className="w-full h-[300px] flex items-end justify-between gap-2">
      {stats
        ? stats.map((day: any, index: number) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-12 bg-primary/80 rounded-t-md" style={{ height: `${day.value * 2}px` }}></div>
              <div className="text-xs mt-2">{day.label}</div>
            </div>
          ))
        : Array(7)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-12 bg-muted rounded-t-md" style={{ height: `${Math.random() * 100 + 50}px` }}></div>
                <div className="text-xs mt-2">Day {index + 1}</div>
              </div>
            ))}
    </div>
  )
}
