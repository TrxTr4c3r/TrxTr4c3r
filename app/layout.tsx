import type { Metadata } from 'next'
import { Archivo, Space_Mono, Source_Serif_4 } from 'next/font/google'
import { BRAND } from '../lib/brand'
import './globals.css'

// TrxTr4c3r "Terminal" brand type pairing:
//  - Archivo: headings / wordmark (industrial grotesk)
//  - Space Mono: data, hashes, CLI, labels
//  - Source Serif 4: long-form prose
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-archivo',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-space-mono',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-source-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: `${BRAND.name} — Independent Blockchain Investigator`,
  description: BRAND.tagline,
}

// Root layout sets NO global background or reset. The dark Terminal theme
// belongs to the landing wrapper; the /kb docs bring their own dark theme.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${spaceMono.variable} ${sourceSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
