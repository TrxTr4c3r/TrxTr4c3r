'use client'

import { motion } from 'framer-motion'
import { BRAND } from '@/lib/brand'
import { ScrambleIn } from '../ScrambleIn'
import { Terminal } from '../Terminal'

export function Hero({ entranceComplete }: { entranceComplete: boolean }) {
  const h1 =
    'font-sans font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(40px,10vw,100px)] text-fg'

  return (
    <section
      id="top"
      className="scanlines relative flex h-screen h-[100dvh] flex-col overflow-hidden px-4 pb-10 pt-24 sm:px-6 sm:pt-28 md:px-8"
    >
      {/* dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(#e9edf2 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center"
      >
        <span
          className="select-none font-sans font-extrabold uppercase leading-none"
          style={{
            fontSize: 'clamp(120px,30vw,520px)',
            letterSpacing: '-4px',
            opacity: 0.08,
            background:
              'radial-gradient(circle, rgba(76,255,122,0.15) 0%, rgba(76,255,122,0.7) 70%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {BRAND.hero.watermark}
        </span>
      </div>

      {/* upper region: living terminal */}
      <div className="relative flex flex-1 items-start justify-end pt-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: entranceComplete ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-md md:w-[42%]"
        >
          <Terminal />
        </motion.div>
      </div>

      {/* bottom row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: entranceComplete ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <h1 className={h1}>
            <ScrambleIn text={BRAND.hero.left[0]} delay={200} triggered={entranceComplete} />
            <br />
            <ScrambleIn text={BRAND.hero.left[1]} delay={500} triggered={entranceComplete} />
            <span className="bp-cursor ml-2 inline-block h-[0.62em] w-[0.4em] translate-y-[0.02em] bg-phosphor align-baseline" />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={entranceComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1], delay: 0.9 }}
            className="mt-6 max-w-sm font-serif text-[14px] leading-relaxed text-fg-dim sm:text-[15px]"
          >
            {BRAND.hero.body}
          </motion.p>
        </div>
        <div className="md:text-right">
          <h1 className={`${h1} md:text-right`}>
            <ScrambleIn text={BRAND.hero.right[0]} delay={700} triggered={entranceComplete} />
            <br />
            <ScrambleIn text={BRAND.hero.right[1]} delay={1000} triggered={entranceComplete} />
          </h1>
        </div>
      </motion.div>
    </section>
  )
}
