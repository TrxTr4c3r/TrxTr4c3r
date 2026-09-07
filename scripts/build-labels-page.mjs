// Re-runnable: datasets/scam-address-labels/labels.csv -> content/casework/address-labels.mdx
// Also copies the raw csv/json into public/labels/ so the page can offer them as downloads.
// Run after adding rows to the dataset. Never hand-edit address-labels.mdx.
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.resolve(ROOT, '../datasets/scam-address-labels')
const OUT = path.resolve(ROOT, 'content/casework/address-labels.mdx')
const PUB = path.resolve(ROOT, 'public/labels')

// minimal RFC4180-ish parser: our fields can contain commas inside quotes
function parseCsv(text) {
  const rows = []
  let row = [], field = '', q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') q = false
      else field += c
    } else if (c === '"') q = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); field = ''; rows.push(row); row = [] }
    else if (c !== '\r') field += c
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  const head = rows.shift()
  return rows.filter(r => r.some(x => x !== '')).map(r =>
    Object.fromEntries(head.map((h, i) => [h, (r[i] ?? '').trim()])))
}

const rows = parseCsv(fs.readFileSync(path.join(SRC, 'labels.csv'), 'utf8'))

// group by episode, newest episode first
const byEpisode = new Map()
for (const r of rows) {
  if (!byEpisode.has(r.episode)) byEpisode.set(r.episode, [])
  byEpisode.get(r.episode).push(r)
}
const episodes = [...byEpisode.keys()].sort().reverse()

const chains = [...new Set(rows.map(r => r.chain))].sort()
const mono = "{{ fontFamily: 'var(--font-space-mono), monospace', fontSize: 13, opacity: 0.7 }}"

const ROLE_ORDER = { 'deposit address': 0, 'sibling collector': 1, 'last hop': 2 }

let out = `# Scam Address Labels

<span style=${mono}>${rows.length} addresses · ${chains.length} chains · free to use</span>

Manually curated address labels for reported scam sites, traced one at a time and published free.
Every label comes from a documented trace with a public write-up behind it, linked in each section.
Nothing here is machine generated and nothing here is bought in.

<div className="case-grid">
  <a className="case-card" href="${'${BASE}'}/labels/labels.csv" download>
    <div style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: 12, letterSpacing: '0.05em', color: '#4CFF7A' }}>CSV · ${rows.length} ROWS</div>
    <div style={{ fontSize: 20, fontWeight: 700, margin: '10px 0 6px' }}>labels.csv</div>
    <div style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.82 }}>For a spreadsheet or a screening-list import.</div>
    <div style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: 13, color: '#4CFF7A', marginTop: 14 }}>download ›</div>
  </a>
  <a className="case-card" href="${'${BASE}'}/labels/labels.json" download>
    <div style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: 12, letterSpacing: '0.05em', color: '#4CFF7A' }}>JSON · FULL SCHEMA</div>
    <div style={{ fontSize: 20, fontWeight: 700, margin: '10px 0 6px' }}>labels.json</div>
    <div style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.82 }}>Every field, including first and last seen and exact amounts.</div>
    <div style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: 13, color: '#4CFF7A', marginTop: 14 }}>download ›</div>
  </a>
</div>

## What a row means, and what it does not

**A row means** this address appeared in a trace of a site that a named source reported as a scam, in the
role stated, and the linked write-up shows the transactions.

**A row does not mean** the address is sanctioned, that its owner has been identified, or that any named
platform has done anything wrong.

Several addresses here are **exchange deposit addresses**. That is a finding about the scam operator, who
chose to collect into an account at a regulated venue. It is not a finding about the exchange. An exchange
receiving a deposit is an exchange receiving a deposit.

### If one of these is yours

If an address in this set belongs to your platform, it is worth your AML team taking a look. You hold the
account records and I do not, so you are the only ones who can establish what sits behind a deposit
address that a reported scam site was handing out. Take it as a free lead rather than an allegation.

The linked write-up carries the full transaction set, exact amounts and UTC timestamps, so there should be
nothing to reconstruct.

`

for (const ep of episodes) {
  const set = byEpisode.get(ep).slice().sort((a, b) =>
    (ROLE_ORDER[a.role] ?? 9) - (ROLE_ORDER[b.role] ?? 9) || a.address.localeCompare(b.address))
  const first = set[0]
  out += `## ${ep}\n\n`
  out += `<span style=${mono}>${first.reported_domain} · reported by ${first.reported_by} · ${set.length} addresses</span>\n\n`
  out += `[Read the full trace ›](${first.post_url})\n\n`
  out += `| Address | Chain | Role | Attribution |\n|---|---|---|---|\n`
  for (const r of set) {
    const attr = r.attribution === 'none'
      ? 'none'
      : `${r.attribution} <br /><em>vendor label, unverified</em>`
    out += `| \`${r.address}\` | ${r.chain} | ${r.role} | ${attr} |\n`
  }
  out += `\n`
}

out += `## Schema

| Column | Notes |
|---|---|
| \`address\` | full length, never abbreviated |
| \`chain\` | ${chains.join(', ')} |
| \`role\` | \`deposit address\` published by the site, \`last hop\` where the trace ended, \`sibling collector\` |
| \`attribution\` | the entity a vendor tool assigns, and which tool said so |
| \`attribution_confidence\` | always "vendor label, unverified" where an entity is named. No raw block explorer carries entity labels, so an attribution cannot be verified the way an amount can |
| \`first_seen\` / \`last_seen\` | UTC, from an explorer API, never read off a screen |
| \`total_received\` | exact, at full precision, main units only |
| \`reported_domain\` | defanged. Never a live link |
| \`reported_by\` | who reported the site. The credit belongs to them |
| \`post_url\` | the public write-up. Check the work |
| \`tag\` | \`#verified\` means explorer-checked with hash, block and exact value on record |

**Payer addresses are deliberately excluded.** People who sent money to a collector may well be victims,
and publishing a victim's address as a scam address would be both wrong and harmful.

## Method

Every trace follows one rule: explorer or nothing. No date, amount, address or direction is recorded
unless it has been read off a block explorer, and no identifier is ever abbreviated, because address
poisoning targets exactly the prefix and suffix that abbreviation preserves.

Verified against Etherscan and Blockscout on EVM chains, TronGrid and Tronscan on Tron, and
blockstream.info cross-checked with mempool.space on Bitcoin. Graph tools are used to find the shape.
Values always come off an explorer.

## Corrections

Found an error, or want a row removed with cause? Raise it on the write-up linked in that section.
Corrections get made in public and dated.
`

// BASE placeholder -> runtime basePath expression
out = out.replace(/\$\{BASE\}/g, "' + (process.env.NEXT_PUBLIC_BASE_PATH || '') + '")
out = out.replace(/href="' \+ \(process\.env\.NEXT_PUBLIC_BASE_PATH \|\| ''\) \+ '(\/labels\/[a-z.]+)"/g,
  (_, p) => `href={(process.env.NEXT_PUBLIC_BASE_PATH || '') + '${p}'}`)

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, out, 'utf8')

fs.mkdirSync(PUB, { recursive: true })
for (const f of ['labels.csv', 'labels.json']) {
  fs.copyFileSync(path.join(SRC, f), path.join(PUB, f))
}

console.log(`labels page: ${rows.length} rows, ${episodes.length} episodes -> content/casework/address-labels.mdx`)
console.log(`raw files copied to public/labels/`)
