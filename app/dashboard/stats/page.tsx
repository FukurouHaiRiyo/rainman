'use client'

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { useFirebaseData } from '@/app/lib/firebase'
import { useEffect, useState } from 'react'

type DailyStats = {
  label: string
  deliveries: number
  pickups: number
  delays: number
}

export default function StatsOverview() {
  const { data: orders, loading } = useFirebaseData('orders')
  const [chartData, setChartData] = useState<DailyStats[]>([])

  useEffect(() => {
    if (!orders || loading) return

    // Procesăm comenzile pentru a obține statistici zilnice
    const statsMap: Record<string, DailyStats> = {}

    orders.forEach((order: any) => {
      const date = new Date(order.date || order.scheduledDate)
      const label = date.toISOString().split('T')[0].slice(5) // ex: '06-13'
      const type = order.type || 'inbound'
      const isDelayed = order.delayed || false

      if (!statsMap[label]) {
        statsMap[label] = {
          label,
          deliveries: 0,
          pickups: 0,
          delays: 0
        }
      }

      if (type === 'outbound') statsMap[label].deliveries++
      else statsMap[label].pickups++

      if (isDelayed) statsMap[label].delays++
    })

    // Convertim obiectul într-un array sortat cronologic
    const result = Object.values(statsMap).sort((a, b) => a.label.localeCompare(b.label))
    setChartData(result)
  }, [orders, loading])

  if (loading || chartData.length === 0) {
    return <p className='text-center text-muted-foreground'>Se încarcă statistici...</p>
  }

  return (
    <div className='w-full h-[350px]'>
      <h2 className='text-xl font-semibold mb-4'>Statistici Comenzi</h2>

      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={chartData}>
          <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
          <XAxis dataKey='label' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type='monotone' dataKey='deliveries' stroke='#4f46e5' name='Livrări' />
          <Line type='monotone' dataKey='pickups' stroke='#22c55e' name='Ridicări' />
          <Line type='monotone' dataKey='delays' stroke='#ef4444' name='Întârzieri' />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
