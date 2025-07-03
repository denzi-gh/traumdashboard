"use client"

import {
  BookIcon,
  BrainIcon,
  CloudMoonIcon,
  CompassIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  MoonStarIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
  SunMoonIcon,
  UsersIcon,
  ImageIcon,
  HeartIcon,
  MoonIcon,
  PieChartIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    avatar: "/placeholder.svg?height=40&width=40",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Dream Pass",
      url: "/dream-visualizer",
      icon: ImageIcon,
    },
    {
      title: "Stimmung",
      url: "/mood",
      icon: HeartIcon,
    },
    {
      title: "Schlafqualität",
      url: "/sleep-quality",
      icon: MoonIcon,
    },
    {
      title: "Traumsymbole",
      url: "/dream-symbols",
      icon: CompassIcon,
    },
    {
      title: "Traumarten",
      url: "/dream-types",
      icon: PieChartIcon,
    },
    {
      title: "Traumtagebuch",
      url: "/dream-journal",
      icon: BookIcon,
    },
    {
      title: "Traum Quiz",
      url: "/dream-quiz",
      icon: BrainIcon,
    }

  ],
  navClouds: [
    {
      title: "Luzide Träume",
      icon: MoonStarIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Techniken",
          url: "#",
        },
        {
          title: "Erfolge",
          url: "#",
        },
      ],
    },
    {
      title: "Albträume",
      icon: CloudMoonIcon,
      url: "#",
      items: [
        {
          title: "Bewältigung",
          url: "#",
        },
        {
          title: "Analyse",
          url: "#",
        },
      ],
    },
    {
      title: "Traumsymbole",
      icon: CompassIcon,
      url: "#",
      items: [
        {
          title: "Lexikon",
          url: "#",
        },
        {
          title: "Persönliche Symbole",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/" className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20 border border-purple-500/30">
                  <SunMoonIcon className="h-4 w-4 text-green-400" />
                </div>
                <span className="text-xl font-semibold">Traum Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
