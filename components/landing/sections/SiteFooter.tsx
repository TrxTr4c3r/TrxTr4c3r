import Link from 'next/link'
import { BRAND } from '@/lib/brand'
import { SiteLogo } from '../SiteLogo'

export function SiteFooter() {
  return (
    <footer className="relative grid min-h-[400px] grid-cols-1 overflow-hidden border-t border-moss bg-void md:grid-cols-2">
      <div className="scanlines relative flex items-center justify-center border-b border-moss bg-ink p-10 md:border-b-0 md:border-r">
        <SiteLogo size={132} />
        <span className="bp-cursor absolute bottom-10 right-10 h-4 w-2.5 bg-phosphor" />
      </div>
      <div className="flex flex-col justify-between p-10 sm:p-16">
        <div>
          <div className="mb-6 flex items-center gap-2.5">
            <SiteLogo size={22} />
            <span className="font-mono text-[15px] font-bold text-fg/80">
              {BRAND.name}
            </span>
          </div>
          <p className="max-w-sm font-serif text-[14px] leading-relaxed text-muted sm:text-[15px]">
            {BRAND.footer.positioning}
          </p>
          <div className="mt-8 flex gap-6 font-mono text-[13px] text-fg-dim">
            <a href={BRAND.links.github} className="hover:text-phosphor">
              GitHub
            </a>
            <a href={BRAND.links.x} className="hover:text-phosphor">
              Twitter
            </a>
            <Link href={BRAND.links.kb} className="hover:text-phosphor">
              Knowledge base
            </Link>
          </div>
        </div>
        <div className="mt-12 font-mono text-[12px] text-muted2">
          {BRAND.footer.copyright}
        </div>
      </div>
    </footer>
  )
}
