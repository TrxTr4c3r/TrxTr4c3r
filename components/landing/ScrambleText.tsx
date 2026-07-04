'use client'

import { useEffect, useRef, useState } from 'react'

const CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><'

// Hover scramble. On hover, scrambles everything then reveals left to right at
// 4 frames per char (25ms interval). On unhover, resets to the full text
// immediately.
export function ScrambleText({
  text,
  isHovered,
  className,
}: {
  text: string
  isHovered: boolean
  className?: string
}) {
  const [display, setDisplay] = useState(text)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!isHovered) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setDisplay(text)
      return
    }
    let frame = 0
    intervalRef.current = setInterval(() => {
      frame++
      const revealed = Math.floor(frame / 4)
      let out = ''
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        if (ch === ' ') out += ' '
        else if (i < revealed) out += ch
        else out += CHARS[Math.floor(Math.random() * CHARS.length)]
      }
      setDisplay(out)
      if (revealed >= text.length && intervalRef.current) {
        clearInterval(intervalRef.current)
        setDisplay(text)
      }
    }, 25)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isHovered, text])

  return <span className={className}>{display}</span>
}
