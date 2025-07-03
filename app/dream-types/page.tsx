"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { PieChartIcon, PlusIcon, TrendingUpIcon, CalendarIcon, BarChart3Icon } from "lucide-react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, LineChart, Line } from "recharts"
import { useDreamData } from "@/contexts/dream-data-context"
import { CustomTooltip } from "@/components/ui/custom-tooltip"
import { motion } from "framer-motion"

const DREAM_TYPES = [
  {
    name: "Luzide Träume",
    value: 35,
    color: "#8b5cf6",
    description: "Bewusste Traumkontrolle",
    details: "Träume, in denen du dir bewusst bist, dass du träumst und den Traum kontrollieren kannst.",
  },
  {
    name: "Albträume",
    value: 15,
    color: "#ec4899",
    description: "Angstvolle Träume",
    details: "Beunruhigende Träume, die Angst, Stress oder negative Emotionen auslösen.",
  },
  {
    name: "Alltägliche Träume",
    value: 30,
    color: "#06b6d4",
    description: "Normale Alltagsträume",
    details: "Träume, die alltägliche Situationen und Erlebnisse widerspiegeln.",
  },
  {
    name: "Fantasie Träume",
    value: 20,
    color: "#10b981",
    description: "Kreative, surreale Träume",
    details: "Imaginative Träume mit fantastischen Elementen und kreativen Szenarien.",
  },
] as const

