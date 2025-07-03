"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BrainIcon, HelpCircleIcon, RotateCcwIcon, TrendingUpIcon, CalendarIcon, StarIcon } from "lucide-react"
import { motion } from "framer-motion"


// Definition der Quiz-Fragen mit ID, Frage und Antwortoptionen
const QUIZ_QUESTIONS = [
  {
    id: "emotion",
    question: "Welche Emotion war in deinem Traum am stärksten?",
    options: ["Freude", "Angst", "Verwirrung", "Trauer", "Wut"],
  },
  {
    id: "setting",
    question: "In welcher Umgebung spielte dein Traum hauptsächlich?",
    options: ["Bekannter Ort", "Fremder Ort", "Fantasiewelt", "Kindheitserinnerung", "Arbeitsplatz"],
  },
  {
    id: "characters",
    question: "Wer war in deinem Traum anwesend?",
    options: ["Familie/Freunde", "Fremde", "Verstorbene", "Berühmtheiten", "Fantasiewesen"],
  },
  {
    id: "actions",
    question: "Was hast du hauptsächlich in deinem Traum getan?",
    options: ["Fliegen", "Laufen/Verfolgt werden", "Sprechen", "Kämpfen", "Beobachten"],
  },
  {
    id: "colors",
    question: "Welche Farben waren in deinem Traum dominant?",
    options: [
      "Warme Farben (Rot, Orange, Gelb)",
      "Kalte Farben (Blau, Grün, Lila)",
      "Schwarz/Weiß",
      "Bunte Mischung",
      "Kann mich nicht erinnern",
    ],
  },
] as const


// Vordefinierte mögliche Interpretationen nach Abschluss des Quiz
const INTERPRETATIONS = [
  {
    title: "Emotionale Verarbeitung",
    description:
      "Dein Traum könnte auf ungelöste emotionale Konflikte hindeuten. Es ist Zeit, deine Gefühle zu reflektieren.",
    advice: "Führe ein Emotionstagebuch und praktiziere Achtsamkeit.",
  },
  {
    title: "Lebensziele und Ambitionen",
    description: "Dieser Traum spiegelt möglicherweise deine aktuellen Lebensziele und Wünsche wider.",
    advice: "Setze dir klare Ziele und arbeite schrittweise darauf hin.",
  },
  {
    title: "Neuanfang und Transformation",
    description: "Die Symbole in deinem Traum deuten auf einen Neuanfang oder eine wichtige Veränderung hin.",
    advice: "Sei offen für neue Möglichkeiten und Veränderungen.",
  },
  {
    title: "Vergangenheitsbewältigung",
    description: "Dein Unterbewusstsein verarbeitet vergangene Erfahrungen und Erinnerungen.",
    advice: "Reflektiere über deine Vergangenheit und lerne aus deinen Erfahrungen.",
  },
  {
    title: "Kreative Problemlösung",
    description: "Dieser Traum könnte eine kreative Lösung für ein aktuelles Problem enthalten.",
    advice: "Notiere dir alle Ideen aus dem Traum und denke kreativ über Lösungen nach.",
  },
  {
    title: "Spirituelle Entwicklung",
    description: "Dein Traum zeigt eine tiefere spirituelle oder persönliche Entwicklung an.",
    advice: "Meditiere regelmäßig und beschäftige dich mit deiner inneren Entwicklung.",
  },
] as const

