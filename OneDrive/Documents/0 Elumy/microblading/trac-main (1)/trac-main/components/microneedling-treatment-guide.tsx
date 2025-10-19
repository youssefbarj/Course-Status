"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RotateCcw, ChevronLeft, ChevronRight, Clock, CheckCircle, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface TreatmentStep {
  id: number
  title: string
  duration: string
  image: string
  video?: string
  description: string
  benefits: string[]
}

const treatmentSteps: TreatmentStep[] = [
  {
    id: 1,
    title: "Tracer la ligne centrale",
    duration: "2 min",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-6HwOY0xOEB1qlSuSqoVWTpKuw4fGAX.jpeg",
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-6HwOY0xOEB1qlSuSqoVWTpKuw4fGAX.jpeg",
    description:
      "Commencez par tracer la ligne verticale centrale (M) qui divise le visage en deux parties égales. Utilisez un fil tendu depuis le milieu du front jusqu'au menton pour garantir une symétrie parfaite. Cette ligne fondamentale est la base de tout le système de mapping proportionnel.",
    benefits: ["Symétrie centrale", "Base de référence", "Équilibre facial"],
  },
  {
    id: 2,
    title: "Établir les lignes verticales parallèles",
    duration: "2 min",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-1sdGEGyjfRUCRFMhKk67o1fvLGiZnc.jpeg",
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-1sdGEGyjfRUCRFMhKk67o1fvLGiZnc.jpeg",
    description:
      "Tracez les lignes verticales parallèles de chaque côté de la ligne centrale. Ces lignes définissent la largeur du sourcil et les zones de traitement. Utilisez le fil tendu pour maintenir des lignes parfaitement droites et parallèles, assurant une symétrie bilatérale précise.",
    benefits: ["Largeur définie", "Parallélisme parfait", "Zones délimitées"],
  },
  {
    id: 3,
    title: "Ajouter les diagonales de référence",
    duration: "2 min",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-aagDa2NQsxjSjxK45BbwSNcXI3PJXj.jpeg",
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-aagDa2NQsxjSjxK45BbwSNcXI3PJXj.jpeg",
    description:
      "Tracez les premières lignes diagonales depuis l'aile du nez vers les points de référence du visage. Ces diagonales établissent les proportions dorées et déterminent les points clés du sourcil : début, arche et fin. Le fil permet un traçage précis de ces angles critiques.",
    benefits: ["Proportions dorées", "Points clés définis", "Angles précis"],
  },
  {
    id: 4,
    title: "Définir la ligne horizontale",
    duration: "2 min",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-j7L1hOLmIzUwCxO8122tOUBxB3iz01.jpeg",
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-j7L1hOLmIzUwCxO8122tOUBxB3iz01.jpeg",
    description:
      "Établissez la ligne horizontale qui traverse les sourcils pour définir leur hauteur et leur alignement. Cette ligne garantit que les deux sourcils sont à la même hauteur et suivent la courbure naturelle du front. Utilisez le fil tendu horizontalement pour une précision maximale.",
    benefits: ["Hauteur uniforme", "Alignement parfait", "Courbure naturelle"],
  },
  {
    id: 5,
    title: "Tracer les diagonales supérieures",
    duration: "2 min",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-ZH7YynXvjvC8GbAJ5OG4ePVSIalPwX.jpeg",
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-ZH7YynXvjvC8GbAJ5OG4ePVSIalPwX.jpeg",
    description:
      "Ajoutez les lignes diagonales supérieures qui partent du front vers les tempes. Ces lignes affinent la forme de l'arche et définissent la transition entre le début et le sommet du sourcil. Le fil permet de créer des courbes harmonieuses et symétriques.",
    benefits: ["Arche affinée", "Transition douce", "Courbes harmonieuses"],
  },
  {
    id: 6,
    title: "Compléter la grille de mapping",
    duration: "3 min",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-vOJyhQKDHRzEqzmxbOhuMSTktcvTKU.jpeg",
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-vOJyhQKDHRzEqzmxbOhuMSTktcvTKU.jpeg",
    description:
      "Complétez le système de grille en ajoutant toutes les lignes de référence restantes. Cette grille complète crée un réseau de points de repère qui guide le traçage final. Chaque intersection représente un point de mesure précis pour garantir la symétrie et les proportions idéales.",
    benefits: ["Grille complète", "Points de repère multiples", "Précision maximale"],
  },
  {
    id: 7,
    title: "Mesurer et vérifier",
    duration: "3 min",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-SE5IrpjtGIMcZbeawtqR4vnmonw0nA.jpeg",
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-SE5IrpjtGIMcZbeawtqR4vnmonw0nA.jpeg",
    description:
      "Utilisez le fil et les outils de mesure pour vérifier toutes les proportions et la symétrie du mapping. Ajustez si nécessaire pour garantir que toutes les mesures respectent les proportions dorées et la morphologie unique du visage. Cette étape de vérification est cruciale avant le traçage final.",
    benefits: ["Vérification complète", "Ajustements précis", "Qualité garantie"],
  },
  {
    id: 8,
    title: "Schéma global du traçage",
    duration: "1 min",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shema%20globale%20du%20tracage-HIJBCoQ5b2XF9EcAXQ0eRiaYkvNcaW.png",
    description:
      "Référez-vous à ce schéma global complet pour guider votre traçage. Utilisez cette illustration comme référence constante pendant votre travail : elle synthétise l'ensemble du système de mapping avec toutes les lignes de construction, les proportions dorées, et les points de mesure clés. Consultez ce guide visuel pour vérifier vos mesures et garantir des résultats symétriques et harmonieux à chaque étape.",
    benefits: ["Référence complète", "Système de traçage professionnel", "Guide visuel permanent"],
  },
  {
    id: 9,
    title: "Nettoyage du traçage",
    duration: "2 min",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shema%20globale%20du%20tracage-HIJBCoQ5b2XF9EcAXQ0eRiaYkvNcaW.png",
    video: "/videos/nettoyage-tracage.mp4",
    description:
      "Nettoyez délicatement les lignes de construction excédentaires tout en préservant les lignes principales du tracé final. Cette étape permet de clarifier le design et de préparer la zone pour le traitement de microneedling. Un nettoyage soigneux garantit un résultat net et professionnel.",
    benefits: ["Tracé clarifié", "Design épuré", "Préparation optimale"],
  },
]

