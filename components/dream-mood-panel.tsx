"use client"

import * as React from "react"
import { HeartIcon, PlusIcon } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, Area, AreaChart, YAxis, ReferenceLine } from "recharts"
import { useDreamData } from "@/contexts/dream-data-context"
import { PanelWrapper } from "./ui/panel-wrapper"
import { CustomTooltip } from "./ui/custom-tooltip"

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

export function DreamMoodPanel() {
  const { dreamData, updateMood } = useDreamData()
  const mood = dreamData.mood as MoodKey
  const [chartView, setChartView] = React.useState<"distribution" | "timeline">("timeline")

  // Vereinfachte Stimmungshistorie
  const moodHistory = React.useMemo(
    () => [
      { date: "Vor 6 Tagen", mood: "positive", day: "Sa" },
      { date: "Vor 5 Tagen", mood: "neutral", day: "So" },
      { date: "Vor 4 Tagen", mood: "very-positive", day: "Mo" },
      { date: "Vor 3 Tagen", mood: "negative", day: "Di" },
      { date: "Vor 2 Tagen", mood: "positive", day: "Mi" },
      { date: "Gestern", mood: "positive", day: "Do" },
      { date: "Heute", mood: mood, day: "Fr" },
    ],
    [mood],
  )

  // Berechne Chart-Daten
  const { chartData, timelineData, trendValue } = React.useMemo(() => {
    // Verteilungsdaten
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

    // Timeline-Daten
    const timelineData = moodHistory.map((entry, index) => ({
      ...entry,
      value: MOOD_TO_VALUE[entry.mood as MoodKey],
      index,
      color: chartData.find((d) => d.key === entry.mood)?.color || "#3b82f6",
    }))

    // Trend berechnen
    const recent = timelineData.slice(-3).map((entry) => entry.value)
    const older = timelineData.slice(-6, -3).map((entry) => entry.value)
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length
    const trendValue = recentAvg - olderAvg

    return { chartData, timelineData, trendValue }
  }, [moodHistory])

  const handleSave = React.useCallback(() => {
    updateMood(mood)
  }, [mood, updateMood])

  const tooltipFormatter = React.useCallback(
    (data: any) => (
      <>
        <p className="font-medium">{data.name || `${data.day} - ${data.date}`}</p>
        <p className="text-sm text-muted-foreground">
          {chartView === "distribution" ? `Anzahl: ${data.value}` : `Stimmung: ${MOOD_LABELS[data.mood as MoodKey]}`}
        </p>
        <p className="text-xs text-muted-foreground">Klicken für Details</p>
      </>
    ),
    [chartView],
  )

  return (
    <PanelWrapper
      gradient="green"
      tag={{
        icon: HeartIcon,
        label: "Stimmung",
        color: "bg-green-500/20 text-green-500",
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Letzte Traumstimmung</div>
            <div className="text-2xl font-semibold md:text-3xl">{MOOD_LABELS[mood]}</div>

            <div
              className={`text-sm mt-1 ${
                trendValue > 0.5 ? "text-green-500" : trendValue < -0.5 ? "text-red-500" : "text-muted-foreground"
              }`}
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
        </div>

        {/* Stimmungs-Auswahl */}
        <div className="flex justify-center mb-4">
          <div className="flex gap-2">
            {Object.entries(MOOD_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={`h-8 w-8 rounded-full cursor-pointer transition-all hover:scale-110 ${
                  mood === key ? MOOD_COLORS[key as MoodKey] : "bg-muted hover:bg-muted/80"
                }`}
                onClick={() => updateMood(key)}
                title={label}
                aria-label={`Stimmung auf ${label} setzen`}
              />
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-[140px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === "distribution" ? (
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.split(" ")[0]}
                />
                <CustomTooltip formatter={tooltipFormatter} />

                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#8b5cf6" />
              </BarChart>
            ) : (
              <AreaChart data={timelineData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis domain={[1, 5]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <CustomTooltip formatter={tooltipFormatter} />

                <ReferenceLine
                  y={timelineData.reduce((sum, entry) => sum + entry.value, 0) / timelineData.length}
                  stroke="#666"
                  strokeDasharray="3 3"
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#moodGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Letzte Einträge */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Letzte Einträge:</h4>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {moodHistory
              .slice(-3)
              .reverse()
              .map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm hover:bg-muted/50 rounded p-1 transition-colors cursor-pointer"
                  onClick={() => updateMood(entry.mood)}
                >
                  <span>{entry.date}</span>
                  <div className={`px-2 py-1 rounded-md text-xs ${MOOD_COLORS[entry.mood as MoodKey]}`}>
                    {MOOD_LABELS[entry.mood as MoodKey]}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between p-6 pt-2 mt-auto">
        <span className="text-sm text-muted-foreground">Letzte Aktualisierung: Heute</span>
        <button
          className="inline-flex h-9 items-center justify-center gap-1 rounded-md border bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={handleSave}
        >
          <PlusIcon className="h-4 w-4" />
          Hinzufügen
        </button>
      </div>
    </PanelWrapper>
  )
}
