"use client"

import type * as React from "react"

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  formatter?: (data: any) => React.ReactNode
}

export function CustomTooltip({ active, payload, label, formatter }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload

  return (
    <div className="bg-background border rounded-md p-3 shadow-lg max-w-xs">
      {formatter ? (
        formatter(data)
      ) : (
        <>
          {label && <p className="font-medium">{label}</p>}
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {entry.name}: {entry.value}
            </p>
          ))}
        </>
      )}
    </div>
  )
}
