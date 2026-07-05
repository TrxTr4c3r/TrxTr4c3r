// Single source of all owner-facing copy and brand config for the landing.
// Angle: "Proof, not credentials." Voice: honest, understated, rigorous.
// Hard rule: no em-dashes or en-dashes anywhere.
// Placeholders marked TODO stay until the owner supplies real values.
// Counts (note/topic totals) are NOT copy: they come from lib/kb-stats.ts,
// which scripts/migrate-kb.mjs regenerates from knowledge-base/ on every sync,
// so the landing numbers can never drift from the knowledge base.
import { KB_NOTE_COUNT, KB_TOPIC_COUNT } from './kb-stats'

export const BRAND = {
  name: 'TrxTr4c3r',
  tagline:
    'Independent blockchain investigator. I follow the money, and I show the work.',

  nav: {
    links: [
      { label: 'Cases', href: '/kb/casework' }, // published casework
      { label: 'Knowledge base', href: '/kb' },
    ],
    cta: { label: 'Get in touch', href: 'https://x.com/TrxTr4c3r' },
  },

  hero: {
    left: ['OPINIONS', "DON'T COUNT"],
    right: ['THE TRAIL', 'DOES'],
    watermark: 'EVIDENCE',
    body:
      'Independent blockchain investigator. Every trace on this site is reproducible on-chain: evidence logged, every claim tagged with how sure I am. I came up through network forensics, and now I follow money instead of packets.',
  },

  // Decorative CLI stream for the hero terminal. Illustrative only (generic
  // placeholder hashes, matching the brand pack mockup), never a case claim.
  terminal: [
    { kind: 'cmd', text: 'trace 0x8f2..a91 --depth 4' },
    { kind: 'out', text: '> resolving counterparties' },
    { kind: 'out', text: '> 3 mixers detected' },
    { kind: 'out', text: '> exit: 0x11c..7de' },
    { kind: 'cmd', text: 'risk --score' },
    { kind: 'hi', text: '[ HIGH · 0.92 ]' },
  ] as const,

  statement:
    "On-chain, nothing really disappears. It just goes unexamined. I follow every hop to the evidence behind it, and I tag every claim with how confident I am. That's the line between a hunch and an investigation.",

  metrics: {
    subtitle: 'Proof of work',
    items: [
      { value: String(KB_NOTE_COUNT), label: 'Tradecraft notes in the open knowledge base' },
      {
        value: String(KB_TOPIC_COUNT),
        label:
          'Disciplines documented, from fundamentals to court-ready reporting',
      },
      {
        value: '0',
        label:
          'Unlabeled guesses. Every claim carries evidence and a confidence level',
      },
    ],
  },

  method: {
    headingLines: ['How I', 'investigate'],
    intro:
      'A repeatable five-stage method, held to a few hard rules. Those rules, not the tools, are what make a finding stand up.',
    cards: [
      {
        title: 'Scope before tools',
        desc:
          "I frame the case and pick the seeds first, and I turn down the ones that can't succeed. A trace that starts wrong ends wrong.",
      },
      {
        title: 'Confidence on every claim',
        desc:
          'Confirmed, high, probable, or possible. Nothing goes in as attribution on a maybe.',
      },
      {
        title: 'Fact, not inference',
        desc:
          'What the chain proves stays separate from what I read into it, and I write down what the evidence does not show.',
      },
      {
        title: 'Evidence you can rerun',
        desc:
          'Every artifact hashed, timestamped, and logged, so a second analyst retraces the steps to the same answer.',
      },
    ],
  },

  layers: {
    subtitle: 'The pipeline',
    heading: 'Five stages. One trail.',
    description:
      "Every case runs the same five stages, whether it's a $600M bridge hack or a single scam wallet. Frame it, follow the money, group the wallets, name the actors, prove it.",
    items: [
      { step: '01 · frame', label: 'Scope & Seed' },
      { step: '02 · follow', label: 'On-Chain Tracing' },
      { step: '03 · group', label: 'Clustering' },
      { step: '04 · identify', label: 'OSINT Attribution' },
      { step: '05 · prove', label: 'Evidence & Report' },
    ],
  },

  footer: {
    positioning:
      'Independent blockchain investigator. I trace illicit funds across chains and turn the trail into evidence a team can use. Built on a network-forensics background and sharpened on public cases. Everything here is verifiable. Start with the knowledge base.',
    copyright: '© 2026 TrxTr4c3r',
  },

  links: {
    github: 'https://github.com/TrxTr4c3r/TrxTr4c3r',
    x: 'https://x.com/TrxTr4c3r',
    kb: '/kb',
    email: 'https://x.com/TrxTr4c3r',
  },

  // No owned background videos yet. Sections fall back to gradient + scanline.
  videoUrls: [] as string[],
} as const

export type Brand = typeof BRAND
