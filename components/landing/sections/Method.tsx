'use client'

import { motion } from 'framer-motion'
import { BRAND } from '@/lib/brand'

export function Method() {
  return (
    <section className="relative bg-ink px-8 py-24 sm:px-12 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="font-sans text-[clamp(36px,8vw,72px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-fg"
          >
            {BRAND.method.headingLines[0]}
            <br />
            {BRAND.method.headingLines[1]}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-xs font-serif text-[14px] leading-relaxed text-muted sm:text-[15px] md:pt-2 md:text-right"
          >
            {BRAND.method.intro}
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          {BRAND.method.cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="border-t border-moss pt-4"
            >
              <div className="mb-3 font-mono text-[11px] text-phosphor">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="mb-2 font-sans text-[15px] font-semibold text-fg sm:text-[16px]">
                {c.title}
              </div>
              <div className="font-serif text-[13px] leading-relaxed text-muted sm:text-[14px]">
                {c.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
