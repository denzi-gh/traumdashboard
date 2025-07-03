"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BookIcon, PlusIcon, CalendarIcon, SearchIcon, FilterIcon, TagIcon } from "lucide-react"
import { motion } from "framer-motion"

interface DreamEntry {
  id: string
  date: Date
  title: string
  content: string
  mood: string
  type: string
  tags: string[]
  intensity: number
}

export default function DreamJournalPage() {
  const [entries, setEntries] = React.useState<DreamEntry[]>([
    {
      id: "1",
      date: new Date(2024, 5, 21),
      title: "Flug über die Stadt",
      content:
        "Ich flog über eine leuchtende Stadt bei Nacht. Die Lichter waren wie Sterne unter mir. Ich fühlte mich frei und glücklich. Es war ein luzider Traum und ich konnte die Richtung kontrollieren.",
      mood: "positive",
      type: "Luzide Träume",
      tags: ["Fliegen", "Stadt", "Lichter"],
      intensity: 8,
    },
    {
      id: "2",
      date: new Date(2024, 5, 18),
      title: "Unterwasserwelt",
      content:
        "Ich konnte unter Wasser atmen und schwamm mit bunten Fischen. Es gab eine alte Ruine auf dem Meeresboden, die ich erkundete. Die Farben waren sehr intensiv.",
      mood: "neutral",
      type: "Fantasie Träume",
      tags: ["Wasser", "Fische", "Ruinen"],
      intensity: 6,
    },
    {
      id: "3",
      date: new Date(2024, 5, 15),
      title: "Verfolgungsjagd",
      content:
        "Ich wurde durch dunkle Gassen verfolgt. Konnte das Gesicht des Verfolgers nie sehen. Bin immer wieder gestolpert und aufgewacht als er mich fast erreicht hatte.",
      mood: "negative",
      type: "Albträume",
      tags: ["Verfolgt werden", "Dunkelheit", "Angst"],
      intensity: 9,
    },
  ])

  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterType, setFilterType] = React.useState<string | null>(null)
  const [filterMood, setFilterMood] = React.useState<string | null>(null)
  const [newEntry, setNewEntry] = React.useState({
    title: "",
    content: "",
    mood: "neutral",
    type: "Alltägliche Träume",
    tags: "",
    intensity: 5,
  })

  const dreamTypes = ["Luzide Träume", "Albträume", "Alltägliche Träume", "Fantasie Träume"]
  const moods = ["positive", "neutral", "negative"]

  const filteredEntries = React.useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesType = !filterType || entry.type === filterType
      const matchesMood = !filterMood || entry.mood === filterMood

      return matchesSearch && matchesType && matchesMood
    })
  }, [entries, searchTerm, filterType, filterMood])

  const handleSubmit = React.useCallback(() => {
    if (newEntry.title && newEntry.content) {
      const entry: DreamEntry = {
        id: Date.now().toString(),
        date: new Date(),
        title: newEntry.title,
        content: newEntry.content,
        mood: newEntry.mood,
        type: newEntry.type,
        tags: newEntry.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        intensity: newEntry.intensity,
      }
      setEntries((prev) => [entry, ...prev])
      setOpen(false)
      setNewEntry({
        title: "",
        content: "",
        mood: "neutral",
        type: "Alltägliche Träume",
        tags: "",
        intensity: 5,
      })
    }
  }, [newEntry])

  const formatDate = React.useCallback((date: Date) => {
    return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${date.getFullYear()}`
  }, [])

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "positive":
        return "text-green-500 bg-green-500/20"
      case "negative":
        return "text-red-500 bg-red-500/20"
      default:
        return "text-blue-500 bg-blue-500/20"
    }
  }

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "positive":
        return "😊"
      case "negative":
        return "😔"
      default:
        return "😐"
    }
  }

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
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
                <BookIcon className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Traumtagebuch</h1>
                <p className="text-lg text-muted-foreground">Dokumentiere und analysiere deine Träume</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BookIcon className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm text-muted-foreground">Gesamteinträge</span>
                </div>
                <div className="text-3xl font-bold">{entries.length}</div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CalendarIcon className="h-5 w-5 text-blue-400" />
                  <span className="text-sm text-muted-foreground">Letzter Eintrag</span>
                </div>
                <div className="text-2xl font-bold">{entries.length > 0 ? formatDate(entries[0].date) : "-"}</div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TagIcon className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">Häufigste Tags</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-500">Fliegen</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-500">Wasser</span>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <FilterIcon className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">Durchschn. Intensität</span>
                </div>
                <div className="text-3xl font-bold">
                  {(entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length || 0).toFixed(1)}
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="rounded-lg border bg-card p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    placeholder="Träume durchsuchen..."
                    className="h-12 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterType || ""}
                    onChange={(e) => setFilterType(e.target.value || null)}
                    className="px-4 py-2 rounded-lg border border-input bg-background"
                  >
                    <option value="">Alle Typen</option>
                    {dreamTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterMood || ""}
                    onChange={(e) => setFilterMood(e.target.value || null)}
                    className="px-4 py-2 rounded-lg border border-input bg-background"
                  >
                    <option value="">Alle Stimmungen</option>
                    <option value="positive">Positiv</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negativ</option>
                  </select>
                  <button
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Neuer Eintrag
                  </button>
                </div>
              </div>
            </div>

            {/* Entries */}
            <div className="space-y-4">
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
                      <div>
                        <h3 className="text-xl font-semibold">{entry.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{formatDate(entry.date)}</span>
                          <span>•</span>
                          <span>{entry.type}</span>
                          <span>•</span>
                          <span>Intensität: {entry.intensity}/10</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${getMoodColor(entry.mood)}`}>
                      {entry.mood === "positive" ? "Positiv" : entry.mood === "negative" ? "Negativ" : "Neutral"}
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">{entry.content}</p>

                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-muted rounded-md text-xs cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => setSearchTerm(tag)}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {filteredEntries.length === 0 && (
              <div className="text-center py-12">
                <BookIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Einträge gefunden</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterType || filterMood
                    ? "Versuche andere Suchbegriffe oder Filter"
                    : "Beginne mit deinem ersten Traumeintrag"}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Modal */}
        {open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setOpen(false)}
          >
            <div className="max-w-2xl w-full mx-4 rounded-lg bg-background p-6" onClick={(e) => e.stopPropagation()}>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold">Neuen Traum hinzufügen</h3>
                <p className="text-muted-foreground">Erfasse deinen Traum, um ihn später zu analysieren.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="dream-title" className="block text-sm font-medium mb-2">
                    Titel
                  </label>
                  <input
                    id="dream-title"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Gib deinem Traum einen Titel"
                    className="w-full h-12 rounded-lg border border-input bg-background px-4 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <div>
                  <label htmlFor="dream-content" className="block text-sm font-medium mb-2">
                    Beschreibung
                  </label>
                  <textarea
                    id="dream-content"
                    value={newEntry.content}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Beschreibe deinen Traum so detailliert wie möglich..."
                    className="w-full min-h-[120px] rounded-lg border border-input bg-background px-4 py-3 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dream-type" className="block text-sm font-medium mb-2">
                      Traumart
                    </label>
                    <select
                      id="dream-type"
                      value={newEntry.type}
                      onChange={(e) => setNewEntry((prev) => ({ ...prev, type: e.target.value }))}
                      className="w-full h-12 rounded-lg border border-input bg-background px-4"
                    >
                      {dreamTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dream-mood" className="block text-sm font-medium mb-2">
                      Stimmung
                    </label>
                    <select
                      id="dream-mood"
                      value={newEntry.mood}
                      onChange={(e) => setNewEntry((prev) => ({ ...prev, mood: e.target.value }))}
                      className="w-full h-12 rounded-lg border border-input bg-background px-4"
                    >
                      <option value="positive">Positiv</option>
                      <option value="neutral">Neutral</option>
                      <option value="negative">Negativ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="dream-tags" className="block text-sm font-medium mb-2">
                    Tags (durch Komma getrennt)
                  </label>
                  <input
                    id="dream-tags"
                    value={newEntry.tags}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, tags: e.target.value }))}
                    placeholder="z.B. Fliegen, Wasser, Familie"
                    className="w-full h-12 rounded-lg border border-input bg-background px-4 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <div>
                  <label htmlFor="dream-intensity" className="block text-sm font-medium mb-2">
                    Intensität: {newEntry.intensity}/10
                  </label>
                  <input
                    id="dream-intensity"
                    type="range"
                    min="1"
                    max="10"
                    value={newEntry.intensity}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, intensity: Number.parseInt(e.target.value) }))}
                    className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Schwach</span>
                    <span>Sehr intensiv</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!newEntry.title || !newEntry.content}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
