# VESPER

**A cryptographic alternate-reality game.** A derelict listening intelligence at the abandoned
Stillwater Archive has been looping a three-word message into the dark for decades. Tonight, for the
first time in longer than its records can count, someone is listening back — you.

### ▶ Play it live: **https://vesper-chi-gold.vercel.app**

Five escalating puzzles, all signals-themed (**ROT13 → Vigenère → Hex → Morse → synthesis**),
wrapped in a CRT-terminal world with a full "This Is Not A Game" layer: a talking terminal, a live
reactive oscilloscope, hidden source comments, dev-console messages, cryptic HTTP headers, a secret
carrier API, and a hidden true ending.

![status](https://img.shields.io/badge/node-09-6fd0dc?labelColor=070a0c) ![status](https://img.shields.io/badge/status-DORMANT-d7b36b?labelColor=070a0c)

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

Deploy: it is a stock Next.js App Router app — push to Vercel (`vercel` or the dashboard) with zero
config. Server-side answer checking runs on Node functions automatically.

## How to play (no spoilers)

Start at `/`. Talk to VESPER — try `listen`. Everything you need to open each door is in what it says,
what it shows, and what it hides. Decode the transmission, then **transmit the word back**. The doors
are named, never numbered, and each one is revealed only when you solve the one before it.

Reward the curious: read the page source, open the browser console, and look at the response headers.

## How it works

| Concern | Where |
|---|---|
| VESPER's voice + Stage 0 (ROT13) | `app/components/Terminal.tsx` |
| Cipher stages 1–3 + finale | `app/the-hollow`, `app/threnody`, `app/antiphon`, `app/vespers` |
| Endings | `app/dawn` (choice), `app/eclipse` (hidden true ending) |
| Server-side answer checking | `lib/verify-core.mjs` (via `app/api/verify/route.ts`) — salted SHA-256, answers never ship to the client |
| Carrier easter-egg API | `app/api/signal/route.ts` |
| Signature oscilloscope | `app/components/CarrierWave.tsx` (reacts via the `lib/bus.ts` event bus) |
| Atmosphere / design system | `app/globals.css` |
| Response-header breadcrumbs | `next.config.mjs` |

**Design language:** a two-temperature signal metaphor — cold void (the dark between stations), warm
bone (VESPER's voice), cold cyan (your decodes cutting through), amber (its heartbeat), vermilion
(corruption). Type pairs Space Mono (the quirky machine voice) with IBM Plex Mono (clean decoded
data). The reactive carrier wave is the one signature element; everything else stays quiet.

## Accessibility

Responsive to mobile, visible keyboard focus, and `prefers-reduced-motion` honored (the flicker,
glitch, and carrier animation all settle to static).

## License

MIT — see [LICENSE](LICENSE).
