'use client'

import { motion } from 'framer-motion'
import { BRAND } from '@/lib/brand'

export function Layers() {
  return (
    <section className="relative flex min-h-screen min-h-[100dvh] items-center justify-center bg-void px-6 py-32">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1 }}
        >
          <div className="mb-8 font-mono text-[12px] uppercase tracking-[0.2em] text-phosphor">
            {BRAND.layers.subtitle}
          </div>
          <h2 className="mb-10 font-sans text-[clamp(28px,6vw,56px)] font-semibold leading-[1.15] tracking-[-0.02em] text-fg">
            {BRAND.layers.heading}
          </h2>
          <p className="mx-auto max-w-xl font-serif text-[15px] leading-relaxed text-fg-dim sm:text-[17px]">
            {BRAND.layers.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="mt-20 flex flex-col items-center gap-4"
        >
          {BRAND.layers.items.map((it) => (
            <div
              key={it.label}
              className="flex h-[72px] w-full max-w-md items-center justify-between rounded-lg border border-moss px-6"
            >
              <span className="font-mono text-[12px] uppercase tracking-[0.15em] text-muted2">
                {it.step}
              </span>
              <span className="font-sans text-[16px] font-medium text-fg sm:text-[18px]">
                {it.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
