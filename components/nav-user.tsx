"use client"

import { MoreVerticalIcon } from "lucide-react"
import { useUser } from "@/contexts/user-context"

export function NavUser({
  user,
}: {
  user: {
    avatar: string
  }
}) {
  const { username } = useUser()

  return (
    <ul className="flex w-full min-w-0 flex-col gap-1">
      <li className="group/menu-item relative">
        <button className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground size-lg flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0">
          <div className="h-8 w-8 rounded-lg grayscale overflow-hidden">
            <img src={user.avatar || "/placeholder.svg"} alt={username} className="h-full w-full object-cover" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{username}</span>
          </div>
          <MoreVerticalIcon className="ml-auto size-4" />
        </button>
      </li>
    </ul>
  )
}
