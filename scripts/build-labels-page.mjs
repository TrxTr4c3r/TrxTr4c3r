// Re-runnable: datasets/scam-address-labels/labels.csv -> content/casework/address-labels.mdx
// Also copies the raw csv/json into public/labels/ so the page can offer them as downloads.
// Run after adding rows to the dataset. Never hand-edit address-labels.mdx.
//
// SCOPE (set 2026-09-07): the dataset holds deposit addresses published BY a reported scam
// platform, and any direct link from that address to a known service. Nothing else. No cash-out
// addresses, no intermediate collectors, no payer addresses.
//
// CONTROL (set 2026-09-18, after CASE-2026-008): a row records that a site PUBLISHED an address,
// never that the operator CONTROLS it. Every row carries control_status + control_basis and the
// page leads with the distinction. Six published deposit addresses across six chains were traced
// in CASE-2026-008 and none was operator-controlled.
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.resolve(ROOT, '../datasets/scam-address-labels')
const OUT = path.resolve(ROOT, 'content/casework/address-labels.mdx')
const PUB = path.resolve(ROOT, 'public/labels')

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

const bySite = new Map()
for (const r of rows) {
  if (!bySite.has(r.scam_domain)) bySite.set(r.scam_domain, [])
  bySite.get(r.scam_domain).push(r)
}
const sites = [...bySite.keys()].sort((a, b) => {
  const ea = bySite.get(a)[0].episode, eb = bySite.get(b)[0].episode
  return eb.localeCompare(ea)
})

const chains = [...new Set(rows.map(r => r.chain))].sort()
const linked = [...new Set(rows.map(r => r.linked_platform).filter(Boolean))].sort()
const mono = "{{ fontFamily: 'var(--font-space-mono), monospace', fontSize: 13, opacity: 0.7 }}"
const card = (kicker, title, body, cta, href) => `  <a className="case-card" href={(process.env.NEXT_PUBLIC_BASE_PATH || '') + '${href}'} download>
    <div style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: 12, letterSpacing: '0.05em', color: '#4CFF7A' }}>${kicker}</div>
    <div style={{ fontSize: 20, fontWeight: 700, margin: '10px 0 6px' }}>${title}</div>
    <div style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.82 }}>${body}</div>
    <div style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: 13, color: '#4CFF7A', marginTop: 14 }}>${cta}</div>
  </a>`

let out = `# Scam Address Labels

<span style=${mono}>${rows.length} deposit addresses · ${chains.length} chains · free to use</span>

**Deposit addresses that reported scam platforms hand out, and nothing else.** Each one was captured from
the site's own deposit screen, then verified on a block explorer. Where the address links directly to a
known service, that link is recorded too, because that is the part an AML team can act on.

**Published by the platform. Not proven to be held by it.** Read "Published is not controlled" below
before you screen against any of this.

Every row carries the write-up that documents it, so you can check the work.

<div className="case-grid">
${card(`CSV · ${rows.length} ROWS`, 'labels.csv', 'For a spreadsheet or a screening-list import.', 'download ›', '/labels/labels.csv')}
${card('JSON · FULL SCHEMA', 'labels.json', 'Every field, including first and last seen and exact amounts.', 'download ›', '/labels/labels.json')}
</div>

## Scope, deliberately narrow

**In:** the address a reported scam platform published as its deposit address, and a direct link from that
address to a known service.

**Out:** cash-out addresses, intermediate collectors, exchange hot wallets, and anything a trace merely
passed through. Those live in the write-ups where they have their context. A screening list full of
counterparties is noise, and noise is what makes a label set useless.

**Never in, on principle:** addresses that *paid* a collector. Those people may be victims, and publishing
a victim's address as a scam address would be both wrong and harmful.

## Published is not controlled

Read this before the rows. It is the most important thing on the page.

A row says a reported scam site **published** this address to take money. It does not say the operator
**controls** it, and the two are not the same fact.

I tested that directly. A fake trading platform handed over six deposit addresses across six chains, in a
live chat with its own operator, which is about as good as provenance gets. I traced all six. **Not one
was operator-controlled.** Three had never been used at all. Three belonged to uninvolved third parties,
including somebody's ordinary account at a regulated exchange, whose normal activity would read as
collection volume to anyone who assumed the site owned the address.

So a fake platform publishing an address it does not hold is documented behaviour, not a theory.

Every row carries \`control_status\`:

| \`control_status\` | What it means | How to treat a hit |
|---|---|---|
| \`not established\` | the site published it, and nothing else about who holds it is known | a lead worth checking against your own account records. **Not** grounds to act against the account holder |
| \`circumstantial\` | on-chain behaviour points at the operation setting the address up, stated in \`control_basis\` | a stronger lead. Still short of proof |
| \`confirmed\` | control demonstrated, for example a co-spend on a UTXO chain | act on it as a finding, and the basis is in \`control_basis\` |

If a row is \`not established\` and it matches one of your customers, the innocent explanation is live: a
scam site can print a stranger's deposit address on its payment page, and that customer has done nothing.
**Freezing on a row from this file alone would be the wrong call.**

## What a row means, and what it does not

**A row means** a site that a named source reported as a scam published this address to take money, and
the linked write-up shows what arrived.

**A row does not mean** the address is sanctioned, that its owner has been identified, or that a named
platform has done anything wrong.

Some of these deposit addresses **are themselves exchange deposit addresses**. What that establishes is
the address type, not the account holder. It may mean the operator collected straight into an account at
a regulated venue. It may equally mean a customer's deposit address was copied onto a scam site's payment
page. \`control_status\` on the row says which of those is supported.

Either way it is not a finding about the exchange. An exchange receiving a deposit is an exchange
receiving a deposit.

### If one of these is yours

If an address here belongs to your platform, it is worth your AML team taking a look. You hold the account
records and I do not, so you are the only ones who can establish what sits behind a deposit address a
reported scam site was handing out. Take it as a free lead rather than an allegation, and read
\`control_status\` first.

The linked write-up carries the full transaction set, exact amounts and UTC timestamps, so there should be
nothing to reconstruct.

`