export default function MicroneedlingTreatmentGuide() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showMobileDetails, setShowMobileDetails] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)

  const handleReset = () => {
    setCurrentStep(0)
    setShowMobileDetails(false)
    setZoomedImage(null)
  }

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex)
    setShowMobileDetails(false)
    setZoomedImage(null)
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setShowMobileDetails(false)
      setZoomedImage(null)
    }
  }

  const handleNext = () => {
    if (currentStep < treatmentSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setShowMobileDetails(false)
      setZoomedImage(null)
    }
  }

  const handleImageZoom = (imageSrc: string) => {
    setZoomedImage(imageSrc)
  }

  const closeZoom = () => {
    setZoomedImage(null)
  }

  const currentStepData = treatmentSteps[currentStep]

  return (
    <div className="w-full max-w-7xl mx-auto p-2 md:p-4">
      {/* Theater Mode - Unobstructed Design */}
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Top Bar - Guide Title */}
        <div className="bg-gradient-to-r from-blue-50 to-violet-50 p-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
              <h1 className="text-xl sm:text-2xl font-bold font-saeada text-gray-800">
                Mapping Proportionnel du Sourcil
              </h1>
              <p className="text-sm font-quicksand text-gray-600 max-w-2xl">
                Le mapping proportionnel utilise les règles de géométrie faciale et les proportions dorées pour créer
                des sourcils parfaitement symétriques. Cette technique professionnelle garantit des résultats harmonieux
                et durables, adaptés à chaque morphologie de visage.
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-xl sm:text-2xl font-bold font-saeada text-gray-800">{currentStep + 1}/9</span>
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 sm:px-4 sm:py-2 rounded-full">
                <Clock size={14} className="sm:w-4 sm:h-4" />
                <span className="text-sm sm:text-base font-semibold font-quicksand text-gray-700">19min</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-quicksand text-gray-600">Progression du traçage</span>
              <span className="text-sm font-bold font-quicksand text-gray-800">
                {Math.round(((currentStep + 1) / treatmentSteps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#000435] to-[#CF9FFF] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / treatmentSteps.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-2 md:p-4">
          {/* Left Side - Step Title (Hidden on mobile, visible on md and up) */}
          <div className="md:col-span-3 hidden md:flex flex-col justify-center">
            <motion.div
              key={`title-${currentStep}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-4 md:p-6 shadow-lg mb-4 md:mb-0"
            >
              <h2 className="text-2xl md:text-3xl font-bold font-saeada text-gray-800 mb-2 md:mb-3 text-center md:text-left">
                {currentStepData.title}
              </h2>
              <div className="flex justify-center md:justify-start mb-3">
                <span className="inline-block px-3 py-1 md:px-4 md:py-2 bg-[#000435] bg-gradient-to-r from-[#000435] to-[#CF9FFF] text-white rounded-full text-sm md:text-base font-bold font-quicksand">
                  {currentStepData.duration}
                </span>
              </div>
              <p className="text-sm md:text-base font-quicksand text-gray-600 leading-relaxed text-center md:text-left">
                {currentStepData.description}
              </p>
            </motion.div>
          </div>

          {/* Center - Main Illustration (Order changed for mobile) */}
          <div className="md:col-span-9 order-first md:order-none">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepData.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-80 sm:h-96 md:h-[36rem] bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl overflow-hidden shadow-lg"
                >
                  {currentStepData.video && currentStepData.id > 7 ? (
                    <video
                      src={currentStepData.video}
                      className="w-full h-full object-contain"
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                    />
                  ) : (
                    <div
                      className="w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleImageZoom(currentStepData.image)}
                    >
                      <Image
                        src={currentStepData.image || "/placeholder.svg"}
                        alt={currentStepData.title}
                        fill
                        style={{ objectFit: "contain" }}
                        priority
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile-only collapsible section */}
        <div className="md:hidden bg-white mx-2 mb-2 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4">
            {/* Step title and duration */}
            <div className="text-center mb-3">
              <h2 className="text-xl font-bold font-saeada text-gray-800 mb-2">{currentStepData.title}</h2>
              <span className="inline-block px-4 py-2 bg-[#000435] bg-gradient-to-r from-[#000435] to-[#CF9FFF] text-white rounded-full text-sm font-bold font-quicksand">
                {currentStepData.duration}
              </span>
            </div>

            {/* Collapsible details */}
            <div className="border-t border-gray-100 pt-3">
              <button
                onClick={() => setShowMobileDetails(!showMobileDetails)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold font-quicksand text-gray-700">Voir les détails</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${showMobileDetails ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {showMobileDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 space-y-4">
                      <div>
                        <h4 className="font-semibold font-saeada text-gray-800 mb-2">Illustration de référence</h4>
                        <div
                          className="relative w-full h-64 bg-gray-50 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => handleImageZoom(currentStepData.image)}
                        >
                          <Image
                            src={currentStepData.image || "/placeholder.svg"}
                            alt={`${currentStepData.title} illustration`}
                            fill
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <h4 className="font-semibold font-saeada text-gray-800 mb-2">Description</h4>
                        <p className="text-sm font-quicksand text-gray-600 leading-relaxed">
                          {currentStepData.description}
                        </p>
                      </div>

                      {/* Benefits */}
                      <div>
                        <h4 className="font-semibold font-saeada text-gray-800 mb-2">Bénéfices</h4>
                        <div className="space-y-2">
                          {currentStepData.benefits.map((benefit, index) => (
                            <div
                              key={index}
                              className="px-3 py-2 bg-violet-100 text-blue-900 rounded-full text-sm font-semibold font-quicksand text-center"
                            >
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="bg-gradient-to-r from-blue-50 to-violet-50 p-3 md:p-4 border-t border-gray-100">
          {/* Control Buttons */}
          <div className="flex justify-center gap-3 md:gap-4 mb-3 md:mb-4">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              size="default"
              className="px-4 py-2 md:px-6 md:py-3 bg-[#000435] bg-gradient-to-r from-[#000435] to-[#CF9FFF] text-white border-none hover:from-[#000435]/90 hover:to-[#CF9FFF]/90 disabled:opacity-50 disabled:cursor-not-allowed font-quicksand text-sm md:text-base shadow-lg"
            >
              <ChevronLeft size={20} className="md:w-6 md:h-6" />
            </Button>

            <Button
              onClick={handleNext}
              disabled={currentStep === treatmentSteps.length - 1}
              variant="outline"
              size="default"
              className="px-4 py-2 md:px-6 md:py-3 bg-[#000435] bg-gradient-to-r from-[#000435] to-[#CF9FFF] text-white border-none hover:from-[#000435]/90 hover:to-[#CF9FFF]/90 disabled:opacity-50 disabled:cursor-not-allowed font-quicksand text-sm md:text-base shadow-lg"
            >
              <ChevronRight size={20} className="md:w-6 md:h-6" />
            </Button>

            <Button
              onClick={handleReset}
              variant="outline"
              size="default"
              className="px-4 py-2 md:px-6 md:py-3 bg-[#000435] bg-gradient-to-r from-[#000435] to-[#CF9FFF] text-white border-none hover:from-[#000435]/90 hover:to-[#CF9FFF]/90 font-quicksand text-sm md:text-base shadow-lg"
            >
              <RotateCcw size={20} className="md:w-6 md:h-6" />
            </Button>
          </div>

          <div className="flex justify-center">
            <div className="flex gap-1 md:gap-2 flex-wrap justify-center max-w-full">
              {treatmentSteps.map((step, index) => (
                <motion.button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`relative w-8 h-8 md:w-10 md:h-10 rounded-full transition-all duration-300 flex items-center justify-center text-xs md:text-sm font-bold font-quicksand flex-shrink-0 ${
                    index === currentStep
                      ? "bg-[#000435] bg-gradient-to-r from-[#000435] to-[#CF9FFF] text-white shadow-xl scale-110"
                      : index < currentStep
                        ? "bg-green-400 text-white shadow-lg"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                  whileHover={{ scale: index === currentStep ? 1.1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Step Number */}
                  <span>{index + 1}</span>

                  {/* Checkmark for Completed Steps */}
                  {index < currentStep && (
                    <motion.div
                      className="absolute -top-1 -right-1 bg-green-600 rounded-full p-0.5 z-20 shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <CheckCircle size={6} className="md:w-2 md:h-2 text-white" />
                    </motion.div>
                  )}

                  {/* Current Step Indicator */}
                  {index === currentStep && (
                    <motion.div
                      className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 z-20 shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-gradient-to-r from-[#000435] to-[#CF9FFF] rounded-full animate-pulse" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeZoom}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeZoom}
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
              >
                <X size={24} className="text-gray-700" />
              </button>
              <div className="w-full h-full p-4">
                <Image
                  src={zoomedImage || "/placeholder.svg"}
                  alt="Zoomed illustration"
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
