import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ref, get } from 'firebase/database'
import { db } from '../firebase'

export default function Hero({ dark }: { dark: boolean }) {
  const [hero, setHero] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const loadingGif = "https://i.gifer.com/ZZ5H.gif"

  // Motion values for 3D tilt
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const xSpring = useSpring(rotateX, { stiffness: 100, damping: 15 })
  const ySpring = useSpring(rotateY, { stiffness: 100, damping: 15 })

  // Background parallax
  const bgX = useMotionValue(50)
  const bgY = useMotionValue(50)
  const bgXSmooth = useSpring(bgX, { stiffness: 50, damping: 20 })
  const bgYSmooth = useSpring(bgY, { stiffness: 50, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window
    const x = (e.clientX / innerWidth - 0.5) * 15
    const y = -(e.clientY / innerHeight - 0.5) * 15
    rotateX.set(y)
    rotateY.set(x)

    // Background parallax (0-100%)
    const bgMoveX = (e.clientX / innerWidth) * 100
    const bgMoveY = (e.clientY / innerHeight) * 100
    bgX.set(bgMoveX)
    bgY.set(bgMoveY)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    bgX.set(50)
    bgY.set(50)
  }

  useEffect(() => {
    get(ref(db, 'hero')).then((s) => {
      if (s.exists()) setHero(s.val())
      setLoading(false)
    })
  }, [])

  if (loading)
    return (
      <section className="section min-h-screen flex items-center justify-center">
        <img src={loadingGif} alt="Loading..." className="w-16 h-16" />
      </section>
    )

  const lightColors = ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', '#F472B6']
  const darkColors = ['#FBBF24', '#34D399', '#60A5FA', '#A78BFA', '#F472B6', '#F87171']
  const colors = dark ? darkColors : lightColors
  const randomColor = () => colors[Math.floor(Math.random() * colors.length)]

  const renderHoverWords = (text: string) => {
    return text.split(' ').map((word, i) => (
      <motion.span
        key={i}
        className="inline-block mr-2 cursor-pointer"
        style={{ color: dark ? '#FFFFFF' : '#111827' }}
        onMouseEnter={(e) => {
          const target = e.target as HTMLElement
          target.style.color = randomColor()
        }}
        onMouseLeave={(e) => {
          const target = e.target as HTMLElement
          target.style.color = dark ? '#FFFFFF' : '#111827'
        }}
        whileHover={{
          scale: 1.3,
          rotateX: Math.random() * 30 - 15,
          rotateY: Math.random() * 30 - 15,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        {word}
      </motion.span>
    ))
  }

  return (
    <motion.section
      id="home"
      className="section min-h-screen flex items-center relative transition-colors duration-500 overflow-hidden px-4"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundImage: hero.backgroundImage ? `url(${hero.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      animate={{
        scale: [1, 1.05, 1],
        backgroundPosition: [
          `${bgXSmooth.get()}% ${bgYSmooth.get()}%`,
          `${bgXSmooth.get() + 2}% ${bgYSmooth.get() + 2}%`,
          `${bgXSmooth.get()}% ${bgYSmooth.get()}%`
        ],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Overlay for readability */}
      <div
        className={`absolute inset-0 ${dark ? 'bg-black/60' : 'bg-black/30'}`}
      ></div>

      <div className="container grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: Passport-style framed Image */}
        <motion.div
          className="flex justify-center md:justify-start"
          style={{
            rotateX: xSpring,
            rotateY: ySpring,
            transformStyle: 'preserve-3d',
          }}
        >
          {hero.image ? (
            <div className="relative w-48 h-64 sm:w-56 sm:h-72 md:w-64 md:h-80 lg:w-72 lg:h-96 bg-white rounded-lg shadow-2xl border-4 border-gray-200 dark:border-gray-600 flex items-center justify-center">
              <motion.img
                src={hero.image}
                alt="Hero"
                className="w-full h-full object-cover rounded-md"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                whileHover={{ scale: 1.05 }}
              />
            </div>
          ) : (
            <div className="w-48 h-64 sm:w-56 sm:h-72 md:w-64 md:h-80 lg:w-72 lg:h-96 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              Image not found
            </div>
          )}
        </motion.div>

        {/* Right: Hero Text */}
        <div className="flex flex-col gap-6 text-center md:text-left">
          {hero.name && (
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold"
              style={{
                rotateX: xSpring,
                rotateY: ySpring,
                transformStyle: 'preserve-3d',
              }}
            >
              {renderHoverWords(hero.name)}
            </motion.h1>
          )}

          {hero.subtitle && (
            <motion.p
              className="text-lg sm:text-xl md:text-2xl font-medium max-w-xl mx-auto md:mx-0"
              style={{
                rotateX: xSpring,
                rotateY: ySpring,
                transformStyle: 'preserve-3d',
              }}
            >
              {renderHoverWords(hero.subtitle)}
            </motion.p>
          )}
        </div>
      </div>
    </motion.section>
  )
}
