"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { MoonIcon, StarIcon, TrendingUpIcon, ClockIcon, ZapIcon } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts"
import { useDreamData } from "@/contexts/dream-data-context"
import { CustomTooltip } from "@/components/ui/custom-tooltip"
import { motion } from "framer-motion"

const QUALITY_RANGES = {
  excellent: { min: 80, label: "Ausgezeichnet", color: "text-green-500 bg-green-500/20" },
  good: { min: 60, label: "Gut", color: "text-emerald-500 bg-emerald-500/20" },
  fair: { min: 40, label: "Mittelmäßig", color: "text-blue-500 bg-blue-500/20" },
  poor: { min: 20, label: "Schlecht", color: "text-amber-500 bg-amber-500/20" },
  very_poor: { min: 0, label: "Sehr schlecht", color: "text-red-500 bg-red-500/20" },
} as const

export default function SleepQualityPage() {
  const { dreamData, updateSleepQuality } = useDreamData()
  const [quality, setQuality] = React.useState(dreamData.sleepQuality)

  const qualityHistory = React.useMemo(
    () => [
      {
        date: "Vor 6 Tagen",
        quality: 65,
        day: "Sa",
        fullDate: "15.06.2024",
        tiefschlaf: 70,
        rem: 60,
        leichtschlaf: 120,
        wach: 15,
      },
      {
        date: "Vor 5 Tagen",
        quality: 75,
        day: "So",
        fullDate: "16.06.2024",
        tiefschlaf: 80,
        rem: 70,
        leichtschlaf: 110,
        wach: 10,
      },
      {
        date: "Vor 4 Tagen",
        quality: 40,
        day: "Mo",
        fullDate: "17.06.2024",
        tiefschlaf: 45,
        rem: 35,
        leichtschlaf: 140,
        wach: 25,
      },
      {
        date: "Vor 3 Tagen",
        quality: 60,
        day: "Di",
        fullDate: "18.06.2024",
        tiefschlaf: 65,
        rem: 55,
        leichtschlaf: 125,
        wach: 20,
      },
      {
        date: "Vor 2 Tagen",
        quality: 85,
        day: "Mi",
        fullDate: "19.06.2024",
        tiefschlaf: 90,
        rem: 80,
        leichtschlaf: 100,
        wach: 5,
      },
      {
        date: "Gestern",
        quality: 70,
        day: "Do",
        fullDate: "20.06.2024",
        tiefschlaf: 75,
        rem: 65,
        leichtschlaf: 115,
        wach: 12,
      },
      {
        date: "Heute",
        quality: quality,
        day: "Fr",
        fullDate: "21.06.2024",
        tiefschlaf: 80,
        rem: 70,
        leichtschlaf: 105,
        wach: 8,
      },
    ],
    [quality],
  )

  const getQualityInfo = React.useCallback((value: number) => {
    const range = Object.values(QUALITY_RANGES).find((r) => value >= r.min) || QUALITY_RANGES.very_poor
    return range
  }, [])

  const qualityInfo = getQualityInfo(quality)
  const averageQuality = qualityHistory.reduce((sum, entry) => sum + entry.quality, 0) / qualityHistory.length

  const saveQuality = React.useCallback(() => {
    updateSleepQuality(quality)
  }, [quality, updateSleepQuality])

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-blue-500/20 border border-blue-500/30">
                <MoonIcon className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Schlafqualität</h1>
                <p className="text-lg text-muted-foreground">Analysiere und verbessere deinen Schlaf</p>
              </div>
            </div>

            {/* Stat */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <MoonIcon className="h-5 w-5 text-blue-400" />
                  <span className="text-sm text-muted-foreground">Letzte Nacht</span>
                </div>
                <div className="text-3xl font-bold">{quality}%</div>
                <div className={`text-sm mt-2 px-2 py-1 rounded-md ${qualityInfo.color}`}>{qualityInfo.label}</div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUpIcon className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">Durchschnitt (7 Tage)</span>
                </div>
                <div className="text-3xl font-bold">{averageQuality.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground mt-2">{getQualityInfo(averageQuality).label}</div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <ClockIcon className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">Beste Nacht</span>
                </div>
                <div className="text-3xl font-bold">85%</div>
                <div className="text-sm text-muted-foreground mt-2">Mittwoch</div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <ZapIcon className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">Trend</span>
                </div>
                <div className="text-3xl font-bold">↗</div>
                <div className="text-sm text-green-500 mt-2">Verbesserung</div>
              </div>
            </div>

            {/* Qualitäts Eingabe */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-semibold mb-4">Schlafqualität bewerten</h3>
              <div className="space-y-6">
                {/* Slider */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Schlecht</span>
                    <span className="text-2xl font-bold">{quality}%</span>
                    <span className="text-sm text-muted-foreground">Ausgezeichnet</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number.parseInt(e.target.value))}
                    className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #ef4444 0%, #f59e0b 25%, #3b82f6 50%, #10b981 75%, #22c55e 100%)`,
                    }}
                  />
                </div>

                {/* Sterne */}
                <div className="flex justify-center">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`h-10 w-10 cursor-pointer transition-all hover:scale-110 ${
                          star <= Math.round(quality / 20)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-muted hover:text-yellow-300"
                        }`}
                        onClick={() => setQuality(star * 20)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={saveQuality}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Qualität speichern
                  </button>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quality Zeitlinie */}
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-xl font-semibold mb-4">Qualitätsverlauf</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={qualityHistory} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <defs>
                        <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <CustomTooltip />
                      <Area
                        type="monotone"
                        dataKey="quality"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorQuality)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Schlafphasen */}
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-xl font-semibold mb-4">Schlafphasen (letzte Nacht)</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Tiefschlaf",
                          value: qualityHistory[qualityHistory.length - 1].tiefschlaf,
                          color: "#1e40af",
                        },
                        { name: "REM-Schlaf", value: qualityHistory[qualityHistory.length - 1].rem, color: "#7c3aed" },
                        {
                          name: "Leichtschlaf",
                          value: qualityHistory[qualityHistory.length - 1].leichtschlaf,
                          color: "#06b6d4",
                        },
                        { name: "Wach", value: qualityHistory[qualityHistory.length - 1].wach, color: "#ef4444" },
                      ]}
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    >
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <CustomTooltip />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Historie */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-semibold mb-4">Schlafhistorie</h3>
              <div className="space-y-3">
                {qualityHistory.reverse().map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {entry.quality >= 80 ? "😴" : entry.quality >= 60 ? "😊" : entry.quality >= 40 ? "😐" : "😴"}
                      </div>
                      <div>
                        <div className="font-medium">{entry.fullDate}</div>
                        <div className="text-sm text-muted-foreground">{entry.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{entry.quality}%</div>
                        <div className="text-sm text-muted-foreground">
                          T: {entry.tiefschlaf}min | R: {entry.rem}min
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${getQualityInfo(entry.quality).color}`}>
                        {getQualityInfo(entry.quality).label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
