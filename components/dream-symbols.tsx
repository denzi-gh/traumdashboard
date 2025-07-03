"use client"

import * as React from "react"
import { CompassIcon, SearchIcon } from "lucide-react"
import { useDreamData } from "@/contexts/dream-data-context"
import { PanelWrapper } from "./ui/panel-wrapper"

const COMMON_SYMBOLS = [
  { name: "Fliegen", meaning: "Freiheit, Kontrolle"},
  { name: "Fallen", meaning: "Unsicherheit, Angst", category: "Bewegung" },
  { name: "Auto fahren", meaning: "Lebensrichtung", category: "Transport" },
  { name: "Zug", meaning: "Lebensreise, vorbestimmter Weg", category: "Transport" },
  { name: "Wasser", meaning: "Emotionen, Unterbewusstsein", category: "Natur" },
  { name: "Feuer", meaning: "Leidenschaft, Transformation", category: "Elemente" },
  { name: "Wald", meaning: "Unbewusstes, Geheimnisse", category: "Natur" },
  { name: "Berg", meaning: "Herausforderungen, Ziele", category: "Natur" },
  { name: "Verfolgt werden", meaning: "Vermeidung, Stress", category: "Beziehungen" },
  { name: "Familie", meaning: "Sicherheit, Wurzeln", category: "Menschen" },
  { name: "Fremde", meaning: "Unbekannte Aspekte des Selbst", category: "Menschen" },
  { name: "Verstorbene", meaning: "Vergangenheit, unerledigte Angelegenheiten", category: "Menschen" },
  { name: "Zähne", meaning: "Sorgen, Selbstbild", category: "Körper" },
  { name: "Haare", meaning: "Stärke, Identität", category: "Körper" },
  { name: "Blut", meaning: "Lebenskraft, Opfer", category: "Körper" },
  { name: "Krankheit", meaning: "Schwäche, Transformation", category: "Gesundheit" },
  { name: "Haus", meaning: "Selbst, Sicherheit", category: "Orte" },
  { name: "Schule", meaning: "Lernen, Vergangenheit", category: "Orte" },
  { name: "Krankenhaus", meaning: "Heilung, Hilfe", category: "Gebäude" },
  { name: "Kirche", meaning: "Spiritualität, Moral", category: "Gebäude" },
  { name: "Hund", meaning: "Treue, Freundschaft", category: "Tiere" },
  { name: "Katze", meaning: "Unabhängigkeit, Weiblichkeit", category: "Tiere" },
  { name: "Schlange", meaning: "Transformation, Weisheit", category: "Tiere" },
  { name: "Vogel", meaning: "Freiheit, Spiritualität", category: "Tiere" },


] as const

export function DreamSymbols() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedSymbol, setSelectedSymbol] = React.useState<string | null>(null)
  const { addSearchedSymbol } = useDreamData()

  //Künstliche Suchhistorie
  const [searchHistory, setSearchHistory] = React.useState([
    { term: "Fliegen", date: "Gestern" },
    { term: "Wasser", date: "Vor 3 Tagen" },
    { term: "Fallen", date: "Vor 5 Tagen" },
  ])

  const filteredSymbols = React.useMemo(() => {
    if (!searchTerm) return COMMON_SYMBOLS.slice(0, 3)
    return COMMON_SYMBOLS.filter((symbol) => symbol.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [searchTerm])

  const handleSearch = React.useCallback(
    (term: string) => {
      if (term.trim() && !searchHistory.some((item) => item.term.toLowerCase() === term.toLowerCase())) {
        setSearchHistory((prev) => [{ term, date: "Heute" }, ...prev.slice(0, 4)])
        addSearchedSymbol(term)
      }
    },
    [searchHistory, addSearchedSymbol],
  )

  return (
    <PanelWrapper
      gradient="teal"
      tag={{
        icon: CompassIcon,
        label: "Deutung",
        color: "bg-teal-500/20 text-teal-500",
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Häufige Traumsymbole</div>
            <div className="text-2xl font-semibold md:text-3xl">Symbolik</div>
          </div>
        </div>

        {/* Suchfeld */}
        <div className="mb-4">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Symbol suchen..."
              className="h-10 w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-primary/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchTerm.trim()) {
                  handleSearch(searchTerm)
                }
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="h-[160px] mb-4">
          <div className="space-y-2 h-full overflow-y-auto">
            {filteredSymbols.length > 0 ? (
              filteredSymbols.map((symbol) => (
                <div
                  key={symbol.name}
                  className="flex justify-between items-center rounded-md border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedSymbol(selectedSymbol === symbol.name ? null : symbol.name)}
                >
                  <div>
                    <span className="font-medium">{symbol.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">{symbol.meaning}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-muted-foreground">Keine Symbole gefunden</div>
            )}
          </div>
        </div>

        {/* Suchhistorie */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Letzte Suchen:</h4>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((entry, index) => (
              <button
                key={index}
                className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs cursor-pointer hover:bg-accent transition-colors"
                onClick={() => {
                  setSearchTerm(entry.term)
                  handleSearch(entry.term)
                }}
              >
                <span>{entry.term}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PanelWrapper>
  )
}
