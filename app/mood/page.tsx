"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { HeartIcon, TrendingUpIcon, CalendarIcon, BarChart3Icon, LineChartIcon } from "lucide-react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  Area,
  AreaChart,
  YAxis,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useDreamData } from "@/contexts/dream-data-context"
import { CustomTooltip } from "@/components/ui/custom-tooltip"
import { motion } from "framer-motion"

const MOOD_LABELS = {
  "very-positive": "Sehr positiv",
  positive: "Positiv",
  neutral: "Neutral",
  negative: "Negativ",
  "very-negative": "Sehr negativ",
} as const

const MOOD_COLORS = {
  "very-positive": "bg-green-500/20 text-green-500",
  positive: "bg-emerald-500/20 text-emerald-500",
  neutral: "bg-blue-500/20 text-blue-500",
  negative: "bg-amber-500/20 text-amber-500",
  "very-negative": "bg-red-500/20 text-red-500",
} as const

const MOOD_TO_VALUE = {
  "very-negative": 1,
  negative: 2,
  neutral: 3,
  positive: 4,
  "very-positive": 5,
} as const

type MoodKey = keyof typeof MOOD_LABELS

export default function MoodPage() {
  const { dreamData, updateMood } = useDreamData()
  const mood = dreamData.mood as MoodKey
  const [chartView, setChartView] = React.useState<"distribution" | "timeline">("timeline")

  const moodHistory = React.useMemo(
    () => [
      { date: "Vor 6 Tagen", mood: "positive", day: "Sa", fullDate: "15.06.2024" },
      { date: "Vor 5 Tagen", mood: "neutral", day: "So", fullDate: "16.06.2024" },
      { date: "Vor 4 Tagen", mood: "very-positive", day: "Mo", fullDate: "17.06.2024" },
      { date: "Vor 3 Tagen", mood: "negative", day: "Di", fullDate: "18.06.2024" },
      { date: "Vor 2 Tagen", mood: "positive", day: "Mi", fullDate: "19.06.2024" },
      { date: "Gestern", mood: "positive", day: "Do", fullDate: "20.06.2024" },
      { date: "Heute", mood: mood, day: "Fr", fullDate: "21.06.2024" },
    ],
    [mood],
  )

  const { chartData, timelineData, trendValue, distributionData } = React.useMemo(() => {
    const counts = Object.keys(MOOD_LABELS).reduce(
      (acc, key) => {
        acc[key as MoodKey] = moodHistory.filter((entry) => entry.mood === key).length
        return acc
      },
      {} as Record<MoodKey, number>,
    )

    const chartData = Object.entries(MOOD_LABELS).map(([key, name]) => ({
      name,
      value: counts[key as MoodKey],
      color:
        key === "very-positive"
          ? "#22c55e"
          : key === "positive"
            ? "#10b981"
            : key === "neutral"
              ? "#3b82f6"
              : key === "negative"
                ? "#f59e0b"
                : "#ef4444",
      key,
    }))

    const timelineData = moodHistory.map((entry, index) => ({
      ...entry,
      value: MOOD_TO_VALUE[entry.mood as MoodKey],
      index,
      color: chartData.find((d) => d.key === entry.mood)?.color || "#3b82f6",
    }))

    const recent = timelineData.slice(-3).map((entry) => entry.value)
    const older = timelineData.slice(-6, -3).map((entry) => entry.value)
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length
    const trendValue = recentAvg - olderAvg

    const distributionData = chartData.filter((d) => d.value > 0)

    return { chartData, timelineData, trendValue, distributionData }
  }, [moodHistory])

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
              <div className="p-4 rounded-2xl bg-green-500/20 border border-purple-500/30">
                <HeartIcon className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Stimmungsanalyse</h1>
                <p className="text-lg text-muted-foreground">Verfolge deine Traumstimmungen über die Zeit</p>
              </div>
            </div>

            {/* Karten */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <HeartIcon className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">Aktuelle Stimmung</span>
                </div>
                <div className="text-3xl font-bold">{MOOD_LABELS[mood]}</div>
                <div
                  className={`text-sm mt-2 ${trendValue > 0.5 ? "text-green-500" : trendValue < -0.5 ? "text-red-500" : "text-muted-foreground"}`}
                >
                  {trendValue > 0.5
                    ? "↗ Deutliche Verbesserung"
                    : trendValue > 0
                      ? "↗ Leichte Verbesserung"
                      : trendValue < -0.5
                        ? "↘ Deutliche Verschlechterung"
                        : trendValue < 0
                          ? "↘ Leichte Verschlechterung"
                          : "→ Stabil"}
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUpIcon className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">Durchschnitt (7 Tage)</span>
                </div>
                <div className="text-3xl font-bold">
                  {(timelineData.reduce((sum, entry) => sum + entry.value, 0) / timelineData.length).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground mt-2">von 5.0</div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CalendarIcon className="h-5 w-5 text-blue-400" />
                  <span className="text-sm text-muted-foreground">Beste Stimmung</span>
                </div>
                <div className="text-3xl font-bold">Mo</div>
                <div className="text-sm text-muted-foreground mt-2">Sehr positiv</div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3Icon className="h-5 w-5 text-amber-400" />
                  <span className="text-sm text-muted-foreground">Häufigste Stimmung</span>
                </div>
                <div className="text-3xl font-bold">Positiv</div>
                <div className="text-sm text-muted-foreground mt-2">3x diese Woche</div>
              </div>
            </div>

            {/* Stimmungs-Auswahl */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-semibold mb-4">Stimmung eingeben</h3>
              <div className="flex justify-center">
                <div className="flex gap-4">
                  {Object.entries(MOOD_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      className={`h-16 w-16 rounded-full cursor-pointer transition-all hover:scale-110 flex items-center justify-center ${
                        mood === key ? MOOD_COLORS[key as MoodKey] : "bg-muted hover:bg-muted/80"
                      }`}
                      onClick={() => updateMood(key)}
                      title={label}
                    >
                      <span className="text-2xl">
                        {key === "very-positive"
                          ? "😄"
                          : key === "positive"
                            ? "😊"
                            : key === "neutral"
                              ? "😐"
                              : key === "negative"
                                ? "😔"
                                : "😢"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-center mt-4 gap-8 text-sm text-muted-foreground">
                <span>Sehr negativ</span>
                <span>Sehr positiv</span>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Timeline Chart */}
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Stimmungsverlauf</h3>
                  <button
                    onClick={() => setChartView(chartView === "timeline" ? "distribution" : "timeline")}
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm bg-muted text-muted-foreground hover:bg-muted/80"
                  >
                    {chartView === "timeline" ? (
                      <BarChart3Icon className="size-4" />
                    ) : (
                      <LineChartIcon className="size-4" />
                    )}
                    {chartView === "timeline" ? "Verteilung" : "Verlauf"}
                  </button>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartView === "timeline" ? (
                      <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <defs>
                          <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis domain={[1, 5]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <CustomTooltip />
                        <ReferenceLine
                          y={timelineData.reduce((sum, entry) => sum + entry.value, 0) / timelineData.length}
                          stroke="#666"
                          strokeDasharray="3 3"
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#8b5cf6"
                          fillOpacity={1}
                          fill="url(#moodGradient)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    ) : (
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <CustomTooltip />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#8b5cf6" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Distribution Chart */}
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-xl font-semibold mb-4">Stimmungsverteilung</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <CustomTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Historie */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-semibold mb-4">Stimmungshistorie</h3>
              <div className="space-y-3">
                {moodHistory.reverse().map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {entry.mood === "very-positive"
                          ? "😄"
                          : entry.mood === "positive"
                            ? "😊"
                            : entry.mood === "neutral"
                              ? "😐"
                              : entry.mood === "negative"
                                ? "😔"
                                : "😢"}
                      </div>
                      <div>
                        <div className="font-medium">{entry.fullDate}</div>
                        <div className="text-sm text-muted-foreground">{entry.date}</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${MOOD_COLORS[entry.mood as MoodKey]}`}>
                      {MOOD_LABELS[entry.mood as MoodKey]}
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