export default function DreamTypesPage() {
  const [open, setOpen] = React.useState(false)
  const [selectedType, setSelectedType] = React.useState("")
  const [selectedSegment, setSelectedSegment] = React.useState<string | null>(null)
  const { updateDreamType } = useDreamData()

  const [typeHistory, setTypeHistory] = React.useState([
    { date: "Vor 2 Tagen", type: "Luzide Träume", fullDate: "19.06.2024", intensity: 8 },
    { date: "Vor 4 Tagen", type: "Alltägliche Träume", fullDate: "17.06.2024", intensity: 5 },
    { date: "Vor 7 Tagen", type: "Albträume", fullDate: "14.06.2024", intensity: 9 },
    { date: "Vor 10 Tagen", type: "Fantasie Träume", fullDate: "11.06.2024", intensity: 7 },
    { date: "Vor 12 Tagen", type: "Luzide Träume", fullDate: "09.06.2024", intensity: 6 },
  ])

  const weeklyData = React.useMemo(
    () => [
      { week: "KW 20", lucid: 3, nightmare: 1, everyday: 2, fantasy: 1 },
      { week: "KW 21", lucid: 2, nightmare: 2, everyday: 3, fantasy: 0 },
      { week: "KW 22", lucid: 4, nightmare: 0, everyday: 2, fantasy: 1 },
      { week: "KW 23", lucid: 1, nightmare: 1, everyday: 4, fantasy: 1 },
      { week: "KW 24", lucid: 3, nightmare: 1, everyday: 1, fantasy: 2 },
    ],
    [],
  )

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
      setTypeHistory((prev) => [
        { date: "Heute", type: selectedType, fullDate: "21.06.2024", intensity: Math.floor(Math.random() * 5) + 5 },
        ...prev.slice(0, 9),
      ])
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
              <div className="p-4 rounded-2xl bg-cyan-500/20 border border-cyan-500/30">
                <PieChartIcon className="h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Traumarten-Analyse</h1>
                <p className="text-lg text-muted-foreground">Verstehe die Verteilung und Muster deiner Träume</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <PieChartIcon className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm text-muted-foreground">Häufigste Art</span>
                </div>
                <div className="text-2xl font-bold">Luzide Träume</div>
                <div className="text-sm text-muted-foreground mt-1">35% aller Träume</div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUpIcon className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">Letzter Traum</span>
                </div>
                <div className="text-2xl font-bold">Luzide Träume</div>
                <div className="text-sm text-muted-foreground mt-1">Vor 2 Tagen</div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CalendarIcon className="h-5 w-5 text-blue-400" />
                  <span className="text-sm text-muted-foreground">Diese Woche</span>
                </div>
                <div className="text-2xl font-bold">7</div>
                <div className="text-sm text-muted-foreground mt-1">Träume erfasst</div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3Icon className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">Intensität Ø</span>
                </div>
                <div className="text-2xl font-bold">7.2</div>
                <div className="text-sm text-muted-foreground mt-1">von 10</div>
              </div>
            </div>

            {/* Add Dream Type */}
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Neuen Traum hinzufügen</h3>
                <button
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  Traum hinzufügen
                </button>
              </div>
              <p className="text-muted-foreground">
                Erfasse deine Träume und analysiere Muster in deinen Traumarten über die Zeit.
              </p>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribution Chart */}
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Traumarten-Verteilung</h3>
                </div>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={enhancedData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
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
                      <CustomTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weekly Trend */}
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-xl font-semibold mb-4">Wöchentlicher Verlauf</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <CustomTooltip />
                      <Line type="monotone" dataKey="lucid" stroke="#8b5cf6" strokeWidth={3} name="Luzide Träume" />
                      <Line type="monotone" dataKey="nightmare" stroke="#ec4899" strokeWidth={3} name="Albträume" />
                      <Line
                        type="monotone"
                        dataKey="everyday"
                        stroke="#06b6d4"
                        strokeWidth={3}
                        name="Alltägliche Träume"
                      />
                      <Line type="monotone" dataKey="fantasy" stroke="#10b981" strokeWidth={3} name="Fantasie Träume" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Dream Type Details */}
            {selectedSegment && (
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-xl font-semibold mb-4">{selectedSegment} - Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Beschreibung</h4>
                    <p className="text-muted-foreground mb-4">
                      {DREAM_TYPES.find((d) => d.name === selectedSegment)?.details}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Häufigkeit:</span>
                        <span className="font-medium">
                          {DREAM_TYPES.find((d) => d.name === selectedSegment)?.value}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Letzte Woche:</span>
                        <span className="font-medium">3x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Durchschnittliche Intensität:</span>
                        <span className="font-medium">7.5/10</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Tipps & Hinweise</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {selectedSegment === "Luzide Träume" && (
                        <>
                          <p>• Führe ein Traumtagebuch für bessere Traumerinnerung</p>
                          <p>• Praktiziere Reality Checks während des Tages</p>
                          <p>• Verwende die MILD-Technik vor dem Schlafen</p>
                        </>
                      )}
                      {selectedSegment === "Albträume" && (
                        <>
                          <p>• Entspannungstechniken vor dem Schlafen</p>
                          <p>• Vermeide schwere Mahlzeiten am Abend</p>
                          <p>• Imagery Rehearsal Therapy kann helfen</p>
                        </>
                      )}
                      {selectedSegment === "Alltägliche Träume" && (
                        <>
                          <p>• Reflektiere über Tageserlebnisse</p>
                          <p>• Achte auf wiederkehrende Muster</p>
                          <p>• Nutze sie zur Problemlösung</p>
                        </>
                      )}
                      {selectedSegment === "Fantasie Träume" && (
                        <>
                          <p>• Dokumentiere kreative Ideen aus Träumen</p>
                          <p>• Nutze sie für künstlerische Inspiration</p>
                          <p>• Erkunde symbolische Bedeutungen</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* History Table */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-semibold mb-4">Traumhistorie</h3>
              <div className="space-y-3">
                {typeHistory.map((entry, index) => {
                  const typeData = DREAM_TYPES.find((item) => item.name === entry.type)
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleSegmentClick({ name: entry.type })}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">
                          {entry.type === "Luzide Träume"
                            ? "🌟"
                            : entry.type === "Albträume"
                              ? "😰"
                              : entry.type === "Alltägliche Träume"
                                ? "😴"
                                : "🎨"}
                        </div>
                        <div>
                          <div className="font-medium">{entry.fullDate}</div>
                          <div className="text-sm text-muted-foreground">{entry.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">Intensität: {entry.intensity}/10</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {typeData && (
                            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: typeData.color }} />
                          )}
                          <span className="font-medium">{entry.type}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Modal */}
        {open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setOpen(false)}
          >
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
      </SidebarInset>
    </SidebarProvider>
  )
}
