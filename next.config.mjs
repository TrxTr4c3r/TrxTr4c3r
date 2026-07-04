import nextra from 'nextra'

// Nextra 4 wraps the Next config. The docs content lives in /content and is
// served under /kb via contentDirBasePath. The landing page owns "/".
const withNextra = nextra({
  contentDirBasePath: '/kb',
  defaultShowCopyCode: true,
})

// basePath is env-driven so a move to a project repo (username.github.io/<repo>)
// is a single env var; empty for a user site or custom domain (our default).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export default withNextra({
  output: 'export',
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
  // trailingSlash so static export emits /kb/index.html (GitHub Pages serves it
  // at /kb/) instead of kb.html which Pages would 404 at /kb.
  trailingSlash: true,
  reactStrictMode: true,
})
