// Re-runnable migration: knowledge-base/*.md (plain-text notes) -> content/**.mdx
// for the Nextra docs at /kb. Idempotent: regenerates topic folders, per-folder
// _meta.ts, the top-level _meta.ts, and the KB landing index.mdx on every run.
//
// Usage: node scripts/migrate-kb.mjs   (from portfolio-site/)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import GithubSlugger from 'github-slugger'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..') // portfolio-site/
const SRC = path.resolve(ROOT, '..', 'knowledge-base')
const DEST = path.resolve(ROOT, 'content')

const TOPICS = {
  '00-fundamentals': {
    title: 'Fundamentals',
    blurb:
      'Blockchain, UTXO and account models, EVM transactions, and the vocabulary every case rests on.',
  },
  '01-osint': {
    title: 'OSINT',
    blurb:
      'Open-source intelligence: what it is, how to collect it safely, and how to grade sources.',
  },
  '02-tracing': {
    title: 'Tracing',
    blurb:
      'Following funds on-chain: graph, taint and peel analysis, cross-chain correlation, EVM mechanics.',
  },
  '03-attribution-clustering': {
    title: 'Attribution & Clustering',
    blurb:
      'Turning addresses into clusters and clusters into real-world identities, with explicit confidence.',
  },
  '04-laundering-obfuscation': {
    title: 'Laundering & Obfuscation',
    blurb:
      'How illicit funds are laundered and obfuscated, and how to break them. Includes the mixers deep-dive.',
  },
  '05-evidence-legal': {
    title: 'Evidence & Legal',
    blurb:
      'Preserving evidence, chain of custody, admissibility, and defensible reporting.',
  },
  '06-casework-method': {
    title: 'Casework Method',
    blurb:
      'Running the investigation: intake, scoping, OPSEC, response priority, freezing, sanctions.',
  },
  '07-tooling': {
    title: 'Tooling',
    blurb: 'Choosing tools, and the consolidated tool catalogue.',
  },
}

const TYPE_ORDER = [
  'concept',
  'definition',
  'principle',
  'framework',
  'workflow',
  'tactic',
  'checklist',
  'caution',
  'example',
  'reference',
]

const TYPE_LABEL = {
  concept: 'Concepts',
  definition: 'Definitions',
  principle: 'Principles',
  framework: 'Frameworks',
  workflow: 'Workflows',
  tactic: 'Tactics',
  checklist: 'Checklists',
  caution: 'Cautions',
  example: 'Worked examples',
  reference: 'Reference',
}

const SKIP = (name) =>
  name.startsWith('_') ||
  name === 'CONTEXT.md' ||
  name.endsWith('_MOC.md') ||
  !name.endsWith('.md')

// --- MDX-safety: escape < { } in prose, leave fenced + inline code intact ---
function escapeProse(s) {
  return s.replace(/[<{}]/g, (c) =>
    c === '<' ? '&lt;' : c === '{' ? '&#123;' : '&#125;',
  )
}
function mdxSafe(body) {
  return body
    .split(/(```[\s\S]*?```)/g)
    .map((chunk) => {
      if (chunk.startsWith('```')) return chunk
      return chunk
        .split(/(`[^`]*`)/g)
        .map((seg) => (seg.startsWith('`') ? seg : escapeProse(seg)))
        .join('')
    })
    .join('')
}

// --- parse a note into { title, meta, body } ---
function parseNote(raw) {
  const lines = raw.split(/\r?\n/)
  let i = 0
  while (i < lines.length && lines[i].trim() === '') i++
  const title = (lines[i] || '').replace(/^#\s+/, '').trim()
  i++
  while (i < lines.length && lines[i].trim() === '') i++
  const meta = {}
  while (
    i < lines.length &&
    lines[i].trim() !== '' &&
    /^[A-Za-z][\w /-]*:\s?/.test(lines[i])
  ) {
    const m = lines[i].match(/^([A-Za-z][\w /-]*):\s?(.*)$/)
    if (!m) break
    meta[m[1].trim().toLowerCase()] = m[2].trim()
    i++
  }
  while (i < lines.length && lines[i].trim() === '') i++
  const body = lines.slice(i).join('\n').trim()
  return { title, meta, body }
}

function noteType(meta, filename) {
  return (meta.type || filename.split('-')[0] || 'reference').toLowerCase()
}

// --- collect all notes (two-pass so Related links can resolve) ---
function listNotes(dir, routeBase, topicKey, sub = null) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && !SKIP(d.name))
    .map((d) => {
      const slug = d.name.replace(/\.md$/, '')
      const raw = fs.readFileSync(path.join(dir, d.name), 'utf8')
      const parsed = parseNote(raw)
      return {
        slug,
        topicKey,
        sub,
        route: `${routeBase}/${slug}`,
        ...parsed,
      }
    })
}

