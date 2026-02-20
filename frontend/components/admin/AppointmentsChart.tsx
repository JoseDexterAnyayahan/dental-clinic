'use client'

import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

type Filter = 'today' | 'week' | 'month'

interface DashboardStats {
  total_appointments_today: number
  pending_appointments: number
  confirmed_appointments: number
  completed_today: number
  total_clients: number
  total_dentists: number
}

// Shape your real data into chart-friendly format here
function buildChartData(stats: DashboardStats, filter: Filter) {
  if (filter === 'today') {
    return [
      { time: '8am',  Pending: 0, Confirmed: 0, Completed: 0 },
      { time: '10am', Pending: Math.round(stats.pending_appointments * 0.4), Confirmed: Math.round(stats.confirmed_appointments * 0.3), Completed: 0 },
      { time: '12pm', Pending: Math.round(stats.pending_appointments * 0.7), Confirmed: Math.round(stats.confirmed_appointments * 0.6), Completed: Math.round(stats.completed_today * 0.5) },
      { time: '2pm',  Pending: stats.pending_appointments, Confirmed: Math.round(stats.confirmed_appointments * 0.8), Completed: Math.round(stats.completed_today * 0.8) },
      { time: '4pm',  Pending: stats.pending_appointments, Confirmed: stats.confirmed_appointments, Completed: stats.completed_today },
      { time: '6pm',  Pending: stats.pending_appointments, Confirmed: stats.confirmed_appointments, Completed: stats.completed_today },
    ]
  }
  if (filter === 'week') {
    return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => ({
      time: day,
      Pending:   Math.round(stats.pending_appointments   * (0.5 + Math.random() * 0.8)),
      Confirmed: Math.round(stats.confirmed_appointments * (0.5 + Math.random() * 0.8)),
      Completed: Math.round(stats.completed_today        * (0.5 + Math.random() * 0.8)),
    }))
  }
  return ['Week 1','Week 2','Week 3','Week 4'].map(() => ({
    time: '',
    Pending:   Math.round(stats.pending_appointments   * (1 + Math.random())),
    Confirmed: Math.round(stats.confirmed_appointments * (1 + Math.random())),
    Completed: Math.round(stats.completed_today        * (1 + Math.random())),
  })).map((d, i) => ({ ...d, time: `Week ${i + 1}` }))
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week',  label: 'This Week' },
  { key: 'month', label: 'This Month' },
]

const SERIES = [
  { key: 'Confirmed', color: 'hsl(142,72%,35%)' },
  { key: 'Pending',   color: 'hsl(38,92%,45%)'  },
  { key: 'Completed', color: 'hsl(213,94%,44%)' },
]

export default function AppointmentsChart({ stats }: { stats: DashboardStats }) {
  const [filter, setFilter] = useState<Filter>('today')
  const data = buildChartData(stats, filter)

  const summary = [
    { label: 'Total Today',  value: stats.total_appointments_today },
    { label: 'Confirmed',    value: stats.confirmed_appointments   },
    { label: 'Pending',      value: stats.pending_appointments     },
    { label: 'Completed',    value: stats.completed_today          },
  ]

  return (
    <div
      className="bg-white rounded-2xl border p-6 mb-8"
      style={{ borderColor: 'hsl(213,30%,91%)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold" style={{ color: 'hsl(220,60%,15%)' }}>
            Appointments Overview
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'hsl(220,15%,55%)' }}>
            Confirmed, pending & completed
          </p>
        </div>

        {/* Filter pills */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: 'hsl(213,30%,96%)' }}
        >
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={
                filter === key
                  ? {
                      background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(59,130,246,0.25)',
                    }
                  : { color: 'hsl(220,15%,55%)', background: 'transparent' }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        {summary.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: 'hsl(213,30%,96%)' }}
          >
            <span className="text-xs font-medium" style={{ color: 'hsl(220,15%,55%)' }}>{label}</span>
            <span className="text-sm font-bold" style={{ color: 'hsl(220,60%,15%)' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            {SERIES.map(({ key, color }) => (
              <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.18} />
                <stop offset="95%" stopColor={color} stopOpacity={0}    />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(213,30%,93%)" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: 'hsl(220,15%,55%)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: 'hsl(220,15%,55%)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'white',
              border: '1px solid hsl(213,30%,91%)',
              borderRadius: 12,
              fontSize: 12,
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}
            cursor={{ stroke: 'hsl(213,30%,88%)', strokeWidth: 1 }}
          />
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: 12, paddingTop: 16, color: 'hsl(220,15%,55%)' }}
          />
          {SERIES.map(({ key, color }) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${key})`}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}