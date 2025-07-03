"use client"

import * as React from "react"
import { PlusIcon, PieChartIcon } from "lucide-react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts"
import { useDreamData } from "@/contexts/dream-data-context"
import { PanelWrapper } from "./ui/panel-wrapper"
import { CustomTooltip } from "./ui/custom-tooltip"

//Traum Arten Kuchendiagramm
const DREAM_TYPES = [
  { name: "Luzide Träume", value: 35, color: "#8b5cf6", description: "Bewusste Traumkontrolle" },
  { name: "Albträume", value: 15, color: "#ec4899", description: "Angstvolle Träume" },
  { name: "Alltägliche Träume", value: 30, color: "#06b6d4", description: "Normale Alltagsträume" },
  { name: "Fantasie Träume", value: 20, color: "#10b981", description: "Kreative, surreale Träume" },
] as const

export function DreamTypeChart() {
  const [open, setOpen] = React.useState(false)
  const [selectedType, setSelectedType] = React.useState("")
  const [selectedSegment, setSelectedSegment] = React.useState<string | null>(null)
  const { updateDreamType } = useDreamData()

  const [typeHistory, setTypeHistory] = React.useState([
    { date: "Vor 2 Tagen", type: "Luzide Träume" },
    { date: "Vor 4 Tagen", type: "Alltägliche Träume" },
    { date: "Vor 7 Tagen", type: "Albträume" },
  ])

  const enhancedData = React.useMemo(
    () =>
      DREAM_TYPES.map((item) => ({
        ...item,
        opacity: selectedSegment === null || selectedSegment === item.name ? 1 : 0.6,
        strokeWidth: selectedSegment === item.name ? 3 : 0,
        stroke: selectedSegment === item.name ? item.color : "none",
      })),
    [selectedSegment],
  )

  const handleSubmit = React.useCallback(() => {
    if (selectedType) {
      setTypeHistory((prev) => [{ date: "Heute", type: selectedType }, ...prev.slice(0, 4)])
      updateDreamType(selectedType)
      setOpen(false)
      setSelectedType("")
    }
  }, [selectedType, updateDreamType])

  const handleSegmentClick = React.useCallback(
    (data: any) => {
      setSelectedSegment(selectedSegment === data.name ? null : data.name)
    },
    [selectedSegment],
  )

  const tooltipFormatter = React.useCallback(
    (data: any) => (
      <>
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">{data.value}% der Träume</p>
        <p className="text-xs">{data.description}</p>
        <p className="text-xs text-muted-foreground mt-1">Klicken für Details</p>
      </>
    ),
    [],
  )

  return (
    <PanelWrapper
      gradient="cyan"
      tag={{
        icon: PieChartIcon,
        label: "Traumarten",
        color: "bg-cyan-500/20 text-cyan-500",
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold">Traumarten</h3>
            <p className="text-sm text-muted-foreground">Verteilung deiner Traumarten im letzten Monat</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[200px] mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={enhancedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                onClick={handleSegmentClick}
                style={{ cursor: "pointer" }}
              >
                {enhancedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    fillOpacity={entry.opacity}
                    stroke={entry.stroke}
                    strokeWidth={entry.strokeWidth}
                  />
                ))}
              </Pie>
              <CustomTooltip formatter={tooltipFormatter} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Details für ausgewähltes Segment */}
        {selectedSegment && (
          <div className="mb-2 p-3 bg-muted/50 rounded-md">
            <h4 className="text-sm font-medium">{selectedSegment}</h4>
            <p className="text-xs text-muted-foreground">
              {DREAM_TYPES.find((d) => d.name === selectedSegment)?.description}
            </p>
            <p className="text-xs mt-1">
              Häufigkeit: {DREAM_TYPES.find((d) => d.name === selectedSegment)?.value}% deiner Träume
            </p>
          </div>
        )}

        {/* Historie */}
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Letzte hinzugefügte Traumarten:</h4>
          <div className="space-y-1 max-h-16 overflow-y-auto">
            {typeHistory.map((entry, index) => {
              const typeData = DREAM_TYPES.find((item) => item.name === entry.type)
              return (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm hover:bg-muted/50 rounded p-1 transition-colors cursor-pointer"
                  onClick={() => handleSegmentClick({ name: entry.type })}
                >
                  <span>{entry.date}</span>
                  <div className="flex items-center gap-2">
                    {typeData && <div className="h-3 w-3 rounded-full" style={{ backgroundColor: typeData.color }} />}
                    <span>{entry.type}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end p-4 pt-2 mt-auto">
        <button
          className="inline-flex h-9 items-center justify-center gap-1 rounded-md border bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => setOpen(true)}
        >
          <PlusIcon className="h-4 w-4" />
          Traum hinzufügen
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setOpen(false)}>
          <div className="max-w-md rounded-lg bg-background p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Traumart hinzufügen</h3>
              <p className="text-sm text-muted-foreground">Welche Art von Traum hattest du letzte Nacht?</p>
            </div>
            <div className="py-4 space-y-4">
              {DREAM_TYPES.map((type) => (
                <div key={type.name} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={type.name}
                    checked={selectedType === type.name}
                    onChange={() => setSelectedType(type.name)}
                    className="h-4 w-4"
                  />
                  <label htmlFor={type.name} className="flex items-center gap-2 text-sm cursor-pointer">
                    {type.name}
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: type.color }} />
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={handleSubmit}
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </PanelWrapper>
  )
}
