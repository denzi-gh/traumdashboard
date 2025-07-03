"use client"

import type React from "react"
import Link from "next/link"

import { MailIcon, PlusCircleIcon } from "lucide-react"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ElementType
  }[]
}) {
  return (
    <div className="relative flex w-full min-w-0 flex-col p-2">
      <div className="w-full text-sm flex flex-col gap-2">
        <ul className="flex w-full min-w-0 flex-col gap-1">
          <li className="flex items-center gap-2">
          </li>
        </ul>
        <ul className="flex w-full min-w-0 flex-col gap-1">
          {items.map((item) => (
            <li key={item.title} className="group/menu-item relative">
              {item.url.startsWith("#") ? (
                <button className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0">
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </button>
              ) : (
                <Link
                  href={item.url}
                  className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-xl outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
