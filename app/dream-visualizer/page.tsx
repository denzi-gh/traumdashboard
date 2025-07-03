"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, DownloadIcon, RefreshCwIcon, SparklesIcon } from "lucide-react"
import { useDreamData } from "@/contexts/dream-data-context"
import { useUser } from "@/contexts/user-context"
import { motion } from "framer-motion"

export default function DreamVisualizerPage() {
  const { dreamData } = useDreamData()
  const { username } = useUser()
  const router = useRouter()
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [imageGenerated, setImageGenerated] = React.useState(false)
  const [generationSeed, setGenerationSeed] = React.useState(Math.random()) // Zufallsseed für Variation


  // Erweiterte Farbpaletten basierend auf Stimmung
  const getMoodPalette = (mood: string) => {
    const palettes = {
      "very-positive": {
        primary: ["#22c55e", "#10b981", "#059669"],
        secondary: ["#fbbf24", "#f59e0b", "#d97706"],
        accent: ["#06b6d4", "#0891b2", "#0e7490"],
        light: ["#ecfdf5", "#d1fae5", "#a7f3d0"],
      },
      positive: {
        primary: ["#10b981", "#059669", "#047857"],
        secondary: ["#3b82f6", "#2563eb", "#1d4ed8"],
        accent: ["#8b5cf6", "#7c3aed", "#6d28d9"],
        light: ["#ddd6fe", "#c4b5fd", "#a78bfa"],
      },
      neutral: {
        primary: ["#3b82f6", "#2563eb", "#1d4ed8"],
        secondary: ["#6366f1", "#4f46e5", "#4338ca"],
        accent: ["#06b6d4", "#0891b2", "#0e7490"],
        light: ["#dbeafe", "#bfdbfe", "#93c5fd"],
      },
      negative: {
        primary: ["#f59e0b", "#d97706", "#b45309"],
        secondary: ["#ef4444", "#dc2626", "#b91c1c"],
        accent: ["#8b5cf6", "#7c3aed", "#6d28d9"],
        light: ["#fef3c7", "#fde68a", "#fcd34d"],
      },
      "very-negative": {
        primary: ["#ef4444", "#dc2626", "#b91c1c"],
        secondary: ["#7f1d1d", "#991b1b", "#b91c1c"],
        accent: ["#374151", "#4b5563", "#6b7280"],
        light: ["#fee2e2", "#fecaca", "#fca5a5"],
      },
    }
    return palettes[mood as keyof typeof palettes] || palettes.neutral
  }

  // Seeded Random für konsistente aber zufällige Ergebnisse
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  // Erweiterte Traumtyp-spezifische Generierung mit Zufallselementen
  const renderDreamTypeElements = (ctx: CanvasRenderingContext2D, palette: any, seed: number) => {
    ctx.save()

    switch (dreamData.dreamType) {
      case "Luzide Träume":
        renderLucidDreamElements(ctx, palette, seed)
        break
      case "Albträume":
        renderNightmareElements(ctx, palette, seed)
        break
      case "Fantasie Träume":
        renderFantasyElements(ctx, palette, seed)
        break
      default:
        renderEverydayElements(ctx, palette, seed)
    }

    ctx.restore()
  }

  const renderLucidDreamElements = (ctx: CanvasRenderingContext2D, palette: any, seed: number) => {
    // Zufällige Anzahl von Spiralen (3-7)
    const spiralCount = Math.floor(seededRandom(seed) * 5) + 3

    for (let i = 0; i < spiralCount; i++) {
      // Zufällige Positionen mit Seed
      const centerX = 100 + seededRandom(seed + i * 10) * 600
      const centerY = 150 + seededRandom(seed + i * 20) * 300

      // Zufällige Größe
      const size = 60 + seededRandom(seed + i * 30) * 40

      // Äußerer Glow mit zufälliger Intensität
      const glowIntensity = 0.5 + seededRandom(seed + i * 40) * 0.5
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size)
      gradient.addColorStop(
        0,
        palette.primary[0] +
          Math.floor(glowIntensity * 128)
            .toString(16)
            .padStart(2, "0"),
      )
      gradient.addColorStop(1, palette.primary[0] + "00")
      ctx.fillStyle = gradient
      ctx.fillRect(centerX - size, centerY - size, size * 2, size * 2)

      // Spirale mit zufälliger Drehung
      const rotation = seededRandom(seed + i * 50) * Math.PI * 2
      ctx.strokeStyle = palette.primary[i % palette.primary.length]
      ctx.lineWidth = 2 + seededRandom(seed + i * 60) * 3
      ctx.shadowColor = palette.primary[0]
      ctx.shadowBlur = 5 + seededRandom(seed + i * 70) * 10
      ctx.beginPath()
      for (let angle = 0; angle < Math.PI * 6; angle += 0.1) {
        const radius = angle * (4 + seededRandom(seed + i * 80) * 6)
        const x = centerX + Math.cos(angle + rotation) * radius
        const y = centerY + Math.sin(angle + rotation) * radius
        if (angle === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Zufällige geometrische Formen
      const shapeType = Math.floor(seededRandom(seed + i * 90) * 3)
      ctx.fillStyle = palette.accent[0] + "60"

      if (shapeType === 0) {
        // Rechteck
        const rectSize = 20 + seededRandom(seed + i * 100) * 30
        ctx.fillRect(centerX - rectSize / 2, centerY - rectSize / 2, rectSize, rectSize)
      } else if (shapeType === 1) {
        // Kreis
        const circleRadius = 15 + seededRandom(seed + i * 110) * 25
        ctx.beginPath()
        ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Dreieck
        const triSize = 25 + seededRandom(seed + i * 120) * 20
        ctx.beginPath()
        ctx.moveTo(centerX, centerY - triSize)
        ctx.lineTo(centerX - triSize, centerY + triSize)
        ctx.lineTo(centerX + triSize, centerY + triSize)
        ctx.closePath()
        ctx.fill()
      }
    }
  }

  const renderNightmareElements = (ctx: CanvasRenderingContext2D, palette: any, seed: number) => {
    ctx.globalCompositeOperation = "multiply"

    // Zufällige Anzahl von bedrohlichen Formen (5-12)
    const shapeCount = Math.floor(seededRandom(seed) * 8) + 5

    for (let i = 0; i < shapeCount; i++) {
      const x = seededRandom(seed + i * 10) * 800
      const y = 200 + seededRandom(seed + i * 20) * 400

      // Zackige Schatten mit zufälliger Form
      ctx.fillStyle = palette.primary[2] + Math.floor(30 + seededRandom(seed + i * 30) * 40).toString(16)
      ctx.beginPath()
      ctx.moveTo(x, y)

      const vertices = 6 + Math.floor(seededRandom(seed + i * 40) * 6)
      for (let j = 0; j < vertices; j++) {
        const angle = (j / vertices) * Math.PI * 2
        const radius = 20 + seededRandom(seed + i * 50 + j) * 60
        const jitter = (seededRandom(seed + i * 60 + j) - 0.5) * 40
        ctx.lineTo(x + Math.cos(angle) * radius + jitter, y + Math.sin(angle) * radius + jitter)
      }
      ctx.closePath()
      ctx.fill()

      // Zufällige Risse
      const crackCount = Math.floor(seededRandom(seed + i * 70) * 4) + 1
      for (let k = 0; k < crackCount; k++) {
        ctx.strokeStyle = palette.secondary[0] + Math.floor(60 + seededRandom(seed + i * 80 + k) * 80).toString(16)
        ctx.lineWidth = 1 + seededRandom(seed + i * 90 + k) * 4
        ctx.beginPath()
        ctx.moveTo(x, y)
        const endX = x + (seededRandom(seed + i * 100 + k) - 0.5) * 300
        const endY = y + (seededRandom(seed + i * 110 + k) - 0.5) * 300
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }
    }

    ctx.globalCompositeOperation = "source-over"
  }

  const renderFantasyElements = (ctx: CanvasRenderingContext2D, palette: any, seed: number) => {
    const colors = [...palette.primary, ...palette.secondary, ...palette.accent]

    // Zufällige Anzahl von magischen Orbs (10-20)
    const orbCount = Math.floor(seededRandom(seed) * 11) + 10

    for (let i = 0; i < orbCount; i++) {
      const x = seededRandom(seed + i * 10) * 800
      const y = seededRandom(seed + i * 20) * 600
      const size = 15 + seededRandom(seed + i * 30) * 80

      // Magische Orbs mit zufälligen Farben
      const colorIndex = Math.floor(seededRandom(seed + i * 40) * colors.length)
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
      gradient.addColorStop(0, colors[colorIndex] + "80")
      gradient.addColorStop(0.7, colors[colorIndex] + "40")
      gradient.addColorStop(1, colors[colorIndex] + "00")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()

      // Zufällige Verbindungslinien
      if (i > 0 && seededRandom(seed + i * 50) > 0.6) {
        const prevIndex = Math.floor(seededRandom(seed + i * 60) * i)
        const prevX = seededRandom(seed + prevIndex * 10) * 800
        const prevY = seededRandom(seed + prevIndex * 20) * 600

        ctx.strokeStyle = palette.accent[0] + "30"
        ctx.lineWidth = 1 + seededRandom(seed + i * 70) * 2
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(prevX, prevY)
        ctx.stroke()
      }
    }

    // Zufällige Kristalle (3-8)
    const crystalCount = Math.floor(seededRandom(seed + 1000) * 6) + 3
    for (let i = 0; i < crystalCount; i++) {
      const x = 50 + seededRandom(seed + 1100 + i * 10) * 700
      const y = 300 + seededRandom(seed + 1200 + i * 20) * 200
      const height = 30 + seededRandom(seed + 1300 + i * 30) * 40
      const width = 15 + seededRandom(seed + 1400 + i * 40) * 25

      ctx.fillStyle = palette.light[0] + "60"
      ctx.strokeStyle = palette.primary[i % palette.primary.length]
      ctx.lineWidth = 2

      ctx.beginPath()
      ctx.moveTo(x, y - height)
      ctx.lineTo(x - width, y)
      ctx.lineTo(x - width / 2, y + height / 2)
      ctx.lineTo(x + width / 2, y + height / 2)
      ctx.lineTo(x + width, y)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }
  }

  const renderEverydayElements = (ctx: CanvasRenderingContext2D, palette: any, seed: number) => {
    const gridSize = 60 + seededRandom(seed) * 40

    for (let x = 0; x < 800; x += gridSize) {
      for (let y = 0; y < 600; y += gridSize) {
        if (seededRandom(seed + x + y) > 0.6) {
          ctx.fillStyle = palette.primary[0] + "20"
          ctx.strokeStyle = palette.secondary[0] + "60"
          ctx.lineWidth = 1

          const size = 20 + seededRandom(seed + x + y + 100) * 30
          const offsetX = seededRandom(seed + x + y + 200) * 20
          const offsetY = seededRandom(seed + x + y + 300) * 20

          ctx.fillRect(x + 20 + offsetX, y + 20 + offsetY, size, size)
          ctx.strokeRect(x + 20 + offsetX, y + 20 + offsetY, size, size)
        }
      }
    }

    // Fließende Linien mit Zufallsvariation
    const lineCount = Math.floor(seededRandom(seed + 2000) * 4) + 3
    ctx.strokeStyle = palette.accent[0] + "40"
    ctx.lineWidth = 2 + seededRandom(seed + 3000) * 3

    for (let i = 0; i < lineCount; i++) {
      const startY = 80 + i * 120 + seededRandom(seed + 4000 + i) * 60
      const amplitude = 20 + seededRandom(seed + 5000 + i) * 40
      const frequency = 0.005 + seededRandom(seed + 6000 + i) * 0.01

      ctx.beginPath()
      ctx.moveTo(0, startY)
      for (let x = 0; x < 800; x += 20) {
        const y = startY + Math.sin(x * frequency + i) * amplitude
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  }

  // Erweiterte Symboldarstellung mit Zufallspositionen
  const renderSymbols = (ctx: CanvasRenderingContext2D, palette: any, seed: number) => {
    const symbols = dreamData.searchedSymbols.slice(0, 5)
    const symbolMap: { [key: string]: (x: number, y: number, variation: number) => void } = {
      Fliegen: (x, y, variation) => {
        // Flügel mit zufälliger Größe und Rotation
        const wingSize = 20 + variation * 15
        const rotation = (variation - 0.5) * 0.6

        ctx.fillStyle = palette.light[0] + "80"
        ctx.beginPath()
        ctx.ellipse(x - 30, y, wingSize, wingSize * 0.6, -0.3 + rotation, 0, Math.PI * 2)
        ctx.ellipse(x + 30, y, wingSize, wingSize * 0.6, 0.3 + rotation, 0, Math.PI * 2)
        ctx.fill()

        // Körper
        ctx.fillStyle = palette.primary[0]
        ctx.fillRect(x - 3, y - 10, 6, 20)
      },
      Wasser: (x, y, variation) => {
        // Wassertropfen mit zufälliger Animation
        const dropCount = Math.floor(variation * 3) + 3
        for (let i = 0; i < dropCount; i++) {
          const dropX = x + (i - dropCount / 2) * 15
          const dropY = y + Math.sin(Date.now() * 0.001 + i + variation * 10) * 15

          ctx.fillStyle = palette.accent[0] + "60"
          ctx.beginPath()
          ctx.arc(dropX, dropY + 10, 6 + variation * 4, 0, Math.PI * 2)
          ctx.moveTo(dropX, dropY)
          ctx.lineTo(dropX - 5, dropY + 10)
          ctx.lineTo(dropX + 5, dropY + 10)
          ctx.closePath()
          ctx.fill()
        }
      },
      Fallen: (x, y, variation) => {
        // Fallende Linien mit zufälliger Intensität
        const lineCount = Math.floor(variation * 4) + 5
        ctx.strokeStyle = palette.secondary[0] + "80"
        ctx.lineWidth = 2 + variation * 2
        for (let i = 0; i < lineCount; i++) {
          const lineX = x + (i - lineCount / 2) * 6
          const length = 30 + variation * 20
          ctx.beginPath()
          ctx.moveTo(lineX, y - length / 2)
          ctx.lineTo(lineX, y + length / 2)
          ctx.stroke()
        }
      },
    }

    symbols.forEach((symbol, index) => {
      // Zufällige Positionen für Symbole
      const baseX = 120 + index * 140
      const x = baseX + (seededRandom(seed + index * 100) - 0.5) * 60
      const y = 60 + seededRandom(seed + index * 200) * 40
      const variation = seededRandom(seed + index * 300)

      // Hintergrund-Glow mit zufälliger Intensität
      const glowSize = 40 + variation * 30
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize)
      gradient.addColorStop(0, palette.primary[0] + Math.floor(20 + variation * 40).toString(16))
      gradient.addColorStop(1, palette.primary[0] + "00")
      ctx.fillStyle = gradient
      ctx.fillRect(x - glowSize, y - glowSize, glowSize * 2, glowSize * 2)

      // Symbol rendern
      if (symbolMap[symbol]) {
        symbolMap[symbol](x, y, variation)
      } else {
        // Standard-Symbol mit zufälliger Größe
        ctx.fillStyle = palette.primary[0]
        ctx.font = `bold ${20 + variation * 12}px Arial`
        ctx.textAlign = "center"
        ctx.fillText(symbol, x, y + 8)
      }
    })
  }

  // Hauptgenerierungsfunktion
  const generateDreamImage = React.useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    console.log("Generiere Bild mit Seed:", generationSeed)

    setIsGenerating(true)
    setImageGenerated(false)

    // Canvas leeren
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Canvas-Größe setzen
    canvas.width = 800
    canvas.height = 600

    const palette = getMoodPalette(dreamData.mood)

    // Hintergrund mit zufälligen Variationen
    const bgVariation = seededRandom(generationSeed)
    const bgGradient = ctx.createLinearGradient(
      bgVariation * 200,
      bgVariation * 200,
      800 - bgVariation * 200,
      600 - bgVariation * 200,
    )
    bgGradient.addColorStop(0, palette.primary[0])
    bgGradient.addColorStop(0.3 + bgVariation * 0.2, palette.secondary[0])
    bgGradient.addColorStop(0.7 - bgVariation * 0.2, palette.accent[0])
    bgGradient.addColorStop(1, palette.primary[2])
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, 800, 600)

    // Textur-Overlay mit zufälliger Dichte
    ctx.globalCompositeOperation = "overlay"
    const textureCount = 800 + Math.floor(seededRandom(generationSeed + 1000) * 400)
    for (let i = 0; i < textureCount; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${seededRandom(generationSeed + i) * 0.15})`
      ctx.fillRect(
        seededRandom(generationSeed + i + 1000) * 800,
        seededRandom(generationSeed + i + 2000) * 600,
        1 + seededRandom(generationSeed + i + 3000) * 2,
        1 + seededRandom(generationSeed + i + 4000) * 2,
      )
    }
    ctx.globalCompositeOperation = "source-over"

    // Sterne mit zufälligen Positionen und Größen
    const starCount =
      Math.floor((dreamData.sleepQuality / 100) * 60) + Math.floor(seededRandom(generationSeed + 5000) * 40)
    for (let i = 0; i < starCount; i++) {
      const x = seededRandom(generationSeed + i + 6000) * 800
      const y = seededRandom(generationSeed + i + 7000) * 300
      const size = seededRandom(generationSeed + i + 8000) * 5 + 1
      const brightness = (dreamData.sleepQuality / 100) * (0.5 + seededRandom(generationSeed + i + 9000) * 0.5)

      // Stern mit Glow
      const starGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3)
      starGradient.addColorStop(0, `rgba(255, 255, 255, ${brightness})`)
      starGradient.addColorStop(1, `rgba(255, 255, 255, 0)`)

      ctx.fillStyle = starGradient
      ctx.beginPath()
      ctx.arc(x, y, size * 3, 0, Math.PI * 2)
      ctx.fill()

      // Stern-Kern
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.8})`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    // Traumtyp-spezifische Elemente mit Zufallsseed
    renderDreamTypeElements(ctx, palette, generationSeed)

    // Symbole mit Zufallsvariation
    renderSymbols(ctx, palette, generationSeed)

    // Benutzername und Metadaten
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.font = "bold 20px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`${username}'s Traum`, 30, 40)

    ctx.font = "14px Arial"
    ctx.fillText(`Stimmung: ${dreamData.mood}`, 30, 65)
    ctx.fillText(`Schlafqualität: ${dreamData.sleepQuality}%`, 30, 85)
    ctx.fillText(`Typ: ${dreamData.dreamType}`, 30, 105)
    ctx.fillText(dreamData.lastUpdated.toLocaleDateString("de-DE"), 30, 125)

    // Stil-Signatur
    ctx.textAlign = "right"

    setTimeout(() => {
      setIsGenerating(false)
      setImageGenerated(true)
    }, 2000)
  }, [dreamData, username, generationSeed])

  // Bild beim Laden der Seite generieren (nur einmal)
  React.useEffect(() => {
    generateDreamImage()
  }, []) // Entferne generateDreamImage aus den Abhängigkeiten!

  const handleRegenerateClick = () => {
    setGenerationSeed(Math.random()) // Neuer Zufallsseed für Variation
    generateDreamImage()
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `${username}-traum-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950/50 to-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Zurück zum Dashboard
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <SparklesIcon className="h-6 w-6 text-green-400" />
          Traum Visualizer
        </h1>
        <div></div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Datenübersicht */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Deine Traumdaten</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Stimmung</label>
                  <p className="font-medium">{dreamData.mood}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Schlafqualität</label>
                  <p className="font-medium">{dreamData.sleepQuality}%</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Traumtyp</label>
                  <p className="font-medium">{dreamData.dreamType}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Symbole</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {dreamData.searchedSymbols.slice(0, 3).map((symbol, index) => (
                      <span key={index} className="px-2 py-1 bg-primary/20 text-primary rounded-md text-sm">
                        {symbol}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Aktionen</h3>
              <div className="space-y-3">
                <button
                  onClick={handleRegenerateClick}
                  disabled={isGenerating}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCwIcon className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                  {isGenerating ? "Generiere..." : "Neu generieren"}
                </button>
                <button
                  onClick={downloadImage}
                  disabled={!imageGenerated}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <DownloadIcon className="h-4 w-4" />
                  Bild herunterladen
                </button>
              </div>
            </div>
          </motion.div>

          {/* Visualisierung */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Dein Traumbild</h3>
                <div className="text-sm text-muted-foreground">
                  Generiert am {dreamData.lastUpdated.toLocaleString("de-DE")}
                </div>
              </div>

              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto rounded-lg border shadow-lg"
                  style={{ maxHeight: "600px" }}
                />

                {isGenerating && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="mx-auto mb-4"
                      >
                        <SparklesIcon className="h-12 w-12" />
                      </motion.div>
                      <p className="text-lg font-medium">Generiere dein Traumbild...</p>
                      <p className="text-sm opacity-75">Basierend auf deinen Traumdaten</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
