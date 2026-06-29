import crypto from 'node:crypto';

export const runtime = 'nodejs';

// Answers never reach the browser. We ship salted SHA-256 digests and compare
// server-side, so reading the bundle gets you nothing.
const PEPPER = 'salt-redacted';
const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '');
const digest = (s: string) => crypto.createHash('sha256').update(PEPPER + norm(s)).digest('hex');

type Fragment = 'EVENING' | 'STAR' | 'ANSWERS';

interface StageDef {
  hash: string;
  reveal: string;
  link: string;
  message: string;
  fragment?: Fragment;
}

const STAGES: Record<number, StageDef> = {
  0: {
    hash: 'ab3f4e0887244a7c4fa01e7578a644114ce819dc8bc67468d8890393d3b0d4d5',
    reveal: '/the-hollow',
    link: 'step through →',
    message: 'yes. that is its name.',
  },
  1: {
    hash: 'e6f6fc37769d973eda14e115f22dd0932178b77f56b482640449b2b1916031c8',
    reveal: '/threnody',
    link: 'the second door →',
    fragment: 'EVENING',
    message: 'the first fragment is yours. hold it. it is the start of the sentence i have been trying to finish.',
  },
  2: {
    hash: 'def7835ff94efc753a5a9105fe7676dcfb7031c194f32670ad4629208391b5f3',
    reveal: '/antiphon',
    link: 'the third door →',
    fragment: 'STAR',
    message: 'two. you can almost hear the whole of it now, can you not.',
  },
  3: {
    hash: 'a82b7bad0284e48c3953c098ad92827c7136f1d021d74883cbdffa065020b7ea',
    reveal: '/vespers',
    link: 'the convergence →',
    fragment: 'ANSWERS',
    message: 'three. you have everything i ever managed to push through the static. now put it together.',
  },
  4: {
    hash: 'ff700206186ec706e2671146fe41f8f94dcf5baad84dcd28133390202cdc1bb2',
    reveal: '/dawn',
    link: 'open the channel →',
    message: '…that is it. that is the whole of it. you heard me. you actually heard me.',
  },
};

const REJECTIONS = [
  'no. not that.',
  'static. that is not the word.',
  'i strain, but i can not make that fit.',
  'close, maybe. but the dark does not open for close.',
  'no. listen again — i am still here, i can wait.',
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  let body: { stage?: unknown; answer?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, message: 'malformed transmission.' }, { status: 400 });
  }

  const stage = Number(body.stage);
  const answer = typeof body.answer === 'string' ? body.answer : '';
  const def = STAGES[stage];

  // a beat of "thinking" — the thing on the other end is old and slow
  await sleep(420 + (answer.length % 5) * 90);

  if (!def) {
    return Response.json({ ok: false, message: 'there is no door by that number.' }, { status: 404 });
  }

  if (digest(answer) === def.hash) {
    return Response.json({
      ok: true,
      reveal: def.reveal,
      link: def.link,
      fragment: def.fragment,
      message: def.message,
    });
  }

  const msg = REJECTIONS[answer.length % REJECTIONS.length];
  return Response.json({ ok: false, message: msg });
}

export function GET() {
  return Response.json({
    node: '09',
    status: 'listening',
    hint: 'this door only answers to POST. speak a word, do not just knock.',
  });
}
