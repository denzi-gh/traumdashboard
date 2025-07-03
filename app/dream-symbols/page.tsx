"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CompassIcon, SearchIcon, BookOpenIcon, StarIcon, TrendingUpIcon } from "lucide-react"
import { useDreamData } from "@/contexts/dream-data-context"
import { motion } from "framer-motion"

const SYMBOL_CATEGORIES = [
  {
    name: "Bewegung & Transport",
    symbols: [
      { name: "Fliegen", meaning: "Freiheit, Kontrolle", category: "Bewegung" },
      { name: "Fallen", meaning: "Unsicherheit, Angst", category: "Bewegung" },
      { name: "Auto fahren", meaning: "Lebensrichtung", category: "Transport" },
      { name: "Zug", meaning: "Lebensreise, vorbestimmter Weg", category: "Transport" },
    ],
  },
  {
    name: "Natur & Elemente",
    symbols: [
      { name: "Wasser", meaning: "Emotionen, Unterbewusstsein", category: "Natur" },
      { name: "Feuer", meaning: "Leidenschaft, Transformation", category: "Elemente" },
      { name: "Wald", meaning: "Unbewusstes, Geheimnisse", category: "Natur" },
      { name: "Berg", meaning: "Herausforderungen, Ziele", category: "Natur" },
    ],
  },
  {
    name: "Menschen & Beziehungen",
    symbols: [
      { name: "Verfolgt werden", meaning: "Vermeidung, Stress", category: "Beziehungen" },
      { name: "Familie", meaning: "Sicherheit, Wurzeln", category: "Menschen" },
      { name: "Fremde", meaning: "Unbekannte Aspekte des Selbst", category: "Menschen" },
      { name: "Verstorbene", meaning: "Vergangenheit, unerledigte Angelegenheiten", category: "Menschen" },
    ],
  },
  {
    name: "Körper & Gesundheit",
    symbols: [
      { name: "Zähne", meaning: "Sorgen, Selbstbild", category: "Körper" },
      { name: "Haare", meaning: "Stärke, Identität", category: "Körper" },
      { name: "Blut", meaning: "Lebenskraft, Opfer", category: "Körper" },
      { name: "Krankheit", meaning: "Schwäche, Transformation", category: "Gesundheit" },
    ],
  },
  {
    name: "Orte & Gebäude",
    symbols: [
      { name: "Haus", meaning: "Selbst, Sicherheit", category: "Orte" },
      { name: "Schule", meaning: "Lernen, Vergangenheit", category: "Orte" },
      { name: "Krankenhaus", meaning: "Heilung, Hilfe", category: "Gebäude" },
      { name: "Kirche", meaning: "Spiritualität, Moral", category: "Gebäude" },
    ],
  },
  {
    name: "Tiere",
    symbols: [
      { name: "Hund", meaning: "Treue, Freundschaft", category: "Tiere" },
      { name: "Katze", meaning: "Unabhängigkeit, Weiblichkeit", category: "Tiere" },
      { name: "Schlange", meaning: "Transformation, Weisheit", category: "Tiere" },
      { name: "Vogel", meaning: "Freiheit, Spiritualität", category: "Tiere" },
    ],
  },
]

export default function DreamSymbolsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [selectedSymbol, setSelectedSymbol] = React.useState<any>(null)
  const { addSearchedSymbol } = useDreamData()

  const [searchHistory, setSearchHistory] = React.useState([
    { term: "Fliegen", date: "Gestern", category: "Bewegung" },
    { term: "Wasser", date: "Vor 3 Tagen", category: "Natur" },
    { term: "Haus", date: "Vor 5 Tagen", category: "Orte" },
    { term: "Zähne", date: "Vor 1 Woche", category: "Körper" },
  ])

  const allSymbols = React.useMemo(() => {
    return SYMBOL_CATEGORIES.flatMap((category) => category.symbols)
  }, [])

  const filteredSymbols = React.useMemo(() => {
    let symbols = allSymbols

    if (selectedCategory) {
      symbols = symbols.filter((symbol) =>
        SYMBOL_CATEGORIES.find((cat) => cat.name === selectedCategory)?.symbols.includes(symbol),
      )
    }

    if (searchTerm) {
      symbols = symbols.filter(
        (symbol) =>
          symbol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          symbol.meaning.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return symbols
  }, [searchTerm, selectedCategory, allSymbols])

  const handleSearch = React.useCallback(
    (term: string) => {
      if (term.trim() && !searchHistory.some((item) => item.term.toLowerCase() === term.toLowerCase())) {
        const symbol = allSymbols.find((s) => s.name.toLowerCase() === term.toLowerCase())
        setSearchHistory((prev) => [
          { term, date: "Heute", category: symbol?.category || "Unbekannt" },
          ...prev.slice(0, 9),
        ])
        addSearchedSymbol(term)
      }
    },
    [searchHistory, addSearchedSymbol, allSymbols],
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
              <div className="p-4 rounded-2xl bg-teal-500/20 border border-teal-500/30">
                <CompassIcon className="h-8 w-8 text-teal-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Traumsymbol-Bibliothek</h1>
                <p className="text-lg text-muted-foreground">Entdecke die Bedeutung deiner Traumsymbole</p>
              </div>
            </div>

            {/* Search */}
            <div className="rounded-lg border bg-card p-6">
              <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  placeholder="Symbol suchen..."
                  className="h-12 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchTerm.trim()) {
                      handleSearch(searchTerm)
                    }
                  }}
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Alle Kategorien
                </button>
                {SYMBOL_CATEGORIES.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedCategory === category.name
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpenIcon className="h-5 w-5 text-teal-400" />
                  <span className="text-sm text-muted-foreground">Symbole gesamt</span>
                </div>
                <div className="text-3xl font-bold">{allSymbols.length}</div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <SearchIcon className="h-5 w-5 text-blue-400" />
                  <span className="text-sm text-muted-foreground">Letzte Suche</span>
                </div>
                <div className="text-3xl font-bold">{searchHistory[0]?.term || "-"}</div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">Kategorien</span>
                </div>
                <div className="text-3xl font-bold">{SYMBOL_CATEGORIES.length}</div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUpIcon className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">Häufigste Kategorie</span>
                </div>
                <div className="text-lg font-bold">Bewegung</div>
              </div>
            </div>

            {/* Symbols Grid */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-semibold mb-4">
                {selectedCategory
                  ? `${selectedCategory} (${filteredSymbols.length})`
                  : `Alle Symbole (${filteredSymbols.length})`}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSymbols.map((symbol, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedSymbol(selectedSymbol?.name === symbol.name ? null : symbol)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg">{symbol.name}</h4>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">{symbol.category}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{symbol.meaning}</p>
                    {selectedSymbol?.name === symbol.name && (
                      <div className="mt-3 pt-3 border-t">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSearch(symbol.name)
                          }}
                          className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full hover:bg-primary/30 transition-colors"
                        >
                          Zu Suchhistorie hinzufügen
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Search History */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-semibold mb-4">Suchhistorie</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {searchHistory.map((entry, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSearchTerm(entry.term)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{entry.term}</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">{entry.category}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{entry.date}</div>
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
