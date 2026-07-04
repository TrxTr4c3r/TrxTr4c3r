'use client'

import { useRef } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion'
import { BRAND } from '@/lib/brand'

export function Statement() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const yRaw = useTransform(scrollYProgress, [0, 1], [60, -120])
  const y = useSpring(yRaw, { stiffness: 15, damping: 32, mass: 1.8 })
  const opacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1])
  const transform = useMotionTemplate`perspective(400px) rotateX(24deg) translateY(${y}px) translateZ(15px)`

  const [before, after] = BRAND.statement.split('evidence')

  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden bg-ink px-6 py-20 sm:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-44"
        style={{
          background: 'linear-gradient(#07100b, transparent)',
        }}
      />
      <motion.p
        style={{ transform, opacity }}
        className="max-w-5xl select-none text-center font-sans text-[22px] font-normal leading-[1.35] tracking-[-0.02em] text-fg sm:text-[30px] md:text-[36px] lg:text-[42px]"
      >
        {before}
        <span className="text-phosphor">evidence</span>
        {after}
      </motion.p>
    </section>
  )
}
