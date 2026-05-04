// RippleWaveLoader.tsx
import React from 'react'
import { motion } from 'framer-motion'

interface RippleWaveLoaderProps {
  color?: 'primary' | 'secondary' | 'accent' | 'muted' // couleurs Shadcn
  size?: number // taille globale des barres
}

// Map pour correspondre aux couleurs Shadcn à des codes hex
const COLOR_MAP: Record<string, string> = {
  primary: 'white', // bleu
  secondary: '#f59e0b', // orange
  accent: '#10b981', // vert
  muted: '#9ca3af', // gris clair
}

const RippleWaveLoader: React.FC<RippleWaveLoaderProps> = ({
  color = 'primary',
  size = 32,
}) => {
  const barCount = 7
  const spacing = 4
  const duration = 0.7
  const barHeight = size
  const barWidth = size / 4
  const barColor = COLOR_MAP[color] || COLOR_MAP.primary

  return (
    <div className='flex items-center justify-center' style={{ gap: spacing }}>
      {Array.from({ length: barCount }).map((_, index) => (
        <motion.div
          key={index}
          style={{
            width: barWidth,
            height: barHeight,
            backgroundColor: barColor,
            borderRadius: barWidth / 2,
          }}
          animate={{
            scaleY: [0.5, 1.5, 0.5],
            scaleX: [1, 0.8, 1],
            translateY: ['0%', '-15%', '0%'],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  )
}

export default RippleWaveLoader
