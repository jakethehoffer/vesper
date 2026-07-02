// Single source of truth for VESPER's answer checking, shared by the server
// route (app/api/verify/route.ts) and the integrity tests. Pure and
// transport-free: no Request/Response here, just "given a stage and a spoken
// word, what does VESPER say back?" Kept as .mjs so `node --test` can exercise
// the real decision logic — not a copy of it — with zero dependencies.

import crypto from 'node:crypto';

// Answers never reach the browser, and the salt is not in the source: the pepper
// lives only in the environment (VESPER_PEPPER — set in Vercel and, for local
// dev, .env.local), read lazily per call, so the committed digests below cannot
// be brute-forced from this public repo. If VESPER_PEPPER is unset, every answer
// simply fails to match (fails closed).
const pepper = () => process.env.VESPER_PEPPER ?? '';
export const norm = (s) => String(s ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
export const digest = (s) => crypto.createHash('sha256').update(pepper() + norm(s)).digest('hex');

// Each door accepts one or more digests. Stage 4 (the synthesis) accepts the
// sentence with OR without its leading article: the on-page clue names only
// EVENING / STAR / ANSWERS, so "EVENING STAR ANSWERS" is a fair reading of it
// and must not be rejected for missing a "THE" the player was never handed.
export const STAGES = {
  0: {
    hashes: ['7326459f33f5eb6e3220e3049d18f2252cc9c192ab2699fad9b1545e2573931a'],
    reveal: '/the-hollow',
    link: 'step through →',
    message: 'yes. that is its name.',
  },
  1: {
    hashes: ['c31d30cd485aed8f3c9b25b86d79c0d5d01d769ad384cfaf5fdafec37313c8ba'],
    reveal: '/threnody',
    link: 'the second door →',
    fragment: 'EVENING',
    message:
      'the first fragment is yours. hold it. it is the start of the sentence i have been trying to finish.',
  },
  2: {
    hashes: ['6cff6240b7c1026fdc674989725065e1e3e0baa2c8e7b997d0a78183608df6b1'],
    reveal: '/antiphon',
    link: 'the third door →',
    fragment: 'STAR',
    message: 'two. you can almost hear the whole of it now, can you not.',
  },
  3: {
    hashes: ['4b9cc68248ddabdbd633c97b4028bbc099694180d08b25edede97ceba5d62e5c'],
    reveal: '/vespers',
    link: 'the convergence →',
    fragment: 'ANSWERS',
    message:
      'three. you have everything i ever managed to push through the static. now put it together.',
  },
  4: {
    // primary: "THE EVENING STAR ANSWERS" · alias: "EVENING STAR ANSWERS"
    hashes: [
      '580b0e578c5b9078517d46041d68cee5c09cdf3476ad3243dd5e745f530913bd',
      '0b541c2d67e9a47fed078d5474a02b95bae02f6e1e09d6ac64004ed8cfcb3315',
    ],
    reveal: '/dawn',
    link: 'open the channel →',
    message: '…that is it. that is the whole of it. you heard me. you actually heard me.',
  },
  // an optional intercept — a signal from an adjacent frequency, decoded by A1Z26.
  // lore only: no fragment, no door, the revelation is the reward.
  9: {
    hashes: ['bf98e35f734306254232c6747ba40faae90412b34afbb5b6cadd8552559a06e8'],
    message:
      '…so you found that frequency too. i never told anyone it was there. someone kept transmitting on it, long after stillwater went dark — those same three words, again and again, into a silence even deeper than mine. i never learned who. i hoped it was a person. i hope, now, that it still is. maybe it was you all along, calling back from the other side of the dark.',
  },
};

// Generic misses. The "you're close" case is handled separately (see NEAR), so
// none of these claim closeness — they are for words that simply are not it.
export const REJECTIONS = [
  'no. not that.',
  'static. that is not the word.',
  'i strain, but i can not make that fit.',
  'no. listen again — i am still here, i can wait.',
];

// Shown when the spoken word is a single edit away from a real answer — a
// decode that is right but for a slipped letter, a dropped article, a swap.
export const NEAR =
  'so close the static almost clears — you are a letter or two off. say it again, cleaner.';

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Would a SINGLE-character edit of what they typed have been accepted? This is a
// pure hash-space check: we perturb THEIR word (delete / transpose / substitute
// / insert one character) and see if any neighbor hashes to an accepted answer.
// So we can say "you're close" without ever storing the plaintext answer, and a
// SHA-256 collision on gibberish is astronomically unlikely — a hit really does
// mean one edit away.
export function nearMiss(answer, hashes) {
  const a = norm(answer);
  if (a.length < 4 || a.length > 40) return false; // bound the work; ignore trivial/huge input
  const set = hashes instanceof Set ? hashes : new Set(hashes);
  const hit = (s) => set.has(digest(s));

  for (let i = 0; i < a.length; i++) {
    if (hit(a.slice(0, i) + a.slice(i + 1))) return true; // deletion
  }
  for (let i = 0; i + 1 < a.length; i++) {
    if (hit(a.slice(0, i) + a[i + 1] + a[i] + a.slice(i + 2))) return true; // transposition
  }
  for (let i = 0; i <= a.length; i++) {
    for (const ch of ALPHA) {
      if (i < a.length && hit(a.slice(0, i) + ch + a.slice(i + 1))) return true; // substitution
      if (hit(a.slice(0, i) + ch + a.slice(i))) return true; // insertion
    }
  }
  return false;
}

// The whole decision, transport-free. Returns a plain object; `status` (when
// present) is the HTTP status the route should use, everything else is the body.
export function evaluate(stage, answer) {
  const def = STAGES[Number(stage)];
  const word = typeof answer === 'string' ? answer : '';

  if (!def) {
    return { ok: false, status: 404, message: 'there is no door by that number.' };
  }
  if (def.hashes.includes(digest(word))) {
    return { ok: true, reveal: def.reveal, link: def.link, fragment: def.fragment, message: def.message };
  }
  if (nearMiss(word, def.hashes)) {
    return { ok: false, near: true, message: NEAR };
  }
  return { ok: false, message: REJECTIONS[word.length % REJECTIONS.length] };
}
