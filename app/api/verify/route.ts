import { evaluate } from '../../../lib/verify-core.mjs';

export const runtime = 'nodejs';

// Best-effort in-memory rate limit on the answer oracle. On serverless this is
// per-instance and resets on a cold start — not a hard guarantee — but it is
// enough to blunt a hammering loop (brute-force or plain abuse) without standing
// up an external store, and it fails open, never blocking a real player.
const WINDOW_MS = 10_000;
const MAX_HITS = 40; // ~4/s sustained per IP; a human submits a handful per minute
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 4096) {
    // opportunistic cleanup so the map can't grow without bound
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_HITS;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'local';
  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, message: 'too many words at once. slow down — i am not going anywhere.' },
      { status: 429 },
    );
  }

  let body: { stage?: unknown; answer?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, message: 'malformed transmission.' }, { status: 400 });
  }

  const answer = typeof body.answer === 'string' ? body.answer : '';
  // a short "thinking" beat — the thing on the other end is old and slow — but no
  // longer half a second, which only amplified a flood into billable compute.
  await sleep(160 + (answer.length % 4) * 40);

  const { status, ...payload } = evaluate(body.stage, answer);
  return status ? Response.json(payload, { status }) : Response.json(payload);
}

export function GET() {
  return Response.json({
    node: '09',
    status: 'listening',
    hint: 'this door only answers to POST. speak a word, do not just knock.',
  });
}
