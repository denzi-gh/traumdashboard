"use client"

import * as React from "react"

type DreamDataType = {
  mood: string
  sleepQuality: number
  dreamType: string
  searchedSymbols: string[]
  lastUpdated: Date
}

type DreamDataContextType = {
  dreamData: DreamDataType
  updateMood: (mood: string) => void
  updateSleepQuality: (quality: number) => void
  updateDreamType: (type: string) => void
  addSearchedSymbol: (symbol: string) => void
}

const DreamDataContext = React.createContext<DreamDataContextType | undefined>(undefined)

export function DreamDataProvider({ children }: { children: React.ReactNode }) {
  const [dreamData, setDreamData] = React.useState<DreamDataType>({
    mood: "neutral",
    sleepQuality: 75,
    dreamType: "Alltägliche Träume",
    searchedSymbols: ["Fliegen", "Wasser"],
    lastUpdated: new Date(),
  })

  const updateMood = (mood: string) => {
    setDreamData((prev) => ({ ...prev, mood, lastUpdated: new Date() }))
  }

  const updateSleepQuality = (quality: number) => {
    setDreamData((prev) => ({ ...prev, sleepQuality: quality, lastUpdated: new Date() }))
  }

  const updateDreamType = (type: string) => {
    setDreamData((prev) => ({ ...prev, dreamType: type, lastUpdated: new Date() }))
  }

  const addSearchedSymbol = (symbol: string) => {
    setDreamData((prev) => ({
      ...prev,
      searchedSymbols: [...new Set([symbol, ...prev.searchedSymbols])].slice(0, 5),
      lastUpdated: new Date(),
    }))
  }

  return (
    <DreamDataContext.Provider
      value={{
        dreamData,
        updateMood,
        updateSleepQuality,
        updateDreamType,
        addSearchedSymbol,
      }}
    >
      {children}
    </DreamDataContext.Provider>
  )
}

export function useDreamData() {
  const context = React.useContext(DreamDataContext)
  if (context === undefined) {
    throw new Error("ERROR")
  }
  return context
}
