// WCAG 2.1 contrast audit for the VESPER palette. Re-run after any palette
// change to keep text readable: node scripts/contrast-audit.mjs
// AA needs 4.5:1 for normal text, 3:1 for large text and UI/graphics.
// NOTE: this measures fg-vs-void in isolation. The scanline + vignette overlays
// (globals.css body::before/after) render ABOVE content, so on-screen contrast
// is a touch lower than the numbers below — hence the extra margin on dim text.

const hex = (h) => { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const blend = (fg, a, bg) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [L1, L2] = [lum(a), lum(b)].sort((x, y) => y - x); return (L1 + 0.05) / (L2 + 0.05); };

// must mirror app/globals.css :root
const C = {
  void: hex('#070a0c'), void2: hex('#0b1013'),
  bone: hex('#e8e4d8'), trace: hex('#6fd0dc'), traceDeep: hex('#2f7a82'),
  signal: hex('#d7b36b'), alert: hex('#d05a44'),
};

const checks = [
  ['bone → void           (primary text)', C.bone, C.void, 4.5],
  ['bone@.60 → void       (narrative .dim/.lede)', blend(C.bone, 0.60, C.void), C.void, 4.5],
  ['placeholder@.46 → void', blend(C.bone, 0.46, C.void), C.void, 3],
  ['trace → void          (eyebrow/links)', C.trace, C.void, 4.5],
  ['signal → void         (cipher/amber)', C.signal, C.void, 4.5],
  ['alert → void          (error text)', C.alert, C.void, 4.5],
  ['trace → void          (.who.you label)', C.trace, C.void, 4.5],
  ['traceDeep → void      (UI borders only)', C.traceDeep, C.void, 3],
];

let fails = 0;
for (const [label, fg, bg, need] of checks) {
  const r = ratio(fg, bg);
  const ok = r >= need;
  if (!ok) fails++;
  console.log(`${r.toFixed(2).padStart(6)} : 1   need ${need}   ${ok ? 'PASS' : 'FAIL'}   ${label}`);
}
console.log(fails === 0 ? '\nall text/UI contrast targets met' : `\n${fails} contrast target(s) failing`);
process.exit(fails === 0 ? 0 : 1);
