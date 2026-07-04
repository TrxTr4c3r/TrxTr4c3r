'use client'

import { motion } from 'framer-motion'
import { BRAND } from '@/lib/brand'

export function Metrics() {
  return (
    <section id="work" className="relative scroll-mt-24 bg-void px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2 }}
          className="mb-16 text-center font-mono text-[13px] uppercase tracking-[0.2em] text-phosphor sm:text-[14px]"
        >
          {BRAND.metrics.subtitle}
        </motion.div>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-8">
          {BRAND.metrics.items.map((m, i) => (
            <motion.div
              key={m.value + i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="text-center"
            >
              <div className="font-sans text-[clamp(48px,10vw,96px)] font-extrabold leading-none tracking-[-0.04em] text-fg">
                {m.value}
              </div>
              <div className="mx-auto mt-4 max-w-[16rem] font-mono text-[12px] leading-relaxed tracking-wide text-muted sm:text-[13px]">
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
