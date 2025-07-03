"use client"

import { MoonStarIcon } from "lucide-react"
import { useUser } from "@/contexts/user-context"

export function SiteHeader() {
  const { username } = useUser()

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear bg-gradient-to-r from-green-950/20 to-background">
      <div className="flex w-full items-center gap-3 px-6 lg:px-8">
        {/* SidebarTrigger wird in der UI-Komponente definiert */}
        <div className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-panel-left"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <line x1="9" x2="9" y1="3" y2="21" />
          </svg>
          <span className="sr-only">Toggle Sidebar</span>
        </div>
        <div className="mx-3 h-6 w-px bg-border" />
        <h1 className="flex items-center gap-3 text-2xl font-bold">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 border border-green-500/30">
            <MoonStarIcon className="h-6 w-6 text-green-400" />
          </div>
          <span>
            Guten Morgen, <span className="text-green-400">{username}!</span>
          </span>
        </h1>
      </div>
    </header>
  )
}
