import { Layout, Navbar, Footer } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './kb-theme.css'
import { SiteLogo } from '@/components/landing/SiteLogo'
import { BRAND } from '@/lib/brand'

// The Nextra docs chrome, scoped to /kb, forced dark to match the Terminal
// brand. The logo returns to the landing (Navbar logoLink defaults to "/").
export default async function KbLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pageMap = await getPageMap('/kb')

  const navbar = (
    <Navbar
      logo={
        <span
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <SiteLogo size={22} />
          <span
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            {BRAND.name}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: 12,
              opacity: 0.5,
              letterSpacing: '0.1em',
            }}
          >
            / kb
          </span>
        </span>
      }
    />
  )

  const footer = (
    <Footer>
      <span
        style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: 13 }}
      >
        © 2026 {BRAND.name} · on-chain forensics tradecraft
      </span>
    </Footer>
  )

  return (
    <Layout
      navbar={navbar}
      footer={footer}
      pageMap={pageMap}
      sidebar={{ defaultMenuCollapseLevel: 1 }}
      docsRepositoryBase="https://github.com/"
      darkMode={false}
      nextThemes={{ defaultTheme: 'dark', forcedTheme: 'dark' }}
    >
      {children}
    </Layout>
  )
}
