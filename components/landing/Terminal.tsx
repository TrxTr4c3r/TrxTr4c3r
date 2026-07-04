'use client'

import { useEffect, useState } from 'react'
import { BRAND } from '@/lib/brand'

// The signature "command line is the brand" motif: a phosphor terminal that
// types a trace on screen, with a blinking cursor. Illustrative copy only.
export function Terminal({ className }: { className?: string }) {
  const lines = BRAND.terminal
  const rendered = lines.map((l) => (l.kind === 'cmd' ? `$ ${l.text}` : l.text))
  const total = rendered.reduce((a, s) => a + s.length, 0)
  const [n, setN] = useState(0)

  useEffect(() => {
    if (n >= total) return
    const step = Math.random() < 0.18 ? 2 : 1
    const id = setTimeout(() => setN((v) => Math.min(total, v + step)), 32)
    return () => clearTimeout(id)
  }, [n, total])

  let remaining = n
  const activeIndex = (() => {
    let acc = 0
    for (let i = 0; i < rendered.length; i++) {
      acc += rendered[i].length
      if (n <= acc) return i
    }
    return rendered.length - 1
  })()

  return (
    <div
      className={`scanlines relative overflow-hidden rounded-xl border border-hair bg-ink font-mono text-[12px] leading-relaxed sm:text-[13px] ${className ?? ''}`}
    >
      <div className="flex items-center gap-2 border-b border-hair bg-void/60 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-phosphor" />
        <span className="h-2.5 w-2.5 rounded-full bg-moss" />
        <span className="ml-2 text-[11px] tracking-[0.2em] text-muted2">
          trace.sh
        </span>
      </div>
      <div className="space-y-1 px-4 py-4">
        {lines.map((l, i) => {
          const full = rendered[i]
          const take = Math.max(0, Math.min(full.length, remaining))
          remaining -= full.length
          if (take <= 0 && i > activeIndex) return null
          const shown = full.slice(0, take)
          const color =
            l.kind === 'cmd'
              ? 'text-phosphor'
              : l.kind === 'hi'
                ? 'font-bold text-phosphor'
                : 'text-fg-dim'
          return (
            <div key={i} className={color}>
              {shown}
              {i === activeIndex && (
                <span className="bp-cursor ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.15em] bg-phosphor" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