const all = []
for (const topic of Object.keys(TOPICS)) {
  const topicDir = path.join(SRC, topic)
  all.push(...listNotes(topicDir, `/kb/${topic}`, topic))
  const mixersDir = path.join(topicDir, 'mixers')
  if (fs.existsSync(mixersDir)) {
    all.push(...listNotes(mixersDir, `/kb/${topic}/mixers`, topic, 'mixers'))
  }
}

// title -> route map (lowercased) for Related-link resolution
const titleMap = new Map()
for (const n of all) if (n.title) titleMap.set(n.title.toLowerCase(), n.route)

// --- render one note to MDX ---
function renderNote(n) {
  const type = noteType(n.meta, n.slug)
  const badgeBits = []
  badgeBits.push('`' + type + '`')
  if (n.meta.level) badgeBits.push(`Level ${n.meta.level}`)
  if (n.meta.tags) {
    const tags = n.meta.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    if (tags.length) badgeBits.push(tags.join(' · '))
  }
  const badge = `<span style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: 13, opacity: 0.7 }}>${badgeBits.join('  ·  ')}</span>`

  let body = mdxSafe(n.body)

  // rewrite the "## Related" title list into links
  body = body.replace(
    /(##\s*Related\s*\n+)([\s\S]*?)(\n##\s|\s*$)/,
    (full, head, content, tail) => {
      const linked = content
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((t) => {
          const r = titleMap.get(t.toLowerCase())
          return r ? `[${t}](${r})` : t
        })
      return `${head}${linked.join(', ')}${tail}`
    },
  )

  // Large notes (e.g. the tooling catalogue) get an in-page Contents jump list
  // linking each ## section, so readers don't have to scroll to find one.
  const bodyNoCode = body.replace(/```[\s\S]*?```/g, '')
  const h2s = [...bodyNoCode.matchAll(/^##\s+(.+?)\s*$/gm)]
    .map((m) => m[1].trim())
    .filter((t) => !['related', 'contents'].includes(t.toLowerCase()))
  let contents = ''
  if (h2s.length >= 10) {
    // Slug in the exact order Nextra will: H1 title, the injected Contents
    // heading, then every body heading. Guarantees anchors match.
    const slugger = new GithubSlugger()
    slugger.slug(n.title)
    slugger.slug('Contents')
    const anchor = new Map()
    for (const m of bodyNoCode.matchAll(/^(#{1,6})\s+(.+?)\s*$/gm)) {
      const s = slugger.slug(m[2].trim())
      if (m[1].length === 2) anchor.set(m[2].trim(), s)
    }
    const links = h2s
      .map((t) => {
        const disp = t.replace(/\s*\(\d+\s*tools?\)\s*$/i, '')
        return `[${disp}](#${anchor.get(t)})`
      })
      .join(' · ')
    contents = `## Contents\n\nJump to a section:\n\n${links}\n\n`
  }

  return `# ${n.title}\n\n${badge}\n\n${contents}${body}\n`
}

// --- render a section overview page: title + note-count badge + blurb +
//     type-grouped shortcut tables linking each note (mirrors the _MOC style) ---
function shortcutTables(notes) {
  let out = ''
  for (const type of TYPE_ORDER) {
    const group = notes
      .filter((n) => noteType(n.meta, n.slug) === type)
      .sort((a, b) => a.title.localeCompare(b.title))
    if (!group.length) continue
    out += `\n### ${TYPE_LABEL[type]}\n\n| Note | Level |\n|---|---|\n`
    for (const n of group) {
      out += `| [${n.title}](${n.route}) | ${n.meta.level || ''} |\n`
    }
  }
  return out
}

function renderSectionIndex(title, blurb, notes, extra) {
  const count = notes.length + (extra ? extra.notes.length : 0)
  const badge = `<span style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: 13, opacity: 0.7 }}>${count} notes</span>`
  let out = `# ${title}\n\n${badge}\n\n${blurb}\n\nJump to any note in this section:\n${shortcutTables(notes)}`
  if (extra) {
    out += `\n## ${extra.heading}\n\n${extra.blurb}\n${shortcutTables(extra.notes)}`
  }
  return out + '\n'
}

// --- write files ---
// clean topic dirs (keep index.mdx, top _meta.ts, casework/)
for (const topic of Object.keys(TOPICS)) {
  const d = path.join(DEST, topic)
  if (fs.existsSync(d)) fs.rmSync(d, { recursive: true, force: true })
}

const byTopic = {}
for (const n of all) {
  ;(byTopic[n.topicKey] ??= { root: [], mixers: [] })[
    n.sub === 'mixers' ? 'mixers' : 'root'
  ].push(n)
}

function metaObject(notes) {
  const sorted = [...notes].sort((a, b) => {
    const ta = TYPE_ORDER.indexOf(noteType(a.meta, a.slug))
    const tb = TYPE_ORDER.indexOf(noteType(b.meta, b.slug))
    if (ta !== tb) return (ta < 0 ? 99 : ta) - (tb < 0 ? 99 : tb)
    return a.title.localeCompare(b.title)
  })
  return sorted
}

function writeMeta(dir, entries) {
  const lines = entries.map(
    ([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`,
  )
  fs.writeFileSync(
    path.join(dir, '_meta.ts'),
    `export default {\n${lines.join('\n')}\n}\n`,
  )
}

let total = 0
for (const topic of Object.keys(TOPICS)) {
  const dir = path.join(DEST, topic)
  fs.mkdirSync(dir, { recursive: true })
  const bucket = byTopic[topic] || { root: [], mixers: [] }

  const rootSorted = metaObject(bucket.root)
  for (const n of rootSorted) {
    fs.writeFileSync(path.join(dir, `${n.slug}.mdx`), renderNote(n))
    total++
  }

  const metaEntries = [['index', 'Overview'], ...rootSorted.map((n) => [n.slug, n.title])]
  let mixExtra = null
  if (bucket.mixers.length) {
    const mdir = path.join(dir, 'mixers')
    fs.mkdirSync(mdir, { recursive: true })
    const mixSorted = metaObject(bucket.mixers)
    for (const n of mixSorted) {
      fs.writeFileSync(path.join(mdir, `${n.slug}.mdx`), renderNote(n))
      total++
    }
    // mixers subsection gets its own overview page + Overview meta entry
    fs.writeFileSync(
      path.join(mdir, 'index.mdx'),
      renderSectionIndex(
        'Mixers & Tumblers',
        'The mixers and tumblers deep-dive: why they are used, how they process funds, and how analysis still cuts through them.',
        mixSorted,
      ),
    )
    writeMeta(mdir, [
      ['index', 'Overview'],
      ...mixSorted.map((n) => [n.slug, n.title]),
    ])
    metaEntries.push(['mixers', 'Mixers & Tumblers'])
    mixExtra = {
      heading: 'Mixers & Tumblers deep-dive',
      blurb:
        'A dedicated subsection. Open the [Mixers & Tumblers](/kb/04-laundering-obfuscation/mixers) overview, or jump straight in:',
      notes: mixSorted,
    }
  }

  // section overview page for the topic
  fs.writeFileSync(
    path.join(dir, 'index.mdx'),
    renderSectionIndex(TOPICS[topic].title, TOPICS[topic].blurb, rootSorted, mixExtra),
  )

  writeMeta(dir, metaEntries)
}

// top-level _meta.ts
const topMeta = [['index', 'Overview']]
for (const [k, v] of Object.entries(TOPICS)) topMeta.push([k, v.title])
topMeta.push(['casework', 'Casework'])
writeMeta(DEST, topMeta)

// KB landing index.mdx
const rows = Object.entries(TOPICS)
  .map(([k, v]) => {
    const count = (byTopic[k]?.root.length || 0) + (byTopic[k]?.mixers.length || 0)
    return `| [${v.title}](/kb/${k}) | ${count} | ${v.blurb} |`
  })
  .join('\n')

const indexMdx = `# Knowledge Base

<span style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: 13, opacity: 0.7 }}>${total} notes · 8 topics · open tradecraft</span>

This is the open reference library behind my investigations: ${total} notes on blockchain forensics, from how a UTXO works to how a case holds up in court. It's the tradecraft I actually use, written in my own words and organized so I can find it fast. Browse by topic in the sidebar.

| Topic | Notes | What's here |
|---|---|---|
${rows}

Published casework lands under [Casework](/kb/casework) as I complete investigations.
`

fs.writeFileSync(path.join(DEST, 'index.mdx'), indexMdx)

console.log(`Migrated ${total} notes across ${Object.keys(TOPICS).length} topics -> ${DEST}`)
