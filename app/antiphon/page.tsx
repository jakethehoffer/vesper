import type { Metadata } from 'next';
import PuzzlePanel from '../components/PuzzlePanel';
import Mood from '../components/Mood';

export const metadata: Metadata = { title: 'ANTIPHON · VESPER' };

export default function Antiphon() {
  return (
    <article>
      <Mood mode="speak" />
      <p className="eyebrow">third door · antiphon</p>
      <h1 className="door-title">ANTIPHON</h1>
      <p className="lede dim">
        An antiphon is a verse sung in answer to another. This is the last fragment, and VESPER is almost
        out of voice. Watch the carrier at the bottom of the screen — it can only pulse now. Dots and dashes.
        The oldest way two strangers ever agreed to mean something.
      </p>

      <blockquote className="utterance">
        my throat is static. but i can still flicker. listen to the gaps as much as the marks — a single space
        between letters, three between words. say back what i spell.
      </blockquote>

      <section className="panel">
        <span className="panel-tag">transmission · morse</span>
        <p className="cipher morse">
          - .... . / - .... .. .-. -.. / ..-. .-. .- --. -- . -. - / .. ... / .- -. ... .-- . .-. ...
        </p>
        <details className="hint">
          <summary>signal weak? take my hand</summary>
          <p className="dim">
            International Morse. <span className="amber">-</span> is T, <span className="amber">.... </span>
            is H, <span className="amber">.</span> is E. The slash <span className="amber">/</span> separates words.
            Decode all five words; the last one is your third fragment and the word to transmit.
          </p>
        </details>
      </section>

      <PuzzlePanel stage={3} placeholder="say what i spell" />

      <p style={{ marginTop: '2.5rem' }}>
        <a className="back" href="/threnody">← threnody</a>
      </p>
    </article>
  );
}
