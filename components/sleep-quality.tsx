"use client"

import * as React from "react"
import { MoonIcon, StarIcon } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useDreamData } from "@/contexts/dream-data-context"
import { PanelWrapper } from "./ui/panel-wrapper"
import { CustomTooltip } from "./ui/custom-tooltip"

const QUALITY_RANGES = {
  excellent: { min: 80, label: "Ausgezeichnet", color: "text-green-500 bg-green-500/20" },
  good: { min: 60, label: "Gut", color: "text-emerald-500 bg-emerald-500/20" },
  fair: { min: 40, label: "Mittelmäßig", color: "text-blue-500 bg-blue-500/20" },
  poor: { min: 20, label: "Schlecht", color: "text-amber-500 bg-amber-500/20" },
  very_poor: { min: 0, label: "Sehr schlecht", color: "text-red-500 bg-red-500/20" },
} as const

export function SleepQuality() {
  const { dreamData, updateSleepQuality } = useDreamData()
  const [quality, setQuality] = React.useState(dreamData.sleepQuality)
  // Remove showDetails State-Variable: const [showDetails, setShowDetails] = React.useState(false)

  const qualityHistory = React.useMemo(
    () => [
      { date: "Vor 6 Tagen", quality: 65, day: "Sa", details: { tiefschlaf: 70, rem: 60 } },
      { date: "Vor 5 Tagen", quality: 75, day: "So", details: { tiefschlaf: 80, rem: 70 } },
      { date: "Vor 4 Tagen", quality: 40, day: "Mo", details: { tiefschlaf: 45, rem: 35 } },
      { date: "Vor 3 Tagen", quality: 60, day: "Di", details: { tiefschlaf: 65, rem: 55 } },
      { date: "Vor 2 Tagen", quality: 85, day: "Mi", details: { tiefschlaf: 90, rem: 80 } },
      { date: "Gestern", quality: 70, day: "Do", details: { tiefschlaf: 75, rem: 65 } },
      { date: "Heute", quality: quality, day: "Fr", details: { tiefschlaf: 80, rem: 70 } },
    ],
    [quality],
  )

  const getQualityInfo = React.useCallback((value: number) => {
    const range = Object.values(QUALITY_RANGES).find((r) => value >= r.min) || QUALITY_RANGES.very_poor
    return range
  }, [])

  const qualityInfo = getQualityInfo(quality)

  const saveQuality = React.useCallback(() => {
    updateSleepQuality(quality)
  }, [quality, updateSleepQuality])

  const tooltipFormatter = React.useCallback(
    (data: any) => (
      <>
        <p className="font-medium">
          {data.day} - {data.date}
        </p>
        <p className="text-sm text-muted-foreground">Qualität: {data.quality}%</p>
        <p className="text-xs">{getQualityInfo(data.quality).label}</p>
        {/* Remove showDetails condition and make details permanently visible */}
        {data.details && (
          <div className="mt-2 text-xs space-y-1">
            <div>Tiefschlaf: {data.details.tiefschlaf}%</div>
            <div>REM-Schlaf: {data.details.rem}%</div>
          </div>
        )}
      </>
    ),
    [getQualityInfo],
  )

  React.useEffect(() => {
    setQuality(dreamData.sleepQuality)
  }, [dreamData.sleepQuality])

  return (
    <PanelWrapper
      gradient="blue"
      tag={{
        icon: MoonIcon,
        label: "Schlafqualität",
        color: "bg-blue-500/20 text-blue-500",
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Letzte Nacht</div>
            <div className="text-2xl font-semibold md:text-3xl">{qualityInfo.label}</div>
            <div className="text-sm text-muted-foreground">{quality}%</div>
          </div>
          {/* Remove the "Details" button from the header */}
        </div>

        {/* Qualitäts-Slider */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Schlecht</span>
            <span className="text-sm text-muted-foreground">Ausgezeichnet</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number.parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer hover:h-3 transition-all"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #f59e0b 25%, #3b82f6 50%, #10b981 75%, #22c55e 100%)`,
            }}
            aria-label="Schlafqualität einstellen"
          />
        </div>

        {/* Sterne-Bewertung */}
        <div className="flex justify-center mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-6 w-6 cursor-pointer transition-all hover:scale-110 ${
                  star <= Math.round(quality / 20)
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-muted hover:text-yellow-300"
                }`}
                onClick={() => setQuality(star * 20)}
                aria-label={`${star} Sterne`}
              />
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-[120px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={qualityHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <CustomTooltip formatter={tooltipFormatter} />
              <Area
                type="monotone"
                dataKey="quality"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorQuality)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Letzte Einträge */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Letzte Einträge:</h4>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {qualityHistory
              .slice(-3)
              .reverse()
              .map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm hover:bg-muted/50 rounded p-1 transition-colors cursor-pointer"
                  onClick={() => setQuality(entry.quality)}
                >
                  <span>{entry.date}</span>
                  <div className={`px-2 py-1 rounded-md text-xs ${getQualityInfo(entry.quality).color}`}>
                    {getQualityInfo(entry.quality).label} ({entry.quality}%)
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between p-6 pt-2 mt-auto">
        <span className="text-sm text-muted-foreground">Letzte Aktualisierung: Heute</span>
        <button
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={saveQuality}
        >
          Speichern
        </button>
      </div>
    </PanelWrapper>
  )
}
