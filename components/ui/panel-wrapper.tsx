"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface PanelWrapperProps {
  children: React.ReactNode
  className?: string
  gradient?: "purple" | "green" | "teal" | "cyan" | "pink" | "emerald"
  tag?: {
    icon: React.ElementType
    label: string
    color: string
  }
}

const gradientClasses = {
  purple: "from-purple-950/30 to-background",
  green: "from-blue-950/30 to-background",
  teal: "from-teal-950/30 to-background",
  cyan: "from-cyan-950/30 to-background",
  pink: "from-pink-950/30 to-background",
  emerald: "from-emerald-950/30 to-background",
}

export function PanelWrapper({ children, className, gradient = "purple", tag }: PanelWrapperProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-gradient-to-b h-full flex flex-col relative",
        gradientClasses[gradient],
        className,
      )}
    >
      {tag && (
        <div className="absolute right-4 top-4 z-10">
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs",
              "max-w-[120px] whitespace-nowrap overflow-hidden",
              tag.color,
            )}
          >
            <tag.icon className="size-3 shrink-0" />
            <span className="truncate">{tag.label}</span>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}
