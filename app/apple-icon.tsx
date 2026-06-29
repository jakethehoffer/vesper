import { ImageResponse } from 'next/og';

// iOS home-screen icon (Apple doesn't honor SVG touch icons, so render a PNG).
// Mirrors app/icon.svg: the evening star over a carrier blip on the void.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'>
    <rect width='180' height='180' fill='#070a0c'/>
    <path d='M90 36 L99 70 L133 79 L99 88 L90 122 L81 88 L47 79 L81 70 Z' fill='#d7b36b'/>
    <path d='M22 122 H64 L80 92 L98 142 L114 104 L130 122 H158' fill='none' stroke='#6fd0dc' stroke-width='6.5' stroke-linejoin='round' stroke-linecap='round'/>
  </svg>`;
  const uri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={uri} width={180} height={180} alt="" />
      </div>
    ),
    { ...size },
  );
}
