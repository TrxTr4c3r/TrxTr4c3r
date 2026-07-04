'use client'

import { useEffect, useRef, useState } from 'react'

const CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><'

// Entrance reveal. After `delay` ms, reveals left to right at 0.5 char/frame on
// a 25ms interval. Unrevealed chars show random glyphs up to 3 ahead of the
// cursor, then blank. Spaces stay spaces. Pre-trigger renders a non-breaking
// space so layout does not jump.
export function ScrambleIn({
  text,
  delay = 0,
  triggered,
  className,
}: {
  text: string
  delay?: number
  triggered: boolean
  className?: string
}) {
  const [display, setDisplay] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!triggered) return
    let interval: ReturnType<typeof setInterval>
    const timeout = setTimeout(() => {
      setStarted(true)
      let revealed = 0
      interval = setInterval(() => {
        revealed += 0.5
        const cursor = Math.floor(revealed)
        let out = ''
        for (let i = 0; i < text.length; i++) {
          const ch = text[i]
          if (ch === ' ') {
            out += ' '
          } else if (i < cursor) {
            out += ch
          } else if (i < cursor + 3) {
            out += CHARS[Math.floor(Math.random() * CHARS.length)]
          }
        }
        setDisplay(out)
        if (cursor >= text.length) {
          clearInterval(interval)
          setDisplay(text)
        }
      }, 25)
    }, delay)
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [triggered, text, delay])

  if (!started) {
    return (
      <span className={className} dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />
    )
  }
  return <span className={className}>{display}</span>
}
