'use client'

import { useEffect, useState } from 'react'
import { Navbar } from './Navbar'
import { Hero } from './sections/Hero'
import { Statement } from './sections/Statement'
import { Metrics } from './sections/Metrics'
import { Method } from './sections/Method'
import { Layers } from './sections/Layers'
import { SiteFooter } from './sections/SiteFooter'

export function Landing() {
  const [entranceComplete, setEntranceComplete] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setEntranceComplete(true), 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="landing-root min-h-[100dvh]">
      <Navbar entranceComplete={entranceComplete} />
      <Hero entranceComplete={entranceComplete} />
      <Statement />
      <Metrics />
      <Method />
      <Layers />
      <SiteFooter />
    </div>
  )
}
