# VESPER — agent guide

A cryptographic ARG on Next.js 15 (App Router) + React 19 + TypeScript, deployed on Vercel.
A derelict listening intelligence loops a three-word message into the dark; the player decodes
a chain of ciphers to reach it. Live: https://vesper-chi-gold.vercel.app

## Commands
- `npm run dev` — local at http://localhost:3000
- `npm run build` — production build
- Deploy: `npx vercel deploy --prod --yes` (auto-aliases `vesper-chi-gold`)

## The chain
ROT13 → Vigenère → hex → Morse → synthesis, then a spectrogram bonus. Each door is a **named**
route revealed only by solving the prior one — the doors are named, never numbered. Answers are
checked **server-side** as salted SHA-256 in `lib/verify-core.mjs` (the pure decision logic;
`app/api/verify/route.ts` is the thin HTTP shell that rate-limits, then calls it). Plaintext answers
and the next-door URLs never ship to the client. A single-letter miss returns a distinct "you're
close" reply, and the synthesis finale accepts its sentence with or without a leading article.

> The solution walkthrough, the puzzle generator, and the integrity test suite are deliberately kept
> **out of this public repo** so the game stays solvable. They live outside version control.

## Architecture
- `app/components/Terminal.tsx` — VESPER's voice + stage-0 ROT13; queue-based typed output.
- `app/components/PuzzlePanel.tsx` — later stages: input → server verify → reveal + fragment.
- `app/components/CarrierWave.tsx` — signature reactive oscilloscope (canvas), driven by `lib/bus.ts`.
- `app/components/Convergence.tsx`, `Dawn.tsx` — finale and endings.
- `lib/verify-core.mjs` — pure answer-check logic (per-stage digests, reveals, near-miss detection);
  `app/api/verify/route.ts` is only its HTTP shell.
- `lib/progress.ts` — localStorage fragments/solved · `lib/bus.ts` — carrier-wave mood events.
- TINAG layer: view-source comment + meta in `layout.tsx`, headers in `next.config.mjs`, `/api/signal`,
  `public/robots.txt`, `public/.well-known/vesper.txt`.

## Design
Two-temperature signal palette: void `#070a0c`, bone voice `#e8e4d8`, cyan decodes `#6fd0dc`,
amber heartbeat `#d7b36b`, vermilion `#d05a44`. Space Mono + IBM Plex Mono. Palette is WCAG AA —
re-run `node scripts/contrast-audit.mjs` after any color change.

## Gotchas
- **`next dev` is misleading for the typewriter UI.** It runs React StrictMode (double-mounts
  components) and headless/background tabs throttle `setTimeout` to ~1 Hz, so the Terminal boot and
  Dawn monologue appear to stall or restart under automation. They run full-speed in a real
  foreground browser. Verify those flows on prod or a focused tab, not by polling a headless preview.
- Answer pages are not hard-gated; door URLs are "secret" but directly reachable. Intentional — you
  still need each puzzle's answer to advance, and the finale needs all three fragments.