for (const site of sites) {
  const set = bySite.get(site).slice().sort((a, b) => a.chain.localeCompare(b.chain))
  const first = set[0]
  out += `## ${site}\n\n`
  out += `<span style=${mono}>${first.episode} · reported by ${first.reported_by} · ${set.length} deposit ${set.length === 1 ? 'address' : 'addresses'}</span>\n\n`
  out += `[Read the full trace ›](${first.post_url})\n\n`
  out += `| Address | Chain | Received | Links to | Control |\n|---|---|---|---|---|\n`
  for (const r of set) {
    const plat = r.linked_platform ? `**${r.linked_platform}**` : 'nothing'
    out += `| \`${r.address}\` | ${r.chain} | ${r.total_received || 'not recorded'} | ${plat} | \`${r.control_status || 'not established'}\` |\n`
  }
  out += `\n`
  for (const r of set) {
    out += `**\`${r.address}\`** ${r.link_basis}${r.link_confidence === 'vendor label, unverified' ? ' No raw block explorer carries entity labels, so this link is a vendor attribution and cannot be verified the way an amount can.' : ''}\n\n`
    out += `Control: **${r.control_status || 'not established'}**. ${r.control_basis || 'No control evidence recorded.'}\n\n`
  }
}

out += `## Schema

| Column | Notes |
|---|---|
| \`address\` | full length, never abbreviated |
| \`chain\` | ${chains.join(', ')} |
| \`role\` | always \`deposit address\`. See Scope above |
| \`control_status\` | \`not established\`, \`circumstantial\` or \`confirmed\`. See "Published is not controlled" |
| \`control_basis\` | exactly what the status rests on, so you can disagree with it |
| \`scam_domain\` | the reported site, defanged. Never a live link |
| \`reported_by\` | who reported the site. The credit belongs to them |
| \`linked_platform\` | a known service this address links directly to${linked.length ? `, so far: ${linked.join(', ')}` : ''}. Empty where there is no link |
| \`link_basis\` | exactly how the link was established, so you can disagree with it |
| \`link_confidence\` | \`vendor label, unverified\` wherever a platform is named. Amounts verify against an explorer; entity names do not |
| \`first_seen\` / \`last_seen\` | UTC, from an explorer API, never read off a screen |
| \`total_received\` | exact, at full precision, main units only |
| \`post_url\` | the public write-up. Check the work |
| \`tag\` | \`#verified\` means explorer-checked with hash, block and exact value on record |

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

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, out, 'utf8')
fs.mkdirSync(PUB, { recursive: true })
for (const f of ['labels.csv', 'labels.json']) fs.copyFileSync(path.join(SRC, f), path.join(PUB, f))

console.log(`labels page: ${rows.length} deposit addresses across ${sites.length} sites -> content/casework/address-labels.mdx`)
console.log('raw files copied to public/labels/')
