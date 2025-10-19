"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

interface StepProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  isLast?: boolean
  colorScheme: "primary" | "secondary" | "tertiary" | "quaternary" | "quinary"
}

const colorSchemes = {
  primary: {
    background: "linear-gradient(135deg, #F765A3 0%, #F9D2D9 100%)",
    border: "#F765A3",
    text: "#161616",
  },
  secondary: {
    background: "linear-gradient(135deg, #C3B1E1 0%, #F765A3 100%)",
    border: "#C3B1E1",
    text: "#161616",
  },
  tertiary: {
    background: "linear-gradient(135deg, #BFE4E4 0%, #A7C7E7 100%)",
    border: "#BFE4E4",
    text: "#161616",
  },
  quaternary: {
    background: "linear-gradient(135deg, #F765A3 0%, #BFE4E4 100%)",
    border: "#F765A3",
    text: "#161616",
  },
  quinary: {
    background: "linear-gradient(135deg, #FFA4B6 0%, #F9D2D9 100%)",
    border: "#FFA4B6",
    text: "#161616",
  },
}

const Step = ({ title, subtitle, children, isLast = false, colorScheme }: StepProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const colors = colorSchemes[colorScheme]

  return (
    <>
      <motion.div
        className="w-full border-2 rounded-lg shadow-lg overflow-hidden"
        style={{ borderColor: colors.border }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(247, 101, 163, 0.2)" }}
      >
        <div
          className="cursor-pointer p-6 flex flex-col items-center justify-center"
          style={{ background: colors.background }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2
            className="text-xl md:text-2xl font-black text-center mb-2"
            style={{
              color: colors.text,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className="text-center font-bold"
              style={{
                color: colors.text,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {subtitle}
            </p>
          )}
          <button className="mt-3 p-2 rounded-full transition-all duration-200 hover:bg-white/20">
            {isExpanded ? (
              <ChevronUp size={24} style={{ color: colors.text }} />
            ) : (
              <ChevronDown size={24} style={{ color: colors.text }} />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <div className="p-6 border-t-2" style={{ borderColor: colors.border }}>
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {!isLast && (
        <motion.div
          className="flex justify-center my-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <svg width="50" height="50" viewBox="0 0 50 50">
            <motion.path
              d="M25 8 L25 42 M15 32 L25 42 L35 32"
              stroke="#F765A3"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
        </motion.div>
      )}
    </>
  )
}

const InfoCard = ({ title, content, bgColor }: { title: string; content: string; bgColor: string }) => (
  <motion.div
    className="p-4 rounded-lg shadow-md"
    style={{ backgroundColor: bgColor }}
    whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(247, 101, 163, 0.15)" }}
    transition={{ duration: 0.2 }}
  >
    <h3
      className="font-bold mb-3 text-sm md:text-base"
      style={{
        color: "#161616",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {title}
    </h3>
    <p
      className="text-sm leading-relaxed"
      style={{
        color: "#161616",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {content}
    </p>
  </motion.div>
)

export default function MicroneedlingFlowchart() {
  return (
    <div className="w-full max-w-4xl">
      <Step title="ACTION MÉCANIQUE" subtitle="Micro-perforations de l'épiderme et du derme" colorScheme="primary">
        <div className="grid md:grid-cols-2 gap-6">
          <InfoCard
            title="Le processus"
            content="Création de micro-canaux dans la peau à l'aide d'aiguilles fines"
            bgColor="#BFE4E4"
          />
          <InfoCard title="Profondeur" content="Variable selon la zone traitée (0.5mm à 2.5mm)" bgColor="#A7C7E7" />
        </div>
      </Step>

      <Step title="RÉACTION DE LA PEAU (AUTO-RÉPARATION)" colorScheme="secondary">
        <div className="grid md:grid-cols-2 gap-6">
          <InfoCard
            title="Stimulation du collagène et de l'élastine"
            content="Déclenche la production naturelle de collagène et d'élastine pour réparer les micro-lésions"
            bgColor="#F9D2D9"
          />
          <InfoCard
            title="Activation du renouvellement cellulaire"
            content="Accélère le processus de régénération de la peau pour une meilleure texture"
            bgColor="#FFA4B6"
          />
        </div>
      </Step>

      <Step title="ABSORPTION DES ACTIFS (SÉRUM)" colorScheme="tertiary">
        <div className="grid md:grid-cols-2 gap-6">
          <InfoCard
            title="Pénétration profonde du sérum adapté à la peau"
            content="Les micro-canaux permettent une absorption jusqu'à 80% plus efficace des principes actifs"
            bgColor="#C3B1E1"
          />
          <InfoCard
            title="Actions ciblées selon le besoin"
            content="Sérums spécifiques pour l'acné, les tâches, l'hydratation, etc."
            bgColor="#F9D2D9"
          />
        </div>
      </Step>

      <Step title="RÉSULTATS PROGRESSIFS" colorScheme="quaternary">
        <div className="grid md:grid-cols-2 gap-6">
          <InfoCard
            title="Teint plus lumineux et homogène"
            content="Amélioration visible de la texture et de l'éclat de la peau"
            bgColor="#BFE4E4"
          />
          <InfoCard
            title="Diminution des imperfections"
            content="Réduction de l'acné, des tâches et des pores dilatés"
            bgColor="#A7C7E7"
          />
        </div>
      </Step>

      <Step title="OPTION : LUMINOTHÉRAPIE EN FIN DE SOIN" colorScheme="quinary" isLast={true}>
        <div className="grid md:grid-cols-3 gap-6">
          <InfoCard
            title="Cicatrices et collagène"
            content="Lumière rouge (630-660nm) pour stimuler davantage la production de collagène"
            bgColor="#C3B1E1"
          />
          <InfoCard
            title="Acné"
            content="Lumière bleue (415-430nm) pour ses propriétés antibactériennes"
            bgColor="#BFE4E4"
          />
          <InfoCard
            title="Tâches pigmentaires"
            content="Lumière jaune (585-595nm) pour réduire l'hyperpigmentation"
            bgColor="#FFA4B6"
          />
        </div>
      </Step>
    </div>
  )
}
