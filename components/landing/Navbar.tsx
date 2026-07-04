'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BRAND } from '@/lib/brand'
import { SiteLogo } from './SiteLogo'
import { ScrambleText } from './ScrambleText'
import { SquashHamburger } from './SquashHamburger'

function NavLink({ label, href }: { label: string; href: string }) {
  const [hover, setHover] = useState(false)
  const inner = (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="font-mono text-[13px] tracking-[0.06em] text-fg-dim transition-colors hover:text-phosphor"
    >
      <ScrambleText text={label} isHovered={hover} />
    </span>
  )
  return href.startsWith('/') ? (
    <Link href={href}>{inner}</Link>
  ) : (
    <a href={href}>{inner}</a>
  )
}

export function Navbar({ entranceComplete }: { entranceComplete: boolean }) {
  const [open, setOpen] = useState(false)
  const [ctaHover, setCtaHover] = useState(false)

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: entranceComplete ? 1 : 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-x-0 top-0 z-50 h-20"
    >
      <nav className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6 md:px-8">
        {/* Logo pill */}
        <a
          href="#top"
          className="flex h-11 items-center gap-2.5 rounded-[14px] border border-moss bg-ink/70 px-4 backdrop-blur-md transition-colors hover:bg-ink"
        >
          <SiteLogo size={18} />
          <span className="font-mono text-[14px] font-bold tracking-[0.02em] text-fg">
            {BRAND.name}
          </span>
        </a>

        {/* Desktop links + CTA */}
        <div className="hidden items-center gap-7 md:flex">
          {BRAND.nav.links.map((l) => (
            <NavLink key={l.label} label={l.label} href={l.href} />
          ))}
          <a
            href={BRAND.nav.cta.href}
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
            className="flex h-11 items-center gap-2 rounded-full bg-phosphor px-5 font-mono text-[13px] font-bold text-void transition-transform hover:scale-[1.03]"
          >
            <span aria-hidden>{'>_'}</span>
            <ScrambleText text={BRAND.nav.cta.label} isHovered={ctaHover} />
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-moss bg-ink/70 text-fg backdrop-blur-md md:hidden"
        >
          <SquashHamburger isOpen={open} variant="mobile" />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-4 mt-1 flex flex-col gap-4 rounded-2xl border border-moss bg-ink/95 p-6 backdrop-blur-md md:hidden"
          >
            {BRAND.nav.links.map((l) =>
              l.href.startsWith('/') ? (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-mono text-[15px] text-fg-dim"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-mono text-[15px] text-fg-dim"
                >
                  {l.label}
                </a>
              ),
            )}
            <a
              href={BRAND.nav.cta.href}
              className="mt-1 flex h-11 w-fit items-center gap-2 rounded-full bg-phosphor px-5 font-mono text-[13px] font-bold text-void"
            >
              <span aria-hidden>{'>_'}</span>
              {BRAND.nav.cta.label}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
