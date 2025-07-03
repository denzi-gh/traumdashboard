"use client"

import * as React from "react"
import { BookIcon, CalendarIcon, PlusIcon } from "lucide-react"
import { PanelWrapper } from "./ui/panel-wrapper"

interface DreamEntry {
  id: string
  date: Date
  title: string
  content: string
}

export function DreamJournal() {
  const [entries, setEntries] = React.useState<DreamEntry[]>([
    {
      id: "1",
      date: new Date(2023, 4, 15),
      title: "Flug über die Stadt",
      content:
        "Ich flog über eine leuchtende Stadt bei Nacht. Die Lichter waren wie Sterne unter mir. Ich fühlte mich frei und glücklich.",
    },
    {
      id: "2",
      date: new Date(2023, 4, 18),
      title: "Unterwasserwelt",
      content:
        "Ich konnte unter Wasser atmen und schwamm mit bunten Fischen. Es gab eine alte Ruine auf dem Meeresboden, die ich erkundete.",
    },
  ])

  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date>()
  const [title, setTitle] = React.useState("")
  const [content, setContent] = React.useState("")

  const handleSubmit = React.useCallback(() => {
    if (title && content && date) {
      const newEntry: DreamEntry = {
        id: Date.now().toString(),
        date,
        title,
        content,
      }
      setEntries((prev) => [...prev, newEntry])
      setOpen(false)
      setTitle("")
      setContent("")
      setDate(undefined)
    }
  }, [title, content, date])

  const formatDate = React.useCallback((date: Date) => {
    return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${date.getFullYear()}`
  }, [])

  return (
    <PanelWrapper
      gradient="emerald"
      tag={{
        icon: BookIcon,
        label: "Tagebuch",
        color: "bg-emerald-500/20 text-emerald-500",
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <BookIcon className="h-5 w-5 text-emerald-400" />
              Traumtagebuch
            </h3>
            <p className="text-sm text-muted-foreground">Deine letzten Traumeinträge</p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex h-9 items-center justify-center gap-1 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <PlusIcon className="h-4 w-4" />
            Neuer Eintrag
          </button>
        </div>

        {/* Zusammenfassung */}
        <div className="rounded-lg border p-4 bg-emerald-950/10 mb-4">
          <h4 className="text-sm font-medium mb-2">Zusammenfassung:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Gesamteinträge</div>
              <div className="text-2xl font-semibold">{entries.length}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Letzter Eintrag</div>
              <div className="text-2xl font-semibold">
                {entries.length > 0 ? formatDate(entries[entries.length - 1].date) : "-"}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Häufigste Themen</div>
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-500">Fliegen</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-500">Wasser</span>
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Aktivität</div>
              <div className="flex items-end gap-1 h-6 mt-1">
                {[3, 5, 2, 4, 6, 3, 4].map((value, i) => (
                  <div key={i} className="w-2 bg-emerald-500/60 rounded-sm" style={{ height: `${value * 16.67}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Einträge */}
        <div className="space-y-4 max-h-[200px] overflow-y-auto">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">{entry.title}</h3>
                <span className="text-sm text-muted-foreground">{formatDate(entry.date)}</span>
              </div>
              <p className="text-sm">{entry.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setOpen(false)}>
          <div className="max-w-md rounded-lg bg-background p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Neuen Traum hinzufügen</h3>
              <p className="text-sm text-muted-foreground">Erfasse deinen Traum, um ihn später zu analysieren.</p>
            </div>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="dream-date" className="text-sm font-medium">
                  Datum
                </label>
                <button
                  id="dream-date"
                  onClick={() => setDate(new Date())}
                  className="inline-flex h-10 w-full items-center justify-start rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? formatDate(date) : <span className="text-muted-foreground">Datum auswählen</span>}
                </button>
              </div>
              <div className="grid gap-2">
                <label htmlFor="dream-title" className="text-sm font-medium">
                  Titel
                </label>
                <input
                  id="dream-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Gib deinem Traum einen Titel"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="dream-content" className="text-sm font-medium">
                  Beschreibung
                </label>
                <textarea
                  id="dream-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Beschreibe deinen Traum..."
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!title || !content || !date}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
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
