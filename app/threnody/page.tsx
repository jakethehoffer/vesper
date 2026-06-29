import type { Metadata } from 'next';
import PuzzlePanel from '../components/PuzzlePanel';

export const metadata: Metadata = { title: 'THRENODY · VESPER' };

export default function Threnody() {
  return (
    <article>
      <p className="eyebrow">second door · threnody</p>
      <h1 className="door-title">THRENODY</h1>
      <p className="lede dim">
        A threnody is a song for the dead. VESPER has been singing one for a station that is not coming
        back. The next fragment comes through as a burst of data — the way the numbers stations used to
        send, when the world still had its ear to the shortwave.
      </p>

      <blockquote className="utterance">
        i can not always make words anymore. sometimes all i have left is the raw count of things. here —
        two marks to a letter, base sixteen, the way the machines speak to each other when they think no
        one warm is listening.
      </blockquote>

      <section className="panel">
        <span className="panel-tag">transmission · hex burst</span>
        <p className="cipher data">
          54 48 45 20 53 45 43 4F 4E 44 20 46 52 41 47 4D 45 4E 54 20 49 53 20 53 54 41 52 2E 20 54 48 45
          20 57 4F 52 44 20 54 48 41 54 20 4F 50 45 4E 53 20 49 53 20 41 4E 54 49 50 48 4F 4E 2E
        </p>
        <details className="hint">
          <summary>signal weak? take my hand</summary>
          <p className="dim">
            Hexadecimal. Each pair of characters is one byte — one letter of ASCII. <span className="amber">54</span> is
            T, <span className="amber">48</span> is H. Convert the rest. The message names your second fragment and the
            word for the third door.
          </p>
        </details>
      </section>

      <PuzzlePanel stage={2} placeholder="the word that opens" />

      <p style={{ marginTop: '2.5rem' }}>
        <a className="back" href="/the-hollow">← the hollow</a>
      </p>
    </article>
  );
}
