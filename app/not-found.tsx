import type { Metadata } from 'next';
import Mood from './components/Mood';

export const metadata: Metadata = { title: 'DEAD CHANNEL · VESPER' };

// Players guess URLs. A default 404 breaks the fiction; this keeps them inside
// it — and the carrier wave flatlines red while they read.
export default function NotFound() {
  return (
    <article>
      <Mood mode="error" />
      <p className="eyebrow">dead channel · 404</p>
      <h1 className="door-title">STATIC</h1>

      <p className="lede dim">
        This frequency is silent. Whatever transmitted here is gone — decommissioned, jammed, or
        never real to begin with. The doors at Stillwater are named, never numbered, and this is not
        one of their names.
      </p>

      <blockquote className="utterance bad">
        do not wander the dark guessing. come back to where my voice is, and i will hand you each door
        in turn.
      </blockquote>

      <p className="dim" style={{ marginTop: '1.6rem', fontSize: '0.84rem' }}>
        If you are truly lost, the open carrier still remembers the way home: <code>/api/signal</code>.
      </p>

      <p style={{ marginTop: '2.4rem' }}>
        <a className="back" href="/">← return to the carrier</a>
      </p>
    </article>
  );
}
