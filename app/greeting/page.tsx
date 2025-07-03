"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MoonStarIcon, Stars } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import { motion } from "framer-motion"

export default function GreetingPage() {
  const { username, setUsername } = useUser()
  const [name, setName] = React.useState(username)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Fokus auf das Eingabefeld setzen, wenn die Seite geladen wird
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUsername(name)
    setIsTransitioning(true)

    // Kurze Verzögerung für die Ausgangsanimation
    setTimeout(() => {
      router.push("/")
    }, 800)
  }

  // Animationsvarianten für die Elemente
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
    },
  }

  // Hintergrundanimation mit schwebenden Sternen
  const floatingStars = Array(20)
    .fill(0)
    .map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 0.5 + 0.5,
      duration: Math.random() * 20 + 10,
    }))

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-green-950/50 to-background p-4">
      {/* Animierter Hintergrund mit schwebenden Sternen */}
      {floatingStars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute z-0 text-green-300/30"
          initial={{ x: `${star.x}%`, y: `${star.y}%`, opacity: 0.3 }}
          animate={{
            y: [`${star.y}%`, `${star.y - 10}%`, `${star.y}%`],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: star.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{ scale: star.size }}
        >
          <Stars size={24} />
        </motion.div>
      ))}

      {/* Hauptinhalt mit Animationen */}
      <motion.div
        className="relative z-10 w-full max-w-md space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate={isTransitioning ? "exit" : "visible"}
      >
        <motion.div className="text-center" variants={itemVariants}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.3,
            }}
          >
            <MoonStarIcon className="mx-auto h-16 w-16 text-green-400" />
          </motion.div>
          <motion.h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground" variants={itemVariants}>
            Guten Morgen,
          </motion.h1>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="mt-8 space-y-6" variants={itemVariants}>
          <motion.div
            className="space-y-2"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div className="relative">
              <motion.input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-lg border border-input bg-background/80 backdrop-blur-sm px-4 py-3 text-center text-2xl font-medium placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Dein Name"
                required
                whileFocus={{ scale: 1.02, boxShadow: "0px 0px 8px rgba(74, 222, 128, 0.3)" }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  ✨
                </motion.span>
              </span>
              Traum Dashboard starten
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  ✨
                </motion.span>
              </span>
            </motion.button>
          </motion.div>
        </motion.form>

        <motion.div
          className="mt-8 text-center text-sm text-muted-foreground"
          variants={itemVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <p>Mediengestaltung 2</p>
        </motion.div>
      </motion.div>

      {/* Übergangsanimation */}
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-50 bg-green-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </div>
  )
}
