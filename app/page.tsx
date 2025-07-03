"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { DreamMoodPanel } from "@/components/dream-mood-panel"
import { DreamTypeChart } from "@/components/dream-type-chart"
import { DreamJournal } from "@/components/dream-journal"
import { DreamSymbols } from "@/components/dream-symbols"
import { SleepQuality } from "@/components/sleep-quality"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useUser } from "@/contexts/user-context"
import { motion } from "framer-motion"
import { ImageIcon, SparklesIcon, ZapIcon } from "lucide-react"

export default function Page() {
  const { username } = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  //Handelt das erstbesuchen auf einer Seite, /greetings wird nur geladen wenn man das erste mal in einer "Session" die Seite öffnet (Tab)
  useEffect(() => {
    const hasVisitedThisSession = sessionStorage.getItem("hasVisited")

    if (!hasVisitedThisSession) {
      sessionStorage.setItem("hasVisited", "true")
      router.push("/greeting")
    } else {
      // Kurze Verzögerung um laden zu simulieren
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [router])



  // Animationsvarianten für die Dashboard-Elemente
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{
              rotate: 360,
              transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            }}
          >
            <div className="mx-auto h-12 w-12 text-green-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            </div>
          </motion.div>
          <p className="mt-4 text-muted-foreground">Lade dein Dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <motion.div
            className="flex flex-1 flex-col p-4 md:p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {/* Erste Reihe: 3 Panels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <motion.div variants={itemVariants} className="w-full h-full">
                  <DreamMoodPanel />
                </motion.div>
                <motion.div variants={itemVariants} className="w-full h-full">
                  <SleepQuality />
                </motion.div>
                <motion.div variants={itemVariants} className="w-full h-full">
                  <DreamSymbols />
                </motion.div>
              </div>

              {/* Zweite Reihe: 2 Panels - Traum Visualizer und Dream Type Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <motion.div variants={itemVariants} className="w-full">
                  <DreamTypeChart />
                </motion.div>
                <motion.div variants={itemVariants} className="w-full">
                  {/* Traum Visualizer*/}
                  <div className="h-full rounded-lg border-2 border-primary/40 bg-gradient-to-br from-green-950/30 via-pink-950/20 to-blue-950/30 hover:from-purple-950/50 hover:via-pink-950/30 hover:to-blue-950/40 transition-all duration-500 overflow-hidden group relative">
                    {/* Animierter Hintergrund */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Schwebende Partikel */}
                    <div className="absolute inset-0 overflow-hidden">
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-primary/30 rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: Math.random() * 2,
                          }}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => router.push("/dream-visualizer")}
                      className="relative w-full h-full p-8 text-left z-10 group-hover:scale-[1.02] transition-transform duration-300"
                    >
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <div className="flex items-center gap-4 mb-6">
                            <motion.div
                              className="p-4 rounded-2xl bg-primary/20 group-hover:bg-primary/30 transition-colors border border-primary/30"
                              animate={{
                                boxShadow: [
                                  "0 0 0 0 rgba(139, 92, 246, 0)",
                                  "0 0 0 20px rgba(139, 92, 246, 0)",
                                  "0 0 0 0 rgba(139, 92, 246, 0)",
                                ],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                              }}
                            >
                              <ImageIcon className="h-10 w-10 text-primary" />
                            </motion.div>

                            <div>
                              <h3 className="text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                Dreampass
                              </h3>
                              <p className="text-base text-muted-foreground">
                                Traum Visualizer
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-base">
                              <SparklesIcon className="h-4 w-4 text-yellow-400" />
                              <span>Lasse dir deinen Dreampass anzeigen</span>
                            </div>
                            <div className="flex items-center gap-3 text-base">
                              <ZapIcon className="h-4 w-4 text-blue-400" />
                              <span>Basierend auf deinen Traumdaten</span>
                            </div>
                            <div className="flex items-center gap-3 text-base">
                              <ImageIcon className="h-4 w-4 text-green-400" />
                              <span>Gemäß World Dream Organization (WDO)</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">Klicken zum Erstellen</div>
                          <motion.div
                            className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-full px-6 py-3 text-primary font-medium text-lg transition-all duration-300 group-hover:scale-105"
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                          >
                            ✨ Jetzt visualisieren
                            <motion.svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                            >
                              <path d="m9 18 6-6-6-6" />
                            </motion.svg>
                          </motion.div>
                        </div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Dritte Reihe: 1 Panel */}
              <motion.div variants={itemVariants} className="w-full">
                <DreamJournal />
              </motion.div>

              {/* Vierte Reihe: Traum Quiz*/}
              <motion.div
                variants={itemVariants}
                className="w-full"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="relative w-full p-4 rounded-lg border bg-gradient-to-r from-pink-950/20 to-green-950/20 hover:from-pink-950/30 hover:to-purple-950/30 transition-all duration-300 overflow-hidden">
                  <div className="relative flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-pink-500/20 border border-pink-500/30">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-pink-400"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                          <path d="M12 17h.01" />
                        </svg>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-foreground">Traum-Quiz</h3>
                        <p className="text-sm text-muted-foreground">Entdecke die Bedeutung deiner Träume</p>
                      </div>
                    </div>

                    <div className="text-sm bg-pink-500/20 border border-pink-500/50 rounded-full px-4 py-2 text-pink-400 font-medium">
                      Quiz starten →
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </SidebarInset>
      </SidebarProvider>
    </motion.div>
  )
}
