import { AppSidebar } from "../../components/app-sidebar"
import { DreamMoodPanel } from "../../components/dream-mood-panel"
import { DreamTypeChart } from "../../components/dream-type-chart"
import { DreamQuiz } from "../../components/dream-quiz"
import { DreamJournal } from "../../components/dream-journal"
import { DreamSymbols } from "../../components/dream-symbols"
import { SleepQuality } from "../../components/sleep-quality"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Erste Reihe: 3 Panels mit einheitlicher Höhe */}
              <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-3 lg:px-6">
                <div className="h-[400px]">
                  <DreamMoodPanel />
                </div>
                <div className="h-[400px]">
                  <SleepQuality />
                </div>
                <div className="h-[400px]">
                  <DreamSymbols />
                </div>
              </div>

              {/* Zweite Reihe: 2 Panels mit einheitlicher Höhe */}
              <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
                <div className="h-[550px]">
                  <DreamTypeChart />
                </div>
                <div className="h-[550px]">
                  <DreamQuiz />
                </div>
              </div>

              {/* Dritte Reihe: 1 Panel */}
              <div className="px-4 lg:px-6">
                <DreamJournal />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
