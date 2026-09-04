# NinoLive

`NinoLive` is the public website project for the `NinoLive` domain.

## Current Focus

The site currently centers on Tekken study guides for Steve and Fahkumram.
These guides are designed as visual study boards rather than long note dumps:

- shorter drill and matchup cards
- visual move notation for inputs such as `ub`, `df`, `qcf`, and `1,2`
- embedded okizeme.gg clips as the primary imagery layer

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS v4

## Guide Architecture

The Tekken guides live in:

- `app/steve/steve-guide.tsx`
- `app/fahkumram/fahkumram-guide.tsx`
- `app/dragunov/dragunov-guide.tsx`
- `app/ling/ling-guide.tsx`
- `app/feng/feng-guide.tsx`
- `app/kazuya/kazuya-guide.tsx`

Shared visual notation and guide UI helpers live in:

- `app/tekken/notation-icons.tsx`
- `app/tekken/guide-ui.tsx`

`notation-icons.tsx` holds the arcade-style input icons:

- block arrows for the eight directions, outlined for a tap and filled for a
  hold (matching the `f` vs `F` casing used in the guide data)
- a star for neutral
- a 2x2 button cluster where the pressed buttons light up, so `1+2` is one icon
  rather than two circles joined by a `+`
- `NotationLegend`, the key that explains those conventions on a guide page

`guide-ui.tsx` builds on those with the reusable pieces for:

- `MoveNotation`, which parses an input string and picks the right icons
- stance chips for labels such as `AOP`, `WS`, and `FC`
- step badges
- tab glyphs
- clip button labels and clip player framing

If you extend the guide content, prefer using the shared notation helpers rather
than rendering raw input strings as plain text.

### Notation strings

`MoveNotation` understands the shorthand already used across the guides:

| Input | Renders as |
| --- | --- |
| `f`, `df`, `n` | tap arrow, tap diagonal, neutral star |
| `F`, `DF` | the same arrows filled, meaning hold |
| `u/f` | folded into the `uf` diagonal |
| `1`, `3+4`, `1+2+3+4` | one button cluster with those buttons lit |
| `ws4`, `AOP.df+1` | stance chip followed by the input |
| `qcf`, `qcb` | the three directions of the quarter circle |
| `ff`, `bb` | the direction drawn twice, for a dash |
| `1,3:3:3` | commas for links, colons for just frames |

## Matchup Clips

Matchup punishment charts are watchable, not just readable. Every opponent move
listed under "What to punish" plays that character's okizeme.gg clip, and the
punish ladders play your own — so a line about blocking their `db+3` can be
checked against the real animation before you commit to a punish.

The pieces:

- `app/tekken/matchup-punishment.tsx` — the chart, which takes `onPlayClip` and
  `activeClipKey` from the guide
- `app/tekken/opponent-clips.ts` — okizeme slugs for the matchup roster, plus
  the helpers that turn a move label such as `db+4 (Deep Web)` into a lookup
- `lib/okizeme-clips.ts` — resolves guide notation onto okizeme's own move key
  before asking for a clip, so `ws2` finds `ws+2` and `CD.df+2` finds
  `f,n,d,df+2`

A guide wires this up by storing a `characterSlug` alongside its active clip
(the player is shared between you and the opponent) and wrapping the matchup
card in `GuideClipSection`.

## Local Development

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run lint
npm run build
```

## Deployment

Phase 1 is designed for Vercel so the site can go live quickly with HTTPS and a
simple deployment flow.

Production deploys are expected to go through the existing GitHub-to-Vercel
integration. The project structure is intentionally lightweight so it can move
to the existing Fasthosts VPS later with minimal rework.