// Hauptkomponente: DreamQuizPage
export default function DreamQuizPage() {
  // State-Hooks für die Quiz-Navigation und -Daten
  const [currentStep, setCurrentStep] = React.useState(0) // Aktueller Quiz-Schritt
  const [answers, setAnswers] = React.useState<Record<string, string>>({}) // Gespeicherte Antworten
  const [dreamDescription, setDreamDescription] = React.useState("") // Beschreibung des Traums
  const [interpretation, setInterpretation] = React.useState<(typeof INTERPRETATIONS)[0] | null>(null) // Ausgewählte Interpretation
  const [isAnalyzing, setIsAnalyzing] = React.useState(false) // Anzeigen der Lade-Animation

  // Verlauf der letzten Quiz-Ergebnisse mit Datum, Titel und Bewertung
  const [quizHistory, setQuizHistory] = React.useState([
    {
      date: "Vor 3 Tagen",
      interpretation: "Emotionale Verarbeitung",
      description: "Dein Traum könnte auf ungelöste emotionale Konflikte hindeuten.",
      rating: 4,
    },
    {
      date: "Vor 8 Tagen",
      interpretation: "Neuanfang und Transformation",
      description: "Die Symbole in deinem Traum deuten auf einen Neuanfang hin.",
      rating: 5,
    },
    {
      date: "Vor 2 Wochen",
      interpretation: "Kreative Problemlösung",
      description: "Dieser Traum könnte eine kreative Lösung enthalten.",
      rating: 3,
    },
    {
      date: "HEUTE",
      interpretation: "MD2 Prüfung",
      description: "Mediengestaltungsprüfung",
      rating: 5,
    },
  ])


    //ERgebnis Handler
    const handleSubmit = React.useCallback(() => {
      setIsAnalyzing(true)

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * INTERPRETATIONS.length)
        const newInterpretation = INTERPRETATIONS[randomIndex]
        setInterpretation(newInterpretation)
        setQuizHistory((prev) => [
          {
            date: "Heute",
            interpretation: newInterpretation.title,
            description: newInterpretation.description,
            rating: 0,
          },
          ...prev.slice(0, 9),
        ])
        setCurrentStep(QUIZ_QUESTIONS.length + 1)
        setIsAnalyzing(false)
      }, 2000)
    }, [])




  // Callback zum Speichern einer Antwort und Weiterführen des Quiz
  const handleAnswer = React.useCallback(
      (value: string) => {
        if (currentStep < QUIZ_QUESTIONS.length) {
          setAnswers((prev) => ({
            ...prev,
            [QUIZ_QUESTIONS[currentStep].id]: value,
          }))

          // Wenn es die letzte Frage ist, dann auswerten
          if (currentStep + 1 === QUIZ_QUESTIONS.length) {
            // Timeout damit zeit ist auszuwerten
            setTimeout(() => handleSubmit(), 300)
          } else {
            setCurrentStep(currentStep + 1)
          }
        }
      },
      [currentStep, handleSubmit]
  )

  const resetQuiz = React.useCallback(() => {
    setCurrentStep(0)
    setAnswers({})
    setDreamDescription("")
    setInterpretation(null)
    setIsAnalyzing(false)
  }, [])

  const rateInterpretation = React.useCallback((rating: number) => {
    setQuizHistory((prev) => prev.map((entry, index) => (index === 0 ? { ...entry, rating } : entry)))
  }, [])

  const progress = (currentStep / (QUIZ_QUESTIONS.length + 1)) * 100

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
              <div className="p-4 rounded-2xl bg-pink-500/20 border border-pink-500/30">
                <BrainIcon className="h-8 w-8 text-pink-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Traum-Quiz</h1>
                <p className="text-lg text-muted-foreground">Entdecke die verborgenen Bedeutungen deiner Träume</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BrainIcon className="h-5 w-5 text-pink-400" />
                  <span className="text-sm text-muted-foreground">Absolvierte Quiz</span>
                </div>
                <div className="text-3xl font-bold">{quizHistory.length}</div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CalendarIcon className="h-5 w-5 text-blue-400" />
                  <span className="text-sm text-muted-foreground">Letztes Quiz</span>
                </div>
                <div className="text-2xl font-bold">{quizHistory.length > 0 ? quizHistory[0].date : "-"}</div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">Durchschn. Bewertung</span>
                </div>
                <div className="text-3xl font-bold">
                  {quizHistory.filter((h) => h.rating > 0).length > 0
                    ? (
                        quizHistory.filter((h) => h.rating > 0).reduce((sum, h) => sum + h.rating, 0) /
                        quizHistory.filter((h) => h.rating > 0).length
                      ).toFixed(1)
                    : "-"}
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUpIcon className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">Häufigste Deutung</span>
                </div>
                <div className="text-lg font-bold">Emotionale Verarbeitung</div>
              </div>
            </div>

            {/* Quiz Content */}
            <div className="rounded-lg border bg-card p-8">
              {/* Progress Bar */}
              {currentStep <= QUIZ_QUESTIONS.length && (
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Fortschritt</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Step 0: Dream Description */}
              {currentStep === 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">Beschreibe deinen Traum</h2>
                    <p className="text-muted-foreground">Erzähle uns kurz von deinem letzten Traum</p>
                  </div>
                  <textarea
                    placeholder="Ich träumte von..."
                    value={dreamDescription}
                    onChange={(e) => setDreamDescription(e.target.value)}
                    className="w-full min-h-[150px] rounded-lg border border-input bg-background px-4 py-3 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <div className="flex justify-center">
                    <button
                      onClick={() => setCurrentStep(1)}
                      disabled={!dreamDescription.trim()}
                      className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Weiter zum Quiz
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Quiz Questions */}
              {currentStep > 0 && currentStep <= QUIZ_QUESTIONS.length && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">
                      {/* GEMOGELT */}
                      Frage {currentStep} von {QUIZ_QUESTIONS.length - 1}
                    </h2>
                    <p className="text-xl">{QUIZ_QUESTIONS[currentStep - 1].question}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {QUIZ_QUESTIONS[currentStep - 1].options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        className="p-4 text-left rounded-lg border hover:bg-muted/50 transition-colors hover:border-primary"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Analysis */}
              {isAnalyzing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
                  <div className="text-2xl font-bold">Analysiere deinen Traum...</div>
                  <div className="flex justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <BrainIcon className="h-12 w-12 text-pink-400" />
                    </motion.div>
                  </div>
                  <p className="text-muted-foreground">Deine Antworten werden ausgewertet...</p>
                </motion.div>
              )}

              {/* Results */}
              {currentStep === QUIZ_QUESTIONS.length + 1 && interpretation && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Deine Traumdeutung</h2>
                    <p className="text-muted-foreground">Basierend auf deinen Antworten</p>
                  </div>

                  <div className="rounded-lg bg-pink-950/20 border border-pink-500/30 p-6">
                    <h3 className="text-2xl font-bold text-pink-400 mb-4">{interpretation.title}</h3>
                    <p className="text-lg mb-4">{interpretation.description}</p>
                    <div className="bg-background/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">💡 Empfehlung:</h4>
                      <p className="text-muted-foreground">{interpretation.advice}</p>
                    </div>
                  </div>

                  {/* Rating
                  <div className="text-center space-y-4">
                    <h4 className="text-lg font-semibold">Wie hilfreich war diese Deutung?</h4>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => rateInterpretation(star)}
                          className={`text-2xl transition-colors ${
                            star <= (quizHistory[0]?.rating || 0)
                              ? "text-yellow-500"
                              : "text-muted hover:text-yellow-300"
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>
                  */}

                  <div className="flex justify-center">
                    <button
                      onClick={resetQuiz}
                      className="inline-flex items-center gap-2 px-6 py-3 border border-input bg-background rounded-lg hover:bg-muted transition-colors"
                    >
                      <RotateCcwIcon className="h-4 w-4" />
                      Neues Quiz starten
                    </button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <HelpCircleIcon className="inline-block h-4 w-4 mr-1" />
                    Hinweis: Dies ist nur eine mögliche Interpretation. Träume können viele Bedeutungen haben.
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quiz History */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-semibold mb-4">Frühere Deutungen</h3>
              <div className="space-y-4">
                {quizHistory.map((entry, index) => (
                  <div key={index} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{entry.interpretation}</h4>
                          <span className="text-sm text-muted-foreground">• {entry.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.description}</p>
                      </div>
                      {entry.rating > 0 && (
                        <div className="flex items-center gap-1 ml-4">
                          {Array.from({ length: entry.rating }, (_, i) => (
                            <span key={i} className="text-yellow-500">
                              ⭐
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
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
