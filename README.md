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

The two Tekken guides live in:

- `app/steve/steve-guide.tsx`
- `app/fahkumram/fahkumram-guide.tsx`

Shared visual notation and guide UI helpers live in:

- `app/tekken/guide-ui.tsx`

That shared file contains the reusable pieces for:

- inline move notation chips
- directional arrows and button tokens
- step badges
- tab glyphs
- clip button labels and clip player framing

If you extend the guide content, prefer using the shared notation helpers rather
than rendering raw input strings as plain text.

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
