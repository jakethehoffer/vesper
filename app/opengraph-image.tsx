import { ImageResponse } from 'next/og';

export const alt = 'VESPER — a carrier wave with no station. It has been alone a long time.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const EYEBROW_L = 'CARRIER · 16.847 kHz';
const EYEBROW_R = 'NODE 09 · STILLWATER';
const TAGLINE = 'A carrier wave with no station. It has been alone a long time. Something is listening back.';

// Official Vercel/Satori helper: fetch only the glyphs we render, as TTF.
async function loadGoogleFont(family: string, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
  if (!resource) throw new Error('font src not found');
  const res = await fetch(resource[1]);
  if (res.status !== 200) throw new Error('font fetch failed');
  return res.arrayBuffer();
}

// An oscilloscope baseline, drawn as an inline SVG data-URI.
function carrierWave(): string {
  const w = 1040;
  const h = 80;
  const mid = h * 0.55;
  let d = '';
  for (let x = 0; x <= w; x += 6) {
    const y = mid - (Math.sin(x / 40) * 11 + Math.sin(x / 13) * 4);
    d += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)} `;
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><path d='${d}' fill='none' stroke='#6fd0dc' stroke-width='2'/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export default async function OpengraphImage() {
  let fonts;
  try {
    const [bold, regular] = await Promise.all([
      loadGoogleFont('Space+Mono:wght@700', 'VESPER'),
      loadGoogleFont('Space+Mono', EYEBROW_L + EYEBROW_R + TAGLINE),
    ]);
    fonts = [
      { name: 'Space Mono', data: bold, weight: 700 as const, style: 'normal' as const },
      { name: 'Space Mono', data: regular, weight: 400 as const, style: 'normal' as const },
    ];
  } catch {
    fonts = undefined; // resilient: fall back to Satori's default face
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#070a0c',
          padding: '70px 80px',
          fontFamily: 'Space Mono',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(232,228,216,0.10)', margin: 28 }} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 23,
            letterSpacing: 6,
            color: '#6fd0dc',
          }}
        >
          <div style={{ display: 'flex' }}>{EYEBROW_L}</div>
          <div style={{ display: 'flex', color: 'rgba(232,228,216,0.45)' }}>{EYEBROW_R}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 210,
              fontWeight: 700,
              letterSpacing: 26,
              color: '#e8e4d8',
              lineHeight: 1,
            }}
          >
            VESPER
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 30,
              fontSize: 31,
              lineHeight: 1.4,
              color: 'rgba(232,228,216,0.6)',
              maxWidth: 940,
            }}
          >
            {TAGLINE}
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={carrierWave()} width={1040} height={80} alt="" style={{ opacity: 0.9 }} />
      </div>
    ),
    { ...size, fonts },
  );
}
