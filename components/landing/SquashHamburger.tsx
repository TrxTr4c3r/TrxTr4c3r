'use client'

import { motion } from 'framer-motion'

// Three bars that squash into an X. Spring: stiffness 300, damping 20.
export function SquashHamburger({
  isOpen,
  variant = 'desktop',
}: {
  isOpen: boolean
  variant?: 'desktop' | 'mobile'
}) {
  const w = variant === 'desktop' ? 18 : 15
  const h = variant === 'desktop' ? 12 : 10
  const bar = variant === 'desktop' ? 1.5 : 1.2
  const mid = (h - bar) / 2
  const spring = { type: 'spring' as const, stiffness: 300, damping: 20 }
  const barStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    width: w,
    height: bar,
    background: 'currentColor',
    borderRadius: 2,
    transformOrigin: 'center',
  }

  return (
    <span
      style={{ position: 'relative', width: w, height: h, display: 'inline-block' }}
      aria-hidden="true"
    >
      <motion.span
        style={{ ...barStyle, top: 0 }}
        animate={isOpen ? { top: mid, rotate: 45 } : { top: 0, rotate: 0 }}
        transition={spring}
      />
      <motion.span
        style={{ ...barStyle, top: mid }}
        animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={spring}
      />
      <motion.span
        style={{ ...barStyle, bottom: 0 }}
        animate={isOpen ? { bottom: mid, rotate: -45 } : { bottom: 0, rotate: 0 }}
        transition={spring}
      />
    </span>
  )
}
