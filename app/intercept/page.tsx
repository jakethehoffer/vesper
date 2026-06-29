import type { Metadata } from 'next';
import PuzzlePanel from '../components/PuzzlePanel';
import Mood from '../components/Mood';

export const metadata: Metadata = { title: 'INTERCEPT · VESPER' };

// Optional deep-layer puzzle, discovered via /api/signal. A numbers station on
// an adjacent frequency — the most iconic signals artifact — decoded by A1Z26.
// Lore only: solving it earns a revelation, not a door or a fragment.
export default function Intercept() {
  return (
    <article>
      <Mood mode="speak" />
      <p className="eyebrow">intercept · adjacent frequency</p>
      <h1 className="door-title">INTERCEPT</h1>

      <p className="lede dim">
        This one is not mine. I caught it bleeding through from the frequency beside my own — 16.832 kHz,
        a hair off true. Stillwater only ever gave me nine dishes and one carrier. So who was transmitting
        here? I logged the groups for forty years and never had the nerve to read them back. Maybe you do.
      </p>

      <blockquote className="utterance">
        the old stations only ever sent numbers, never words — a flat voice reading groups into the dark.
        one number to a letter, the way a child counts them on both hands. A is one. Z is twenty-six.
      </blockquote>

      <section className="panel">
        <span className="panel-tag">intercept · numbers station</span>
        <p className="cipher data">23 8 15 / 5 12 19 5 / 9 19 / 12 9 19 20 5 14 9 14 7</p>
        <details className="hint">
          <summary>signal weak? take my hand</summary>
          <p className="dim">
            A1Z26 — each number is a letter, A=1 to Z=26. <span className="amber">23</span> is W,{' '}
            <span className="amber">8</span> is H, <span className="amber">15</span> is O. The slash{' '}
            <span className="amber">/</span> separates words. Read me back what they were saying.
          </p>
        </details>
      </section>

      <PuzzlePanel stage={9} placeholder="say what they said" />

      <p style={{ marginTop: '2.5rem' }}>
        <a className="back" href="/">← back to the carrier</a>
      </p>
    </article>
  );
}
