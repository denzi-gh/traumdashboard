"use client"

import * as React from "react"
import { BrainIcon, HelpCircleIcon, RotateCcwIcon } from "lucide-react"
import { PanelWrapper } from "./ui/panel-wrapper"

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
    question: "Was hast du in deinem Traum hauptsächlich getan?",
    options: ["Fliegen", "Laufen/Verfolgt werden", "Sprechen", "Beobachten", "Kämpfen"],
  },
  {
    id: "feeling",
    question: "Wie hast du dich beim Aufwachen gefühlt?",
    options: ["Entspannt", "Verwirrt", "Ängstlich", "Inspiriert", "Müde"],
  },
] as const

const INTERPRETATIONS = [
  "Dein Traum könnte auf ungelöste emotionale Konflikte hindeuten.",
  "Dieser Traum spiegelt möglicherweise deine aktuellen Lebensziele wider.",
  "Die Symbole in deinem Traum deuten auf einen Neuanfang hin.",
  "Dein Unterbewusstsein verarbeitet vergangene Erfahrungen.",
  "Dieser Traum könnte eine kreative Lösung für ein aktuelles Problem enthalten.",
] as const

export function DreamQuiz() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [dreamDescription, setDreamDescription] = React.useState("")
  const [interpretation, setInterpretation] = React.useState("")

  const [quizHistory, setQuizHistory] = React.useState([
    { date: "Vor 3 Tagen", interpretation: "Dein Traum könnte auf ungelöste emotionale Konflikte hindeuten." },
    { date: "Vor 8 Tagen", interpretation: "Die Symbole in deinem Traum deuten auf einen Neuanfang hin." },
  ])

  const handleAnswer = React.useCallback(
    (value: string) => {
      if (currentStep <= QUIZ_QUESTIONS.length) {
        setAnswers((prev) => ({
          ...prev,
          [QUIZ_QUESTIONS[currentStep - 1].id]: value,
        }))

        // Bei der letzten Frage automatisch Ergebnis anzeigen
        if (currentStep === QUIZ_QUESTIONS.length) {
          const randomIndex = Math.floor(Math.random() * INTERPRETATIONS.length)
          const newInterpretation = INTERPRETATIONS[randomIndex]
          setInterpretation(newInterpretation)
          setQuizHistory((prev) => [{ date: "Heute", interpretation: newInterpretation }, ...prev.slice(0, 4)])
          setCurrentStep(currentStep + 1)
        } else {
          setCurrentStep(currentStep + 1)
        }
      }
    },
    [currentStep],
  )

  const handleSubmit = React.useCallback(() => {
    const randomIndex = Math.floor(Math.random() * INTERPRETATIONS.length)
    const newInterpretation = INTERPRETATIONS[randomIndex]
    setInterpretation(newInterpretation)
    setQuizHistory((prev) => [{ date: "Heute", interpretation: newInterpretation }, ...prev.slice(0, 4)])
    setCurrentStep(currentStep + 1)
  }, [currentStep])

  const resetQuiz = React.useCallback(() => {
    setCurrentStep(0)
    setAnswers({})
    setDreamDescription("")
    setInterpretation("")
  }, [])

  return (
    <PanelWrapper
      gradient="pink"
      tag={{
        icon: BrainIcon,
        label: "Quiz",
        color: "bg-pink-500/20 text-pink-500",
      }}
    >
      <div className="p-6">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <BrainIcon className="h-5 w-5 text-pink-400" />
            Traum-Quiz
          </h3>
          <p className="text-sm text-muted-foreground">Finde heraus, was dein Traum bedeuten könnte</p>
        </div>

        {/* Schritt 0: Traumbeschreibung */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h4 className="text-lg font-semibold mb-2">Starte dein Traum-Quiz</h4>
              <p className="text-sm text-muted-foreground">
                Beschreibe kurz deinen letzten Traum, um eine personalisierte Deutung zu erhalten
              </p>
            </div>
            <label htmlFor="dream-description" className="text-sm font-medium">
              Traumbeschreibung *
            </label>
            <textarea
              id="dream-description"
              placeholder="Ich träumte von... (z.B. 'Ich flog über eine Stadt' oder 'Ich war in meinem Elternhaus')"
              value={dreamDescription}
              onChange={(e) => setDreamDescription(e.target.value)}
              className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            {!dreamDescription.trim() && (
              <p className="text-xs text-muted-foreground">
                💡 Tipp: Gib eine kurze Beschreibung ein, um das Quiz zu starten
              </p>
            )}
            <button
              onClick={() => setCurrentStep(1)}
              disabled={!dreamDescription.trim()}
              className="w-full inline-flex h-12 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {dreamDescription.trim() ? "Quiz starten" : "Beschreibung eingeben"}
            </button>
          </div>
        )}

        {/* Quiz-Fragen */}
        {currentStep > 0 && currentStep <= QUIZ_QUESTIONS.length && (
          <div className="space-y-4">
            <div className="mb-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>
                  Frage {currentStep} von {QUIZ_QUESTIONS.length}
                </span>
                <span>{Math.round((currentStep / QUIZ_QUESTIONS.length) * 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-lg font-medium">{QUIZ_QUESTIONS[currentStep - 1].question}</div>
            <div className="space-y-3">
              {QUIZ_QUESTIONS[currentStep - 1].options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={option}
                    name={QUIZ_QUESTIONS[currentStep - 1].id}
                    value={option}
                    onChange={() => handleAnswer(option)}
                    className="h-4 w-4"
                  />
                  <label htmlFor={option} className="text-sm cursor-pointer">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ergebnis */}
        {currentStep === QUIZ_QUESTIONS.length + 1 && (
          <div className="space-y-4">
            <div className="rounded-lg bg-pink-950/20 p-4">
              <div className="mb-2 font-semibold text-pink-400">Traumdeutung:</div>
              <p>{interpretation}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Frühere Deutungen:</h4>
              <div className="space-y-2 max-h-24 overflow-y-auto">
                {quizHistory.map((entry, index) => (
                  <div key={index} className="rounded-md border p-2 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{entry.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{entry.interpretation}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <HelpCircleIcon className="mr-1 inline-block h-4 w-4" />
              Hinweis: Dies ist nur eine mögliche Interpretation. Träume können viele Bedeutungen haben.
            </div>

            <button
              onClick={resetQuiz}
              className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <RotateCcwIcon className="h-4 w-4" />
              Neues Quiz starten
            </button>
          </div>
        )}
      </div>
    </PanelWrapper>
  )
}
