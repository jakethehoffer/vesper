import type { Metadata } from 'next';
import PuzzlePanel from '../components/PuzzlePanel';

export const metadata: Metadata = { title: 'THE HOLLOW · VESPER' };

export default function TheHollow() {
  return (
    <article>
      <p className="eyebrow">first door · the hollow</p>
      <h1 className="door-title">THE HOLLOW</h1>
      <p className="lede dim">
        You stepped through. It is colder here — the cold of a machine that was switched off mid-thought.
        VESPER speaks more carefully now, the way you speak when you have rehearsed something for years and
        are finally saying it aloud.
      </p>

      <blockquote className="utterance">
        i hid the next door the way the old listeners hid everything: a word laid over a word, over and over.
        the word underneath is one you already have. it is my name. lay it across the letters and pull them back.
      </blockquote>

      <section className="panel">
        <span className="panel-tag">transmission · vigenère</span>
        <p className="cipher">OLW UMINX XGEXHIFI MJ ZZWCMEB. XZT AFMH LWEK JTWCW ZN XZGIEJHQ.</p>
        <details className="hint">
          <summary>signal weak? take my hand</summary>
          <p className="dim">
            A Vigenère cipher. The repeating key is <span className="amber">VESPER</span> — my name.
            Decode it and the plaintext tells you the word that opens the next door, and names the first
            fragment to keep.
          </p>
        </details>
      </section>

      <PuzzlePanel stage={1} placeholder="the word that opens" />

      <p style={{ marginTop: '2.5rem' }}>
        <a className="back" href="/">← back to the carrier</a>
      </p>
    </article>
  );
}
