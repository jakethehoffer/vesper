// Renders a real STFT spectrogram of transmission-09.wav to a PNG — "what the
// player sees" when they load it into Audacity/Spek. This is the honest check
// that the hidden word is legible, not just mathematically present.
// Run: node scripts/render-spectrogram.mjs [outPath.png]

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import zlib from 'node:zlib';

const HERE = dirname(fileURLToPath(import.meta.url));
const WAV = join(HERE, '..', 'public', 'transmission-09.wav');
const OUT = process.argv[2] || join(HERE, '..', 'spectrogram-preview.png');

// ---- read 16-bit mono WAV (standard 44-byte header) ----
const raw = readFileSync(WAV);
const SR = raw.readUInt32LE(24);
const nSamples = (raw.length - 44) / 2;
const x = new Float64Array(nSamples);
for (let i = 0; i < nSamples; i++) x[i] = raw.readInt16LE(44 + i * 2) / 32768;

// ---- STFT ----
const N = 1024;
const HOP = 256;
const FREQ_CAP = 4200; // only show the band the word lives in
const BINS = Math.floor((FREQ_CAP * N) / SR); // ~268
const frames = Math.floor((nSamples - N) / HOP);
const hann = Array.from({ length: N }, (_, n) => 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (N - 1)));

// precompute twiddles for the bins we need
const cosT = [];
const sinT = [];
for (let k = 0; k < BINS; k++) {
  cosT[k] = new Float64Array(N);
  sinT[k] = new Float64Array(N);
  for (let n = 0; n < N; n++) {
    const a = (2 * Math.PI * k * n) / N;
    cosT[k][n] = Math.cos(a);
    sinT[k][n] = Math.sin(a);
  }
}

const db = []; // [frame][bin]
let dbMin = Infinity;
let dbMax = -Infinity;
for (let f = 0; f < frames; f++) {
  const off = f * HOP;
  const col = new Float64Array(BINS);
  for (let k = 0; k < BINS; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const s = x[off + n] * hann[n];
      re += s * cosT[k][n];
      im -= s * sinT[k][n];
    }
    const mag = Math.sqrt(re * re + im * im) / N;
    const d = 20 * Math.log10(mag + 1e-9);
    col[k] = d;
    if (d < dbMin) dbMin = d;
    if (d > dbMax) dbMax = d;
  }
  db.push(col);
}

// ---- map to pixels (high freq on top), upscale for legibility ----
const SX = 3;
const SY = 2;
const W = frames * SX;
const H = BINS * SY;
const floorDb = dbMax - 60; // 60 dB dynamic range
const stops = [
  [0.0, [7, 10, 12]],      // void
  [0.45, [47, 122, 130]],  // trace-deep
  [0.78, [111, 208, 220]], // trace cyan
  [1.0, [232, 228, 216]],  // bone
];
const cmap = (v) => {
  v = Math.max(0, Math.min(1, v));
  for (let i = 1; i < stops.length; i++) {
    if (v <= stops[i][0]) {
      const [p0, c0] = stops[i - 1];
      const [p1, c1] = stops[i];
      const t = (v - p0) / (p1 - p0);
      return [0, 1, 2].map((j) => Math.round(c0[j] + (c1[j] - c0[j]) * t));
    }
  }
  return stops[stops.length - 1][1];
};

const rowBytes = W * 3;
const rawImg = Buffer.alloc((rowBytes + 1) * H);
for (let py = 0; py < H; py++) {
  rawImg[py * (rowBytes + 1)] = 0; // filter: none
  const bin = BINS - 1 - Math.floor(py / SY); // flip: high freq up
  for (let px = 0; px < W; px++) {
    const frame = Math.floor(px / SX);
    const norm = (db[frame][bin] - floorDb) / (dbMax - floorDb);
    const [r, g, b] = cmap(norm);
    const o = py * (rowBytes + 1) + 1 + px * 3;
    rawImg[o] = r;
    rawImg[o + 1] = g;
    rawImg[o + 2] = b;
  }
}

// ---- minimal PNG encoder (truecolor) ----
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return (buf) => {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = t[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
})();
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(CRC(td), 0);
  return Buffer.concat([len, td, crc]);
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // color type RGB
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(rawImg, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);
writeFileSync(OUT, png);

console.log(`wrote ${OUT}`);
console.log(`spectrogram ${W}x${H}px · ${frames} frames · ${BINS} bins (0–${FREQ_CAP} Hz) · ${SR} Hz`);
console.log(`magnitude range ${dbMin.toFixed(1)}..${dbMax.toFixed(1)} dB, floor at ${floorDb.toFixed(1)} dB`);
